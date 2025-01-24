export interface Card {
  id: string;
  name: string;
  image: string;
  description: string;
  subtype: FaithCard | CharacterCard | ActionCard;
}

export type Faith = "justice" | "element" | "nature" | "any";

export interface FaithCard {
  type: "faith";
  faith: Faith;
}

export interface CharacterCard {
  type: "character";
  cost: Faith[];
  rarity: number;
}

export interface ActionCard {
  type: "action";
  cost: Faith[];
  rarity: number;
}
