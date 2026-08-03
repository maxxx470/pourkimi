import React, { useState } from 'react';
import { Info, Check } from 'lucide-react';
import { Piece } from '../../../types/devis';
import { PieceCard } from './PieceCard';

interface ModeBPiecesProps {
  pieces: Piece[];
  onPrixChange: (pieceId: string, prix: number) => void;
  onApplyToAll: (prix: number) => void;
  formatMontant: (n: number) => string;
}

export const ModeBPieces: React.FC<ModeBPiecesProps> = ({
  pieces,
  onPrixChange,
  onApplyToAll,
  formatMontant,
}) => {
  const [showBulkInput, setShowBulkInput] = useState<boolean>(false);
  const [bulkPrix, setBulkPrix] = useState<string>('');

  // Group pieces by level
  const groupedPieces = pieces.reduce<Record<string, Piece[]>>((acc, piece) => {
    const lvl = piece.niveau || 'Autre';
    if (!acc[lvl]) acc[lvl] = [];
    acc[lvl].push(piece);
    return acc;
  }, {});

  const handleApplyBulk = () => {
    const val = parseFloat(bulkPrix);
    if (!isNaN(val) && val > 0) {
      onApplyToAll(val);
      setBulkPrix('');
      setShowBulkInput(false);
    }
  };

  let globalIndex = 0;

  return (
    <div className="font-sans mb-8">
      {/* Banner Info */}
      <div
        style={{
          backgroundColor: '#EBF3FF',
          border: '1px solid rgba(42,123,222,0.15)',
          borderRadius: '10px',
          padding: '10px 14px',
        }}
        className="flex items-center gap-2.5 mb-4 shadow-2xs"
      >
        <Info size={14} style={{ color: '#2A7BDE' }} className="shrink-0" />
        <span className="text-[12px] font-medium text-[#1A5BA8] leading-snug font-sans">
          Le prix au m² couvre tout — structure, maçonnerie et finitions inclus.
        </span>
      </div>

      {/* Grouped Pieces by Level */}
      <div className="flex flex-col gap-4">
        {Object.entries(groupedPieces).map(([niveau, nPieces]) => (
          <div key={niveau}>
            {/* Level label */}
            <div className="text-[10px] font-extrabold uppercase text-[#475569] tracking-wider mt-3 mb-1.5 font-sans">
              Niveau — {niveau}
            </div>

            {/* List of PieceCards */}
            <div className="flex flex-col gap-2">
              {nPieces.map((piece) => {
                const currentIndex = globalIndex++;
                return (
                  <PieceCard
                    key={piece.id}
                    piece={piece}
                    colorIndex={currentIndex}
                    onPrixChange={onPrixChange}
                    formatMontant={formatMontant}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Apply Action */}
      <div className="mt-5">
        {!showBulkInput ? (
          <button
            type="button"
            onClick={() => setShowBulkInput(true)}
            style={{
              border: '1px dashed #D4D4D8',
              borderRadius: '10px',
              padding: '10px',
              backgroundColor: '#F8FAFC',
            }}
            className="w-full text-center text-[12px] font-semibold text-[#475569] hover:bg-[#F1F5F9] hover:text-[#1E293B] transition-all cursor-pointer font-sans"
          >
            + Appliquer un prix à toutes les pièces vides
          </button>
        ) : (
          <div
            style={{
              border: '1px solid #4F46E5',
              borderRadius: '10px',
              padding: '12px 16px',
              backgroundColor: '#EEF2FF',
            }}
            className="flex items-center gap-3 flex-wrap font-sans"
          >
            <span className="text-[12px] font-bold text-[#5348A8]">
              Appliquer un prix par défaut aux pièces sans prix :
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={bulkPrix}
                placeholder="ex: 35000"
                onChange={(e) => setBulkPrix(e.target.value)}
                className="w-28 h-8 border border-[rgba(108,94,207,0.3)] rounded-md px-2.5 text-[12px] font-bold text-[#1E293B] bg-white focus:outline-none focus:border-[#4F46E5] font-sans"
              />
              <span className="text-[11px] font-semibold text-[#475569]">
                FCFA / m²
              </span>
              <button
                type="button"
                onClick={handleApplyBulk}
                style={{ backgroundColor: '#4F46E5' }}
                className="h-8 px-3.5 rounded-full text-white text-[12px] font-bold flex items-center gap-1 hover:opacity-95 transition-opacity cursor-pointer font-sans"
              >
                <Check size={13} />
                <span>Appliquer</span>
              </button>
              <button
                type="button"
                onClick={() => setShowBulkInput(false)}
                className="h-8 px-3 rounded-full text-[12px] font-semibold text-[#475569] hover:text-[#1E293B] transition-colors cursor-pointer font-sans"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
