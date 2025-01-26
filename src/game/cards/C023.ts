import type { Card } from "@/game/types";

export default {
  id: "C023",
  name: "大暑",
  description: "TODO",
  collection: "元素",
  subtype: {
    type: "指令",
    cost: ["元素", "元素", "元素"],
    rarity: 2,
  },
} satisfies Card;
