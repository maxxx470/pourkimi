import { useState, useCallback } from 'react';
import { MetreVersion } from '../types/versions';
import { MOCK_VERSIONS } from '../data/mockVersions';

export interface UseVersionsReturn {
  versions: MetreVersion[];
  isRestoreModalOpen: boolean;
  isPreviewModalOpen: boolean;
  selectedVersionId: string | null;
  requestRestore: (id: string) => void;
  confirmRestore: () => void;
  cancelRestore: () => void;
  requestPreview: (id: string) => void;
  closePreview: () => void;
  formatDate: (iso: string) => string;
  formatMontant: (n: number | null | undefined) => string;
}

export function formatMontant(n: number | null | undefined): string {
  if (n === null || n === undefined || isNaN(n)) return '—';
  const rounded = Math.round(n);
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

const MONTH_NAMES = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
];

export function formatDate(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}h${minutes}`;

  const today = new Date('2026-07-24T00:00:00'); // current mock reference date or system date
  const targetDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffDays = Math.round(
    (today.getTime() - targetDay.getTime()) / (1000 * 3600 * 24)
  );

  if (diffDays === 0) {
    return `Aujourd'hui · ${timeStr}`;
  } else if (diffDays === 1) {
    return `Hier · ${timeStr}`;
  } else {
    const dayNum = date.getDate();
    const monthName = MONTH_NAMES[date.getMonth()];
    return `${dayNum} ${monthName} · ${timeStr}`;
  }
}

export function useVersions(): UseVersionsReturn {
  const [versions, setVersions] = useState<MetreVersion[]>(MOCK_VERSIONS);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);

  const requestRestore = useCallback((id: string) => {
    setSelectedVersionId(id);
    setIsRestoreModalOpen(true);
  }, []);

  const confirmRestore = useCallback(() => {
    if (!selectedVersionId) return;

    setVersions((prev) => {
      const targetVersion = prev.find((v) => v.id === selectedVersionId);
      if (!targetVersion) return prev;

      const currentVer = prev.find((v) => v.isCurrent);
      const now = new Date().toISOString();

      // Create backup of current version before restoring
      const maxVersionNum = Math.max(...prev.map((v) => v.versionNumber), 0);
      const backupVersion: MetreVersion = {
        id: `v_${Date.now()}`,
        versionNumber: maxVersionNum + 1,
        label: `Restauration de la V${targetVersion.versionNumber} (${targetVersion.label})`,
        trigger: 'manual',
        createdAt: now,
        lignesCount: targetVersion.lignesCount,
        totalTTC: targetVersion.totalTTC,
        isCurrent: true,
      };

      // Set previous versions isCurrent to false
      const updatedList = prev.map((v) => ({
        ...v,
        isCurrent: false,
      }));

      // Keep maximum 10 versions
      const newList = [backupVersion, ...updatedList];
      return newList.slice(0, 10);
    });

    setIsRestoreModalOpen(false);
  }, [selectedVersionId]);

  const cancelRestore = useCallback(() => {
    setIsRestoreModalOpen(false);
    setSelectedVersionId(null);
  }, []);

  const requestPreview = useCallback((id: string) => {
    setSelectedVersionId(id);
    setIsPreviewModalOpen(true);
  }, []);

  const closePreview = useCallback(() => {
    setIsPreviewModalOpen(false);
  }, []);

  return {
    versions,
    isRestoreModalOpen,
    isPreviewModalOpen,
    selectedVersionId,
    requestRestore,
    confirmRestore,
    cancelRestore,
    requestPreview,
    closePreview,
    formatDate,
    formatMontant,
  };
}
