import type { Card } from "@/game/types";
import typia from "typia";

export function defineCard(card: Card) {
  return card;
}

interface CardModule {
  default: Card;
}

const cardModules = import.meta.webpackContext("./", {
  recursive: true,
  regExp: /\w+\d+\.ts$/,
});

export const cards = cardModules
  .keys()
  .map((key) => {
    try {
      return typia.assert<CardModule>(cardModules(key)).default;
    } catch (e) {
      console.error(`Error loading card ${key}:`, e);
    }
  })
  .filter(Boolean) as Card[];
