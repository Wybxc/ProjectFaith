import type { Card } from "@/game/types";

export default {
  id: "C029",
  name: "精华",
  description: "TODO",
  collection: "自然",
  subtype: {
    type: "指令",
    cost: ["自然", "自然", "任意"],
    rarity: 0,
  },
} satisfies Card;
