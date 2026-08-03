import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import { AppLayout } from '../../layouts/AppLayout';
import { ProjectStepperNav } from '../../components/ProjectStepperNav';
import { useVersions } from '../../hooks/useVersions';
import { VersionTimelineItem } from './components/VersionTimelineItem';
import { RestoreConfirmModal } from './components/RestoreConfirmModal';
import { PreviewVersionModal } from './components/PreviewVersionModal';

export const HistoriquePage: React.FC = () => {
  const navigate = useNavigate();
  const { id: routeProjectId } = useParams<{ id?: string }>();
  const projectId = routeProjectId || 'p1';

  const {
    versions,
    isRestoreModalOpen,
    isPreviewModalOpen,
    selectedVersionId,
    requestRestore,
    confirmRestore,
    cancelRestore,
    requestPreview,
    closePreview,
  } = useVersions();

  const [isRestoring, setIsRestoring] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleConfirmRestore = () => {
    setIsRestoring(true);
    setTimeout(() => {
      confirmRestore();
      setIsRestoring(false);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }, 400);
  };

  const selectedVersion = versions.find((v) => v.id === selectedVersionId) || null;

  return (
    <AppLayout
      currentPath="/projects"
      onNavigate={(path) => navigate(path)}
      onNewProject={() => navigate('/dashboard')}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
        {/* Project Pipeline Stepper Navigation */}
        <ProjectStepperNav projectId={projectId} />

        {/* Contextual Topbar / Header */}
        <div className="mb-6 pb-4 border-b border-[#E2E8F0]">
          <div className="text-[12px] font-semibold text-[#475569] mb-1 font-sans">
            Villa résidentielle R+2
          </div>
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full inline-block font-sans mb-1.5">
            Historique
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E293B] tracking-tight font-sans">
            Versions du métré
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5 font-sans">
            Villa résidentielle R+2 — 10 dernières versions conservées
          </p>
        </div>

        {/* Timeline list */}
        <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-5 sm:p-6 shadow-2xs font-sans">
          <div className="flex flex-col">
            {versions.map((v, i) => (
              <VersionTimelineItem
                key={v.id}
                version={v}
                isLast={i === versions.length - 1}
                onPreview={requestPreview}
                onRestore={requestRestore}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal Confirmation Restauration */}
      <RestoreConfirmModal
        isOpen={isRestoreModalOpen}
        version={selectedVersion}
        onConfirm={handleConfirmRestore}
        onCancel={cancelRestore}
        isRestoring={isRestoring}
      />

      {/* Modal Aperçu en lecture seule */}
      <PreviewVersionModal
        isOpen={isPreviewModalOpen}
        version={selectedVersion}
        onClose={closePreview}
        onRestoreFromPreview={() => {
          closePreview();
          if (selectedVersionId) {
            requestRestore(selectedVersionId);
          }
        }}
      />

      {/* Toast Notification */}
      {showToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 70,
            backgroundColor: '#1E293B',
            color: '#ffffff',
            borderRadius: '10px',
            padding: '12px 16px',
          }}
          className="font-sans font-semibold text-[13px] flex items-center gap-2 shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <Check size={14} style={{ color: '#12B76A' }} />
          <span>Version restaurée avec succès</span>
        </div>
      )}
    </AppLayout>
  );
};
