import type { Card } from "@/game/types";

export default {
  id: "C020",
  name: "清明",
  description: "TODO",
  collection: "元素",
  subtype: {
    type: "指令",
    cost: ["元素", "元素", "任意"],
    rarity: 0,
  },
} satisfies Card;
