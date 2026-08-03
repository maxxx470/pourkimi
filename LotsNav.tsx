import React from 'react';
import { CalcLot } from '../../../data/mockCahier';

export interface LotsNavProps {
  lots: CalcLot[];
  selectedLot: 'all' | number;
  onSelect: (lot: 'all' | number) => void;
}

export const LotsNav: React.FC<LotsNavProps> = ({
  lots,
  selectedLot,
  onSelect,
}) => {
  return (
    <div className="flex items-center gap-[5px] flex-wrap mb-3.5 font-sans overflow-x-auto pb-1 no-scrollbar">
      {/* "Tous les lots" pill */}
      <button
        type="button"
        onClick={() => onSelect('all')}
        style={
          selectedLot === 'all'
            ? { backgroundColor: '#1E293B', color: '#ffffff' }
            : {
                backgroundColor: '#ffffff',
                border: '1px solid #E2E8F0',
                color: '#475569',
              }
        }
        className="px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-200 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/30 cursor-pointer whitespace-nowrap flex-shrink-0 hover:opacity-95"
      >
        Tous les lots
      </button>

      {/* Per-lot pills */}
      {lots.map((lot) => {
        const isSelected = selectedLot === lot.id;

        return (
          <button
            key={lot.id}
            type="button"
            onClick={() => onSelect(lot.id)}
            style={
              isSelected
                ? {
                    backgroundColor: lot.color,
                    color: '#ffffff',
                    borderColor: 'transparent',
                  }
                : {
                    backgroundColor: '#ffffff',
                    color: lot.color,
                    border: `1px solid ${lot.color}33`,
                  }
            }
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-200 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/30 cursor-pointer whitespace-nowrap flex items-center gap-1.5 flex-shrink-0 hover:opacity-95"
          >
            <span
              style={{
                backgroundColor: isSelected ? '#ffffff' : lot.color,
              }}
              className="w-1.5 h-1.5 rounded-full inline-block"
            />
            <span>{lot.name}</span>
          </button>
        );
      })}
    </div>
  );
};
