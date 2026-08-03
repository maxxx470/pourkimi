import { useState, useCallback, useMemo, useRef } from 'react';
import { ModeDevis, Piece } from '../types/devis';
import { DQELot, DQEItem } from '../data/mockDQE';
import { useProjectData } from '../store/ProjectDataContext';

export interface UseDevisReturn {
  mode: ModeDevis;
  switchMode: (mode: ModeDevis) => void;
  prixUnitaires: Record<string, number>;
  updatePrixUnitaire: (itemId: string, prix: number) => void;
  pieces: Piece[];
  updatePrixPiece: (pieceId: string, prix: number) => void;
  applyPrixToAllPieces: (prix: number) => void;
  lots: DQELot[];
  totalHT: number;
  tvaRate: number;
  tva: number;
  totalTTC: number;
  devise: string;
  formatMontant: (n: number) => string;
  isSaving: boolean;
}

function extractPrixUnitaires(lots: DQELot[]): Record<string, number> {
  const map: Record<string, number> = {};
  const extractFromItems = (items: DQEItem[]) => {
    for (const item of items) {
      if (item.prixUnitaire !== null && item.prixUnitaire !== undefined) {
        map[item.id] = item.prixUnitaire;
      }
      if (item.children && item.children.length > 0) {
        extractFromItems(item.children);
      }
    }
  };
  for (const lot of lots) {
    extractFromItems(lot.items);
  }
  return map;
}

export function useDevis(): UseDevisReturn {
  const {
    dqeLots: lots,
    updateDQEPrix,
    pieces,
    updatePiecePrix,
    applyPrixToAllPieces: applyPrixToAllPiecesShared,
    devisModePipeline,
  } = useProjectData();

  const [mode, setMode] = useState<ModeDevis>(devisModePipeline === 'm2' ? 'B' : 'A');
  const [tvaRate] = useState<number>(18);
  const [devise] = useState<string>('FCFA');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const prixUnitaires = useMemo(() => extractPrixUnitaires(lots), [lots]);

  const triggerSavingToast = useCallback(() => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setIsSaving(true);
    toastTimerRef.current = setTimeout(() => {
      setIsSaving(false);
    }, 1500);
  }, []);

  const switchMode = useCallback((newMode: ModeDevis) => {
    setMode(newMode);
  }, []);

  const updatePrixUnitaire = useCallback(
    (itemId: string, prix: number) => {
      updateDQEPrix(itemId, isNaN(prix) ? null : prix);

      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        triggerSavingToast();
      }, 800);
    },
    [triggerSavingToast, updateDQEPrix]
  );

  const updatePrixPiece = useCallback(
    (pieceId: string, prix: number) => {
      updatePiecePrix(pieceId, prix);

      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        triggerSavingToast();
      }, 800);
    },
    [triggerSavingToast, updatePiecePrix]
  );

  const applyPrixToAllPieces = useCallback(
    (prix: number) => {
      applyPrixToAllPiecesShared(prix);

      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        triggerSavingToast();
      }, 800);
    },
    [applyPrixToAllPiecesShared, triggerSavingToast]
  );

  // Compute totalHT based on active mode
  const totalHT = useMemo(() => {
    if (mode === 'A') {
      let total = 0;
      const processItems = (items: DQEItem[]) => {
        for (const item of items) {
          if (!item.isSubLot && !item.isDetail) {
            const pu = prixUnitaires[item.id];
            if (pu !== undefined && pu !== null && item.quantite) {
              total += Math.round(item.quantite * pu);
            }
          }
          if (item.children && item.children.length > 0) {
            processItems(item.children);
          }
        }
      };
      for (const lot of lots) {
        processItems(lot.items);
      }
      return total;
    } else {
      return pieces.reduce((sum, p) => sum + (p.montant || 0), 0);
    }
  }, [mode, lots, prixUnitaires, pieces]);

  const tva = useMemo(() => Math.round(totalHT * (tvaRate / 100)), [totalHT, tvaRate]);
  const totalTTC = useMemo(() => totalHT + tva, [totalHT, tva]);

  const formatMontant = useCallback((n: number) => {
    if (n === null || n === undefined || isNaN(n)) return '0';
    return Math.round(n)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }, []);

  return {
    mode,
    switchMode,
    prixUnitaires,
    updatePrixUnitaire,
    pieces,
    updatePrixPiece,
    applyPrixToAllPieces,
    lots,
    totalHT,
    tvaRate,
    tva,
    totalTTC,
    devise,
    formatMontant,
    isSaving,
  };
}
