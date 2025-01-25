export interface Card {
  id: string;
  name: string;
  honor?: string;
  description: string;
  preface?: boolean;
  collection: "正义" | "元素" | "自然" | "中立";
  subtype: FaithCard | CharacterCard | ActionCard;
}

export type Faith = "正义" | "元素" | "自然" | "任意";

export interface FaithCard {
  type: "信念";
  faith: Faith;
}

export interface CharacterCard {
  type: "角色";
  cost: Faith[];
  rarity: number;
}

export interface ActionCard {
  type: "指令";
  cost: Faith[];
  rarity: number;
}
