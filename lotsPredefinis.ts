export interface LotPredefini {
  nom: string;
  color: string;
  bgColor: string;
  corpsMetier: string;
}

export const LOTS_PREDEFINIS: LotPredefini[] = [
  { nom: 'Plomberie', color: '#0369A1', bgColor: '#E0F2FE', corpsMetier: 'plomberie' },
  { nom: 'Électricité', color: '#B45309', bgColor: '#FEF3C7', corpsMetier: 'electricite' },
  { nom: 'Étanchéité', color: '#0F766E', bgColor: '#CCFBF1', corpsMetier: 'isolation' },
  { nom: 'Climatisation & Ventilation', color: '#1D4ED8', bgColor: '#DBEAFE', corpsMetier: 'electricite' },
  { nom: 'Charpente & Toiture', color: '#92400E', bgColor: '#FEF3C7', corpsMetier: 'toiture' },
  { nom: 'VRD (Voirie & Réseaux Divers)', color: '#4D7C0F', bgColor: '#ECFDF5', corpsMetier: 'terrassement_vrd' },
  { nom: 'Revêtements de sol', color: '#BE185D', bgColor: '#FCE7F3', corpsMetier: 'revetements_sol' },
  { nom: 'Isolation thermique', color: '#3730A3', bgColor: '#E0E7FF', corpsMetier: 'isolation' },
];
