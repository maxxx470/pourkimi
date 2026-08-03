import { CORPS_METIER_MAP } from './mockMesPrix';
import { LigneMateriau } from '../types/materiaux';

export const CATEGORIES_MAP: Record<string, string> = {
  all: 'Tous',
  beton: 'Béton (DQE)',
  maconnerie: 'Maçonnerie (DQE)',
  chape: 'Chape (DQE)',
  enduits: 'Enduits & Peinture (DQE)',
  ...CORPS_METIER_MAP,
};

// Lignes "calcul DQE" : ratios système utilisés pour dériver automatiquement
// les quantités de matériaux dans le DQE (src/data/deriveDQE.ts). Les lignes
// "référence libre" (bibliothèque "Mes prix") vivent désormais dans le store
// partagé (src/store/ProjectDataContext.tsx) — voir useMateriauxUnifie.ts.
export const CALCUL_DQE_MATERIAUX: LigneMateriau[] = [
  {
    id: 'm1',
    designation: 'Béton dosé 350 kg/m³',
    origine: 'calcul_dqe' as const,
    categorie: 'beton',
    isSystemDefault: true,
    ratios: [
      { label: 'Ciment', valeur: '350 kg/m³' },
      { label: 'Sable', valeur: '0.4 m³/m³' },
      { label: 'Gravier', valeur: '0.8 m³/m³' },
      { label: 'Eau', valeur: '175 L/m³' },
    ],
  },
  {
    id: 'm2',
    designation: 'Parpaings 15×20×40',
    origine: 'calcul_dqe' as const,
    categorie: 'maconnerie',
    isSystemDefault: true,
    ratios: [
      { label: 'Parpaings', valeur: '12.5 u/m²' },
      { label: 'Ciment mortier', valeur: '30 kg/m²' },
      { label: 'Sable mortier', valeur: '0.06 m³/m²' },
    ],
  },
  {
    id: 'm3',
    designation: 'Chape renforcée (perso.)',
    origine: 'calcul_dqe' as const,
    categorie: 'chape',
    isSystemDefault: false,
    ratios: [
      { label: 'Ciment', valeur: '350 kg/m³' },
      { label: 'Sable', valeur: '0.9 m³/m³' },
    ],
  },
  {
    id: 'm4',
    designation: 'Enduit standard',
    origine: 'calcul_dqe' as const,
    categorie: 'enduits',
    isSystemDefault: true,
    ratios: [
      { label: 'Rendement', valeur: '1 sac 25kg / 3m²' },
      { label: 'Majoration', valeur: '5%' },
    ],
  },
];
