import type { Card } from "@/game/types";

export default {
  id: "C030",
  name: "绽放",
  description: "TODO",
  collection: "自然",
  subtype: {
    type: "指令",
    cost: ["自然", "自然", "任意"],
    rarity: 0,
  },
} satisfies Card;
