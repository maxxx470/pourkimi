import { useState, useCallback } from 'react';
import { CalcLot, Hypothese } from '../data/mockCahier';
import { useProjectData } from '../store/ProjectDataContext';

export interface UseCahierCalculReturn {
  lots: CalcLot[];
  hypotheses: Hypothese[];
  editMode: boolean;
  toggleEditMode: () => void;
  editedValues: Record<string, string>;
  updateValue: (itemId: string, value: string) => void;
  recalculate: (itemId: string) => void;
  selectedLot: 'all' | number;
  setSelectedLot: (lot: 'all' | number) => void;
  hasWarnings: boolean;
  warningCount: number;
  recentlyChangedItemId: string | null;
}

export function useCahierCalcul(): UseCahierCalculReturn {
  const { cahierLots: lots, hypotheses, updateCahierEditableValue, recalculateMetre } =
    useProjectData();

  const [editMode, setEditMode] = useState<boolean>(true);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [selectedLot, setSelectedLot] = useState<'all' | number>('all');
  const [recentlyChangedItemId, setRecentlyChangedItemId] = useState<string | null>(null);

  const toggleEditMode = useCallback(() => {
    setEditMode((prev) => !prev);
  }, []);

  const triggerFlash = (itemId: string) => {
    setRecentlyChangedItemId(itemId);
    setTimeout(() => {
      setRecentlyChangedItemId(null);
    }, 800);
  };

  const updateValue = useCallback(
    (itemId: string, value: string) => {
      setEditedValues((prev) => ({ ...prev, [itemId]: value }));
      updateCahierEditableValue(itemId, value);
    },
    [updateCahierEditableValue]
  );

  const recalculate = useCallback(
    (itemId: string) => {
      recalculateMetre(itemId);
      triggerFlash(itemId);
    },
    [recalculateMetre]
  );

  const warningCount = hypotheses.length;
  const hasWarnings = warningCount > 0;

  return {
    lots,
    hypotheses,
    editMode,
    toggleEditMode,
    editedValues,
    updateValue,
    recalculate,
    selectedLot,
    setSelectedLot,
    hasWarnings,
    warningCount,
    recentlyChangedItemId,
  };
}
