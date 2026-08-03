import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, Check } from 'lucide-react';
import { Variante } from '../../../types/variantes';
import { useProjectData } from '../../../store/ProjectDataContext';

interface NewVarianteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (nom: string, mode: 'A' | 'B', baseOn?: string) => void;
  existingVariantes: Variante[];
}

export const NewVarianteModal: React.FC<NewVarianteModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  existingVariantes,
}) => {
  const navigate = useNavigate();
  const { id: routeProjectId } = useParams<{ id?: string }>();
  const projectId = routeProjectId || 'proj-1';

  const { devisModePipeline } = useProjectData();
  const currentMode: 'A' | 'B' = devisModePipeline === 'm2' ? 'B' : 'A';

  const [nom, setNom] = useState<string>('');
  const [baseOn, setBaseOn] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) return;

    onCreate(nom.trim(), currentMode, baseOn || undefined);

    setToastMessage('Variante créée avec succès !');
    setTimeout(() => {
      onClose();
      navigate(`/projects/${projectId}/dqe`);
    }, 400);
  };

  return (
    <div
      style={{ backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 50 }}
      className="fixed inset-0 flex items-center justify-center p-4 font-sans backdrop-blur-2xs"
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          width: '440px',
          maxWidth: 'calc(100vw - 32px)',
          padding: '24px',
        }}
        className="relative shadow-2xl font-sans animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header & Title */}
        <div className="flex items-start justify-between mb-1">
          <h2 className="font-sans font-extrabold text-[18px] text-[#1E293B] tracking-tight">
            Créer une nouvelle variante
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#475569] hover:text-[#1E293B] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <p className="font-sans text-[12px] text-[#475569] font-medium mb-5">
          Créez une nouvelle version du devis pour comparer différentes approches
        </p>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="mb-4 p-2.5 rounded-[8px] bg-[#12B76A]/10 border border-[#12B76A]/30 text-[#12B76A] font-bold text-xs flex items-center gap-2">
            <Check size={14} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Champ Nom */}
          <div>
            <label className="block font-sans text-[12px] font-semibold text-[#1E293B] mb-1">
              Nom de la variante
            </label>
            <input
              type="text"
              required
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Ex: Version rénovation économique"
              style={{
                height: '36px',
                border: '1px solid rgba(0,0,0,0.10)',
                borderRadius: '8px',
              }}
              className="w-full px-3 font-sans text-[13px] text-[#1E293B] outline-none focus:border-[#4F46E5] transition-colors"
            />
          </div>

          {/* Champ Mode */}
          <div>
            <label className="block font-sans text-[12px] font-semibold text-[#1E293B] mb-1.5">
              Mode de tarification
            </label>
            <div className="p-2.5 rounded-[8px] border border-[#4F46E5] bg-[#EEF2FF] text-left">
              <div className="font-bold text-[12px] text-[#1E293B] flex items-center justify-between">
                <span>
                  {currentMode === 'A' ? 'Mode A — Prix unitaires (DQE)' : 'Mode B — Prix au m²'}
                </span>
                <Check size={14} className="text-[#4F46E5]" />
              </div>
              <div className="text-[11px] text-[#475569] mt-0.5 font-medium">
                Verrouillé selon le mode du projet
              </div>
            </div>
          </div>

          {/* Champ Baser sur */}
          <div>
            <label className="block font-sans text-[12px] font-semibold text-[#1E293B] mb-1">
              Baser sur (optionnel)
            </label>
            <select
              value={baseOn}
              onChange={(e) => setBaseOn(e.target.value)}
              style={{
                height: '36px',
                border: '1px solid rgba(0,0,0,0.10)',
                borderRadius: '8px',
              }}
              className="w-full px-2.5 font-sans text-[12px] font-semibold text-[#1E293B] bg-white outline-none focus:border-[#4F46E5] transition-colors cursor-pointer"
            >
              <option value="">Partir de zéro</option>
              {existingVariantes.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.nom} ({formatFCFA(v.totalTTC)} FCFA)
                </option>
              ))}
            </select>
            <p className="font-sans text-[11px] text-[#475569] mt-1">
              Copie les quantités et prix de la variante sélectionnée comme point de départ
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[rgba(0,0,0,0.06)]">
            <button
              type="button"
              onClick={onClose}
              style={{
                border: '1px solid #E2E8F0',
                backgroundColor: '#ffffff',
              }}
              className="px-4 h-[34px] rounded-full font-sans font-bold text-[12px] text-[#475569] hover:text-[#1E293B] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!nom.trim()}
              style={{
                backgroundColor: '#4F46E5',
                color: '#ffffff',
                opacity: nom.trim() ? 1 : 0.5,
              }}
              className="px-4 h-[34px] rounded-full font-sans font-bold text-[12px] transition-opacity cursor-pointer shadow-xs disabled:cursor-not-allowed"
            >
              Créer la variante
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function formatFCFA(n: number): string {
  if (!n) return '0';
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
