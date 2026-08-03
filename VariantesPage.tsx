import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { AppLayout } from '../../layouts/AppLayout';
import { ProjectStepperNav } from '../../components/ProjectStepperNav';
import { useVariantes } from '../../hooks/useVariantes';
import { VarianteCard } from './components/VarianteCard';
import { CompareView } from './components/CompareView';
import { NewVarianteModal } from './components/NewVarianteModal';

export const VariantesPage: React.FC = () => {
  const navigate = useNavigate();
  const { id: routeProjectId } = useParams<{ id?: string }>();
  const projectId = routeProjectId || 'proj-1';

  const {
    variantes,
    activeVarianteId,
    setActiveVariante,
    duplicateVariante,
    deleteVariante,
    createVariante,
    formatMontant,
    getCheapest,
    getMostExpensive,
  } = useVariantes();

  const [activeTab, setActiveTab] = useState<'list' | 'compare'>('list');
  const [selectedVarianteId, setSelectedVarianteId] = useState<string>(
    activeVarianteId || 'current'
  );

  // Comparison state
  const [varianteAId, setVarianteAId] = useState<string>(
    variantes[0]?.id || 'current'
  );
  const [varianteBId, setVarianteBId] = useState<string>(
    variantes[1]?.id || variantes[0]?.id || 'current'
  );

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const cheapestId = getCheapest();
  const mostExpensiveId = getMostExpensive();

  const handleSelectVariante = (id: string) => {
    setSelectedVarianteId(id);
    setActiveVariante(id);
  };

  const handleViewVariante = (id: string) => {
    setActiveVariante(id);
    navigate(`/projects/${projectId}/dqe`);
  };

  return (
    <AppLayout
      currentPath="/projects"
      onNavigate={(path) => navigate(path)}
      onNewProject={() => navigate('/dashboard')}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
        {/* Project Pipeline Stepper Navigation */}
        <ProjectStepperNav projectId={projectId} />

        {/* Contextual Topbar / Header action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E2E8F0]">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full inline-block font-sans mb-1.5">
              Variantes de devis
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1E293B] tracking-tight font-sans">
              Villa résidentielle R+2
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5 font-sans">
              Comparez différentes versions du devis pour ce projet
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            style={{ backgroundColor: '#4F46E5', color: '#ffffff' }}
            className="font-sans font-bold text-[13px] h-[36px] px-4 rounded-full flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer shadow-xs self-start sm:self-auto shrink-0"
          >
            <Plus size={13} className="stroke-[3]" />
            <span>Nouvelle variante</span>
          </button>
        </div>

        {/* Tabs selector */}
        <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-[10px] w-fit mb-6 border border-[rgba(0,0,0,0.06)]">
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            style={{
              backgroundColor: activeTab === 'list' ? '#ffffff' : 'transparent',
              color: activeTab === 'list' ? '#1E293B' : '#475569',
              boxShadow: activeTab === 'list' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
            }}
            className="font-sans font-bold text-[12px] px-3.5 py-1.5 rounded-full transition-all cursor-pointer"
          >
            Liste des variantes ({variantes.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('compare')}
            style={{
              backgroundColor: activeTab === 'compare' ? '#ffffff' : 'transparent',
              color: activeTab === 'compare' ? '#1E293B' : '#475569',
              boxShadow: activeTab === 'compare' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
            }}
            className="font-sans font-bold text-[12px] px-3.5 py-1.5 rounded-full transition-all cursor-pointer"
          >
            Comparer
          </button>
        </div>

        {/* Tab 1: Liste des variantes */}
        {activeTab === 'list' && (
          <div className="space-y-3">
            {variantes.map((v) => (
              <VarianteCard
                key={v.id}
                variante={v}
                isSelected={v.id === selectedVarianteId || v.isActive}
                onSelect={handleSelectVariante}
                onView={handleViewVariante}
                onDuplicate={duplicateVariante}
                onDelete={deleteVariante}
                isCheapest={v.id === cheapestId && variantes.length > 1}
                isMostExpensive={v.id === mostExpensiveId && variantes.length > 1}
                formatMontant={formatMontant}
              />
            ))}

            {/* Bouton Créer une nouvelle variante en bas */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3 border-2 border-dashed border-[rgba(0,0,0,0.12)] rounded-full text-[#475569] hover:text-[#4F46E5] hover:border-[#4F46E5] hover:bg-[#EEF2FF]/50 transition-all font-sans font-bold text-[13px] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus size={15} />
                <span>Créer une nouvelle variante</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Comparer */}
        {activeTab === 'compare' && (
          <CompareView
            variantes={variantes}
            varianteAId={varianteAId}
            varianteBId={varianteBId}
            onChangeA={setVarianteAId}
            onChangeB={setVarianteBId}
            formatMontant={formatMontant}
          />
        )}
      </div>

      {/* Modal nouvelle variante */}
      <NewVarianteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={createVariante}
        existingVariantes={variantes}
      />
    </AppLayout>
  );
};
