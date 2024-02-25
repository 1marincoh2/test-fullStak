export interface Ability {
    name: string;
    url: string;
  }

export interface AbilityData {
    ability: Ability;
    is_hidden: boolean;
    slot: number;
  };

export  interface Pokemon {
    name: string;
    abilities: AbilityData[];
    image: string;
  }