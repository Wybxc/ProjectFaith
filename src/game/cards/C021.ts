import type { Card } from "@/game/types";

export default {
  id: "C021",
  name: "汇聚",
  description: "TODO",
  collection: "元素",
  subtype: {
    type: "指令",
    cost: ["元素", "元素", "元素"],
    rarity: 0,
  },
} satisfies Card;
