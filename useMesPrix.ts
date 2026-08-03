import { useMemo, useState, useCallback } from 'react';
import { MonPrix } from '../types/materiaux';
import { useProjectData } from '../store/ProjectDataContext';

export interface UseMesPrixReturn {
  prixList: MonPrix[];
  filteredPrix: MonPrix[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCorpsMetier: string;
  setSelectedCorpsMetier: (cm: string) => void;
  updatePrix: (id: string, newPrix: number) => void;
  deletePrix: (id: string) => void;
  formatMontant: (n: number) => string;
  isSaving: boolean;
}

// Ce hook lit/écrit désormais dans le ProjectDataContext, la même bibliothèque
// que celle utilisée pour l'auto-suggestion de matériaux à l'ajout d'un lot
// dans le DQE (src/store/ProjectDataContext.tsx). Un prix modifié ici est donc
// visible partout, y compris depuis la vue "Bibliothèque unifiée".
export function useMesPrix(): UseMesPrixReturn {
  const { bibliothequeMesPrix: prixList, updateBibliothequePrix, deleteBibliothequePrix } =
    useProjectData();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCorpsMetier, setSelectedCorpsMetier] = useState<string>('all');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const filteredPrix = useMemo(() => {
    return prixList.filter((p) => {
      const matchSearch =
        !searchQuery.trim() || p.designation.toLowerCase().includes(searchQuery.toLowerCase().trim());
      const matchCorps = selectedCorpsMetier === 'all' || p.corpsMetier === selectedCorpsMetier;
      return matchSearch && matchCorps;
    });
  }, [prixList, searchQuery, selectedCorpsMetier]);

  const updatePrix = useCallback(
    (id: string, newPrix: number) => {
      setIsSaving(true);
      updateBibliothequePrix(id, newPrix);
      setTimeout(() => {
        setIsSaving(false);
      }, 800);
    },
    [updateBibliothequePrix]
  );

  const deletePrix = useCallback(
    (id: string) => {
      deleteBibliothequePrix(id);
    },
    [deleteBibliothequePrix]
  );

  const formatMontant = useCallback((n: number): string => {
    return Math.round(n)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }, []);

  return {
    prixList,
    filteredPrix,
    searchQuery,
    setSearchQuery,
    selectedCorpsMetier,
    setSelectedCorpsMetier,
    updatePrix,
    deletePrix,
    formatMontant,
    isSaving,
  };
}
