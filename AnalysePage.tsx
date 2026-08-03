import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RefreshCw, ArrowLeft, Sliders, Play } from 'lucide-react';
import { AppLayout } from '../../layouts/AppLayout';
import { ProjectStepperNav } from '../../components/ProjectStepperNav';
import { useAnalyse } from '../../hooks/useAnalyse';
import { useProjectData } from '../../store/ProjectDataContext';
import { DocumentStatusComponent } from './components/DocumentStatus';
import { LogPanel } from './components/LogPanel';
import { MissingDataForm } from './components/MissingDataForm';
import { Alert } from '../../components/ui/Alert';

function formatTimeLeft(seconds: number): string {
  if (seconds <= 0) return '0 s';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) {
    return `${mins} min ${secs} s`;
  }
  return `${secs} s`;
}

export const AnalysePage: React.FC = () => {
  const navigate = useNavigate();
  const { id: routeProjectId } = useParams<{ id: string }>();
  const projectId = routeProjectId || 'p1';

  const { state, runAnalysisSequence, recommencerAnalyse, simulateMissingData } = useAnalyse(projectId);
  const { devisModePipeline, advanceProjectStep } = useProjectData();

  const hasAutoStartedRef = useRef(false);

  useEffect(() => {
    if (!hasAutoStartedRef.current) {
      hasAutoStartedRef.current = true;
      runAnalysisSequence();
    }
  }, [runAnalysisSequence]);

  // Auto-navigate à la fin de l'analyse
  useEffect(() => {
    if (state.status === 'completed') {
      const nextStep = devisModePipeline === 'm2' ? 'devis' : 'cahier';
      advanceProjectStep(projectId, nextStep);
      const timer = setTimeout(() => {
        if (devisModePipeline === 'm2') {
          navigate(`/projects/${projectId}/devis`);
        } else {
          navigate(`/dashboard/projects/${projectId}/cahier-de-calcul`);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state.status, navigate, projectId, devisModePipeline, advanceProjectStep]);

  const isIdle = state.status === 'idle';
  const isProcessing = state.status === 'processing';
  const isMissingData = state.status === 'missing_data';
  const isError = state.status === 'error';

  return (
    <AppLayout
      currentPath="/projects"
      onNavigate={(path) => navigate(path)}
      onNewProject={() => navigate('/dashboard')}
    >
      <div className="max-w-3xl mx-auto py-2 md:py-4 px-4 font-sans">
        {/* Project Pipeline Stepper Navigation */}
        <ProjectStepperNav projectId={projectId} />

        {/* Header */}
        <div className="mb-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#EEF2FF] border border-[#4F46E5]/20 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
              <span className="font-bold text-[11px] text-[#4F46E5]">
                Analyse IA
              </span>
            </div>

            <h1 className="font-black text-[22px] md:text-[26px] text-[#1E293B] tracking-tight">
              {isIdle && 'Lancement de l’analyse'}
              {isProcessing && 'Analyse en cours'}
              {isMissingData && 'Informations manquantes'}
              {isError && 'Erreur d’analyse'}
            </h1>

            <p className="text-[13px] text-[#475569] mt-0.5">
              {isIdle && 'Préparation de l’analyse des plans'}
              {isProcessing && 'Claude analyse vos documents et extrait les ouvrages'}
              {isMissingData && 'Complétez les informations manquantes pour continuer'}
              {isError && 'Impossible de finaliser l’analyse automatique'}
            </p>
          </div>

          {/* Quick Simulation controls for testing/demo */}
          {isProcessing && (
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                onClick={simulateMissingData}
                style={{ border: '1px solid #E2E8F0' }}
                className="h-8 px-2.5 rounded-full bg-white text-[#475569] hover:text-[#1E293B] text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                title="Tester le cas des informations manquantes"
              >
                <Sliders size={12} />
                <span>Simuler données manquantes</span>
              </button>
            </div>
          )}
        </div>

        {/* Global Progress Bar (Processing state) */}
        {isProcessing && (
          <div className="mb-4 space-y-2">
            <div
              style={{
                height: '4px',
                backgroundColor: 'rgba(0,0,0,0.06)',
                borderRadius: '99px',
              }}
              className="w-full overflow-hidden"
            >
              <div
                style={{
                  width: `${state.globalProgress}%`,
                  backgroundColor: '#4F46E5',
                  borderRadius: '99px',
                }}
                className="h-full transition-all duration-400 ease-out"
              />
            </div>

            {/* ETA Indicator */}
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#475569] pt-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4F46E5] animate-pulse" />
                <span className="text-[#1E293B]">Analyse en cours</span>
              </div>
              <div>
                Résultat estimé dans {formatTimeLeft(state.estimatedSecondsLeft)}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 md:p-6 shadow-xs mt-4">
          {/* Status Idle */}
          {isIdle && (
            <div className="text-center font-sans space-y-4 py-6">
              <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] border border-[#4F46E5]/20 mx-auto flex items-center justify-center text-[#4F46E5]">
                <Play size={28} />
              </div>
              <div>
                <h2 className="font-extrabold text-[18px] text-[#1E293B]">
                  Lancement de l'analyse IA
                </h2>
                <p className="text-[12.5px] text-[#475569] max-w-md mx-auto mt-1 leading-relaxed">
                  L'analyse automatique va extraire et structurer les métrés de vos plans.
                </p>
              </div>
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => runAnalysisSequence()}
                  style={{ backgroundColor: '#4F46E5' }}
                  className="h-10 px-6 rounded-full text-white font-bold text-[13.5px] hover:opacity-95 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Play size={16} className="fill-current" />
                  <span>Lancer l'analyse</span>
                </button>
              </div>
            </div>
          )}
          {/* Status Processing */}
          {isProcessing && (
            <div>
              <DocumentStatusComponent documents={state.documentStatuses} />
              <LogPanel logEntries={state.logEntries} currentPhase={state.currentPhase} />
            </div>
          )}

          {/* Status Missing Data */}
          {isMissingData && (
            <MissingDataForm
              missingData={state.missingData}
              onSubmit={(answers) => recommencerAnalyse(answers)}
            />
          )}

          {/* Status Error */}
          {isError && (
            <Alert variant="error" className="mb-4 p-4">
              <div className="space-y-2.5">
                <h2 className="font-bold text-[14px] text-[#1E293B]">
                  L'analyse a échoué
                </h2>
                <p className="text-[12px] text-[#475569] leading-relaxed">
                  {state.errorMessage ||
                    'Une erreur inattendue s\'est produite. Vérifiez votre connexion et réessayez.'}
                </p>
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <button
                    onClick={() => recommencerAnalyse()}
                    style={{ backgroundColor: '#4F46E5' }}
                    className="h-9 px-4 rounded-full text-white font-semibold text-[13px] hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw size={14} />
                    <span>Réessayer</span>
                  </button>
                  <button
                    onClick={() => navigate(`/dashboard/projects/${projectId}/upload`)}
                    style={{ border: '1px solid #E2E8F0' }}
                    className="h-9 px-4 rounded-full bg-white text-[#1E293B] font-semibold text-[13px] hover:bg-[#F8FAFC] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>Revenir à l'upload</span>
                  </button>
                </div>
              </div>
            </Alert>
          )}
        </div>
      </div>
    </AppLayout>
  );
};
