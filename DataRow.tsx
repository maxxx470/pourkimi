import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { DQEItem } from '../../../data/mockDQE';
import { formatMontant } from '../../../hooks/useDQE';

export interface DataRowProps {
  item: DQEItem;
  modeDevis: boolean;
  editMode: boolean;
  onPrixChange: (id: string, prix: number | null) => void;
  onQuantiteChange: (id: string, q: number) => void;
  onUniteChange: (id: string, u: string) => void;
  onDelete: (id: string) => void;
  indent?: number;
}

export const DataRow: React.FC<DataRowProps> = ({
  item,
  modeDevis,
  editMode,
  onPrixChange,
  onQuantiteChange,
  onUniteChange,
  onDelete,
  indent = 0,
}) => {
  const [localPrice, setLocalPrice] = useState<string>(
    item.prixUnitaire !== null && item.prixUnitaire !== undefined
      ? String(item.prixUnitaire)
      : ''
  );

  const [localQty, setLocalQty] = useState<string>(String(item.quantite));
  const [localUnite, setLocalUnite] = useState<string>(item.unite || '');

  // Sync state if item prop changes
  useEffect(() => {
    setLocalPrice(
      item.prixUnitaire !== null && item.prixUnitaire !== undefined
        ? String(item.prixUnitaire)
        : ''
    );
  }, [item.prixUnitaire]);

  useEffect(() => {
    setLocalQty(String(item.quantite));
  }, [item.quantite]);

  useEffect(() => {
    setLocalUnite(item.unite || '');
  }, [item.unite]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalPrice(val);
    if (val.trim() === '') {
      onPrixChange(item.id, null);
    } else {
      const num = parseFloat(val);
      if (!isNaN(num)) {
        onPrixChange(item.id, num);
      }
    }
  };

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalQty(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      onQuantiteChange(item.id, num);
    }
  };

  const handleUniteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalUnite(val);
    onUniteChange(item.id, val);
  };

  const paddingLeftPx = 12 + indent * 12;

  return (
    <tr className="hover:bg-[#F8FAFC] border-b border-[#E2E8F0] font-sans text-[12px] transition-colors">
      {/* N° */}
      <td className="px-3 py-2 text-left font-medium text-[#475569] text-[11px] whitespace-nowrap">
        {item.numero || ''}
      </td>

      {/* Désignation */}
      <td
        style={{ paddingLeft: `${paddingLeftPx}px` }}
        className="px-3 py-2 text-left font-semibold text-[#1E293B] leading-snug"
      >
        <span>{item.designation}</span>
        {item.isDefault && (
          <span
            style={{
              backgroundColor: '#FDF8EC',
              color: '#D4960A',
              borderRadius: '4px',
            }}
            className="text-[9px] font-bold px-1.5 py-0.5 ml-1.5 inline-block tracking-tight"
          >
            Défaut
          </span>
        )}
      </td>

      {/* Unité */}
      <td className="px-3 py-2 text-center text-[#475569] text-[10px] font-medium whitespace-nowrap">
        {editMode ? (
          <input
            type="text"
            value={localUnite}
            onChange={handleUniteChange}
            className="w-[55px] h-[26px] border border-[rgba(0,0,0,0.12)] rounded px-1 text-center font-medium text-[11px] text-[#1E293B] outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]/30"
          />
        ) : (
          <span>{item.unite}</span>
        )}
      </td>

      {/* Quantité */}
      <td className="px-3 py-2 text-right font-bold text-[#1E293B] whitespace-nowrap">
        {editMode ? (
          <input
            type="number"
            step="any"
            value={localQty}
            onChange={handleQtyChange}
            className="w-[70px] h-[26px] border border-[rgba(0,0,0,0.12)] rounded px-1.5 text-right font-bold text-[12px] text-[#1E293B] outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]/30"
          />
        ) : (
          <span>
            {item.quantite.toLocaleString('fr-FR', {
              maximumFractionDigits: 2,
            })}
          </span>
        )}
      </td>

      {/* Prix unitaire FCFA (modeDevis only) */}
      {modeDevis && (
        <td className="px-3 py-2 text-right whitespace-nowrap">
          <input
            type="number"
            value={localPrice}
            placeholder="0"
            onChange={handlePriceChange}
            style={{
              width: '80px',
              height: '26px',
              border: '1px solid #E2E8F0',
              borderRadius: '6px',
            }}
            className="px-1.5 text-right font-semibold text-[11px] text-[#1E293B] bg-white outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]/30 transition-all"
          />
        </td>
      )}

      {/* Montant FCFA (modeDevis only) */}
      {modeDevis && (
        <td className="px-3 py-2 text-right font-bold text-[12px] text-[#4F46E5] whitespace-nowrap">
          {item.montant !== null && item.montant !== undefined
            ? formatMontant(item.montant)
            : '—'}
        </td>
      )}

      {/* Observation */}
      <td className="px-3 py-2 text-left italic text-[10px] text-[#475569] max-w-[100px] truncate">
        {item.observation || ''}
      </td>

      {/* Actions (editMode only) */}
      {editMode && (
        <td className="px-3 py-2 text-center w-[40px]">
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="text-[#475569] hover:text-[#E8442A] p-1 transition-colors cursor-pointer"
            title="Supprimer cet ouvrage"
          >
            <Trash2 size={13} />
          </button>
        </td>
      )}
    </tr>
  );
};
