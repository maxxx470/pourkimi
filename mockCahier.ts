import { Piece } from '../types/devis';

export interface CalcItem {
  id: string;
  label: string;
  formula: string;
  result: number;
  unit: string;
  isFinal: boolean;
  isEditable: boolean;
  editableValue?: string;
  hypothese?: string;
  warning?: string;
}

export interface CalcLot {
  id: number;
  name: string;
  color: string;
  bgColor: string;
  sources: string[];
  items: CalcItem[];
}

export interface Hypothese {
  champ: string;
  valeur: string;
  description: string;
  lot_concerne: string;
}

export const MOCK_CAHIER: CalcLot[] = [
  {
    id: 1,
    name: 'Terrassement',
    color: '#E8442A',
    bgColor: '#FEF0EC',
    sources: ['Plan RDC', 'Coupe AA'],
    items: [
      {
        id: 'terr-1',
        label: 'Emprise au sol du bâtiment',
        formula: '12.80 × 9.60',
        result: 122.88,
        unit: 'm²',
        isFinal: false,
        isEditable: false,
      },
      {
        id: 'terr-2',
        label: 'Profondeur de fouilles',
        formula: 'valeur par défaut',
        result: 1.20,
        unit: 'm',
        isFinal: false,
        isEditable: true,
        editableValue: '1.20',
        hypothese: 'Profondeur estimée à 1.20 m — non précisée sur les coupes',
      },
      {
        id: 'terr-3',
        label: 'Volume fouilles en rigoles',
        formula: '122.88 × 1.20',
        result: 147.46,
        unit: 'm³',
        isFinal: true,
        isEditable: false,
      },
      {
        id: 'terr-4',
        label: 'Volume remblai (30% fouilles)',
        formula: '147.46 × 0.30',
        result: 44.24,
        unit: 'm³',
        isFinal: false,
        isEditable: false,
      },
      {
        id: 'terr-5',
        label: 'Volume évacuation',
        formula: '147.46 − 44.24',
        result: 103.22,
        unit: 'm³',
        isFinal: false,
        isEditable: false,
      },
    ],
  },
  {
    id: 2,
    name: 'Gros œuvre — Béton armé',
    color: '#2A7BDE',
    bgColor: '#EBF3FF',
    sources: ['Plan structure', 'Coupe AA'],
    items: [
      {
        id: 'go-0',
        label: 'Semelles de fondation filantes — Section 40×40 cm',
        formula: '44.80 (périmètre) × 0.40 × 0.40',
        result: 7.17,
        unit: 'm³',
        isFinal: true,
        isEditable: false,
        hypothese: 'Section des semelles estimée à 40×40 cm — étude de sol / plan de fondation absent',
      },
      {
        id: 'go-1',
        label: 'Poteaux RDC — Section 25×25 cm',
        formula: '0.25×0.25×2.80×16',
        result: 2.80,
        unit: 'm³',
        isFinal: false,
        isEditable: false,
        hypothese: 'Section poteaux 25×25 cm appliquée par défaut — plan de structure absent',
      },
      {
        id: 'go-2',
        label: 'Poteaux R+1 — Section 25×25 cm',
        formula: '0.25×0.25×2.80×16',
        result: 2.80,
        unit: 'm³',
        isFinal: false,
        isEditable: false,
      },
      {
        id: 'go-3',
        label: 'Dalle RDC — ép. 15 cm',
        formula: '112.0 × 0.15',
        result: 16.80,
        unit: 'm³',
        isFinal: false,
        isEditable: false,
      },
      {
        id: 'go-4',
        label: 'Dalle R+1 — ép. 15 cm',
        formula: '112.0 × 0.15',
        result: 16.80,
        unit: 'm³',
        isFinal: false,
        isEditable: false,
      },
      {
        id: 'go-5',
        label: 'Total béton gros œuvre',
        formula: '7.17+2.80+2.80+16.80+16.80',
        result: 46.37,
        unit: 'm³',
        isFinal: true,
        isEditable: false,
      },
    ],
  },
  {
    id: 3,
    name: 'Maçonnerie',
    color: '#D4960A',
    bgColor: '#FDF8EC',
    sources: ['Plan RDC', 'Plan R+1'],
    items: [
      {
        id: 'mac-1',
        label: 'Surface murs extérieurs brute',
        formula: 'périmètre × HSP × 2 niveaux',
        result: 246.40,
        unit: 'm²',
        isFinal: false,
        isEditable: false,
      },
      {
        id: 'mac-2',
        label: 'Déduction ouvertures ext.',
        formula: '8 fen. + 2 portes ext.',
        result: 24.48,
        unit: 'm²',
        isFinal: false,
        isEditable: false,
      },
      {
        id: 'mac-3',
        label: 'Surface murs ext. nette',
        formula: '246.40 − 24.48',
        result: 221.92,
        unit: 'm²',
        isFinal: true,
        isEditable: false,
      },
    ],
  },
  {
    id: 4,
    name: 'Chape & Dallage',
    color: '#12B76A',
    bgColor: '#EDFAF3',
    sources: ['Plan RDC', 'Plan R+1'],
    items: [
      {
        id: 'chp-1',
        label: 'Surface chape RDC',
        formula: '112.0 m² (hors murs)',
        result: 108.40,
        unit: 'm²',
        isFinal: false,
        isEditable: false,
      },
      {
        id: 'chp-2',
        label: 'Surface chape R+1',
        formula: '112.0 m² (hors murs)',
        result: 108.40,
        unit: 'm²',
        isFinal: false,
        isEditable: false,
      },
      {
        id: 'chp-3',
        label: 'Surface chape totale',
        formula: '108.40 + 108.40',
        result: 216.80,
        unit: 'm²',
        isFinal: true,
        isEditable: false,
      },
    ],
  },
  {
    id: 5,
    name: 'Menuiserie',
    color: '#4F46E5',
    bgColor: '#EEF2FF',
    sources: ['Plan RDC', 'Plan R+1', 'Façade nord-sud'],
    items: [
      {
        id: 'men-1',
        label: 'Portes simples int. 90×220 cm',
        formula: '8 unités détectées',
        result: 8,
        unit: 'u',
        isFinal: false,
        isEditable: true,
        editableValue: '8',
      },
      {
        id: 'men-2',
        label: 'Portes doubles ext. 140×220 cm',
        formula: '2 unités détectées',
        result: 2,
        unit: 'u',
        isFinal: false,
        isEditable: true,
        editableValue: '2',
      },
      {
        id: 'men-3',
        label: 'Fenêtres 120×120 cm',
        formula: '10 unités détectées',
        result: 10,
        unit: 'u',
        isFinal: false,
        isEditable: true,
        editableValue: '10',
      },
      {
        id: 'men-4',
        label: 'Surface vitrée totale',
        formula: '(10×1.20×1.20)+(2×1.40×2.20)',
        result: 20.56,
        unit: 'm²',
        isFinal: true,
        isEditable: false,
      },
    ],
  },
  {
    id: 6,
    name: 'Enduits & Peinture',
    color: '#D03F7B',
    bgColor: '#FEE8F1',
    sources: ['Plan RDC', 'Plan R+1'],
    items: [
      {
        id: 'end-1',
        label: 'Surface enduit intérieur',
        formula: 'surf. murs int. nette × 1.05',
        result: 318.64,
        unit: 'm²',
        isFinal: false,
        isEditable: false,
      },
      {
        id: 'end-2',
        label: 'Surface enduit extérieur',
        formula: 'surf. murs ext. nette × 1.05',
        result: 233.02,
        unit: 'm²',
        isFinal: false,
        isEditable: false,
      },
      {
        id: 'end-3',
        label: 'Surface peinture intérieure',
        formula: '= surface enduit intérieur',
        result: 318.64,
        unit: 'm²',
        isFinal: true,
        isEditable: false,
      },
      {
        id: 'end-4',
        label: 'Surface peinture extérieure',
        formula: '= surface enduit extérieur',
        result: 233.02,
        unit: 'm²',
        isFinal: true,
        isEditable: false,
      },
    ],
  },
];

export const MOCK_HYPOTHESES: Hypothese[] = [
  {
    champ: 'profondeur_fouilles',
    valeur: '1.20 m',
    description: 'Non précisée sur les coupes',
    lot_concerne: 'LOT 1 — Terrassement',
  },
  {
    champ: 'section_semelles',
    valeur: '40×40 cm',
    description: 'Étude de sol / plan de fondation absent',
    lot_concerne: 'LOT 2 — Gros œuvre',
  },
  {
    champ: 'section_poteaux',
    valeur: '25×25 cm',
    description: 'Plan de structure absent',
    lot_concerne: 'LOT 2 — Gros œuvre',
  },
];

export const MOCK_PIECES_METRE: Piece[] = [
  { id: 'p1', nom: 'Salon', surface_m2: 42.5, niveau: 'RDC', prixAuM2: 45000, montant: 1912500 },
  { id: 'p2', nom: 'Chambre principale', surface_m2: 18.0, niveau: 'RDC', prixAuM2: 38000, montant: 684000 },
  { id: 'p3', nom: 'Chambre 2', surface_m2: 14.5, niveau: 'RDC', prixAuM2: null, montant: null },
  { id: 'p4', nom: 'Cuisine', surface_m2: 12.0, niveau: 'RDC', prixAuM2: 52000, montant: 624000 },
  { id: 'p5', nom: 'Salle de bain', surface_m2: 6.0, niveau: 'RDC', prixAuM2: null, montant: null },
  { id: 'p6', nom: 'Couloir', surface_m2: 4.8, niveau: 'RDC', prixAuM2: 25000, montant: 120000 },
  { id: 'p7', nom: 'Chambre 3', surface_m2: 14.5, niveau: 'R+1', prixAuM2: null, montant: null },
  { id: 'p8', nom: 'Chambre 4', surface_m2: 12.0, niveau: 'R+1', prixAuM2: null, montant: null },
  { id: 'p9', nom: 'Salle de bain R+1', surface_m2: 5.5, niveau: 'R+1', prixAuM2: null, montant: null },
  { id: 'p10', nom: 'Terrasse couverte', surface_m2: 18.0, niveau: 'R+1', prixAuM2: 28000, montant: 504000 },
];
