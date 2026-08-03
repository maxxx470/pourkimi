import { useState, useCallback, useMemo } from 'react';
import { Variante } from '../types/variantes';
import { MOCK_VARIANTES } from '../data/mockVariantes';
import { useProjectData } from '../store/ProjectDataContext';

export interface UseVariantesReturn {
  variantes: Variante[];
  activeVarianteId: string;
  setActiveVariante: (id: string) => void;
  duplicateVariante: (id: string) => void;
  deleteVariante: (id: string) => void;
  createVariante: (nom: string, mode: 'A' | 'B', baseOn?: string) => void;
  formatMontant: (n: number) => string;
  getCheapest: () => string;
  getMostExpensive: () => string;
}

export function formatMontant(n: number | null | undefined): string {
  if (n === null || n === undefined || isNaN(n)) return '—';
  const rounded = Math.round(n);
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function useVariantes(): UseVariantesReturn {
  const { devisModePipeline, dqeLots, pieces } = useProjectData();
  const currentMode: 'A' | 'B' = devisModePipeline === 'm2' ? 'B' : 'A';

  const [savedVariantes, setSavedVariantes] = useState<Variante[]>(MOCK_VARIANTES);
  const [activeVarianteId, setActiveVarianteId] = useState<string>('current');

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  // "Version actuelle" dynamique calculée à partir des données live de useProjectData
  const versionActuelle: Variante = useMemo(() => {
    if (currentMode === 'B') {
      const totalHT = pieces.reduce((acc, p) => acc + (p.montant || 0), 0);
      const ouvragesChiffres = pieces.filter(
        (p) => p.prixAuM2 !== null && p.prixAuM2 > 0
      ).length;

      return {
        id: 'current',
        nom: 'Version actuelle',
        mode: 'B',
        createdAt: today,
        description: "Reflète l'état actuel du projet",
        lotsTotal: {},
        totalHT,
        totalTTC: Math.round(totalHT * 1.18),
        ouvragesChiffres,
        isActive: false,
      };
    } else {
      const lotsTotal: Record<number, number> = {};
      let totalHT = 0;
      let ouvragesChiffres = 0;

      for (const lot of dqeLots) {
        lotsTotal[lot.id] = lot.sousTotal || 0;
        totalHT += lot.sousTotal || 0;
        for (const item of lot.items) {
          if (item.isSubLot && item.children) {
            for (const child of item.children) {
              if (child.montant && child.montant > 0) ouvragesChiffres++;
            }
          } else if (!item.isSubLot) {
            if (item.montant && item.montant > 0) ouvragesChiffres++;
          }
        }
      }

      return {
        id: 'current',
        nom: 'Version actuelle',
        mode: 'A',
        createdAt: today,
        description: "Reflète l'état actuel du projet",
        lotsTotal,
        totalHT,
        totalTTC: Math.round(totalHT * 1.18),
        ouvragesChiffres,
        isActive: false,
      };
    }
  }, [currentMode, pieces, dqeLots, today]);

  // Filtrer les variantes sauvegardées par mode courant
  const filteredSaved = useMemo(
    () => savedVariantes.filter((v) => v.mode === currentMode),
    [savedVariantes, currentMode]
  );

  const listRaw = useMemo(
    () => [versionActuelle, ...filteredSaved],
    [versionActuelle, filteredSaved]
  );

  const effectiveActiveId = useMemo(() => {
    return listRaw.some((v) => v.id === activeVarianteId)
      ? activeVarianteId
      : 'current';
  }, [listRaw, activeVarianteId]);

  const variantes = useMemo(() => {
    return listRaw.map((v) => ({
      ...v,
      isActive: v.id === effectiveActiveId,
    }));
  }, [listRaw, effectiveActiveId]);

  const setActiveVariante = useCallback((id: string) => {
    setActiveVarianteId(id);
  }, []);

  const duplicateVariante = useCallback(
    (id: string) => {
      setSavedVariantes((prev) => {
        const source = variantes.find((v) => v.id === id);
        if (!source) return prev;

        const newVariante: Variante = {
          ...source,
          id: `v_${Date.now()}`,
          nom: `${source.nom} — Copie`,
          createdAt: today,
          isActive: false,
        };

        return [...prev, newVariante];
      });
    },
    [variantes, today]
  );

  const deleteVariante = useCallback((id: string) => {
    if (id === 'current') return;
    setSavedVariantes((prev) => prev.filter((v) => v.id !== id));
    setActiveVarianteId((prevId) => (prevId === id ? 'current' : prevId));
  }, []);

  const createVariante = useCallback(
    (nom: string, _mode: 'A' | 'B', baseOn?: string) => {
      setSavedVariantes((prev) => {
        const baseSource = baseOn
          ? variantes.find((v) => v.id === baseOn)
          : undefined;

        const newVariante: Variante = {
          id: `v_${Date.now()}`,
          nom: nom.trim() || `Variante Mode ${currentMode}`,
          mode: currentMode,
          createdAt: today,
          description: baseSource
            ? `Basée sur ${baseSource.nom}`
            : currentMode === 'A'
            ? 'Ouvrages chiffrés'
            : 'Prix au m² tout inclus',
          lotsTotal: baseSource
            ? { ...baseSource.lotsTotal }
            : currentMode === 'A'
            ? { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
            : {},
          totalHT: baseSource ? baseSource.totalHT : 0,
          totalTTC: baseSource ? baseSource.totalTTC : 0,
          ouvragesChiffres: baseSource ? baseSource.ouvragesChiffres : 0,
          isActive: false,
        };

        return [...prev, newVariante];
      });
    },
    [currentMode, variantes, today]
  );

  const getCheapest = useCallback((): string => {
    if (variantes.length === 0) return '';
    let cheapest = variantes[0];
    for (const v of variantes) {
      if (v.totalTTC < cheapest.totalTTC) {
        cheapest = v;
      }
    }
    return cheapest.id;
  }, [variantes]);

  const getMostExpensive = useCallback((): string => {
    if (variantes.length === 0) return '';
    let expensive = variantes[0];
    for (const v of variantes) {
      if (v.totalTTC > expensive.totalTTC) {
        expensive = v;
      }
    }
    return expensive.id;
  }, [variantes]);

  return {
    variantes,
    activeVarianteId: effectiveActiveId,
    setActiveVariante,
    duplicateVariante,
    deleteVariante,
    createVariante,
    formatMontant,
    getCheapest,
    getMostExpensive,
  };
}
