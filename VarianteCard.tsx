import React, { useState } from 'react';
import { Check, Eye, Copy, Trash2 } from 'lucide-react';
import { Variante } from '../../../types/variantes';

interface VarianteCardProps {
  variante: Variante;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onView: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  isCheapest?: boolean;
  isMostExpensive?: boolean;
  formatMontant: (n: number) => string;
}

export const VarianteCard: React.FC<VarianteCardProps> = ({
  variante,
  isSelected,
  onSelect,
  onView,
  onDuplicate,
  onDelete,
  isCheapest,
  isMostExpensive,
  formatMontant,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const activeOrSelected = variante.isActive || isSelected;

  // Determine total color based on price comparison
  let totalColor = '#4F46E5';
  if (isCheapest) {
    totalColor = '#12B76A';
  } else if (isMostExpensive) {
    totalColor = '#E8442A';
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Avoid triggering card selection if action buttons clicked
    if ((e.target as HTMLElement).closest('button')) return;
    onSelect(variante.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showDeleteConfirm) {
      onDelete(variante.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        backgroundColor: activeOrSelected ? '#EEF2FF' : '#F8FAFC',
        border: `1px solid ${activeOrSelected ? '#4F46E5' : '#E2E8F0'}`,
        borderRadius: '12px',
        padding: '14px 16px',
      }}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 cursor-pointer transition-colors duration-130 font-sans shadow-2xs select-none"
    >
      {/* Checkbox custom */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelect(variante.id);
        }}
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '6px',
          border: activeOrSelected ? '1.5px solid #4F46E5' : '1.5px solid rgba(0,0,0,0.15)',
          backgroundColor: activeOrSelected ? '#4F46E5' : '#ffffff',
        }}
        className="flex items-center justify-center shrink-0 transition-colors"
      >
        {activeOrSelected && <Check size={12} className="text-white stroke-[3]" />}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-sans font-bold text-[14px] text-[#1E293B]">
            {variante.nom}
          </span>
          <span
            style={{
              backgroundColor: variante.mode === 'A' ? '#EEF2FF' : '#EBF3FF',
              color: variante.mode === 'A' ? '#4F46E5' : '#2A7BDE',
            }}
            className="font-sans font-bold text-[10px] px-2 py-0.5 rounded-full"
          >
            Mode {variante.mode}
          </span>
          {variante.id === 'current' && (
            <span className="bg-[#12B76A]/10 text-[#12B76A] font-sans font-bold text-[10px] px-2 py-0.5 rounded-full">
              En direct
            </span>
          )}
        </div>
        <div className="font-sans text-[11px] text-[#475569] mt-0.5 font-medium">
          Créée le {variante.createdAt} • {variante.description}
        </div>
      </div>

      {/* Total & Actions */}
      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[rgba(0,0,0,0.06)]">
        {/* Total TTC */}
        <div className="text-left sm:text-right">
          <div className="font-sans text-[10px] text-[#475569] font-bold uppercase tracking-wider">
            Total TTC
          </div>
          <div
            style={{ color: totalColor }}
            className="font-sans font-extrabold text-[16px] tracking-tight"
          >
            {formatMontant(variante.totalTTC)} FCFA
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onView(variante.id);
            }}
            title={variante.id === 'current' ? 'Voir le devis' : 'Aperçu / Voir DQE'}
            className="w-[28px] h-[28px] rounded-full border border-[#E2E8F0] bg-white text-[#475569] hover:text-[#4F46E5] hover:border-[#4F46E5] flex items-center justify-center transition-colors cursor-pointer"
          >
            <Eye size={14} />
          </button>

          {variante.id !== 'current' && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(variante.id);
                }}
                title="Dupliquer la variante"
                className="w-[28px] h-[28px] rounded-full border border-[#E2E8F0] bg-white text-[#475569] hover:text-[#4F46E5] hover:border-[#4F46E5] flex items-center justify-center transition-colors cursor-pointer"
              >
                <Copy size={14} />
              </button>

              <button
                type="button"
                onClick={handleDeleteClick}
                onMouseLeave={() => setShowDeleteConfirm(false)}
                title={showDeleteConfirm ? 'Confirmer la suppression ?' : 'Supprimer'}
                style={{
                  backgroundColor: showDeleteConfirm ? '#FEF0EC' : '#ffffff',
                  borderColor: showDeleteConfirm ? '#E8442A' : '#E2E8F0',
                  color: showDeleteConfirm ? '#E8442A' : '#475569',
                }}
                className="w-[28px] h-[28px] rounded-full border flex items-center justify-center transition-colors cursor-pointer hover:text-[#E8442A] hover:border-[#E8442A]"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
