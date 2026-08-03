import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FileSpreadsheet,
  FileText,
  ArrowRight,
  Check,
  Share2,
} from 'lucide-react';
import { AppLayout } from '../../layouts/AppLayout';
import { ProjectStepperNav } from '../../components/ProjectStepperNav';
import { useDevis } from '../../hooks/useDevis';
import { useProjectData } from '../../store/ProjectDataContext';
import { ModeSelector } from './components/ModeSelector';
import { ModeAPrix } from './components/ModeAPrix';
import { ModeBPieces } from './components/ModeBPieces';
import { RecapDevis } from './components/RecapDevis';

export const DevisPage: React.FC = () => {
  const navigate = useNavigate();
  const { id: routeProjectId } = useParams<{ id?: string }>();
  const projectId = routeProjectId || 'p1';
  const {
    mode,
    switchMode,
    prixUnitaires,
    updatePrixUnitaire,
    pieces,
    updatePrixPiece,
    applyPrixToAllPieces,
    lots,
    totalHT,
    tvaRate,
    tva,
    totalTTC,
    devise,
    formatMontant,
    isSaving,
  } = useDevis();

  const { devisModePipeline, advanceProjectStep } = useProjectData();

  const handleGoToRecap = () => {
    advanceProjectStep(projectId, 'recap');
    navigate(`/projects/${projectId}/recap`);
  };
  // Si l'utilisateur a choisi un mode dès le départ (après l'upload), on
  // verrouille l'affichage sur ce mode pour éviter toute confusion — les deux
  // modes ne sont plus présentés comme interchangeables à la volée.
  const isModeLocked = devisModePipeline === 'dqe' || devisModePipeline === 'm2';

  const [activeView, setActiveView] = useState<'modeA' | 'modeB' | 'recap'>(
    devisModePipeline === 'm2' ? 'modeB' : 'modeA'
  );
  const [localToast, setLocalToast] = useState<string | null>(null);

  const showLocalToast = (msg: string) => {
    setLocalToast(msg);
    setTimeout(() => {
      setLocalToast(null);
    }, 2000);
  };

  const handleSwitchMode = (newMode: 'A' | 'B') => {
    switchMode(newMode);
    setActiveView(newMode === 'A' ? 'modeA' : 'modeB');
  };

  const currentToast = isSaving ? 'Sauvegardé' : localToast;

  return (
    <AppLayout
      currentPath="/projects"
      onNavigate={(path) => navigate(path)}
      onNewProject={() => navigate('/dashboard')}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans pb-28 relative">
        {/* Project Pipeline Stepper Navigation */}
        <ProjectStepperNav projectId={projectId} />
        {/* Toast Sauvegarde Discret */}
        {currentToast && (
          <div
            style={{
              position: 'fixed',
              bottom: '80px',
              right: '20px',
              zIndex: 60,
              backgroundColor: '#1E293B',
              color: '#fff',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 600,
            }}
            className="flex items-center gap-2 shadow-2xl animate-fade-in font-sans"
          >
            <Check size={12} style={{ color: '#12B76A' }} />
            <span>{currentToast}</span>
          </div>
        )}

        {/* Page Topbar & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0] mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full font-sans">
                Mode devis
              </span>
              <span className="text-[11px] text-[#475569] font-medium font-sans">
                • Villa résidentielle R+2
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1E293B] tracking-tight font-sans">
              {isModeLocked
                ? devisModePipeline === 'm2'
                  ? 'Devis par m²'
                  : 'Devis détaillé (DQE)'
                : 'Choisissez votre mode de tarification'}
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5 font-sans">
              {isModeLocked
                ? 'Mode choisi après l\'upload des plans'
                : 'Switchez entre les deux modes à tout moment'}
            </p>
          </div>

          {/* Contextual Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => showLocalToast('Lien de partage copié')}
              className="h-9 px-3 rounded-full border border-[rgba(0,0,0,0.12)] bg-white text-[12px] font-semibold text-[#1E293B] hover:bg-[#F8FAFC] flex items-center gap-1.5 transition-colors cursor-pointer font-sans"
            >
              <Share2 size={14} className="text-[#475569]" />
              <span>Exporter</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('recap')}
              style={{ backgroundColor: '#4F46E5' }}
              className="h-9 px-4 rounded-full text-white text-[12px] font-semibold flex items-center gap-1.5 hover:opacity-95 transition-all cursor-pointer shadow-xs font-sans"
            >
              <span>Récapitulatif</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Mode Selector Cards Component — masqué si le mode a déjà été choisi après l'upload */}
        {!isModeLocked && <ModeSelector mode={mode} onSwitch={handleSwitchMode} />}

        {/* View Tabs */}
        <div className="flex items-center gap-1.5 mb-5 overflow-x-auto pb-1 scrollbar-none">
          {(!isModeLocked || devisModePipeline === 'dqe') && (
            <button
              type="button"
              onClick={() => setActiveView('modeA')}
              style={{
                backgroundColor: activeView === 'modeA' ? '#4F46E5' : '#ffffff',
                color: activeView === 'modeA' ? '#ffffff' : '#475569',
                borderColor: activeView === 'modeA' ? '#4F46E5' : '#E2E8F0',
              }}
              className="px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all cursor-pointer whitespace-nowrap shadow-2xs font-sans"
            >
              {isModeLocked ? 'Prix unitaires par ouvrage' : 'Mode A — Prix unitaires'}
            </button>
          )}

          {(!isModeLocked || devisModePipeline === 'm2') && (
            <button
              type="button"
              onClick={() => setActiveView('modeB')}
              style={{
                backgroundColor: activeView === 'modeB' ? '#4F46E5' : '#ffffff',
                color: activeView === 'modeB' ? '#ffffff' : '#475569',
                borderColor: activeView === 'modeB' ? '#4F46E5' : '#E2E8F0',
              }}
              className="px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all cursor-pointer whitespace-nowrap shadow-2xs font-sans"
            >
              {isModeLocked ? 'Prix au m² par pièce' : 'Mode B — Prix au m²'}
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveView('recap')}
            style={{
              backgroundColor: activeView === 'recap' ? '#4F46E5' : '#ffffff',
              color: activeView === 'recap' ? '#ffffff' : '#475569',
              borderColor: activeView === 'recap' ? '#4F46E5' : '#E2E8F0',
            }}
            className="px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all cursor-pointer whitespace-nowrap shadow-2xs font-sans"
          >
            Récapitulatif
          </button>
        </div>

        {/* View Content */}
        <div className="transition-all duration-200">
          {activeView === 'modeA' && (
            <ModeAPrix
              lots={lots}
              prixUnitaires={prixUnitaires}
              onPrixChange={updatePrixUnitaire}
              totalHT={totalHT}
              tvaRate={tvaRate}
              tva={tva}
              totalTTC={totalTTC}
              formatMontant={formatMontant}
            />
          )}
          {activeView === 'modeB' && (
            <ModeBPieces
              pieces={pieces}
              onPrixChange={updatePrixPiece}
              onApplyToAll={applyPrixToAllPieces}
              formatMontant={formatMontant}
            />
          )}
          {activeView === 'recap' && (
            <RecapDevis
              lots={lots}
              mode={mode}
              totalHT={totalHT}
              tvaRate={tvaRate}
              tva={tva}
              totalTTC={totalTTC}
              pieces={pieces}
              formatMontant={formatMontant}
              onNext={() => navigate(`/projects/${projectId}/recap`)}
            />
          )}
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#F8FAFC] border-t border-[#E2E8F0] py-2.5 px-5 sm:px-8 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left: Total HT Display */}
          <div className="flex items-baseline gap-2">
            <span className="text-[12px] font-semibold text-[#475569] font-sans">
              Total HT
            </span>
            <span className="font-sans font-black text-[18px] text-[#1E293B] tracking-tight">
              {formatMontant(totalHT)}
            </span>
            <span className="text-[12px] font-semibold text-[#475569] font-sans">
              {devise}
            </span>
          </div>

          {/* Right: Export & Navigation Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            <button
              type="button"
              onClick={() => showLocalToast('Export PDF disponible')}
              className="h-8 px-3 rounded-full border border-[rgba(0,0,0,0.12)] bg-white text-[12px] font-semibold text-[#1E293B] hover:bg-white/80 flex items-center gap-1.5 transition-colors cursor-pointer font-sans"
            >
              <FileText size={13} className="text-[#475569]" />
              <span>Export PDF</span>
            </button>

            <button
              type="button"
              onClick={() => showLocalToast('Export Excel disponible')}
              className="h-8 px-3 rounded-full border border-[rgba(0,0,0,0.12)] bg-white text-[12px] font-semibold text-[#1E293B] hover:bg-white/80 flex items-center gap-1.5 transition-colors cursor-pointer font-sans"
            >
              <FileSpreadsheet size={13} className="text-[#475569]" />
              <span>Export Excel</span>
            </button>

            <button
              type="button"
              onClick={handleGoToRecap}
              style={{ backgroundColor: '#4F46E5' }}
              className="h-8 px-4 rounded-full text-white text-[12px] font-semibold flex items-center gap-1.5 hover:opacity-95 transition-all cursor-pointer shadow-xs font-sans"
            >
              <span>Voir le Récapitulatif & Export</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
