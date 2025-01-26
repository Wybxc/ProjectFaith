import { cardMap } from "./cards";
import type { Card, Faith } from "./types";
import typia from "typia";
import {
  encode as msgpackEncode,
  decode as msgpackDecode,
} from "@msgpack/msgpack";
import { base64url } from "rfc4648";

/* 计算一张卡牌所需要的信念消耗数量 */
export function faithCost(card: Card): Record<Faith, number> {
  const cost: Record<Faith, number> = {
    正义: 0,
    元素: 0,
    自然: 0,
    任意: 0,
  };

  if ("cost" in card.subtype) {
    for (const faith of card.subtype.cost) {
      cost[faith]++;
    }
  }

  return cost;
}

/* 计算一组卡牌所提供的信念数量 */
export function faithProvide(cards: Card[]): Record<Faith, number> {
  const provide: Record<Faith, number> = {
    正义: 0,
    元素: 0,
    自然: 0,
    任意: 0,
  };

  for (const card of cards) {
    if (card.subtype.type === "信念") {
      provide[card.subtype.faith]++;
    }
  }

  return provide;
}

/* 计算信念组成的总数量 */
export function totalFaith(faith: Record<Faith, number>): number {
  return Object.values(faith).reduce((sum, count) => sum + count, 0);
}

/* 计算满足一张卡牌消耗的最小信念组成 */
export function minFaithReduce(
  faith: Record<Faith, number>,
  card: Card,
): Record<Faith, number> {
  const cost: Record<Faith, number> = typia.misc.clone(faith);
  const cardCost = faithCost(card);

  // 一般信念需要数量取最大值
  for (const faith of typia.misc.literals<Faith>()) {
    if (faith !== "任意") {
      cost[faith] = Math.max(cost[faith], cardCost[faith]);
    }
  }

  // 任意信念可以被其他多余的信念替代
  let surplus = 0;
  for (const faith of typia.misc.literals<Faith>()) {
    if (faith !== "任意") {
      surplus += Math.max(0, cost[faith] - cardCost[faith]);
    }
  }

  cost.任意 = Math.max(0, cardCost.任意 - surplus);

  return cost;
}

/* 计算满足一组卡牌消耗的最小信念组成 */
export function minFaith(cards: Card[]): Record<Faith, number> {
  return cards.reduce((faith, card) => minFaithReduce(faith, card), {
    正义: 0,
    元素: 0,
    自然: 0,
    任意: 0,
  });
}

/* 判断信念构成是否可以满足给定的卡牌消耗 */
export function canAfford(faith: Record<Faith, number>, card: Card): boolean {
  const cardCost = faithCost(card);
  const availableFaith = { ...faith };

  // 先满足固定信念需求
  for (const f of typia.misc.literals<Faith>()) {
    if (f !== "任意") {
      if (availableFaith[f] < cardCost[f]) {
        return false;
      }
      availableFaith[f] -= cardCost[f];
    }
  }

  // 计算剩余可用信念总量
  const totalAvailable = Object.values(availableFaith).reduce(
    (sum, count) => sum + count,
    0,
  );

  // 检查是否有足够的信念满足"任意"需求
  return totalAvailable >= cardCost.任意;
}

/* 序列化卡组 */
export function serializeDeck(cards: Card[]): string {
  const counter = new Map<string, number>();
  for (const card of cards) {
    const count = counter.get(card.id) || 0;
    counter.set(card.id, count + 1);
  }

  /* 序列：[序号, 数量, 序号长度] */
  const bukkets = new Map<string, [number, number, number][]>();
  for (const [id, count] of counter) {
    const [prefix, suffix] = id.match(/(\D+)(\d+)/)?.slice(1) ?? [id, "0"];
    if (!bukkets.has(prefix)) {
      bukkets.set(prefix, []);
    }
    bukkets.get(prefix)?.push([Number(suffix), count, suffix.length]);
  }

  /* 压缩序列：如果最后两项与上一项相同，则省略 */
  const compressedBukkets: Record<string, number[][]> = {};
  for (const [prefix, counts] of bukkets.entries()) {
    compressedBukkets[prefix] = [];
    let last: number[] = [];
    for (const [suffix, count, len] of counts) {
      const current = [suffix, count, len];
      for (let i = current.length - 1; i >= 0; i--) {
        if (current[i] === last[i]) {
          current.pop();
        } else {
          break;
        }
      }
      compressedBukkets[prefix].push(current);
      last = [suffix, count, len];
    }
  }

  const encoded = msgpackEncode(compressedBukkets);
  return base64url.stringify(encoded);
}

/* 反序列化卡组 */
export function deserializeDeck(serialized: string): Card[] {
  const encoded = base64url.parse(serialized);
  const bukkets = typia.assert<Record<string, number[][]>>(
    msgpackDecode(encoded),
  );

  const cards: Card[] = [];
  for (const [prefix, counts] of Object.entries(bukkets)) {
    let last = [0, 0, 0];
    for (const current of counts) {
      const [suffix, count, len] = current.concat(last.slice(current.length));
      const id = `${prefix}${suffix.toString().padStart(len, "0")}`;
      const card = cardMap.get(id);
      if (card) {
        for (let i = 0; i < count; i++) {
          cards.push(card);
        }
      }
      last = [suffix, count, len];
    }
  }

  return cards;
}
