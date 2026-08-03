import { useState, useMemo } from 'react';
import { DQELot, DQEItem } from '../data/mockDQE';
import { CabinetInfo, RecapData } from '../types/recap';
import { useProjectData } from '../store/ProjectDataContext';

export interface UseRecapDQEReturn {
  recapData: RecapData;
  isPaywalled: boolean;
  setIsPaywalled: React.Dispatch<React.SetStateAction<boolean>>;
  cabinet: CabinetInfo;
  setCabinet: (cabinet: CabinetInfo) => void;
  userPlan: 'decouverte' | 'pro' | 'studio';
  formatMontant: (n: number) => string;
}

export function formatMontant(n: number | null | undefined): string {
  if (n === null || n === undefined || isNaN(n)) return '—';
  const rounded = Math.round(n);
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

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

export function useRecapDQE(): UseRecapDQEReturn {
  const { dqeLots, cabinetInfo, updateCabinetInfo } = useProjectData();
  const userPlan: 'decouverte' | 'pro' | 'studio' = 'decouverte';
  const [isPaywalled, setIsPaywalled] = useState<boolean>(false);

  const recapData = useMemo<RecapData>(() => {
    const tvaRate = 18;

    const lots: DQELot[] = dqeLots.map((lot) => ({
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
      cabinet: cabinetInfo,
    };
  }, [dqeLots, cabinetInfo]);

  return {
    recapData,
    isPaywalled,
    setIsPaywalled,
    cabinet: cabinetInfo,
    setCabinet: updateCabinetInfo,
    userPlan,
    formatMontant: (n: number) => formatMontant(n),
  };
}
