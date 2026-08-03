export type ModeDevis = 'A' | 'B';

export interface Piece {
  id: string;
  nom: string;
  surface_m2: number;
  niveau: string;
  prixAuM2: number | null;
  montant: number | null;
}

export interface DevisState {
  mode: ModeDevis;
  prixUnitaires: Record<string, number>;
  prixParPiece: Record<string, number>;
  totalHT: number;
  tva: number;
  totalTTC: number;
  tvaRate: number;
  devise: string;
}
