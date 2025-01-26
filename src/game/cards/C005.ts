import type { Card } from "@/game/types";

export default {
  id: "C005",
  name: "暗影刺客",
  description: "TODO",
  collection: "正义",
  subtype: {
    type: "角色",
    cost: ["正义", "任意"],
    rarity: 0,
  },
} satisfies Card;
