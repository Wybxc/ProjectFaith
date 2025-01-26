import type { Card } from "@/game/types";

export default {
  id: "C022",
  name: "百灵",
  description: "TODO",
  collection: "元素",
  subtype: {
    type: "角色",
    cost: ["元素", "元素"],
    rarity: 2,
  },
} satisfies Card;
