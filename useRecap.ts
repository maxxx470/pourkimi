import { useState, useMemo } from 'react';
import { DQELot, MOCK_DQE_LOTS, DQEItem } from '../data/mockDQE';
import { CabinetInfo, RecapData } from '../types/recap';

export interface UseRecapReturn {
  recapData: RecapData;
  isPaywalled: boolean;
  setIsPaywalled: React.Dispatch<React.SetStateAction<boolean>>;
  cabinet: CabinetInfo;
  setCabinet: React.Dispatch<React.SetStateAction<CabinetInfo>>;
  userPlan: 'decouverte' | 'pro' | 'studio';
  formatMontant: (n: number) => string;
}

export function formatMontant(n: number | null | undefined): string {
  if (n === null || n === undefined || isNaN(n)) return '—';
  const rounded = Math.round(n);
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

const MOCK_CABINET: CabinetInfo = {
  nom: 'Cabinet Architecture Diallo',
  email: 'contact@diallo-archi.com',
  telephone: '+225 07 00 00 00',
  adresse: 'Cocody, Abidjan',
  logoUrl: null,
};

const MOCK_PROJECT_INFO = {
  nom: 'Villa résidentielle R+2',
  client: 'M. Koné',
  localisation: "Abidjan, Côte d'Ivoire",
  etabliPar: 'Ing. T. Kouassi',
};

function calculateLotSousTotal(items: DQEItem[]): number {
  let total = 0;
  for (const item of items) {
    if (item.isSubLot && item.children) {
      total += calculateLotSousTotal(item.children);
    } else if (item.montant !== null && !isNaN(item.montant)) {
      total += item.montant;
    }
  }
  return Math.round(total);
}

export function useRecap(): UseRecapReturn {
  const userPlan: 'decouverte' | 'pro' | 'studio' = 'decouverte';
  const [isPaywalled, setIsPaywalled] = useState<boolean>(false);
  const [cabinet, setCabinet] = useState<CabinetInfo>(MOCK_CABINET);

  const recapData = useMemo<RecapData>(() => {
    const tvaRate = 18;

    const lots: DQELot[] = MOCK_DQE_LOTS.map((lot) => ({
      ...lot,
      sousTotal: calculateLotSousTotal(lot.items),
    }));

    const totalHT = lots.reduce((acc, lot) => acc + lot.sousTotal, 0);
    const tva = Math.round(totalHT * (tvaRate / 100));
    const totalTTC = totalHT + tva;

    return {
      project: MOCK_PROJECT_INFO,
      lots,
      totalHT,
      tvaRate,
      tva,
      totalTTC,
      cabinet,
    };
  }, [cabinet]);

  return {
    recapData,
    isPaywalled,
    setIsPaywalled,
    cabinet,
    setCabinet,
    userPlan,
    formatMontant: (n: number) => formatMontant(n),
  };
}
