import { useState, useMemo } from 'react';
import { CabinetInfo, RecapDataM2 } from '../types/recap';
import { useProjectData } from '../store/ProjectDataContext';
import { formatMontant } from './useRecapDQE';

export interface UseRecapM2Return {
  recapData: RecapDataM2;
  isPaywalled: boolean;
  setIsPaywalled: React.Dispatch<React.SetStateAction<boolean>>;
  cabinet: CabinetInfo;
  setCabinet: (cabinet: CabinetInfo) => void;
  userPlan: 'decouverte' | 'pro' | 'studio';
  formatMontant: (n: number) => string;
}

const MOCK_PROJECT_INFO = {
  nom: 'Villa résidentielle R+2',
  client: 'M. Koné',
  localisation: "Abidjan, Côte d'Ivoire",
  etabliPar: 'Ing. T. Kouassi',
};

export function useRecapM2(): UseRecapM2Return {
  const { pieces, cabinetInfo, updateCabinetInfo } = useProjectData();
  const userPlan: 'decouverte' | 'pro' | 'studio' = 'decouverte';
  const [isPaywalled, setIsPaywalled] = useState<boolean>(false);

  const recapData = useMemo<RecapDataM2>(() => {
    const tvaRate = 18;

    const totalHT = pieces.reduce((acc, p) => {
      if (p.montant !== null && p.montant !== undefined && !isNaN(p.montant)) {
        return acc + p.montant;
      }
      return acc;
    }, 0);

    const tva = Math.round(totalHT * (tvaRate / 100));
    const totalTTC = totalHT + tva;

    return {
      project: MOCK_PROJECT_INFO,
      pieces,
      totalHT,
      tvaRate,
      tva,
      totalTTC,
      cabinet: cabinetInfo,
    };
  }, [pieces, cabinetInfo]);

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
