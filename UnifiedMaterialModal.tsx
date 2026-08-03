import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, HelpCircle, Calculator, Tag } from 'lucide-react';
import { LigneMateriau, OrigineLigne } from '../../../types/materiaux';
import { CORPS_METIER_MAP } from '../../../data/mockMesPrix';

interface UnifiedMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (material: Omit<LigneMateriau, 'id'>) => void;
  onUpdate?: (id: string, updated: Partial<LigneMateriau>) => void;
  editingItem?: LigneMateriau | null;
}

export const UnifiedMaterialModal: React.FC<UnifiedMaterialModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  editingItem,
}) => {
  // Step 1: choice (null if editing or chosen), 'calcul_dqe', 'reference_libre'
  const [step, setStep] = useState<'choice' | 'form'>(editingItem ? 'form' : 'choice');
  const [origine, setOrigine] = useState<OrigineLigne>('calcul_dqe');

  // Form fields
  const [designation, setDesignation] = useState<string>('');
  const [categorie, setCategorie] = useState<string>('beton');
  const [unite, setUnite] = useState<string>('m³');
  const [prixActuel, setPrixActuel] = useState<string>('0');
  const [ratios, setRatios] = useState<{ label: string; valeur: string }[]>([
    { label: '', valeur: '' },
  ]);

  useEffect(() => {
    if (editingItem) {
      setStep('form');
      setOrigine(editingItem.origine);
      setDesignation(editingItem.designation);
      setCategorie(editingItem.categorie);
      setUnite(editingItem.unite || 'm³');
      setPrixActuel((editingItem.prixActuel || 0).toString());
      setRatios(editingItem.ratios && editingItem.ratios.length > 0 ? editingItem.ratios : [{ label: '', valeur: '' }]);
    } else {
      setStep('choice');
      setOrigine('calcul_dqe');
      setDesignation('');
      setCategorie('beton');
      setUnite('sac');
      setPrixActuel('0');
      setRatios([{ label: '', valeur: '' }]);
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSelectOrigineChoice = (chosen: OrigineLigne) => {
    setOrigine(chosen);
    setCategorie(chosen === 'calcul_dqe' ? 'beton' : 'ciment_beton');
    setStep('form');
  };

  const handleAddRatioRow = () => {
    setRatios((prev) => [...prev, { label: '', valeur: '' }]);
  };

  const handleRemoveRatioRow = (index: number) => {
    setRatios((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleRatioChange = (index: number, field: 'label' | 'valeur', value: string) => {
    setRatios((prev) =>
      prev.map((r, idx) => (idx === index ? { ...r, [field]: value } : r))
    );
  };

  const isFormValid = () => {
    if (!designation.trim()) return false;
    if (origine === 'calcul_dqe') {
      return ratios.some((r) => r.label.trim().length > 0 && r.valeur.trim().length > 0);
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    if (editingItem && onUpdate) {
      if (origine === 'calcul_dqe') {
        const filteredRatios = ratios.filter((r) => r.label.trim() && r.valeur.trim());
        onUpdate(editingItem.id, {
          designation: designation.trim(),
          categorie,
          ratios: filteredRatios,
        });
      } else {
        const prixNum = parseInt(prixActuel.replace(/\s/g, ''), 10);
        onUpdate(editingItem.id, {
          designation: designation.trim(),
          categorie,
          unite: unite.trim(),
          prixActuel: isNaN(prixNum) ? 0 : prixNum,
        });
      }
    } else {
      if (origine === 'calcul_dqe') {
        const filteredRatios = ratios.filter((r) => r.label.trim() && r.valeur.trim());
        onSave({
          designation: designation.trim(),
          origine: 'calcul_dqe',
          categorie,
          isSystemDefault: false,
          ratios: filteredRatios,
        });
      } else {
        const prixNum = parseInt(prixActuel.replace(/\s/g, ''), 10);
        onSave({
          designation: designation.trim(),
          origine: 'reference_libre',
          categorie,
          unite: unite.trim(),
          prixSuggere: isNaN(prixNum) ? 0 : prixNum,
          prixActuel: isNaN(prixNum) ? 0 : prixNum,
          isSystemDefault: false,
        });
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 font-sans animate-fade-in">
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
        }}
        className="shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div>
            <h3 className="font-sans font-extrabold text-[16px] text-[#1E293B]">
              {editingItem
                ? "Modifier l'élément"
                : step === 'choice'
                ? 'Nouveau matériau / prix'
                : origine === 'calcul_dqe'
                ? 'Ajouter un matériau (Calcul DQE)'
                : 'Ajouter un prix de référence'}
            </h3>
            <p className="font-sans text-[11px] text-[#475569] mt-0.5">
              {editingItem
                ? 'Mettez à jour les paramètres de cet élément'
                : step === 'choice'
                ? 'Choisissez le type d\'élément à ajouter dans votre bibliothèque'
                : origine === 'calcul_dqe'
                ? 'Définit les formules et dosages de calcul pour le DQE'
                : 'Ajoute un tarif unitaire de référence modifiable'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#475569] hover:bg-[#F1F5F9] hover:text-[#1E293B] transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Step 1: Choice */}
        {step === 'choice' && !editingItem ? (
          <div className="p-6 space-y-4 font-sans">
            <div className="flex items-start gap-3 p-3.5 bg-[#EEF2FF]/50 border border-[rgba(108,94,207,0.2)] rounded-xl">
              <HelpCircle size={18} className="text-[#4F46E5] shrink-0 mt-0.5" />
              <p className="text-[12px] font-semibold text-[#5348A8] leading-relaxed">
                Cet élément influence-t-il le calcul automatique du DQE ?
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleSelectOrigineChoice('calcul_dqe')}
                style={{ border: '1px solid rgba(108,94,207,0.3)', backgroundColor: '#ffffff' }}
                className="p-4 rounded-xl text-left hover:bg-[#EEF2FF]/40 hover:border-[#4F46E5] transition-all cursor-pointer group flex items-start gap-3 shadow-2xs"
              >
                <div className="w-9 h-9 rounded-lg bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0 group-hover:bg-[#4F46E5] group-hover:text-white transition-colors">
                  <Calculator size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[13px] text-[#1E293B] group-hover:text-[#4F46E5] transition-colors">
                      Oui — Calcul DQE
                    </span>
                    <span className="bg-[#EEF2FF] text-[#4F46E5] text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                      Dosage & Ratios
                    </span>
                  </div>
                  <p className="text-[11px] text-[#475569] mt-1 leading-snug">
                    Permet de définir des dosages (ciment, sable, gravier...) qui s'appliquent automatiquement lors des métrés DQE.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectOrigineChoice('reference_libre')}
                style={{ border: '1px solid rgba(0,0,0,0.1)', backgroundColor: '#ffffff' }}
                className="p-4 rounded-xl text-left hover:bg-[#F8FAFC] hover:border-[#1E293B] transition-all cursor-pointer group flex items-start gap-3 shadow-2xs"
              >
                <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] text-[#475569] flex items-center justify-center shrink-0 group-hover:bg-[#1E293B] group-hover:text-white transition-colors">
                  <Tag size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[13px] text-[#1E293B] transition-colors">
                      Non — Référence libre
                    </span>
                    <span className="bg-[#F1F5F9] text-[#475569] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                      Prix unitaire
                    </span>
                  </div>
                  <p className="text-[11px] text-[#475569] mt-1 leading-snug">
                    Un tarif de fourniture ou de matériau de repère (sac, m³, kg, unité) que vous pouvez éditer librement sans impact direct sur les formules DQE.
                  </p>
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Form */
          <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto font-sans">
            {/* Désignation */}
            <div>
              <label className="block text-[11px] font-bold text-[#1E293B] mb-1">
                Désignation <span className="text-[#E8442A]">*</span>
              </label>
              <input
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder={
                  origine === 'calcul_dqe'
                    ? 'Ex: Béton armé dosé 400 kg/m³'
                    : 'Ex: Ciment Portland CPJ45 (sac 50kg)'
                }
                style={{
                  height: '32px',
                  border: '1px solid rgba(0,0,0,0.12)',
                  borderRadius: '7px',
                }}
                className="w-full px-2.5 text-[12px] font-medium text-[#1E293B] bg-white focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 transition-all shadow-2xs"
              />
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-[11px] font-bold text-[#1E293B] mb-1">
                Catégorie / Corps de métier
              </label>
              <select
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
                style={{
                  height: '32px',
                  border: '1px solid rgba(0,0,0,0.12)',
                  borderRadius: '7px',
                }}
                className="w-full px-2.5 text-[12px] font-medium text-[#1E293B] bg-white focus:outline-none focus:border-[#4F46E5] transition-all shadow-2xs"
              >
                {origine === 'calcul_dqe' ? (
                  <>
                    <option value="beton">Béton (DQE)</option>
                    <option value="maconnerie">Maçonnerie (DQE)</option>
                    <option value="chape">Chape (DQE)</option>
                    <option value="enduits">Enduits & Peinture (DQE)</option>
                  </>
                ) : (
                  Object.entries(CORPS_METIER_MAP)
                    .filter(([k]) => k !== 'all')
                    .map(([k, label]) => (
                      <option key={k} value={k}>
                        {label}
                      </option>
                    ))
                )}
              </select>
            </div>

            {/* Specific fields for Référence libre */}
            {origine === 'reference_libre' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#1E293B] mb-1">
                    Unité <span className="text-[#E8442A]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={unite}
                    onChange={(e) => setUnite(e.target.value)}
                    placeholder="Ex: sac, m³, kg, u"
                    style={{
                      height: '32px',
                      border: '1px solid rgba(0,0,0,0.12)',
                      borderRadius: '7px',
                    }}
                    className="w-full px-2.5 text-[12px] font-medium text-[#1E293B] bg-white focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#1E293B] mb-1">
                    Prix (FCFA)
                  </label>
                  <input
                    type="text"
                    value={prixActuel}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '');
                      setPrixActuel(raw);
                    }}
                    placeholder="Ex: 6500"
                    style={{
                      height: '32px',
                      border: '1px solid rgba(0,0,0,0.12)',
                      borderRadius: '7px',
                    }}
                    className="w-full px-2.5 text-[12px] font-bold text-[#1E293B] bg-white focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>
              </div>
            )}

            {/* Specific fields for Calcul DQE (ratios) */}
            {origine === 'calcul_dqe' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-[#1E293B]">
                    Ratios / Dosages <span className="text-[#E8442A]">*</span>
                  </label>
                </div>

                <div className="space-y-2">
                  {ratios.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Ex: Ciment"
                        value={row.label}
                        onChange={(e) => handleRatioChange(idx, 'label', e.target.value)}
                        style={{
                          height: '30px',
                          border: '1px solid rgba(0,0,0,0.12)',
                          borderRadius: '6px',
                        }}
                        className="w-[40%] px-2 text-[11px] font-medium text-[#1E293B] bg-white focus:outline-none focus:border-[#4F46E5]"
                      />
                      <input
                        type="text"
                        placeholder="Ex: 350 kg/m³"
                        value={row.valeur}
                        onChange={(e) => handleRatioChange(idx, 'valeur', e.target.value)}
                        style={{
                          height: '30px',
                          border: '1px solid rgba(0,0,0,0.12)',
                          borderRadius: '6px',
                        }}
                        className="w-[55%] px-2 text-[11px] font-bold text-[#1E293B] bg-white focus:outline-none focus:border-[#4F46E5]"
                      />
                      {ratios.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRatioRow(idx)}
                          className="w-6 h-6 rounded flex items-center justify-center text-[#475569] hover:text-[#E8442A] transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddRatioRow}
                  style={{
                    border: '1px dashed rgba(108,94,207,0.3)',
                    borderRadius: '6px',
                  }}
                  className="w-full mt-2 py-1.5 text-[11px] font-bold text-[#4F46E5] bg-[#EEF2FF]/50 hover:bg-[#EEF2FF] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus size={12} />
                  <span>Ajouter un ratio</span>
                </button>
              </div>
            )}

            {/* Buttons */}
            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-8 px-3.5 rounded-full border border-[rgba(0,0,0,0.12)] bg-white text-[12px] font-semibold text-[#475569] hover:text-[#1E293B] transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={!isFormValid()}
                style={{
                  backgroundColor: isFormValid() ? '#4F46E5' : '#A1A1AA',
                  cursor: isFormValid() ? 'pointer' : 'not-allowed',
                }}
                className="h-8 px-4 rounded-full text-white text-[12px] font-bold transition-all shadow-xs"
              >
                {editingItem ? 'Enregistrer les modifications' : 'Créer l\'élément'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
