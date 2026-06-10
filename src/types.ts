export interface Character {
  id: string;
  name: string;
  type: 'Mascota Mágica' | 'Criatura Mitológica' | 'Héroe Legendario';
  story: string;
  personality: string;
  visualDesign: string;
  element: string;
  signatureCosmetic: string;
}

export interface Pet {
  id: string;
  name: string;
  rarity: 'Común' | 'Rara' | 'Épica' | 'Legendaria';
  style: string; // Color indicator / category color
  abilityName: string;
  abilityDesc: string;
  category: 'Soporte' | 'Monedas' | 'Movilidad' | 'Especial';
}

export interface Minigame {
  id: string;
  name: string;
  category: 'Reflejos' | 'Carreras' | 'Combate' | 'Todos contra todos' | '2 vs 3' | 'Supervivencia';
  objective: string;
  mechanics: string[];
  duration: number; // in seconds
  controls: string;
  rewards: string;
}

export interface DivineInvocation {
  id: string;
  name: string;
  title: string;
  visualEffectDesc: string;
  boardAlteration: string;
  economyImpact: string;
  strategicChange: string;
  colorHex: string;
  emoji: string;
}

export interface SandboxNode {
  id: number;
  type: 'neutral' | 'coin_plus' | 'coin_minus' | 'divine_portal' | 'trophy' | 'shortcut';
  x: number;
  y: number;
  name: string;
  description: string;
}
