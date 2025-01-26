import type { Card } from "@/game/types";

export default {
  id: "C012",
  name: "艾伦",
  honor: "正义行侣",
  description: "TODO",
  collection: "正义",
  preface: true,
  subtype: {
    type: "角色",
    cost: ["正义", "正义", "正义"],
    rarity: 3,
  },
} satisfies Card;
