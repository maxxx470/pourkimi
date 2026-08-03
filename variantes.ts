export interface Variante {
  id: string;
  nom: string;
  mode: 'A' | 'B';
  createdAt: string;
  description: string;
  lotsTotal: Record<number, number>;
  totalHT: number;
  totalTTC: number;
  ouvragesChiffres: number;
  isActive: boolean;
}
