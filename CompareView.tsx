import React from 'react';
import { Variante } from '../../../types/variantes';
import { CompareTable } from './CompareTable';

interface CompareViewProps {
  variantes: Variante[];
  varianteAId: string;
  varianteBId: string;
  onChangeA: (id: string) => void;
  onChangeB: (id: string) => void;
  formatMontant: (n: number) => string;
}

export const CompareView: React.FC<CompareViewProps> = ({
  variantes,
  varianteAId,
  varianteBId,
  onChangeA,
  onChangeB,
  formatMontant,
}) => {
  const varianteA = variantes.find((v) => v.id === varianteAId);
  const varianteB = variantes.find((v) => v.id === varianteBId);

  return (
    <div className="w-full font-sans">
      {/* Header de sélection */}
      <div className="flex items-center gap-3 mb-3.5">
        {/* Sélecteur gauche */}
        <div className="flex-1 flex items-center gap-2">
          <label className="text-[11px] font-semibold text-[#475569] whitespace-nowrap">
            Variante A
          </label>
          <select
            value={varianteAId}
            onChange={(e) => onChangeA(e.target.value)}
            style={{
              height: '36px',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
            }}
            className="flex-1 px-2.5 font-sans text-[12px] font-semibold text-[#1E293B] bg-white outline-none focus:border-[#4F46E5] transition-colors cursor-pointer"
          >
            {variantes.map((v) => (
              <option key={v.id} value={v.id}>
                {v.nom} (Mode {v.mode})
              </option>
            ))}
          </select>
        </div>

        {/* VS au centre */}
        <span className="font-sans font-extrabold text-[13px] text-[#475569] px-1 shrink-0">
          VS
        </span>

        {/* Sélecteur droit */}
        <div className="flex-1 flex items-center gap-2">
          <label className="text-[11px] font-semibold text-[#475569] whitespace-nowrap">
            Variante B
          </label>
          <select
            value={varianteBId}
            onChange={(e) => onChangeB(e.target.value)}
            style={{
              height: '36px',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
            }}
            className="flex-1 px-2.5 font-sans text-[12px] font-semibold text-[#1E293B] bg-white outline-none focus:border-[#4F46E5] transition-colors cursor-pointer"
          >
            {variantes.map((v) => (
              <option key={v.id} value={v.id}>
                {v.nom} (Mode {v.mode})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CompareTable */}
      <CompareTable
        varianteA={varianteA}
        varianteB={varianteB}
        formatMontant={formatMontant}
      />
    </div>
  );
};
