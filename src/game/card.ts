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
    type: "character",
    cost: ["justice"],
    rarity: 0,
  },
});

defineCard({
  id: "C11",
  name: "改天换地",
  image: "TODO",
  description: "TODO",
  subtype: {
    type: "action",
    cost: ["justice", "justice", "justice"],
    rarity: 2,
  },
});

defineCard({
  id: "C13",
  name: "谷雨",
  image: "TODO",
  description: "TODO",
  subtype: {
    type: "action",
    cost: ["element"],
    rarity: 0,
  },
});
