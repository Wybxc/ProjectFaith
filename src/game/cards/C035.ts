import type { Card } from "@/game/types";

export default {
  id: "C035",
  name: "天灾",
  description: "TODO",
  collection: "自然",
  subtype: {
    type: "指令",
    cost: ["自然", "自然", "自然"],
    rarity: 2,
  },
} satisfies Card;
