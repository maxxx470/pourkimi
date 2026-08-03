import React from 'react';
import { Download } from 'lucide-react';
import { DQELot, DQEItem } from '../../../data/mockDQE';
import { ModeDevis, Piece } from '../../../types/devis';

interface RecapDevisProps {
  lots: DQELot[];
  mode: ModeDevis;
  totalHT: number;
  tvaRate: number;
  tva: number;
  totalTTC: number;
  pieces: Piece[];
  formatMontant: (n: number) => string;
  onNext: () => void;
}

const COLOR_PALETTE = ['#4F46E5', '#2A7BDE', '#12B76A', '#D4960A', '#E8442A', '#D03F7B'];

export const RecapDevis: React.FC<RecapDevisProps> = ({
  lots,
  mode,
  totalHT,
  tvaRate,
  tva,
  totalTTC,
  pieces,
  formatMontant,
  onNext,
}) => {
  // Helper for lot total computation
  const getLotTotal = (lot: DQELot): number => {
    let sum = 0;
    const process = (items: DQEItem[]) => {
      for (const item of items) {
        if (!item.isSubLot && !item.isDetail) {
          if (item.prixUnitaire !== null && item.quantite) {
            sum += Math.round(item.quantite * item.prixUnitaire);
          }
        }
        if (item.children) process(item.children);
      }
    };
    process(lot.items);
    return sum;
  };

  return (
    <div className="font-sans max-w-3xl mx-auto mb-8">
      <div
        style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '20px',
        }}
        className="shadow-2xs"
      >
        <h3 className="font-sans font-extrabold text-[14px] text-[#1E293B] mb-3 pb-2 border-b border-[#E2E8F0]">
          {mode === 'A' ? 'Récapitulatif par lot (Mode A)' : 'Récapitulatif par pièce (Mode B)'}
        </h3>

        {/* Breakdown lines */}
        <div className="flex flex-col gap-0.5 mb-3">
          {mode === 'A' ? (
            lots.map((lot) => {
              const lotSum = getLotTotal(lot);
              return (
                <div
                  key={lot.id}
                  className="flex items-center justify-between py-1.5 border-b border-[rgba(0,0,0,0.06)] text-[12px] font-sans"
                >
                  <div className="flex items-center gap-2">
                    <span
                      style={{ backgroundColor: lot.color }}
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                    />
                    <span className="font-semibold text-[#1E293B]">
                      LOT {lot.numero} — {lot.name}
                    </span>
                  </div>
                  <span className="font-bold text-[#4F46E5]">
                    {lotSum > 0 ? `${formatMontant(lotSum)} FCFA` : <span className="text-[#A1A1AA] font-normal">— FCFA</span>}
                  </span>
                </div>
              );
            })
          ) : (
            pieces.map((piece, idx) => {
              const pColor = COLOR_PALETTE[idx % COLOR_PALETTE.length];
              return (
                <div
                  key={piece.id}
                  className="flex items-center justify-between py-1.5 border-b border-[rgba(0,0,0,0.06)] text-[12px] font-sans"
                >
                  <div className="flex items-center gap-2">
                    <span
                      style={{ backgroundColor: pColor }}
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                    />
                    <span className="font-semibold text-[#1E293B]">
                      {piece.nom} ({piece.surface_m2} m²)
                    </span>
                  </div>
                  <span className="font-bold text-[#4F46E5]">
                    {piece.montant !== null && piece.montant > 0 ? (
                      `${formatMontant(piece.montant)} FCFA`
                    ) : (
                      <span className="text-[#A1A1AA] font-normal">— FCFA</span>
                    )}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Separator */}
        <div className="border-t-2 border-[#E2E8F0] pt-2.5 flex flex-col gap-1.5">
          {/* Total HT */}
          <div className="flex items-center justify-between text-[13px] font-bold text-[#1E293B]">
            <span>TOTAL HT</span>
            <span>{formatMontant(totalHT)} FCFA</span>
          </div>

          {/* TVA */}
          <div className="flex items-center justify-between text-[12px] font-semibold text-[#475569]">
            <span>TVA ({tvaRate}%)</span>
            <span>{formatMontant(tva)} FCFA</span>
          </div>

          {/* Total TTC Box */}
          <div
            style={{ backgroundColor: '#EEF2FF', borderRadius: '8px', padding: '10px 12px' }}
            className="flex items-center justify-between mt-1"
          >
            <span className="font-sans font-black text-[14px] text-[#5348A8]">
              TOTAL TTC
            </span>
            <span className="font-sans font-black text-[17px] text-[#4F46E5]">
              {formatMontant(totalTTC)} FCFA
            </span>
          </div>
        </div>
      </div>

      {/* Action button */}
      <button
        type="button"
        onClick={onNext}
        style={{ backgroundColor: '#4F46E5' }}
        className="w-full h-11 mt-4 rounded-full text-white font-sans font-medium text-[14px] flex items-center justify-center gap-2 hover:opacity-95 transition-opacity cursor-pointer shadow-xs"
      >
        <Download size={16} />
        <span>Passer à l'export</span>
      </button>
    </div>
  );
};
