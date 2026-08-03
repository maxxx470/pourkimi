import { useState, useCallback, useRef, useEffect } from 'react';
import { DQELot, DQEItem } from '../data/mockDQE';
import { LotPredefini } from '../data/lotsPredefinis';
import { useProjectData } from '../store/ProjectDataContext';

export interface UseDQEReturn {
  lots: DQELot[];
  modeDevis: boolean;
  editMode: boolean;
  selectedLot: 'all' | number;
  totalHT: number;
  tva: number;
  totalTTC: number;
  toastMessage: string | null;
  isSaving: boolean;
  toggleModeDevis: () => void;
  toggleEditMode: () => void;
  setSelectedLot: (lot: 'all' | number) => void;
  updatePrix: (itemId: string, prix: number | null) => void;
  updateQuantite: (itemId: string, quantite: number) => void;
  updateUnite: (itemId: string, unite: string) => void;
  deleteItem: (itemId: string) => void;
  addItem: (lotId: number, item: Partial<DQEItem>) => void;
  addLot: (nom: string, color: string, bgColor: string, corpsMetier?: string) => void;
  deleteLot: (lotId: number) => void;
  lotsPredefinisDisponibles: LotPredefini[];
  filteredLots: DQELot[];
}

export function formatMontant(n: number | null | undefined): string {
  if (n === null || n === undefined || isNaN(n)) return '—';
  const rounded = Math.round(n);
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function useDQE(projectId: string = 'p1'): UseDQEReturn {
  const {
    dqeLots: lots,
    updateDQEPrix,
    updateDQEQuantite,
    updateDQEUnite,
    deleteDQEItem,
    addDQEItem,
    addDQELot,
    deleteDQELot,
    lotsPredefinisDisponibles,
  } = useProjectData();

  const [modeDevis, setModeDevis] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedLot, setSelectedLot] = useState<'all' | number>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const priceDebounceTimerRef = useRef<Record<string, NodeJS.Timeout>>({});
  const quantiteDebounceTimerRef = useRef<Record<string, NodeJS.Timeout>>({});
  const uniteDebounceTimerRef = useRef<Record<string, NodeJS.Timeout>>({});

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 1500);
  }, []);

  const toggleModeDevis = useCallback(() => {
    setModeDevis((prev) => !prev);
  }, []);

  const toggleEditMode = useCallback(() => {
    setEditMode((prev) => !prev);
  }, []);

  // 1. Update Prix (persistance simulée + mise à jour du store partagé)
  const updatePrix = useCallback(
    (itemId: string, prix: number | null) => {
      updateDQEPrix(itemId, prix);

      if (priceDebounceTimerRef.current[itemId]) {
        clearTimeout(priceDebounceTimerRef.current[itemId]);
      }
      priceDebounceTimerRef.current[itemId] = setTimeout(async () => {
        setIsSaving(true);
        try {
          await fetch('/api/dqe/update-prix', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project_id: projectId, item_id: itemId, prix_unitaire: prix }),
          });
          showToast('Sauvegardé');
        } catch (err) {
          console.error('Error saving price:', err);
        } finally {
          setIsSaving(false);
        }
      }, 800);
    },
    [projectId, showToast, updateDQEPrix]
  );

  // 2. Update Quantite
  const updateQuantite = useCallback(
    (itemId: string, quantite: number) => {
      updateDQEQuantite(itemId, quantite);

      if (quantiteDebounceTimerRef.current[itemId]) {
        clearTimeout(quantiteDebounceTimerRef.current[itemId]);
      }
      quantiteDebounceTimerRef.current[itemId] = setTimeout(async () => {
        setIsSaving(true);
        try {
          await fetch('/api/dqe/update-quantite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project_id: projectId, item_id: itemId, quantite }),
          });
          showToast('Sauvegardé');
        } catch (err) {
          console.error('Error saving quantity:', err);
        } finally {
          setIsSaving(false);
        }
      }, 1000);
    },
    [projectId, showToast, updateDQEQuantite]
  );

  // 3. Update Unite
  const updateUnite = useCallback(
    (itemId: string, unite: string) => {
      updateDQEUnite(itemId, unite);

      if (uniteDebounceTimerRef.current[itemId]) {
        clearTimeout(uniteDebounceTimerRef.current[itemId]);
      }
      uniteDebounceTimerRef.current[itemId] = setTimeout(async () => {
        setIsSaving(true);
        try {
          await fetch('/api/dqe/update-unite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project_id: projectId, item_id: itemId, unite }),
          });
          showToast('Sauvegardé');
        } catch (err) {
          console.error('Error saving unit:', err);
        } finally {
          setIsSaving(false);
        }
      }, 1000);
    },
    [projectId, showToast, updateDQEUnite]
  );

  // 3. Delete Item
  const deleteItem = useCallback(
    (itemId: string) => {
      const confirmed = window.confirm(
        'Voulez-vous vraiment supprimer cet ouvrage du tableau DQE ?'
      );
      if (!confirmed) return;
      deleteDQEItem(itemId);
      showToast('Ouvrage supprimé');
    },
    [deleteDQEItem, showToast]
  );

  // 4. Add Item
  const addItem = useCallback(
    (lotId: number, partialItem: Partial<DQEItem>) => {
      addDQEItem(lotId, partialItem);
      showToast('Ouvrage ajouté');
    },
    [addDQEItem, showToast]
  );

  // 5. Add Lot
  const addLot = useCallback(
    (nom: string, color: string, bgColor: string, corpsMetier?: string) => {
      addDQELot(nom, color, bgColor, corpsMetier);
      showToast(`Lot "${nom}" ajouté`);
    },
    [addDQELot, showToast]
  );

  // 6. Delete Lot
  const deleteLot = useCallback(
    (lotId: number) => {
      const confirmed = window.confirm(
        'Voulez-vous vraiment supprimer ce lot et tous ses ouvrages du DQE ?'
      );
      if (!confirmed) return;
      deleteDQELot(lotId);
      showToast('Lot supprimé');
    },
    [deleteDQELot, showToast]
  );

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(priceDebounceTimerRef.current).forEach(clearTimeout);
      Object.values(quantiteDebounceTimerRef.current).forEach(clearTimeout);
      Object.values(uniteDebounceTimerRef.current).forEach(clearTimeout);
    };
  }, []);

  // Compute overall totals
  const totalHT = lots.reduce((acc, lot) => acc + lot.sousTotal, 0);
  const tva = Math.round(totalHT * 0.18);
  const totalTTC = totalHT + tva;
  const filteredLots =
    selectedLot === 'all' ? lots : lots.filter((l) => l.id === selectedLot);

  return {
    lots,
    modeDevis,
    editMode,
    selectedLot,
    totalHT,
    tva,
    totalTTC,
    toastMessage,
    isSaving,
    toggleModeDevis,
    toggleEditMode,
    setSelectedLot,
    updatePrix,
    updateQuantite,
    updateUnite,
    deleteItem,
    addItem,
    addLot,
    deleteLot,
    lotsPredefinisDisponibles,
    filteredLots,
  };
}
