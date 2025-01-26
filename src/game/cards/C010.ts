import type { Card } from "@/game/types";

export default {
  id: "C010",
  name: "翼使",
  description: "TODO",
  collection: "正义",
  subtype: {
    type: "角色",
    cost: ["正义", "正义"],
    rarity: 2,
  },
} satisfies Card;
