import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CheckCircle,
  ArrowRight,
  Edit2,
  Sliders,
  Check,
  FileSpreadsheet,
} from 'lucide-react';
import { AppLayout } from '../../layouts/AppLayout';
import { ProjectStepperNav } from '../../components/ProjectStepperNav';
import { useCahierCalcul } from '../../hooks/useCahierCalcul';
import { useProjectData } from '../../store/ProjectDataContext';
import { HypotheseAlert } from './components/HypotheseAlert';
import { LotsNav } from './components/LotsNav';
import { CalcBlock } from './components/CalcBlock';

export const CahierCalculPage: React.FC = () => {
  const navigate = useNavigate();
  const { id: routeProjectId } = useParams<{ id: string }>();
  const projectId = routeProjectId || 'p1';

  const {
    lots,
    hypotheses,
    editMode,
    toggleEditMode,
    editedValues,
    updateValue,
    recalculate,
    selectedLot,
    setSelectedLot,
    recentlyChangedItemId,
  } = useCahierCalcul();

  const handleScrollToLot = (lotName: string) => {
    // Find lot by name
    const matchedLot = lots.find((l) =>
      lotName.toLowerCase().includes(l.name.toLowerCase()) ||
      l.name.toLowerCase().includes(lotName.toLowerCase())
    );

    if (matchedLot) {
      setSelectedLot(matchedLot.id);
      setTimeout(() => {
        const el = document.getElementById(`lot-block-${matchedLot.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      setSelectedLot('all');
    }
  };

  const filteredLots =
    selectedLot === 'all'
      ? lots
      : lots.filter((lot) => lot.id === selectedLot);

  const { advanceProjectStep } = useProjectData();

  const handleNavigateToDQE = () => {
    advanceProjectStep(projectId, 'dqe');
    navigate(`/projects/${projectId}/dqe`);
  };

  return (
    <AppLayout
      currentPath="/projects"
      onNavigate={(path) => navigate(path)}
      onNewProject={() => navigate('/dashboard')}
    >
      <div className="max-w-7xl mx-auto py-2 md:py-4 px-4 font-sans pb-24">
        {/* Project Pipeline Stepper Navigation */}
        <ProjectStepperNav projectId={projectId} />

        {/* Contextual Header / Topbar Area */}
        <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[rgba(0,0,0,0.06)] pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#EEF2FF] border border-[#4F46E5]/20 mb-2">
              <FileSpreadsheet size={12} className="text-[#4F46E5]" />
              <span className="font-bold text-[11px] text-[#4F46E5]">
                Cahier de calcul
              </span>
            </div>

            <h1 className="font-black text-[22px] md:text-[26px] text-[#1E293B] tracking-tight">
              Détail des quantités
            </h1>

            <p className="text-[13px] text-[#475569] mt-0.5">
              Vérifiez et corrigez chaque calcul avant de passer au DQE
            </p>
          </div>

          {/* Action buttons in header */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={toggleEditMode}
              style={{
                backgroundColor: editMode ? '#EEF2FF' : '#ffffff',
                border: editMode
                  ? '1px solid #4F46E5'
                  : '1px solid #E2E8F0',
                color: editMode ? '#4F46E5' : '#1E293B',
              }}
              className="h-9 px-3 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {editMode ? (
                <>
                  <Check size={14} className="text-[#4F46E5]" />
                  <span>Mode édition actif</span>
                </>
              ) : (
                <>
                  <Edit2 size={14} />
                  <span>Modifier les valeurs</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleNavigateToDQE}
              style={{ backgroundColor: '#4F46E5' }}
              className="h-9 px-3.5 rounded-full text-white font-semibold text-[12px] flex items-center gap-1.5 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
            >
              <span>Passer au DQE</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Hypotheses Alert */}
        <HypotheseAlert
          hypotheses={hypotheses}
          onScrollToLot={handleScrollToLot}
        />

        {/* Lots Navigation */}
        <LotsNav
          lots={lots}
          selectedLot={selectedLot}
          onSelect={(lot) => setSelectedLot(lot)}
        />

        {/* Calculation Blocks List */}
        <div className="space-y-3">
          {filteredLots.map((lot) => (
            <CalcBlock
              key={lot.id}
              lot={lot}
              editMode={editMode}
              editedValues={editedValues}
              onEditValue={updateValue}
              onRecalculate={recalculate}
              recentlyChangedItemId={recentlyChangedItemId}
            />
          ))}
        </div>
      </div>

      {/* Sticky Bottom Validation Bar */}
      <div
        style={{
          backgroundColor: '#F8FAFC',
          borderTop: '1px solid #E2E8F0',
        }}
        className="fixed bottom-0 left-0 right-0 z-30 px-4 md:px-8 py-3 shadow-lg"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left info */}
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <div className="w-7 h-7 rounded-full bg-[#EDFAF3] flex items-center justify-center text-[#12B76A] flex-shrink-0">
              <CheckCircle size={15} />
            </div>
            <div>
              <span className="font-bold text-[13px] text-[#1E293B] block leading-tight">
                Vérification terminée ?
              </span>
              <span className="text-[11px] text-[#475569] block">
                Vous pourrez toujours revenir modifier
              </span>
            </div>
          </div>

          {/* Right action button */}
          <button
            type="button"
            onClick={handleNavigateToDQE}
            style={{
              height: '36px',
              backgroundColor: '#4F46E5',
              boxShadow: '0 4px 12px rgba(108,94,207,0.25)',
            }}
            className="w-full sm:w-auto px-5 rounded-full text-white font-semibold text-[13px] flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Passer au tableau DQE</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </AppLayout>
  );
};
