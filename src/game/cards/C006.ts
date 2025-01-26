import type { Card } from "@/game/types";

export default {
  id: "C006",
  name: "剑侍",
  description: "TODO",
  collection: "正义",
  subtype: {
    type: "角色",
    cost: ["正义", "任意"],
    rarity: 0,
  },
} satisfies Card;
