import { Variante } from '../types/variantes';

export const MOCK_VARIANTES: Variante[] = [
  {
    id: 'v2',
    nom: 'Version économique',
    mode: 'A',
    createdAt: '2026-07-23',
    description: 'Matériaux moins coûteux',
    lotsTotal: { 1: 1253410, 2: 5470000, 3: 1022000, 4: 890000, 5: 1025000, 6: 1138000 },
    totalHT: 9500000,
    totalTTC: 11230000,
    ouvragesChiffres: 47,
    isActive: false,
  },
  {
    id: 'v3',
    nom: 'Version au m² - Standard',
    mode: 'B',
    createdAt: '2026-07-24',
    description: 'Prix au m² tout inclus',
    lotsTotal: {},
    totalHT: 16050000,
    totalTTC: 18940000,
    ouvragesChiffres: 10,
    isActive: false,
  },
];

export const LOT_NAMES: Record<number, { name: string; color: string }> = {
  1: { name: 'Terrassement', color: '#E8442A' },
  2: { name: 'Gros œuvre', color: '#2A7BDE' },
  3: { name: 'Maçonnerie', color: '#D4960A' },
  4: { name: 'Chape & Dallage', color: '#12B76A' },
  5: { name: 'Menuiserie', color: '#4F46E5' },
  6: { name: 'Enduits & Peinture', color: '#D03F7B' },
};
