import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Check, X as XIcon } from 'lucide-react';
import { AppLayout } from '../../layouts/AppLayout';
import { ProjectStepperNav } from '../../components/ProjectStepperNav';
import { useRecapDQE } from '../../hooks/useRecapDQE';
import { useRecapM2 } from '../../hooks/useRecapM2';
import { useProjectData } from '../../store/ProjectDataContext';
import { DocumentPreview } from './components/DocumentPreview';
import { DocumentPreviewM2 } from './components/DocumentPreviewM2';
import { TotauxPanel } from './components/TotauxPanel';
import { CabinetForm } from './components/CabinetForm';
import { ExportPanel } from './components/ExportPanel';
import { PaywallCard } from './components/PaywallCard';
import { generatePDF } from '../../services/pdfExport';
import { generateExcel } from '../../services/excelExport';
import { CabinetInfo, RecapData, RecapDataM2 } from '../../types/recap';

interface ToastState {
  type: 'success' | 'error';
  message: string;
}

interface CommonRecapProps {
  projectId: string;
  mode: 'dqe' | 'm2';
  recapData: RecapData | RecapDataM2;
  formatMontant: (n: number) => string;
  isPaywalled: boolean;
  setIsPaywalled: React.Dispatch<React.SetStateAction<boolean>>;
  cabinet: CabinetInfo;
  setCabinet: (cabinet: CabinetInfo) => void;
  previewElement: React.ReactNode;
}

const RecapPageContent: React.FC<CommonRecapProps> = ({
  projectId,
  mode,
  recapData,
  formatMontant,
  isPaywalled,
  setIsPaywalled,
  cabinet,
  setCabinet,
  previewElement,
}) => {
  const navigate = useNavigate();
  const { markProjectCompleted } = useProjectData();

  const [isExportingPDF, setIsExportingPDF] = useState<boolean>(false);
  const [isExportingExcel, setIsExportingExcel] = useState<boolean>(false);
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleUnlockPaywall = () => {
    setIsUnlocking(true);
    setTimeout(() => {
      setIsPaywalled(false);
      setIsUnlocking(false);
      showToast('success', 'Export débloqué avec succès !');
    }, 1000);
  };

  const handleExportPDF = () => {
    setIsExportingPDF(true);
    try {
      generatePDF(recapData, mode);
      markProjectCompleted(projectId);
      showToast('success', 'Document PDF téléchargé avec succès');
    } catch (err) {
      console.error('Erreur export PDF:', err);
      showToast('error', 'La génération du PDF a échoué, réessayez');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportExcel = () => {
    setIsExportingExcel(true);
    try {
      generateExcel(recapData, mode);
      markProjectCompleted(projectId);
      showToast('success', 'Document Excel téléchargé avec succès');
    } catch (err) {
      console.error('Erreur export Excel:', err);
      showToast('error', "La génération de l'Excel a échoué, réessayez");
    } finally {
      setIsExportingExcel(false);
    }
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

        {/* Header */}
        <div className="mb-6 pb-4 border-b border-[#E2E8F0]">
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full inline-block font-sans mb-1.5">
            Récapitulatif final
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E293B] tracking-tight font-sans">
            Aperçu du document
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5 font-sans">
            Vérifiez le rendu avant d'exporter en PDF ou Excel
          </p>
        </div>

        {/* 2-column Desktop / 1-column Mobile Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-4 items-start">
          {/* Colonne gauche : DocumentPreview ou DocumentPreviewM2 */}
          <div>{previewElement}</div>

          {/* Colonne droite : TotauxPanel, CabinetForm, PaywallCard (si isPaywalled), ExportPanel */}
          <div className="space-y-4">
            <TotauxPanel
              totalHT={recapData.totalHT}
              tva={recapData.tva}
              totalTTC={recapData.totalTTC}
              tvaRate={recapData.tvaRate}
              formatMontant={formatMontant}
            />

            <CabinetForm cabinet={cabinet} onChange={setCabinet} />

            {isPaywalled && (
              <PaywallCard
                price={15000}
                onUnlock={handleUnlockPaywall}
                isProcessing={isUnlocking}
              />
            )}

            <ExportPanel
              isLocked={isPaywalled}
              onExportPDF={handleExportPDF}
              onExportExcel={handleExportExcel}
              isExportingPDF={isExportingPDF}
              isExportingExcel={isExportingExcel}
            />
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 60,
            backgroundColor: '#1E293B',
            color: '#ffffff',
            borderRadius: '10px',
            padding: '12px 16px',
            fontSize: '13px',
            fontWeight: 600,
          }}
          className="font-sans flex items-center gap-2.5 shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          {toast.type === 'success' ? (
            <div className="w-5 h-5 rounded-full bg-[#12B76A]/20 flex items-center justify-center shrink-0">
              <Check size={13} className="text-[#12B76A]" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-[#E8442A]/20 flex items-center justify-center shrink-0">
              <XIcon size={13} className="text-[#E8442A]" />
            </div>
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </AppLayout>
  );
};

const RecapDQEView: React.FC<{ projectId: string }> = ({ projectId }) => {
  const {
    recapData,
    formatMontant,
    isPaywalled,
    setIsPaywalled,
    cabinet,
    setCabinet,
  } = useRecapDQE();

  return (
    <RecapPageContent
      projectId={projectId}
      mode="dqe"
      recapData={recapData}
      formatMontant={formatMontant}
      isPaywalled={isPaywalled}
      setIsPaywalled={setIsPaywalled}
      cabinet={cabinet}
      setCabinet={setCabinet}
      previewElement={<DocumentPreview data={recapData} />}
    />
  );
};

const RecapM2View: React.FC<{ projectId: string }> = ({ projectId }) => {
  const {
    recapData,
    formatMontant,
    isPaywalled,
    setIsPaywalled,
    cabinet,
    setCabinet,
  } = useRecapM2();

  return (
    <RecapPageContent
      projectId={projectId}
      mode="m2"
      recapData={recapData}
      formatMontant={formatMontant}
      isPaywalled={isPaywalled}
      setIsPaywalled={setIsPaywalled}
      cabinet={cabinet}
      setCabinet={setCabinet}
      previewElement={<DocumentPreviewM2 data={recapData} />}
    />
  );
};

export const RecapPage: React.FC = () => {
  const { id: routeProjectId } = useParams<{ id?: string }>();
  const projectId = routeProjectId || 'proj-1';
  const { devisModePipeline } = useProjectData();

  if (devisModePipeline === 'm2') {
    return <RecapM2View projectId={projectId} />;
  }

  return <RecapDQEView projectId={projectId} />;
};
