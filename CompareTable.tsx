import React from 'react';
import { Variante } from '../../../types/variantes';
import { LOT_NAMES } from '../../../data/mockVariantes';

interface CompareTableProps {
  varianteA?: Variante;
  varianteB?: Variante;
  formatMontant: (n: number) => string;
}

export const CompareTable: React.FC<CompareTableProps> = ({
  varianteA,
  varianteB,
  formatMontant,
}) => {
  const lotIds = [1, 2, 3, 4, 5, 6];

  const totalA = varianteA?.totalTTC ?? 0;
  const totalB = varianteB?.totalTTC ?? 0;

  const cheapestTotal =
    totalA > 0 && totalB > 0
      ? totalA < totalB
        ? 'A'
        : totalB < totalA
        ? 'B'
        : 'NONE'
      : 'NONE';

  return (
    <div
      style={{
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
      }}
      className="w-full font-sans shadow-2xs overflow-x-auto min-w-0"
    >
      <table className="w-full border-collapse text-left min-w-[600px]">
        <thead>
          <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] font-sans text-[10px] font-bold uppercase tracking-wider text-[#475569]">
            <th className="py-3 px-4 font-bold text-left w-1/3">Lot</th>
            <th className="py-3 px-4 font-bold text-center w-1/3">
              {varianteA ? (
                <div className="flex flex-col items-center">
                  <span className="text-[#1E293B] text-[12px] capitalize font-bold">
                    {varianteA.nom}
                  </span>
                  <span className="text-[10px] text-[#475569] lowercase font-normal">
                    (Mode {varianteA.mode})
                  </span>
                </div>
              ) : (
                'Variante A'
              )}
            </th>
            <th className="py-3 px-4 font-bold text-center w-1/3">
              {varianteB ? (
                <div className="flex flex-col items-center">
                  <span className="text-[#1E293B] text-[12px] capitalize font-bold">
                    {varianteB.nom}
                  </span>
                  <span className="text-[10px] text-[#475569] lowercase font-normal">
                    (Mode {varianteB.mode})
                  </span>
                </div>
              ) : (
                'Variante B'
              )}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E2E8F0] font-sans text-xs">
          {lotIds.map((lotId) => {
            const lotInfo = LOT_NAMES[lotId] || {
              name: `Lot ${lotId}`,
              color: '#475569',
            };

            const valA = varianteA?.lotsTotal?.[lotId];
            const valB = varianteB?.lotsTotal?.[lotId];

            const hasValA = typeof valA === 'number' && valA > 0;
            const hasValB = typeof valB === 'number' && valB > 0;

            let diffA: number | null = null;
            let diffB: number | null = null;

            if (hasValA && hasValB) {
              if (valA > valB) {
                const pc = Math.round(((valA - valB) / valB) * 100);
                if (pc >= 10) diffA = pc;
              } else if (valB > valA) {
                const pc = Math.round(((valB - valA) / valA) * 100);
                if (pc >= 10) diffB = pc;
              }
            }

            return (
              <tr key={lotId} className="hover:bg-[#F8FAFC]/50 transition-colors">
                {/* Left cell: Lot info */}
                <td className="py-3 px-4 text-[#475569] font-medium text-[12px]">
                  <span className="font-bold text-[#1E293B] mr-1">
                    LOT {lotId}
                  </span>
                  — {lotInfo.name}
                </td>

                {/* Center cell: Variante A */}
                <td className="py-3 px-4 text-center">
                  {hasValA ? (
                    <div>
                      <div className="font-sans font-bold text-[#1E293B] text-[13px]">
                        {formatMontant(valA)} FCFA
                      </div>
                      {diffA !== null && (
                        <div className="text-[10px] font-bold text-[#E8442A] mt-0.5">
                          +{diffA}%
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-[#475569] font-medium text-[12px]">
                      —
                    </span>
                  )}
                </td>

                {/* Center cell: Variante B */}
                <td className="py-3 px-4 text-center">
                  {hasValB ? (
                    <div>
                      <div className="font-sans font-bold text-[#1E293B] text-[13px]">
                        {formatMontant(valB)} FCFA
                      </div>
                      {diffB !== null && (
                        <div className="text-[10px] font-bold text-[#E8442A] mt-0.5">
                          +{diffB}%
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-[#475569] font-medium text-[12px]">
                      —
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>

        {/* Ligne finale — Total TTC */}
        <tfoot>
          <tr className="bg-[#F1F5F9] font-extrabold border-t border-[rgba(0,0,0,0.12)]">
            <td className="py-3.5 px-4 text-[#1E293B] text-[12px] font-extrabold">
              Total TTC
            </td>
            <td className="py-3.5 px-4 text-center">
              <span
                style={{
                  color: cheapestTotal === 'A' ? '#12B76A' : '#1E293B',
                }}
                className="font-sans font-extrabold text-[14px]"
              >
                {varianteA ? `${formatMontant(varianteA.totalTTC)} FCFA` : '—'}
              </span>
            </td>
            <td className="py-3.5 px-4 text-center">
              <span
                style={{
                  color: cheapestTotal === 'B' ? '#12B76A' : '#1E293B',
                }}
                className="font-sans font-extrabold text-[14px]"
              >
                {varianteB ? `${formatMontant(varianteB.totalTTC)} FCFA` : '—'}
              </span>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
