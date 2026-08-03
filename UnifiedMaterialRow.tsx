import React, { useState } from 'react';
import { Lock, Copy, Trash2, ChevronDown, ChevronUp, Edit3 } from 'lucide-react';
import { LigneMateriau } from '../../../types/materiaux';
import { CATEGORIES_MAP } from '../../../data/mockMateriauxUnifie';

interface UnifiedMaterialRowProps {
  item: LigneMateriau;
  onPrixChange: (id: string, newPrix: number) => void;
  onEditItem: (item: LigneMateriau) => void;
  onDuplicateItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  formatMontant: (n: number) => string;
}

const PriceInputInline: React.FC<{
  initialValue: number;
  onSave: (val: number) => void;
}> = ({ initialValue, onSave }) => {
  const [val, setVal] = useState<string>(initialValue.toString());

  React.useEffect(() => {
    setVal(initialValue.toString());
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s/g, '');
    if (/^\d*$/.test(raw)) {
      setVal(raw);
      const num = parseInt(raw, 10);
      onSave(isNaN(num) ? 0 : num);
    }
  };

  const formattedDisplay = val ? parseInt(val, 10).toLocaleString('fr-FR') : '0';

  return (
    <div className="flex items-center gap-1 justify-end">
      <input
        type="text"
        value={val ? formattedDisplay : '0'}
        onChange={handleChange}
        style={{
          width: '105px',
          height: '30px',
          border: '1px solid rgba(0,0,0,0.12)',
          borderRadius: '6px',
          padding: '0 8px',
        }}
        className="font-sans font-bold text-[12px] text-right text-[#1E293B] bg-white focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 transition-all"
      />
      <span className="text-[11px] font-bold text-[#475569]">FCFA</span>
    </div>
  );
};

export const UnifiedMaterialRow: React.FC<UnifiedMaterialRowProps> = ({
  item,
  onPrixChange,
  onEditItem,
  onDuplicateItem,
  onDeleteItem,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const isDQE = item.origine === 'calcul_dqe';
  const categoryLabel = CATEGORIES_MAP[item.categorie] || item.categorie;

  return (
    <>
      <tr className="hover:bg-[#F8FAFC]/80 transition-colors border-b border-[rgba(0,0,0,0.06)] group">
        {/* Colonne 1 : Badge origine */}
        <td className="py-3 px-3.5 align-middle whitespace-nowrap">
          {isDQE ? (
            <span
              style={{
                backgroundColor: '#EEF2FF',
                color: '#4F46E5',
                fontSize: '9px',
                fontWeight: 800,
                padding: '2.5px 7px',
                borderRadius: '99px',
              }}
              className="inline-flex items-center gap-1 uppercase tracking-wide font-sans shadow-2xs"
            >
              Calcul DQE
            </span>
          ) : (
            <span
              style={{
                backgroundColor: '#F1F5F9',
                color: '#475569',
                fontSize: '9px',
                fontWeight: 700,
                padding: '2.5px 7px',
                borderRadius: '99px',
              }}
              className="inline-flex items-center gap-1 uppercase tracking-wide font-sans shadow-2xs"
            >
              Référence libre
            </span>
          )}
        </td>

        {/* Colonne 2 : Désignation */}
        <td className="py-3 px-3.5 align-middle">
          <div className="flex items-center gap-1.5 font-sans">
            <span className="font-bold text-[13px] text-[#1E293B]">
              {item.designation}
            </span>
            {item.isSystemDefault && (
              <span title="Défaut système non supprimable" className="text-[#A1A1AA] flex items-center">
                <Lock size={10} />
              </span>
            )}
          </div>
        </td>

        {/* Colonne 3 : Catégorie */}
        <td className="py-3 px-3.5 align-middle whitespace-nowrap">
          <span className="font-sans font-semibold text-[11px] text-[#475569] bg-[#F8FAFC] border border-[rgba(0,0,0,0.06)] px-2 py-0.5 rounded-md">
            {categoryLabel}
          </span>
        </td>

        {/* Colonne 4 : Unité */}
        <td className="py-3 px-3.5 align-middle whitespace-nowrap">
          <span className="font-sans font-semibold text-[12px] text-[#52525B]">
            {item.unite || '—'}
          </span>
        </td>

        {/* Colonne 5 : Prix / Dosage principal */}
        <td className="py-3 px-3.5 align-middle text-right font-sans">
          {isDQE ? (
            <div className="flex flex-col items-end gap-1">
              <div className="text-[12px] font-bold text-[#1E293B]">
                {item.ratios && item.ratios.length > 0 ? (
                  <span>
                    <span className="text-[#475569] font-medium text-[11px]">
                      {item.ratios[0].label}:
                    </span>{' '}
                    {item.ratios[0].valeur}
                  </span>
                ) : (
                  'Aucun ratio défini'
                )}
              </div>
              {item.ratios && item.ratios.length > 1 && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[11px] font-bold text-[#4F46E5] hover:text-[#5348A8] flex items-center gap-0.5 cursor-pointer transition-colors"
                >
                  <span>{isExpanded ? 'Masquer les dosages' : 'Voir tous les dosages'}</span>
                  {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
              )}
            </div>
          ) : (
            <PriceInputInline
              initialValue={item.prixActuel || 0}
              onSave={(val) => onPrixChange(item.id, val)}
            />
          )}
        </td>

        {/* Colonne 6 : Actions */}
        <td className="py-3 px-3.5 align-middle text-center whitespace-nowrap">
          <div className="flex items-center justify-center gap-1 font-sans">
            {/* Edit button */}
            <button
              type="button"
              onClick={() => onEditItem(item)}
              title="Modifier l'élément"
              className="p-1.5 rounded-md text-[#475569] hover:text-[#4F46E5] hover:bg-[#EEF2FF] transition-all cursor-pointer inline-flex items-center justify-center"
            >
              <Edit3 size={13} />
            </button>

            {/* Duplicate button (only for DQE or reference) */}
            <button
              type="button"
              onClick={() => onDuplicateItem(item.id)}
              title="Dupliquer l'élément"
              className="p-1.5 rounded-md text-[#475569] hover:text-[#1E293B] hover:bg-[#F1F5F9] transition-all cursor-pointer inline-flex items-center justify-center"
            >
              <Copy size={13} />
            </button>

            {/* Delete button (only if not system default) */}
            {!item.isSystemDefault ? (
              <button
                type="button"
                onClick={() => onDeleteItem(item.id)}
                title="Supprimer l'élément"
                className="p-1.5 rounded-md text-[#475569] hover:text-[#E8442A] hover:bg-[#FEF0EC] transition-all cursor-pointer inline-flex items-center justify-center"
              >
                <Trash2 size={13} />
              </button>
            ) : (
              <span className="w-7 text-center text-[#D4D4D8] inline-block" title="Non supprimable">
                <Lock size={11} className="mx-auto" />
              </span>
            )}
          </div>
        </td>
      </tr>

      {/* Accordion Row for Dosages if expanded */}
      {isDQE && isExpanded && item.ratios && (
        <tr className="bg-[#EEF2FF]/30 border-b border-[rgba(108,94,207,0.1)]">
          <td colSpan={6} className="py-3 px-5 font-sans">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#4F46E5]">
                Tableau complet des dosages ({item.designation})
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {item.ratios.map((r, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[rgba(108,94,207,0.15)] rounded-lg p-2 flex flex-col shadow-2xs"
                >
                  <span className="text-[10px] font-bold text-[#475569] uppercase">{r.label}</span>
                  <span className="text-[12px] font-extrabold text-[#1E293B]">{r.valeur}</span>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
