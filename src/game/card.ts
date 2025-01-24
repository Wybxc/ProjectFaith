import type { Card } from "./types";

export const cards: Card[] = [];

function defineCard(card: Card) {
  cards.push(card);
}

defineCard({
  id: "C01",
  name: "自称骑士",
  image: "TODO",
  description: "TODO",
  subtype: {
    type: "角色",
    cost: ["正义"],
    rarity: 0,
  },
});

defineCard({
  id: "C11",
  name: "改天换地",
  image: "TODO",
  description: "TODO",
  subtype: {
    type: "指令",
    cost: ["正义", "正义", "正义"],
    rarity: 2,
  },
});

defineCard({
  id: "C13",
  name: "谷雨",
  image: "TODO",
  description: "TODO",
  subtype: {
    type: "指令",
    cost: ["元素"],
    rarity: 0,
  },
});
