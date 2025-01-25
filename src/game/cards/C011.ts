import { defineCard } from ".";

export default defineCard({
  id: "C011",
  name: "改天换地",
  description: "TODO",
  collection: "正义",
  subtype: {
    type: "指令",
    cost: ["正义", "正义", "正义"],
    rarity: 2,
  },
});
