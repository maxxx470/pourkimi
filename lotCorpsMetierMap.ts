import { DQELot } from './mockDQE';

export const LOT_NOM_TO_CORPS_METIER: Record<string, string[]> = {
  'TERRASSEMENT': ['granulats'],
  'GROS ŒUVRE — BÉTON ARMÉ': ['ciment_beton', 'acier', 'bois_coffrage'],
  'MAÇONNERIE': ['agglos', 'ciment_beton'],
  'CHAPE & DALLAGE': ['ciment_beton', 'granulats'],
  'MENUISERIE': ['menuiserie_portes', 'menuiserie_fenetres', 'menuiserie_accessoires'],
  'ENDUITS & PEINTURE': ['enduits_peinture'],
};

export function getCorpsMetierPourLot(lot?: DQELot): string[] {
  if (!lot) return [];
  if (lot.corpsMetier && lot.corpsMetier.length > 0) {
    return lot.corpsMetier;
  }
  const lotNameKey = (lot.name || '').toUpperCase().trim();
  for (const [key, value] of Object.entries(LOT_NOM_TO_CORPS_METIER)) {
    if (key.toUpperCase() === lotNameKey) {
      return value;
    }
  }
  return [];
}
