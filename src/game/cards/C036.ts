import type { Card } from "@/game/types";

export default {
  id: "C036",
  name: "希里",
  honor: "自然行侣",
  description: "TODO",
  collection: "自然",
  preface: true,
  subtype: {
    type: "角色",
    cost: ["自然", "自然", "自然"],
    rarity: 3,
  },
} satisfies Card;
