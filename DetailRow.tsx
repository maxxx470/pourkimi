import React from 'react';
import { Trash2 } from 'lucide-react';
import { DQEItem } from '../../../data/mockDQE';

export interface DetailRowProps {
  item: DQEItem;
  modeDevis: boolean;
  editMode: boolean;
  onDelete?: (id: string) => void;
  indent?: number;
}

export const DetailRow: React.FC<DetailRowProps> = ({
  item,
  modeDevis,
  editMode,
  onDelete,
  indent = 1,
}) => {
  const paddingLeftPx = 16 + indent * 12;

  return (
    <tr className="bg-[#F8FAFC]/70 border-b border-[rgba(0,0,0,0.06)] font-sans text-[11px] italic text-[#475569]">
      {/* N° */}
      <td className="px-3 py-1.5 text-left text-[10px] text-[#A1A1AA] whitespace-nowrap">
        {item.numero || ''}
      </td>

      {/* Désignation */}
      <td
        style={{ paddingLeft: `${paddingLeftPx}px` }}
        className="px-3 py-1.5 text-left leading-snug"
      >
        {item.designation}
      </td>

      {/* Unité */}
      <td className="px-3 py-1.5 text-center text-[10px] text-[#A1A1AA] whitespace-nowrap">
        {item.unite}
      </td>

      {/* Quantité */}
      <td className="px-3 py-1.5 text-right font-medium text-[#475569] whitespace-nowrap">
        {item.quantite.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
      </td>

      {/* Prix unitaire (modeDevis only) */}
      {modeDevis && (
        <td className="px-3 py-1.5 text-right text-[10px] text-[#A1A1AA]">
          —
        </td>
      )}

      {/* Montant (modeDevis only) */}
      {modeDevis && (
        <td className="px-3 py-1.5 text-right text-[10px] text-[#A1A1AA]">
          —
        </td>
      )}

      {/* Observation */}
      <td className="px-3 py-1.5 text-left text-[10px] text-[#A1A1AA] max-w-[100px] truncate">
        {item.observation || ''}
      </td>

      {/* Actions (editMode only) */}
      {editMode && (
        <td className="px-3 py-1.5 text-center w-[40px]">
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className="text-[#A1A1AA] hover:text-[#E8442A] p-0.5 transition-colors cursor-pointer"
              title="Supprimer ce détail"
            >
              <Trash2 size={12} />
            </button>
          )}
        </td>
      )}
    </tr>
  );
};
