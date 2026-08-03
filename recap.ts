import { DQELot } from '../data/mockDQE';
import { Piece } from './devis';

export interface CabinetInfo {
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  logoUrl: string | null;
}

export interface RecapData {
  project: {
    nom: string;
    client: string;
    localisation: string;
    etabliPar: string;
  };
  lots: DQELot[];
  totalHT: number;
  tvaRate: number;
  tva: number;
  totalTTC: number;
  cabinet: CabinetInfo;
}

export interface RecapDataM2 {
  project: {
    nom: string;
    client: string;
    localisation: string;
    etabliPar: string;
  };
  pieces: Piece[];
  totalHT: number;
  tvaRate: number;
  tva: number;
  totalTTC: number;
  cabinet: CabinetInfo;
}
