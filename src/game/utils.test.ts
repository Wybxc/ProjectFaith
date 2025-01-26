import { describe, expect, it } from "vitest";
import {
  faithCost,
  totalFaith,
  minFaithReduce,
  minFaith,
  canAfford,
  faithProvide,
  serializeDeck,
  deserializeDeck,
} from "./utils";
import type { Card } from "./types";
import { cardMap, cards } from "./cards";

describe("utils", () => {
  describe("faithCost", () => {
    it("should calculate faith cost for a card", () => {
      const card: Card = {
        id: "it",
        name: "测试卡牌",
        description: "测试卡牌",
        collection: "中立",
        subtype: {
          type: "角色",
          cost: ["正义", "元素", "任意"],
          rarity: 0,
        },
      };

      expect(faithCost(card)).toEqual({
        正义: 1,
        元素: 1,
        自然: 0,
        任意: 1,
      });
    });
  });

  describe("totalFaith", () => {
    it("should calculate total faith count", () => {
      const faith = {
        正义: 2,
        元素: 1,
        自然: 0,
        任意: 1,
      };

      expect(totalFaith(faith)).toBe(4);
    });
  });

  describe("minFaithReduce", () => {
    it("should calculate minimum faith required", () => {
      const faith = {
        正义: 1,
        元素: 1,
        自然: 0,
        任意: 0,
      };

      const card: Card = {
        id: "it",
        name: "测试卡牌",
        description: "测试卡牌",
        collection: "中立",
        subtype: {
          type: "角色",
          cost: ["正义", "正义", "任意"],
          rarity: 0,
        },
      };

      expect(minFaithReduce(faith, card)).toEqual({
        正义: 2,
        元素: 1,
        自然: 0,
        任意: 0,
      });
    });
  });

  describe("minFaith", () => {
    it("should calculate minimum faith for multiple cards", () => {
      const cards: Card[] = [
        {
          id: "test1",
          name: "测试卡牌1",
          description: "测试卡牌1",
          collection: "中立",
          subtype: {
            type: "角色",
            cost: ["正义", "元素"],
            rarity: 0,
          },
        },
        {
          id: "test2",
          name: "测试卡牌2",
          description: "测试卡牌2",
          collection: "中立",
          subtype: {
            type: "角色",
            cost: ["正义", "正义", "任意"],
            rarity: 0,
          },
        },
      ];

      expect(minFaith(cards)).toEqual({
        正义: 2,
        元素: 1,
        自然: 0,
        任意: 0,
      });
    });
  });

  describe("canAfford", () => {
    it("should check if faith is sufficient for card cost", () => {
      const faith = {
        正义: 2,
        元素: 1,
        自然: 0,
        任意: 0,
      };

      const affordableCard: Card = {
        id: "test1",
        name: "可购买卡牌",
        description: "可购买卡牌",
        collection: "中立",
        subtype: {
          type: "角色",
          cost: ["正义", "元素", "任意"],
          rarity: 0,
        },
      };

      const unaffordableCard: Card = {
        id: "test2",
        name: "不可购买卡牌",
        description: "不可购买卡牌",
        collection: "中立",
        subtype: {
          type: "角色",
          cost: ["正义", "正义", "正义"],
          rarity: 0,
        },
      };

      expect(canAfford(faith, affordableCard)).toBe(true);
      expect(canAfford(faith, unaffordableCard)).toBe(false);
    });
  });

  describe("faithProvide", () => {
    it("should return zero faith for empty cards array", () => {
      expect(faithProvide([])).toEqual({
        正义: 0,
        元素: 0,
        自然: 0,
        任意: 0,
      });
    });

    it("should calculate faith provided by faith cards only", () => {
      const cards: Card[] = [
        {
          id: "faith1",
          name: "正义信念",
          description: "提供正义信念",
          collection: "中立",
          subtype: {
            type: "信念",
            faith: "正义",
          },
        },
        {
          id: "char1",
          name: "角色卡牌",
          description: "这是个角色卡牌",
          collection: "中立",
          subtype: {
            type: "角色",
            cost: ["正义"],
            rarity: 0,
          },
        },
      ];

      expect(faithProvide(cards)).toEqual({
        正义: 1,
        元素: 0,
        自然: 0,
        任意: 0,
      });
    });

    it("should calculate total faith from multiple faith cards", () => {
      const cards: Card[] = [
        {
          id: "faith1",
          name: "正义信念",
          description: "提供正义信念",
          collection: "中立",
          subtype: {
            type: "信念",
            faith: "正义",
          },
        },
        {
          id: "faith2",
          name: "元素信念",
          description: "提供元素信念",
          collection: "中立",
          subtype: {
            type: "信念",
            faith: "元素",
          },
        },
        {
          id: "faith3",
          name: "正义信念",
          description: "提供正义信念",
          collection: "中立",
          subtype: {
            type: "信念",
            faith: "正义",
          },
        },
      ];

      expect(faithProvide(cards)).toEqual({
        正义: 2,
        元素: 1,
        自然: 0,
        任意: 0,
      });
    });
  });

  describe("deck serialization", () => {
    it("empty deck", () => {
      const empty: Card[] = [];
      const serialized = serializeDeck(empty);
      expect(deserializeDeck(serialized)).toEqual(empty);
    });

    it("single card", () => {
      const deck = [cards[0]];
      const serialized = serializeDeck(deck);
      expect(deserializeDeck(serialized)).toEqual(deck);
    });

    it("multiple same cards", () => {
      const card = cards[0];
      const deck = Array(3).fill(card);
      const serialized = serializeDeck(deck);
      expect(deserializeDeck(serialized)).toEqual(deck);
    });

    it("multiple different cards", () => {
      const deck = cards.slice(0, 5).sort((a, b) => a.id.localeCompare(b.id));
      const serialized = serializeDeck(deck);
      const deserialized = deserializeDeck(serialized).sort((a, b) =>
        a.id.localeCompare(b.id),
      );
      expect(deserialized).toEqual(deck);
    });

    it("serialization format", () => {
      const cards = Array.from(cardMap.values()).slice(0, 3);
      const serialized = serializeDeck(cards);
      expect(typeof serialized).toBe("string");
      expect(serialized).toMatch(/^[A-Za-z0-9_-]+$/); // base64url 格式验证
    });

    it("roundtrip consistency", () => {
      for (let i = 0; i < cards.length; i += 5) {
        const deck = cards
          .slice(i, i + 5)
          .sort((a, b) => a.id.localeCompare(b.id));
        const serialized = serializeDeck(deck);
        const deserialized = deserializeDeck(serialized).sort((a, b) =>
          a.id.localeCompare(b.id),
        );
        expect(deserialized).toEqual(deck);
      }
    });

    it("invalid serialized string", () => {
      expect(() => deserializeDeck("invalid-base64")).toThrow();
    });
  });
});
