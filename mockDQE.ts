import { MOCK_CAHIER } from './mockCahier';
import { buildDQELotsFromCahier } from './deriveDQE';

export interface DQEItem {
  id: string;
  numero: string;
  designation: string;
  unite: string;
  quantite: number;
  prixUnitaire: number | null;
  montant: number | null;
  observation: string | null;
  isSubLot: boolean;
  isDetail: boolean;
  isLotHeader: boolean;
  children?: DQEItem[];
  isDefault?: boolean;
}

export interface DQELot {
  id: number;
  numero: string;
  name: string;
  color: string;
  bgColor: string;
  items: DQEItem[];
  sousTotal: number;
  isCustom?: boolean;
  corpsMetier?: string[];
}

export interface DQEState {
  lots: DQELot[];
  modeDevis: boolean;
  editMode: boolean;
  totalHT: number;
  selectedLot: 'all' | number;
}

// Derived from mockCahier via deriveDQE
export const MOCK_DQE_LOTS: DQELot[] = buildDQELotsFromCahier(MOCK_CAHIER);
