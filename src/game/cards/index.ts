import type { Card } from "@/game/types";
import typia from "typia";

interface CardModule {
  default: Card;
}

export const cards = Object.entries(
  import.meta.glob(["./**/*.ts", "!./index.ts"], {
    eager: true,
  }),
)
  .map(([key, module]) => {
    try {
      return typia.assert<CardModule>(module).default;
    } catch (e) {
      console.error(`Error loading card ${key}:`, e);
    }
  })
  .filter(Boolean) as Card[];

export const cardMap = new Map(cards.map((card) => [card.id, card]));
