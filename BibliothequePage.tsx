import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Info, Check } from 'lucide-react';
import { AppLayout } from '../../layouts/AppLayout';
import { useMateriauxUnifie } from '../../hooks/useMateriauxUnifie';
import { OriginFilterPills } from './components/OriginFilterPills';
import { UnifiedMaterialRow } from './components/UnifiedMaterialRow';
import { UnifiedMaterialModal } from './components/UnifiedMaterialModal';
import { LigneMateriau } from '../../types/materiaux';
import { CORPS_METIER_MAP } from '../../data/mockMesPrix';

export const BibliothequePage: React.FC = () => {
  const navigate = useNavigate();

  const {
    materiaux,
    filteredMateriaux,
    searchQuery,
    setSearchQuery,
    selectedOrigine,
    setSelectedOrigine,
    selectedCategorie,
    setSelectedCategorie,
    updatePrix,
    updateRatios,
    addMateriau,
    duplicateMateriau,
    deleteMateriau,
    formatMontant,
    isSaving,
  } = useMateriauxUnifie();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<LigneMateriau | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: LigneMateriau) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveModal = (itemData: Omit<LigneMateriau, 'id'>) => {
    addMateriau(itemData);
    triggerToast('Nouvel élément ajouté avec succès');
  };

  const handleUpdateModal = (id: string, updated: Partial<LigneMateriau>) => {
    if (updated.ratios) {
      updateRatios(id, updated.ratios);
    }
    if (updated.prixActuel !== undefined) {
      updatePrix(id, updated.prixActuel);
    }
    triggerToast('Élément mis à jour');
  };

  const handleDuplicate = (id: string) => {
    duplicateMateriau(id);
    triggerToast('Élément dupliqué avec succès');
  };

  const handleDelete = (id: string) => {
    const ok = deleteMateriau(id);
    if (ok) {
      triggerToast('Élément supprimé');
    } else {
      triggerToast('Impossible de supprimer un élément système par défaut');
    }
  };

  const handlePrixChange = (id: string, val: number) => {
    updatePrix(id, val);
  };

  const countMap = {
    all: materiaux.length,
    calcul_dqe: materiaux.filter((m) => m.origine === 'calcul_dqe').length,
    reference_libre: materiaux.filter((m) => m.origine === 'reference_libre').length,
  };

  // Build category list for secondary filter
  const getCategoryOptions = () => {
    if (selectedOrigine === 'calcul_dqe') {
      return [
        { id: 'all', label: 'Tous' },
        { id: 'beton', label: 'Béton' },
        { id: 'maconnerie', label: 'Maçonnerie' },
        { id: 'chape', label: 'Chape' },
        { id: 'enduits', label: 'Enduits & Peinture' },
      ];
    }

    if (selectedOrigine === 'reference_libre') {
      const freeOptions = Object.entries(CORPS_METIER_MAP).map(([id, label]) => ({
        id,
        label,
      }));
      return freeOptions;
    }

    // 'all' origin: DQE categories + Corps de métier categories
    const dqeCats = [
      { id: 'beton', label: 'Béton (DQE)' },
      { id: 'maconnerie', label: 'Maçonnerie (DQE)' },
      { id: 'chape', label: 'Chape (DQE)' },
      { id: 'enduits', label: 'Enduits & Peinture (DQE)' },
    ];

    const freeCats = Object.entries(CORPS_METIER_MAP)
      .filter(([id]) => id !== 'all')
      .map(([id, label]) => ({ id, label }));

    return [{ id: 'all', label: 'Tous' }, ...dqeCats, ...freeCats];
  };

  const categoryOptions = getCategoryOptions();
  const currentToast = isSaving ? 'Sauvegarde automatique...' : toastMessage;

  return (
    <AppLayout
      currentPath="/materiaux"
      onNavigate={(path) => navigate(path)}
      onNewProject={() => navigate('/dashboard')}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans relative">
        {/* Floating Toast */}
        {currentToast && (
          <div
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 60,
              backgroundColor: '#1E293B',
              color: '#ffffff',
              borderRadius: '10px',
              padding: '10px 16px',
            }}
            className="flex items-center gap-2 shadow-2xl animate-fade-in text-[12px] font-semibold font-sans"
          >
            <Check size={14} style={{ color: '#12B76A' }} />
            <span>{currentToast}</span>
          </div>
        )}

        {/* Topbar & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#E2E8F0]">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full inline-block font-sans mb-1.5">
              Bibliothèque Unifiée
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1E293B] tracking-tight font-sans">
              Matériaux & Prix
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5 font-sans">
              Gérez vos dosages de calcul DQE et votre référentiel de prix unifié ({materiaux.length} éléments)
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            style={{ backgroundColor: '#4F46E5', color: '#ffffff' }}
            className="font-sans font-bold text-[13px] h-[38px] px-4 rounded-full flex items-center justify-center gap-1.5 hover:opacity-95 transition-opacity cursor-pointer shadow-xs self-start sm:self-auto shrink-0"
          >
            <Plus size={15} className="stroke-[2.5]" />
            <span>Ajouter un élément</span>
          </button>
        </div>

        {/* Info Banner */}
        <div
          style={{
            backgroundColor: '#EEF2FF',
            border: '1px solid rgba(108, 94, 207, 0.2)',
            borderRadius: '12px',
          }}
          className="p-3.5 mb-5 flex items-start gap-2.5 shadow-2xs font-sans"
        >
          <Info size={14} style={{ color: '#4F46E5' }} className="shrink-0 mt-0.5" />
          <p className="text-[12px] font-medium text-[#5348A8] leading-relaxed">
            Les éléments marqués « Calcul DQE » influencent directement vos devis automatiques. Les autres sont des repères de prix que vous gérez librement, sans impact sur le calcul.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4 max-w-md">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#475569] pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par désignation..."
            style={{
              height: '38px',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '9px',
              paddingLeft: '38px',
            }}
            className="w-full bg-white text-[12px] font-sans font-medium text-[#1E293B] placeholder-[#A1A1AA] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 transition-all shadow-2xs"
          />
        </div>

        {/* Filters Container */}
        <div className="space-y-3 mb-5">
          {/* Primary Filter (Origin Pills) */}
          <OriginFilterPills
            selectedOrigine={selectedOrigine}
            onSelectOrigine={setSelectedOrigine}
            countMap={countMap}
          />

          {/* Secondary Filter (Category / Corps de Métier Pills) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 scrollbar-none">
            {categoryOptions.map((cat) => {
              const isSelected = selectedCategorie === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategorie(cat.id)}
                  style={{
                    backgroundColor: isSelected ? '#1E293B' : '#F8FAFC',
                    color: isSelected ? '#ffffff' : '#475569',
                    border: isSelected ? '1px solid transparent' : '1px solid #E2E8F0',
                  }}
                  className="font-sans font-bold text-[11px] px-3 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer shrink-0 shadow-2xs hover:border-[#4F46E5]/40"
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Unified Material Table */}
        <div
          style={{
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#ffffff',
          }}
          className="shadow-2xs"
        >
          <div className="overflow-x-auto min-w-0 w-full">
            <table className="w-full text-left border-collapse font-sans min-w-[650px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-bold uppercase tracking-wider text-[#475569]">
                  <th className="py-2.5 px-3.5 w-32">Origine</th>
                  <th className="py-2.5 px-3.5">Désignation</th>
                  <th className="py-2.5 px-3.5">Catégorie</th>
                  <th className="py-2.5 px-3.5 w-20">Unité</th>
                  <th className="py-2.5 px-3.5 text-right">Prix / Dosage principal</th>
                  <th className="py-2.5 px-3.5 text-center w-28">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMateriaux.length > 0 ? (
                  filteredMateriaux.map((item) => (
                    <UnifiedMaterialRow
                      key={item.id}
                      item={item}
                      onPrixChange={handlePrixChange}
                      onEditItem={handleOpenEditModal}
                      onDuplicateItem={handleDuplicate}
                      onDeleteItem={handleDelete}
                      formatMontant={formatMontant}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-14 text-center text-[#475569] text-[12px] font-sans">
                      <p className="font-bold text-[#1E293B] text-[13px]">
                        Aucun élément ne correspond à votre recherche
                      </p>
                      <p className="text-[11px] text-[#475569] mt-1">
                        Essayez de réinitialiser vos filtres ou de modifier votre terme de recherche.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Unified Modal (Add or Edit) */}
        <UnifiedMaterialModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveModal}
          onUpdate={handleUpdateModal}
          editingItem={editingItem}
        />
      </div>
    </AppLayout>
  );
};
