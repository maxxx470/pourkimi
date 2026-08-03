import React, { useState, useEffect, useMemo, useRef } from 'react';
import { X, Plus, Sparkles, BookOpen } from 'lucide-react';
import { DQELot, DQEItem } from '../../../data/mockDQE';
import { useProjectData } from '../../../store/ProjectDataContext';
import { getCorpsMetierPourLot } from '../../../data/lotCorpsMetierMap';
import { MonPrix } from '../../../types/materiaux';

export interface AddRowModalProps {
  isOpen: boolean;
  lotId: number;
  lots: DQELot[];
  isSpecificLot?: boolean;
  onClose: () => void;
  onAdd: (lotId: number, item: Partial<DQEItem>) => void;
}

export const AddRowModal: React.FC<AddRowModalProps> = ({
  isOpen,
  lotId,
  lots,
  isSpecificLot = false,
  onClose,
  onAdd,
}) => {
  const { bibliothequeMesPrix } = useProjectData();
  const designationInputRef = useRef<HTMLInputElement>(null);

  const [selectedLotId, setSelectedLotId] = useState<number>(lotId || 1);
  const [rowType, setRowType] = useState<'ouvrage' | 'sublot' | 'detail'>('ouvrage');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('custom');

  const [numero, setNumero] = useState<string>('');
  const [designation, setDesignation] = useState<string>('');
  const [unite, setUnite] = useState<string>('m²');
  const [quantite, setQuantite] = useState<string>('1');
  const [prixUnitaire, setPrixUnitaire] = useState<string>('');
  const [observation, setObservation] = useState<string>('');

  useEffect(() => {
    setSelectedLotId(lotId || (lots[0]?.id ?? 1));
  }, [lotId, lots]);

  const selectedLot = useMemo(() => {
    return lots.find((l) => l.id === selectedLotId);
  }, [lots, selectedLotId]);

  const allMaterials = useMemo(() => {
    return bibliothequeMesPrix && bibliothequeMesPrix.length > 0
      ? bibliothequeMesPrix
      : [];
  }, [bibliothequeMesPrix]);

  if (!isOpen) return null;

  const handleMaterialDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedMaterialId(val);

    if (val === 'custom') {
      setDesignation('');
      setUnite('m²');
      setPrixUnitaire('');
      setTimeout(() => designationInputRef.current?.focus(), 50);
    } else {
      const found = allMaterials.find((m) => m.id === val);
      if (found) {
        setDesignation(found.designation);
        setUnite(found.unite || 'u');
        setPrixUnitaire(found.prixActuel !== null ? String(found.prixActuel) : '');
      }
    }
  };

  const handleSelectMaterial = (mp: MonPrix) => {
    setSelectedMaterialId(mp.id);
    setDesignation(mp.designation);
    setUnite(mp.unite);
    setPrixUnitaire(mp.prixActuel !== null ? String(mp.prixActuel) : '');
  };

  const handleFocusCustom = () => {
    setSelectedMaterialId('custom');
    setDesignation('');
    designationInputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!designation.trim()) return;

    const parsedQty = parseFloat(quantite) || 0;
    const parsedPrix = prixUnitaire.trim() !== '' ? parseFloat(prixUnitaire) : null;

    onAdd(selectedLotId, {
      numero: numero.trim(),
      designation: designation.trim(),
      unite: unite.trim(),
      quantite: parsedQty,
      prixUnitaire: parsedPrix,
      observation: observation.trim() || null,
      isSubLot: rowType === 'sublot',
      isDetail: rowType === 'detail',
    });

    // Reset form
    setDesignation('');
    setNumero('');
    setPrixUnitaire('');
    setObservation('');
    setSelectedMaterialId('custom');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 font-sans animate-fade-in">
      <div className="bg-white rounded-3xl max-w-[520px] w-full p-6 shadow-2xl border border-[#E2E8F0] relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-5">
          <div>
            <h2 className="font-extrabold text-[18px] text-[#1E293B] tracking-tight">
              Ajouter un ouvrage
            </h2>
            <p className="text-[11.5px] text-[#475569] mt-0.5">
              {isSpecificLot && selectedLot
                ? `Ajout direct au LOT ${selectedLot.numero} — ${selectedLot.name}`
                : 'Sélectionnez un matériau de votre bibliothèque ou saisissez-le librement'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#475569] hover:text-[#1E293B] p-1.5 transition-colors cursor-pointer rounded-full hover:bg-[#F1F5F9]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Lot - HIDE IF IN SPECIFIC LOT */}
          {!isSpecificLot ? (
            <div>
              <label className="block text-[11px] font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                Lot concerné
              </label>
              <select
                value={selectedLotId}
                onChange={(e) => {
                  setSelectedLotId(Number(e.target.value));
                  setSelectedMaterialId('custom');
                }}
                className="w-full h-9 px-3 rounded-full border border-[rgba(0,0,0,0.12)] text-[12px] font-semibold text-[#1E293B] bg-white outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]"
              >
                {lots.map((lot) => (
                  <option key={lot.id} value={lot.id}>
                    LOT {lot.numero} — {lot.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="bg-[#EEF2FF] px-3.5 py-2 rounded-full border border-[#4F46E5]/20 flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#4F46E5] uppercase tracking-wider">
                Lot en cours
              </span>
              <span className="text-[12px] font-extrabold text-[#1E293B]">
                LOT {selectedLot?.numero} — {selectedLot?.name}
              </span>
            </div>
          )}

          {/* Section Matériaux de la bibliothèque avec Saisie libre en premier */}
          <div className="bg-[#FAF9FF] p-3.5 rounded-2xl border border-[#4F46E5]/15 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-[#4F46E5] uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen size={13} className="text-[#4F46E5]" />
                Sélection du matériau
              </label>
            </div>

            {/* Dropdown HTML avec Saisie libre tout en haut */}
            <select
              value={selectedMaterialId}
              onChange={handleMaterialDropdownChange}
              className="w-full h-10 px-3.5 rounded-full border border-[#4F46E5]/30 text-[12.5px] font-semibold text-[#1E293B] bg-white outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 shadow-2xs"
            >
              <option value="custom" className="text-[#4F46E5] font-bold italic bg-[#EEF2FF]">
                ✎ Saisie libre... (Saisie manuelle)
              </option>
              <option disabled className="text-gray-400">
                ───────────── Bibliothèque de matériaux ─────────────
              </option>
              {allMaterials.map((mp) => (
                <option key={mp.id} value={mp.id}>
                  {mp.designation} ({mp.unite}) — {mp.prixActuel !== null ? mp.prixActuel.toLocaleString('fr-FR') : 0} FCFA
                </option>
              ))}
            </select>
          </div>

          {/* Select Type */}
          <div>
            <label className="block text-[11px] font-bold text-[#475569] uppercase tracking-wider mb-1.5">
              Type d'élément
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRowType('ouvrage')}
                className={`py-2 text-[11px] font-semibold rounded-full border transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer ${
                  rowType === 'ouvrage'
                    ? 'bg-[#EEF2FF] border-[#4F46E5] text-[#4F46E5]'
                    : 'bg-white border-[rgba(0,0,0,0.1)] text-[#475569]'
                }`}
              >
                Ouvrage
              </button>
              <button
                type="button"
                onClick={() => setRowType('sublot')}
                className={`py-2 text-[11px] font-semibold rounded-full border transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer ${
                  rowType === 'sublot'
                    ? 'bg-[#EEF2FF] border-[#4F46E5] text-[#4F46E5]'
                    : 'bg-white border-[rgba(0,0,0,0.1)] text-[#475569]'
                }`}
              >
                Sous-lot
              </button>
              <button
                type="button"
                onClick={() => setRowType('detail')}
                className={`py-2 text-[11px] font-semibold rounded-full border transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer ${
                  rowType === 'detail'
                    ? 'bg-[#EEF2FF] border-[#4F46E5] text-[#4F46E5]'
                    : 'bg-white border-[rgba(0,0,0,0.1)] text-[#475569]'
                }`}
              >
                Détail matériau
              </button>
            </div>
          </div>

          {/* Numero & Designation */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                N° (ex: 1.4)
              </label>
              <input
                type="text"
                placeholder="1.4"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-[rgba(0,0,0,0.12)] text-[12px] font-medium text-[#1E293B] outline-none focus:border-[#4F46E5]"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                Désignation *
              </label>
              <input
                ref={designationInputRef}
                type="text"
                required
                placeholder="Nom de l'ouvrage ou matériau..."
                value={designation}
                onChange={(e) => {
                  setDesignation(e.target.value);
                  setSelectedMaterialId('custom');
                }}
                className="w-full h-9 px-3.5 rounded-xl border border-[rgba(0,0,0,0.12)] text-[12px] font-medium text-[#1E293B] outline-none focus:border-[#4F46E5]"
              />
            </div>
          </div>

          {/* Unité & Quantité */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                Unité
              </label>
              <input
                type="text"
                placeholder="m², m³, u, ml..."
                value={unite}
                onChange={(e) => setUnite(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-[rgba(0,0,0,0.12)] text-[12px] font-medium text-[#1E293B] outline-none focus:border-[#4F46E5]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                Quantité
              </label>
              <input
                type="number"
                step="any"
                value={quantite}
                onChange={(e) => setQuantite(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-[rgba(0,0,0,0.12)] text-[12px] font-bold text-[#1E293B] outline-none focus:border-[#4F46E5]"
              />
            </div>
          </div>

          {/* Prix unitaire & Observation */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                Prix unit. (FCFA)
              </label>
              <input
                type="number"
                placeholder="Optionnel"
                value={prixUnitaire}
                onChange={(e) => setPrixUnitaire(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-[rgba(0,0,0,0.12)] text-[12px] font-bold text-[#4F46E5] outline-none focus:border-[#4F46E5]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                Observation
              </label>
              <input
                type="text"
                placeholder="Ex: Prof. 1.20 m"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-[rgba(0,0,0,0.12)] text-[12px] font-medium text-[#1E293B] outline-none focus:border-[#4F46E5]"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E2E8F0] mt-5">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-5 rounded-full border border-[rgba(0,0,0,0.12)] text-[12px] font-semibold text-[#475569] hover:bg-[#F1F5F9] transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="h-9 px-6 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[12px] font-bold flex items-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer shadow-md"
            >
              <Plus size={14} />
              <span>Ajouter</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
