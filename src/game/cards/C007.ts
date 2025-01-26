import type { Card } from "@/game/types";

export default {
  id: "C007",
  name: "福龙",
  description: "TODO",
  collection: "正义",
  subtype: {
    type: "角色",
    cost: ["正义", "正义"],
    rarity: 0,
  },
} satisfies Card;
