import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import { AppLayout } from '../../layouts/AppLayout';
import { UploadedFile, useFileUpload } from '../../hooks/useFileUpload';
import { StepPlans } from './steps/StepPlans';
import { StepCoupes } from './steps/StepCoupes';
import { StepFacades } from './steps/StepFacades';
import { StepStructure } from './steps/StepStructure';
import { StepRecap } from './steps/StepRecap';

export interface UploadWizardProps {
  projectName?: string;
  projectId?: string;
  onFinish?: () => void;
}

export interface WizardState {
  currentStep: 1 | 2 | 3 | 4 | 5;
  files: {
    plans: UploadedFile[];
    coupes: UploadedFile[];
    facades: UploadedFile[];
    structure: UploadedFile[];
  };
}

export const UploadWizard: React.FC<UploadWizardProps> = ({
  projectName = 'Villa résidentielle R+2 — Abidjan',
  onFinish,
}) => {
  const navigate = useNavigate();
  const { id: routeProjectId } = useParams<{ id: string }>();

  const [state, setState] = useState<WizardState>({
    currentStep: 1,
    files: {
      plans: [],
      coupes: [],
      facades: [],
      structure: [],
    },
  });

  const { uploadFiles, convertDWG } = useFileUpload();

  const handleAddFiles = (category: 'plans' | 'coupes' | 'facades' | 'structure', rawFiles: File[]) => {
    const newFileObjects: UploadedFile[] = rawFiles.map((f) => ({
      id: `${category}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: f.name,
      size: f.size,
      type: f.type,
      status: 'uploading',
      progress: 0,
    }));

    setState((prev) => ({
      ...prev,
      files: {
        ...prev.files,
        [category]: [...prev.files[category], ...newFileObjects],
      },
    }));

    // Trigger simulation via hook
    uploadFiles(
      rawFiles,
      category,
      (fileId, progress) => {
        setState((prev) => ({
          ...prev,
          files: {
            ...prev.files,
            [category]: prev.files[category].map((item, idx) => {
              // Match by index or id approximation
              if (idx >= prev.files[category].length - rawFiles.length) {
                return { ...item, progress };
              }
              return item;
            }),
          },
        }));
      },
      (fileId, url) => {
        setState((prev) => ({
          ...prev,
          files: {
            ...prev.files,
            [category]: prev.files[category].map((item, idx) => {
              if (idx >= prev.files[category].length - rawFiles.length) {
                const isDwg = item.name.toLowerCase().endsWith('.dwg');
                if (isDwg && item.status !== 'converting') {
                  // Trigger DWG conversion simulation
                  convertDWG(
                    fileId,
                    (convProgress) => {
                      setState((convPrev) => ({
                        ...convPrev,
                        files: {
                          ...convPrev.files,
                          [category]: convPrev.files[category].map((fItem) =>
                            fItem.id === item.id
                              ? { ...fItem, status: 'converting', progress: convProgress }
                              : fItem
                          ),
                        },
                      }));
                    },
                    (convUrl) => {
                      setState((convPrev) => ({
                        ...convPrev,
                        files: {
                          ...convPrev.files,
                          [category]: convPrev.files[category].map((fItem) =>
                            fItem.id === item.id
                              ? { ...fItem, status: 'done', progress: 100, url: convUrl }
                              : fItem
                          ),
                        },
                      }));
                    }
                  );
                  return { ...item, status: 'converting', progress: 0, url };
                }
                return { ...item, status: 'done', progress: 100, url };
              }
              return item;
            }),
          },
        }));
      },
      (fileId) => {
        setState((prev) => ({
          ...prev,
          files: {
            ...prev.files,
            [category]: prev.files[category].map((item, idx) => {
              if (idx >= prev.files[category].length - rawFiles.length) {
                return { ...item, status: 'error' };
              }
              return item;
            }),
          },
        }));
      }
    );
  };

  const handleRemoveFile = (category: 'plans' | 'coupes' | 'facades' | 'structure', fileId: string) => {
    setState((prev) => ({
      ...prev,
      files: {
        ...prev.files,
        [category]: prev.files[category].filter((f) => f.id !== fileId),
      },
    }));
  };

  const goToStep = (step: 1 | 2 | 3 | 4 | 5) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  };

  const nextStep = () => {
    if (state.currentStep < 5) {
      goToStep((state.currentStep + 1) as 1 | 2 | 3 | 4 | 5);
    }
  };

  const prevStep = () => {
    if (state.currentStep > 1) {
      goToStep((state.currentStep - 1) as 1 | 2 | 3 | 4 | 5);
    }
  };

  const handleLaunch = () => {
    if (onFinish) {
      onFinish();
    } else {
      const targetId = routeProjectId || 'p1';
      navigate(`/projects/${targetId}/mode-choix`);
    }
  };

  const stepLabels = [
    { num: 1, label: 'Plans niveaux' },
    { num: 2, label: 'Coupes' },
    { num: 3, label: 'Façades' },
    { num: 4, label: 'Structure' },
    { num: 5, label: 'Récap' },
  ];

  const progressPercentage = state.currentStep * 20;

  return (
    <AppLayout
      currentPath="/dashboard/projects"
      onNavigate={(path) => navigate(path)}
      onNewProject={() => navigate('/dashboard')}
    >
      <div className="max-w-2xl mx-auto py-2 md:py-4 px-4 font-sans">
        {/* Header / Eyebrow */}
        <div className="mb-5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#EEF2FF] border border-[#4F46E5]/20 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
            <span className="font-sans font-bold text-[11px] text-[#4F46E5] truncate">
              {projectName}
            </span>
          </div>
          <h1 className="font-sans font-black text-[22px] md:text-[26px] text-[#1E293B] tracking-tight">
            Ajoutez vos plans
          </h1>
          <p className="font-sans text-[13px] text-[#475569] mt-0.5">
            Uploadez vos documents — l'IA analysera l'ensemble
          </p>
        </div>

        {/* Global Progress Bar Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-[11px] font-sans font-bold text-[#475569] mb-1.5">
            <span>Étape {state.currentStep} sur 5</span>
            <span className="text-[#4F46E5]">{progressPercentage}%</span>
          </div>
          <div className="w-full h-1 bg-[rgba(0,0,0,0.06)] rounded-full overflow-hidden">
            <div
              style={{
                width: `${progressPercentage}%`,
                backgroundColor: '#4F46E5',
              }}
              className="h-full rounded-full transition-all duration-400 ease-out"
            />
          </div>
        </div>

        {/* Step Indicator Circles */}
        <div className="mb-6 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
          <div className="flex items-center justify-between min-w-[480px]">
            {stepLabels.map((s, idx) => {
              const isPassed = s.num < state.currentStep;
              const isActive = s.num === state.currentStep;
              const isFuture = s.num > state.currentStep;

              return (
                <div key={s.num} className="flex items-center flex-1 last:flex-none">
                  <div
                    onClick={() => isPassed && goToStep(s.num as 1 | 2 | 3 | 4 | 5)}
                    className={`flex flex-col items-center gap-1.5 group ${
                      isPassed ? 'cursor-pointer' : ''
                    }`}
                  >
                    {/* Circle */}
                    <div
                      style={{
                        backgroundColor: isPassed
                          ? '#12B76A'
                          : isActive
                          ? '#4F46E5'
                          : '#F1F5F9',
                        color: isPassed || isActive ? '#ffffff' : '#475569',
                        boxShadow: isActive
                          ? '0 0 0 3px rgba(108,94,207,0.2)'
                          : 'none',
                        border: isFuture ? '1px solid #E2E8F0' : 'none',
                      }}
                      className="w-7 h-7 rounded-full flex items-center justify-center font-sans font-bold text-[12px] transition-all duration-200"
                    >
                      {isPassed ? <Check size={13} /> : s.num}
                    </div>

                    {/* Step Label */}
                    <span
                      className={`font-sans text-[11px] font-bold whitespace-nowrap ${
                        isActive
                          ? 'text-[#4F46E5]'
                          : isPassed
                          ? 'text-[#1E293B]'
                          : 'text-[#475569]'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>

                  {/* Connecting Line */}
                  {idx < stepLabels.length - 1 && (
                    <div
                      style={{
                        backgroundColor:
                          s.num < state.currentStep ? '#12B76A' : '#E2E8F0',
                      }}
                      className="h-[2px] flex-1 mx-2 mt-[-18px] transition-colors duration-200"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 md:p-6 shadow-xs">
          {state.currentStep === 1 && (
            <StepPlans
              files={state.files.plans}
              onAddFiles={(f) => handleAddFiles('plans', f)}
              onRemoveFile={(id) => handleRemoveFile('plans', id)}
              onNext={nextStep}
            />
          )}

          {state.currentStep === 2 && (
            <StepCoupes
              files={state.files.coupes}
              onAddFiles={(f) => handleAddFiles('coupes', f)}
              onRemoveFile={(id) => handleRemoveFile('coupes', id)}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {state.currentStep === 3 && (
            <StepFacades
              files={state.files.facades}
              onAddFiles={(f) => handleAddFiles('facades', f)}
              onRemoveFile={(id) => handleRemoveFile('facades', id)}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {state.currentStep === 4 && (
            <StepStructure
              files={state.files.structure}
              onAddFiles={(f) => handleAddFiles('structure', f)}
              onRemoveFile={(id) => handleRemoveFile('structure', id)}
              onNext={nextStep}
              onBack={prevStep}
              onSkip={nextStep}
            />
          )}

          {state.currentStep === 5 && (
            <StepRecap
              files={state.files}
              onBack={prevStep}
              onGoToStep={goToStep}
              onLaunch={handleLaunch}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
};
