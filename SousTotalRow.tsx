import React from 'react';
import { DQELot } from '../../../data/mockDQE';
import { formatMontant } from '../../../hooks/useDQE';

export interface SousTotalRowProps {
  lot: DQELot;
  modeDevis: boolean;
  editMode: boolean;
}

export const SousTotalRow: React.FC<SousTotalRowProps> = ({
  lot,
  modeDevis,
  editMode,
}) => {
  return (
    <tr
      style={{ backgroundColor: '#F1F5F9' }}
      className="border-t border-b border-[rgba(0,0,0,0.1)] font-sans text-[12px]"
    >
      {/* Colspan for N°, Designation, Unite, Quantite (4 columns) */}
      <td
        colSpan={modeDevis ? 5 : 4}
        className="px-3 py-2 text-right font-bold text-[#1E293B] pr-3"
      >
        Sous-total LOT {lot.numero} — {lot.name}
      </td>

      {/* Montant FCFA (if modeDevis) */}
      {modeDevis && (
        <td className="px-3 py-2 text-right font-extrabold text-[13px] text-[#4F46E5] whitespace-nowrap">
          {lot.sousTotal > 0 ? `${formatMontant(lot.sousTotal)} FCFA` : '—'}
        </td>
      )}

      {/* Observation */}
      <td className="px-3 py-2"></td>

      {/* Actions (if editMode) */}
      {editMode && <td className="px-3 py-2"></td>}
    </tr>
  );
};
