export type UsageFrequence = 'frequent' | 'occasionnel' | 'jamais';

export type OrigineLigne = 'calcul_dqe' | 'reference_libre';

export interface MonPrix {
  id: string;
  designation: string;
  unite: string;
  prixSuggere: number;
  prixActuel: number;
  corpsMetier: string;
  isSuggestion: boolean;
}

export interface LigneMateriau {
  id: string;
  designation: string;
  origine: OrigineLigne;
  categorie: string;
  unite?: string;
  prixSuggere?: number;
  prixActuel?: number;
  isSystemDefault?: boolean;
  ratios?: { label: string; valeur: string }[];
}
