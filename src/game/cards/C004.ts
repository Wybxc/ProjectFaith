import type { Card } from "@/game/types";

export default {
  id: "C004",
  name: "佣兵",
  description: "TODO",
  collection: "正义",
  subtype: {
    type: "角色",
    cost: ["正义"],
    rarity: 0,
  },
} satisfies Card;
