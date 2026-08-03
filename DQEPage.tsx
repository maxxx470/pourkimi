import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  History,
  FileSpreadsheet,
  FileText,
  ArrowRight,
  Edit3,
  Check,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { AppLayout } from '../../layouts/AppLayout';
import { ProjectStepperNav } from '../../components/ProjectStepperNav';
import { useDQE, formatMontant } from '../../hooks/useDQE';
import { useProjectData } from '../../store/ProjectDataContext';
import { DQETable } from './components/DQETable';
import { AddRowModal } from './components/AddRowModal';
import { AddLotModal } from './components/AddLotModal';

export const DQEPage: React.FC = () => {
  const navigate = useNavigate();
  const { id: routeProjectId } = useParams<{ id?: string }>();
  const projectId = routeProjectId || 'p1';
  const { advanceProjectStep } = useProjectData();

  const {
    lots,
    modeDevis,
    editMode,
    selectedLot,
    totalHT,
    tva,
    totalTTC,
    toastMessage,
    toggleModeDevis,
    toggleEditMode,
    setSelectedLot,
    updatePrix,
    updateQuantite,
    updateUnite,
    deleteItem,
    addItem,
    addLot,
    deleteLot,
    lotsPredefinisDisponibles,
    filteredLots,
  } = useDQE(projectId);

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isAddLotModalOpen, setIsAddLotModalOpen] = useState<boolean>(false);
  const [targetLotId, setTargetLotId] = useState<number>(1);
  const [localToast, setLocalToast] = useState<string | null>(null);

  const showLocalToast = (msg: string) => {
    setLocalToast(msg);
    setTimeout(() => {
      setLocalToast(null);
    }, 2000);
  };

  const handleOpenAddModal = (lotId: number) => {
    setTargetLotId(lotId);
    setIsAddModalOpen(true);
  };

  const currentToast = toastMessage || localToast;

  return (
    <AppLayout
      currentPath="/projects"
      onNavigate={(path) => navigate(path)}
      onNewProject={() => navigate('/dashboard')}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans pb-28 relative">
        {/* Project Pipeline Stepper Navigation */}
        <ProjectStepperNav projectId={projectId} />
        {/* Floating Auto-save / Action Toast */}
        {currentToast && (
          <div className="fixed top-20 right-6 z-50 bg-[#1E293B] text-white text-[12px] font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-white/10 animate-fade-in">
            <CheckCircle2 size={15} className="text-[#12B76A]" />
            <span>{currentToast}</span>
          </div>
        )}

        {/* Page Topbar & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0] mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full">
                Phase 7 — Tableau DQE
              </span>
              <span className="text-[11px] text-[#475569] font-medium">
                • Villa résidentielle R+2
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
              Devis Quantitatif Estimatif (DQE)
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5">
              Client: M. Diop · Dakar · Synthèse complète extraite par IA
            </p>
          </div>

          {/* Contextual Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => showLocalToast('Historique des versions (Disponible Phase 9)')}
              className="h-9 px-3 rounded-full border border-[rgba(0,0,0,0.12)] bg-white text-[12px] font-semibold text-[#1E293B] hover:bg-[#F8FAFC] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <History size={14} className="text-[#475569]" />
              <span>Versions</span>
            </button>

            <button
              type="button"
              onClick={() => showLocalToast('Export disponible en Phase 9')}
              className="h-9 px-3 rounded-full border border-[rgba(0,0,0,0.12)] bg-white text-[12px] font-semibold text-[#1E293B] hover:bg-[#F8FAFC] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileSpreadsheet size={14} className="text-[#475569]" />
              <span>Exporter</span>
            </button>

            <button
              type="button"
              onClick={toggleEditMode}
              style={{
                backgroundColor: editMode ? '#1E293B' : '#ffffff',
                color: editMode ? '#ffffff' : '#1E293B',
              }}
              className="h-9 px-3.5 rounded-full border border-[rgba(0,0,0,0.12)] text-[12px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              {editMode ? (
                <>
                  <Check size={14} className="text-[#12B76A]" />
                  <span>Terminer l'édition</span>
                </>
              ) : (
                <>
                  <Edit3 size={14} className="text-[#4F46E5]" />
                  <span>Éditer les ouvrages</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
          {/* Mode Devis Toggle Switch */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={modeDevis}
                onChange={toggleModeDevis}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-[#E4E4E7] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4F46E5]"></div>
            </label>
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-[#1E293B]">
                Mode devis (Prix FCFA)
              </span>
              <span className="text-[10px] text-[#475569]">
                {modeDevis ? 'Affiche prix unitaires & montants' : 'Masque les colonnes financières'}
              </span>
            </div>
          </div>

          {/* KPI Summary Pills */}
          {modeDevis && (
            <div className="flex items-center gap-3 bg-[#F8FAFC] px-3.5 py-1.5 rounded-lg border border-[rgba(0,0,0,0.06)]">
              <div className="flex flex-col text-right">
                <span className="text-[10px] font-bold text-[#475569] uppercase tracking-wider">
                  Total Général HT
                </span>
                <span className="text-[13px] font-extrabold text-[#1E293B]">
                  {formatMontant(totalHT)} FCFA
                </span>
              </div>
              <div className="h-6 w-[1px] bg-[rgba(0,0,0,0.1)]"></div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] font-bold text-[#475569] uppercase tracking-wider">
                  Total TTC (18%)
                </span>
                <span className="text-[13px] font-extrabold text-[#4F46E5]">
                  {formatMontant(totalTTC)} FCFA
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Lot Filter Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedLot('all')}
            style={{
              backgroundColor: selectedLot === 'all' ? '#1E293B' : '#ffffff',
              color: selectedLot === 'all' ? '#ffffff' : '#475569',
            }}
            className="px-3.5 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider border border-[rgba(0,0,0,0.1)] transition-all whitespace-nowrap cursor-pointer shadow-2xs shrink-0"
          >
            Tous les lots ({lots.length})
          </button>

          {lots.map((lot) => {
            const isSelected = selectedLot === lot.id;
            return (
              <button
                key={lot.id}
                type="button"
                onClick={() => setSelectedLot(lot.id)}
                style={{
                  backgroundColor: isSelected ? lot.color : '#ffffff',
                  color: isSelected ? '#ffffff' : '#1E293B',
                  borderColor: isSelected ? lot.color : 'rgba(0,0,0,0.1)',
                }}
                className="px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all whitespace-nowrap cursor-pointer shrink-0 shadow-2xs flex items-center gap-1.5"
              >
                <span
                  style={{ backgroundColor: isSelected ? '#ffffff' : lot.color }}
                  className="w-2 h-2 rounded-full inline-block"
                ></span>
                <span>
                  LOT {lot.numero} — {lot.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main DQE Table Component */}
        <DQETable
          lots={filteredLots}
          modeDevis={modeDevis}
          editMode={editMode}
          selectedLot={selectedLot}
          totalHT={totalHT}
          tva={tva}
          totalTTC={totalTTC}
          onPrixChange={updatePrix}
          onQuantiteChange={updateQuantite}
          onUniteChange={updateUnite}
          onDeleteItem={deleteItem}
          onAddItemClick={handleOpenAddModal}
          onAddLotClick={() => setIsAddLotModalOpen(true)}
          onDeleteLot={deleteLot}
        />

        {/* Add Row Modal */}
        <AddRowModal
          isOpen={isAddModalOpen}
          lotId={targetLotId || (typeof selectedLot === 'number' ? selectedLot : lots[0]?.id || 1)}
          lots={lots}
          isSpecificLot={selectedLot !== 'all'}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={addItem}
        />

        {/* Add Lot Modal */}
        <AddLotModal
          isOpen={isAddLotModalOpen}
          lotsPredefinis={lotsPredefinisDisponibles}
          onClose={() => setIsAddLotModalOpen(false)}
          onAdd={addLot}
        />
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[rgba(0,0,0,0.1)] py-3 px-4 sm:px-8 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left Metadata info */}
          <div className="flex items-center gap-2 text-[11px] text-[#475569] font-medium">
            <Sparkles size={14} className="text-[#4F46E5]" />
            <span>47 ouvrages d'art · {lots.length} lots de construction · Mis à jour à l'instant</span>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => showLocalToast('Export PDF disponible en Phase 9')}
              className="h-9 px-3.5 rounded-full border border-[rgba(0,0,0,0.12)] bg-white text-[12px] font-semibold text-[#1E293B] hover:bg-[#F8FAFC] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText size={14} className="text-[#475569]" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>

            <button
              type="button"
              onClick={() => showLocalToast('Export Excel disponible en Phase 9')}
              className="h-9 px-3.5 rounded-full border border-[rgba(0,0,0,0.12)] bg-white text-[12px] font-semibold text-[#1E293B] hover:bg-[#F8FAFC] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileSpreadsheet size={14} className="text-[#475569]" />
              <span className="hidden sm:inline">Export Excel</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (!modeDevis) toggleModeDevis();
                advanceProjectStep(projectId, 'devis');
                navigate(`/projects/${projectId}/devis`);
              }}
              style={{ backgroundColor: '#4F46E5' }}
              className="h-9 px-5 rounded-full text-white text-[12px] font-semibold flex items-center gap-1.5 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer shadow-md"
            >
              <span>Valider et passer à la Tarification</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
