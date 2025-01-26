import type { Card } from "@/game/types";

export default {
  id: "C024",
  name: "露娜",
  honor: "元素行侣",
  description: "TODO",
  collection: "元素",
  preface: true,
  subtype: {
    type: "角色",
    cost: ["元素", "元素", "元素"],
    rarity: 3,
  },
} satisfies Card;
