export type VersionTrigger = 'auto' | 'export' | 'analyse' | 'manual' | 'initial';

export interface MetreVersion {
  id: string;
  versionNumber: number;
  label: string;
  trigger: VersionTrigger;
  createdAt: string;
  lignesCount: number;
  totalTTC: number | null;
  isCurrent: boolean;
}
