import type { Card } from "@/game/types";

export default {
  id: "C043",
  name: "收藏者",
  description: "TODO",
  collection: "中立",
  subtype: {
    type: "角色",
    cost: ["任意", "任意"],
    rarity: 0,
  },
} satisfies Card;
