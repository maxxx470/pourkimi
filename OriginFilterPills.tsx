import React from 'react';
import { OrigineFiltre } from '../../../hooks/useMateriauxUnifie';

interface OriginFilterPillsProps {
  selectedOrigine: OrigineFiltre;
  onSelectOrigine: (origine: OrigineFiltre) => void;
  countMap: { all: number; calcul_dqe: number; reference_libre: number };
}

export const OriginFilterPills: React.FC<OriginFilterPillsProps> = ({
  selectedOrigine,
  onSelectOrigine,
  countMap,
}) => {
  const options: { id: OrigineFiltre; label: string; count: number }[] = [
    { id: 'all', label: 'Tous', count: countMap.all },
    { id: 'calcul_dqe', label: 'Calcul DQE', count: countMap.calcul_dqe },
    { id: 'reference_libre', label: 'Référence libre', count: countMap.reference_libre },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none whitespace-nowrap min-w-0 w-full">
      {options.map((opt) => {
        const isSelected = selectedOrigine === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelectOrigine(opt.id)}
            style={{
              backgroundColor: isSelected ? '#1E293B' : '#F1F5F9',
              color: isSelected ? '#ffffff' : '#64748B',
              border: isSelected ? '1px solid #1E293B' : '1px solid #E2E8F0',
            }}
            className="font-sans font-semibold text-[13px] px-4 py-2 min-h-[40px] rounded-full transition-all duration-200 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/30 cursor-pointer shadow-2xs flex items-center gap-2 shrink-0 hover:opacity-90"
          >
            <span>{opt.label}</span>
            <span
              style={{
                backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.06)',
                color: isSelected ? '#ffffff' : '#475569',
              }}
              className="text-[11px] px-1.5 py-0.5 rounded-full font-bold"
            >
              {opt.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
