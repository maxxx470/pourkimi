import { useState, useMemo, useCallback } from 'react';
import { LigneMateriau, OrigineLigne } from '../types/materiaux';
import { CALCUL_DQE_MATERIAUX } from '../data/mockMateriauxUnifie';
import { useProjectData } from '../store/ProjectDataContext';

export type OrigineFiltre = 'all' | OrigineLigne;

export interface UseMateriauxUnifieReturn {
  materiaux: LigneMateriau[];
  filteredMateriaux: LigneMateriau[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedOrigine: OrigineFiltre;
  setSelectedOrigine: (o: OrigineFiltre) => void;
  selectedCategorie: string;
  setSelectedCategorie: (c: string) => void;
  updatePrix: (id: string, newPrix: number) => void;
  updateRatios: (id: string, newRatios: { label: string; valeur: string }[]) => void;
  addMateriau: (item: Omit<LigneMateriau, 'id'>) => void;
  duplicateMateriau: (id: string) => void;
  deleteMateriau: (id: string) => boolean;
  formatMontant: (n: number) => string;
  isSaving: boolean;
}

// Vue unifiée de la bibliothèque : les lignes "Référence libre" viennent du
// ProjectDataContext (donc partagées avec l'auto-suggestion de matériaux du
// DQE et avec la page "Mes prix" — src/hooks/useMesPrix.ts). Les lignes
// "Calcul DQE" (ratios système) restent gérées localement à cette page pour
// l'instant : les brancher sur le moteur de calcul du DQE est une suite
// possible, pas encore faite (voir deriveDQE.ts, ratios actuellement fixes).
export function useMateriauxUnifie(): UseMateriauxUnifieReturn {
  const { bibliothequeMesPrix, updateBibliothequePrix, deleteBibliothequePrix, addBibliothequePrix } =
    useProjectData();

  const [extraMateriaux, setExtraMateriaux] = useState<LigneMateriau[]>(CALCUL_DQE_MATERIAUX);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrigine, setSelectedOrigine] = useState<OrigineFiltre>('all');
  const [selectedCategorie, setSelectedCategorie] = useState<string>('all');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const materiaux = useMemo<LigneMateriau[]>(() => {
    const fromBibliotheque: LigneMateriau[] = bibliothequeMesPrix.map((item) => ({
      id: item.id,
      designation: item.designation,
      origine: 'reference_libre',
      categorie: item.corpsMetier,
      unite: item.unite,
      prixSuggere: item.prixSuggere,
      prixActuel: item.prixActuel,
      isSystemDefault: false,
    }));
    return [...extraMateriaux, ...fromBibliotheque];
  }, [extraMateriaux, bibliothequeMesPrix]);

  // When changing origin, reset category filter to 'all' if selected category is not valid
  const handleSetSelectedOrigine = useCallback((o: OrigineFiltre) => {
    setSelectedOrigine(o);
    setSelectedCategorie('all');
  }, []);

  const filteredMateriaux = useMemo(() => {
    return materiaux.filter((item) => {
      const query = searchQuery.toLowerCase().trim();
      const matchSearch = !query || item.designation.toLowerCase().includes(query);
      const matchOrigine = selectedOrigine === 'all' || item.origine === selectedOrigine;
      const matchCategorie = selectedCategorie === 'all' || item.categorie === selectedCategorie;
      return matchSearch && matchOrigine && matchCategorie;
    });
  }, [materiaux, searchQuery, selectedOrigine, selectedCategorie]);

  const updatePrix = useCallback(
    (id: string, newPrix: number) => {
      setIsSaving(true);
      const isFromBibliotheque = bibliothequeMesPrix.some((item) => item.id === id);
      if (isFromBibliotheque) {
        updateBibliothequePrix(id, newPrix);
      } else {
        setExtraMateriaux((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, prixActuel: isNaN(newPrix) || newPrix < 0 ? 0 : newPrix }
              : item
          )
        );
      }
      setTimeout(() => setIsSaving(false), 500);
    },
    [bibliothequeMesPrix, updateBibliothequePrix]
  );

  const updateRatios = useCallback((id: string, newRatios: { label: string; valeur: string }[]) => {
    setIsSaving(true);
    setExtraMateriaux((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ratios: newRatios } : item))
    );
    setTimeout(() => setIsSaving(false), 500);
  }, []);

  const addMateriau = useCallback(
    (newItem: Omit<LigneMateriau, 'id'>) => {
      if (newItem.origine === 'reference_libre' && newItem.unite) {
        // Alimente directement la bibliothèque partagée : ce nouveau matériau
        // devient immédiatement disponible pour l'auto-suggestion de lots.
        addBibliothequePrix({
          designation: newItem.designation,
          unite: newItem.unite,
          prixSuggere: newItem.prixSuggere ?? 0,
          prixActuel: newItem.prixActuel ?? newItem.prixSuggere ?? 0,
          corpsMetier: newItem.categorie,
          isSuggestion: false,
        });
      } else {
        const id = `user_${Date.now()}`;
        setExtraMateriaux((prev) => [{ ...newItem, id }, ...prev]);
      }
    },
    [addBibliothequePrix]
  );

  const duplicateMateriau = useCallback(
    (id: string) => {
      const target = materiaux.find((m) => m.id === id);
      if (!target) return;
      const copy: LigneMateriau = {
        ...target,
        id: `copy_${Date.now()}`,
        designation: `${target.designation} (Copie)`,
        isSystemDefault: false,
      };
      setExtraMateriaux((prev) => [copy, ...prev]);
    },
    [materiaux]
  );

  const deleteMateriau = useCallback(
    (id: string): boolean => {
      const target = materiaux.find((m) => m.id === id);
      if (!target || target.isSystemDefault) return false;

      const isFromBibliotheque = bibliothequeMesPrix.some((item) => item.id === id);
      if (isFromBibliotheque) {
        deleteBibliothequePrix(id);
      } else {
        setExtraMateriaux((prev) => prev.filter((m) => m.id !== id));
      }
      return true;
    },
    [materiaux, bibliothequeMesPrix, deleteBibliothequePrix]
  );

  const formatMontant = useCallback((n: number): string => {
    return Math.round(n)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }, []);

  return {
    materiaux,
    filteredMateriaux,
    searchQuery,
    setSearchQuery,
    selectedOrigine,
    setSelectedOrigine: handleSetSelectedOrigine,
    selectedCategorie,
    setSelectedCategorie,
    updatePrix,
    updateRatios,
    addMateriau,
    duplicateMateriau,
    deleteMateriau,
    formatMontant,
    isSaving,
  };
}
