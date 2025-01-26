import type { Card } from "@/game/types";

export default {
  id: "C001",
  name: "自称骑士",
  description: "TODO",
  collection: "正义",
  subtype: {
    type: "角色",
    cost: ["正义"],
    rarity: 0,
  },
} satisfies Card;
