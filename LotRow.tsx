import React from 'react';
import { Trash2 } from 'lucide-react';
import { DQELot } from '../../../data/mockDQE';

export interface LotRowProps {
  lot: DQELot;
  colSpan?: number;
  editMode?: boolean;
  onDeleteLot?: (lotId: number) => void;
}

export const LotRow: React.FC<LotRowProps> = ({ lot, colSpan = 7, editMode = false, onDeleteLot }) => {
  return (
    <tr
      style={{
        backgroundColor: lot.color,
        color: '#ffffff',
      }}
      className="font-sans font-extrabold text-[11px] uppercase tracking-wider select-none"
    >
      <td colSpan={editMode && lot.isCustom ? colSpan - 1 : colSpan} className="px-3 py-2 text-left">
        <span>
          LOT {lot.numero} — {lot.name}
        </span>
        {lot.isCustom && (
          <span
            style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
            className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold normal-case tracking-normal"
          >
            Ajouté manuellement — non issu de l'analyse des plans
          </span>
        )}
      </td>
      {editMode && lot.isCustom && (
        <td className="px-3 py-2 text-right">
          <button
            type="button"
            onClick={() => onDeleteLot && onDeleteLot(lot.id)}
            className="text-white/80 hover:text-white cursor-pointer inline-flex items-center"
            title="Supprimer ce lot"
          >
            <Trash2 size={13} />
          </button>
        </td>
      )}
    </tr>
  );
};
