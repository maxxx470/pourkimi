import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { LotPredefini } from '../../../data/lotsPredefinis';

export interface AddLotModalProps {
  isOpen: boolean;
  lotsPredefinis: LotPredefini[];
  onClose: () => void;
  onAdd: (nom: string, color: string, bgColor: string, corpsMetier?: string) => void;
}

const CUSTOM_COLOR = '#475569';
const CUSTOM_BG = '#F1F5F9';

export const AddLotModal: React.FC<AddLotModalProps> = ({
  isOpen,
  lotsPredefinis,
  onClose,
  onAdd,
}) => {
  const [selectedPredefini, setSelectedPredefini] = useState<string | null>(null);
  const [customNom, setCustomNom] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedPredefini) {
      const lot = lotsPredefinis.find((l) => l.nom === selectedPredefini);
      if (lot) onAdd(lot.nom, lot.color, lot.bgColor, lot.corpsMetier);
    } else if (customNom.trim()) {
      onAdd(customNom.trim(), CUSTOM_COLOR, CUSTOM_BG);
    } else {
      return;
    }

    setSelectedPredefini(null);
    setCustomNom('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 font-sans animate-fade-in">
      <div className="bg-white rounded-2xl max-w-[480px] w-full p-6 shadow-2xl border border-[#E2E8F0] relative max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-5">
          <div>
            <h2 className="font-extrabold text-[18px] text-[#1E293B] tracking-tight">
              Ajouter un lot
            </h2>
            <p className="text-[11.5px] text-[#475569] mt-0.5">
              Pour un corps de métier absent des plans (plomberie, électricité...)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#475569] hover:text-[#1E293B] p-1 transition-colors cursor-pointer rounded-full hover:bg-[#F1F5F9]"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Lots prédéfinis */}
          <div>
            <label className="block text-[11px] font-bold text-[#475569] uppercase tracking-wider mb-2">
              Lots courants
            </label>
            <p className="text-[10.5px] text-[#475569] mb-2 -mt-1">
              Les matériaux de votre bibliothèque seront proposés automatiquement.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {lotsPredefinis.map((lot) => {
                const isSelected = selectedPredefini === lot.nom;
                return (
                  <button
                    key={lot.nom}
                    type="button"
                    onClick={() => {
                      setSelectedPredefini(lot.nom);
                      setCustomNom('');
                    }}
                    style={{
                      borderColor: isSelected ? lot.color : 'rgba(0,0,0,0.1)',
                      backgroundColor: isSelected ? lot.bgColor : '#ffffff',
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all cursor-pointer"
                  >
                    <span
                      style={{ backgroundColor: lot.color }}
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    />
                    <span
                      style={{ color: isSelected ? lot.color : '#1E293B' }}
                      className="text-[11.5px] font-semibold leading-tight"
                    >
                      {lot.nom}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lot personnalisé */}
          <div>
            <label className="block text-[11px] font-bold text-[#475569] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sparkles size={12} className="text-[#4F46E5]" />
              Ou un lot personnalisé
            </label>
            <input
              type="text"
              placeholder="Nom du lot (ex: Piscine, Clôture...)"
              value={customNom}
              onChange={(e) => {
                setCustomNom(e.target.value);
                setSelectedPredefini(null);
              }}
              className="w-full h-9 px-3 rounded-lg border border-[rgba(0,0,0,0.12)] text-[12px] font-medium text-[#1E293B] outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0] mt-5">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-full border border-[rgba(0,0,0,0.12)] text-[12px] font-semibold text-[#475569] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!selectedPredefini && !customNom.trim()}
              style={{
                backgroundColor: !selectedPredefini && !customNom.trim() ? '#C4C4C8' : '#4F46E5',
                cursor: !selectedPredefini && !customNom.trim() ? 'not-allowed' : 'pointer',
              }}
              className="h-9 px-5 rounded-full text-white text-[12px] font-semibold flex items-center gap-1.5 hover:opacity-90 active:scale-[0.98] transition-all shadow-xs"
            >
              <Plus size={14} />
              <span>Créer le lot</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
