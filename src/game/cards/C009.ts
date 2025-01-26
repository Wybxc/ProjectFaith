import type { Card } from "@/game/types";

export default {
  id: "C009",
  name: "祝福",
  description: "TODO",
  collection: "正义",
  subtype: {
    type: "指令",
    cost: ["正义", "正义", "正义"],
    rarity: 0,
  },
} satisfies Card;
