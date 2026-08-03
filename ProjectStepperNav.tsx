import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Upload,
  Cpu,
  Calculator,
  FileSpreadsheet,
  Tag,
  FileCheck2,
  GitFork,
  History,
  Lock,
} from 'lucide-react';
import { useProjectData, ProjectStepId } from '../store/ProjectDataContext';

interface ProjectStepperNavProps {
  projectId: string;
}

export const ProjectStepperNav: React.FC<ProjectStepperNavProps> = ({ projectId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { devisModePipeline, getProjectMaxReachedStep } = useProjectData();

  const maxReachedStepId = getProjectMaxReachedStep(projectId);

  const stepsDQE = [
    {
      id: 'upload',
      label: '1. Plans',
      path: `/dashboard/projects/${projectId}/upload`,
      icon: Upload,
    },
    {
      id: 'analyse',
      label: '2. Analyse IA',
      path: `/projects/${projectId}/analyse`,
      icon: Cpu,
    },
    {
      id: 'cahier',
      label: '3. Quantités',
      path: `/projects/${projectId}/cahier-de-calcul`,
      icon: Calculator,
    },
    {
      id: 'dqe',
      label: '4. DQE',
      path: `/projects/${projectId}/dqe`,
      icon: FileSpreadsheet,
    },
    {
      id: 'devis',
      label: '5. Tarification',
      path: `/projects/${projectId}/devis`,
      icon: Tag,
    },
    {
      id: 'recap',
      label: '6. Récap & Export',
      path: `/projects/${projectId}/recap`,
      icon: FileCheck2,
    },
    {
      id: 'variantes',
      label: '7. Variantes',
      path: `/projects/${projectId}/variantes`,
      icon: GitFork,
    },
    {
      id: 'historique',
      label: '8. Historique',
      path: `/projects/${projectId}/historique`,
      icon: History,
    },
  ];

  const stepsM2 = [
    {
      id: 'upload',
      label: '1. Plans',
      path: `/dashboard/projects/${projectId}/upload`,
      icon: Upload,
    },
    {
      id: 'analyse',
      label: '2. Analyse IA',
      path: `/projects/${projectId}/analyse`,
      icon: Cpu,
    },
    {
      id: 'devis',
      label: '3. Devis (m²)',
      path: `/projects/${projectId}/devis`,
      icon: Tag,
    },
    {
      id: 'recap',
      label: '4. Récap & Export',
      path: `/projects/${projectId}/recap`,
      icon: FileCheck2,
    },
  ];

  const steps = devisModePipeline === 'm2' ? stepsM2 : stepsDQE;

  const stepIdsOrder = steps.map((s) => s.id);
  const maxReachedIndex = stepIdsOrder.indexOf(maxReachedStepId as string);

  const isActive = (stepPath: string) => {
    return currentPath === stepPath || currentPath.endsWith(stepPath.replace(`/projects/${projectId}`, ''));
  };

  return (
    <div className="w-full bg-white border-b border-[#E2E8F0] mb-6 py-2 px-1 overflow-x-auto scrollbar-none font-sans">
      <div className="flex items-center gap-1.5 min-w-max">
        {steps.map((step, idx) => {
          const active = isActive(step.path);
          const Icon = step.icon;
          // Step is reached if its index is <= maxReachedIndex (or if maxReached is unknown/completed)
          const isReached = maxReachedIndex === -1 ? true : idx <= maxReachedIndex;

          return (
            <button
              key={step.id}
              type="button"
              disabled={!isReached}
              onClick={() => {
                if (isReached) navigate(step.path);
              }}
              title={
                isReached
                  ? step.label
                  : 'Étape non encore atteinte — validez les étapes précédentes pour y accéder'
              }
              style={{
                backgroundColor: active
                  ? '#4F46E5'
                  : isReached
                  ? '#F8FAFC'
                  : '#F1F5F9',
                color: active
                  ? '#FFFFFF'
                  : isReached
                  ? '#1E293B'
                  : '#A1A1AA',
                border: active
                  ? '1px solid #4F46E5'
                  : isReached
                  ? '1px solid #E2E8F0'
                  : '1px solid rgba(0,0,0,0.04)',
                opacity: isReached ? 1 : 0.6,
                cursor: isReached ? 'pointer' : 'not-allowed',
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold transition-all shadow-2xs ${
                isReached ? 'hover:border-[#4F46E5]/40' : ''
              }`}
            >
              {!isReached ? (
                <Lock size={12} className="text-[#A1A1AA]" />
              ) : (
                <Icon size={13} className={active ? 'text-white' : 'text-[#475569]'} />
              )}
              <span>{step.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
