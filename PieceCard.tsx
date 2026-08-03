import React from 'react';
import { Piece } from '../../../types/devis';

interface PieceCardProps {
  piece: Piece;
  colorIndex: number;
  onPrixChange: (pieceId: string, prix: number) => void;
  formatMontant: (n: number) => string;
}

const COLOR_PALETTE = ['#4F46E5', '#2A7BDE', '#12B76A', '#D4960A', '#E8442A', '#D03F7B'];

export const PieceCard: React.FC<PieceCardProps> = ({
  piece,
  colorIndex,
  onPrixChange,
  formatMontant,
}) => {
  const activeColor = COLOR_PALETTE[colorIndex % COLOR_PALETTE.length];

  return (
    <div
      style={{
        backgroundColor: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
      className="font-sans shadow-2xs transition-all hover:shadow-xs"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[#E2E8F0] bg-white">
        <div className="flex items-center gap-2 min-w-0">
          <span
            style={{ backgroundColor: activeColor }}
            className="w-2 h-2 rounded-full shrink-0"
          />
          <h4 className="font-sans font-bold text-[13px] text-[#1E293B] truncate">
            {piece.nom}
          </h4>
        </div>
        <span className="font-sans font-semibold text-[12px] text-[#475569] shrink-0 ml-2">
          {piece.surface_m2} m²
        </span>
      </div>

      {/* Body */}
      <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-[12px] font-medium text-[#475569]">
          Prix tout inclus au m²
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Input Group */}
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min="0"
              value={piece.prixAuM2 !== null && piece.prixAuM2 !== undefined ? piece.prixAuM2 : ''}
              placeholder="0"
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onPrixChange(piece.id, isNaN(val) ? 0 : val);
              }}
              style={{
                width: '100px',
                height: '32px',
                border: '1px solid rgba(108,94,207,0.3)',
                borderRadius: '8px',
                padding: '0 10px',
                color: '#4F46E5',
                backgroundColor: '#EEF2FF',
              }}
              className="font-sans font-bold text-[13px] text-right focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 transition-all shadow-2xs"
            />
            <span className="text-[11px] font-semibold text-[#475569]">
              FCFA / m²
            </span>
          </div>

          {/* Résultat */}
          <div className="text-right min-w-[110px]">
            {piece.montant !== null ? (
              <span className="font-sans font-black text-[14px] text-[#4F46E5]">
                = {formatMontant(piece.montant)} FCFA
              </span>
            ) : (
              <span className="font-sans font-normal text-[12px] text-[#A1A1AA]">
                — FCFA
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
