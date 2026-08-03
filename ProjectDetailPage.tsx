import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  User,
  MapPin,
  Building2,
  FileText,
  Cpu,
  Calculator,
  FolderOpen,
  Sparkles,
  CheckCircle,
  Layers,
  Calendar,
  ArrowRight,
  ChevronRight,
  Lock,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';
import { AppLayout } from '../../layouts/AppLayout';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';
import { useProjects } from '../../hooks/useProjects';
import { useProjectData, ProjectStepId } from '../../store/ProjectDataContext';

export const ProjectDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id: routeProjectId } = useParams<{ id: string }>();
  const projectId = routeProjectId || '1';

  const { projects } = useProjects();
  const { getProjectMaxReachedStep, devisModePipeline } = useProjectData();

  const project = projects.find((p) => p.id === projectId) || {
    id: projectId,
    name: 'Projet ' + projectId,
    client_name: 'Client N/A',
    location: 'Non spécifié',
    type_batiment: 'Bâtiment standard',
    status: 'draft' as const,
    created_at: new Date().toISOString().split('T')[0],
  };

  const maxReachedStepId = getProjectMaxReachedStep(project.id, project.status);

  const stepsDQE = [
    {
      id: 'upload',
      title: '1. Plans & Documents',
      desc: 'Téléchargement des fichiers PDF / DWG',
      path: `/dashboard/projects/${project.id}/upload`,
      icon: FileText,
    },
    {
      id: 'mode-choix',
      title: '2. Choix du Mode',
      desc: 'Mode A (DQE détaillé) vs Mode B (m² rapide)',
      path: `/projects/${project.id}/mode-choix`,
      icon: Layers,
    },
    {
      id: 'analyse',
      title: '3. Analyse par Vision IA',
      desc: 'Extraction automatique des éléments et cotes',
      path: `/projects/${project.id}/analyse`,
      icon: Cpu,
    },
    {
      id: 'cahier',
      title: '4. Quantités & Cahier de calcul',
      desc: 'Détail et vérification des formules de calcul',
      path: `/projects/${project.id}/cahier-de-calcul`,
      icon: Calculator,
    },
    {
      id: 'dqe',
      title: '5. Tableau DQE',
      desc: 'Quantitatif structuré par lots d’ouvrages',
      path: `/projects/${project.id}/dqe`,
      icon: FolderOpen,
    },
    {
      id: 'devis',
      title: '6. Tarification (Devis)',
      desc: 'Affectation des prix unitaires ou au m²',
      path: `/projects/${project.id}/devis`,
      icon: Sparkles,
    },
    {
      id: 'recap',
      title: '7. Récapitulatif & Export',
      path: `/projects/${project.id}/recap`,
      desc: 'Exportation PDF, Excel et synthèse cabinet',
      icon: CheckCircle,
    },
    {
      id: 'variantes',
      title: '8. Variantes',
      desc: 'Comparatifs d’ouvrages et options',
      path: `/projects/${project.id}/variantes`,
      icon: Layers,
    },
    {
      id: 'historique',
      title: '9. Historique',
      desc: 'Journal des versions et modifications',
      path: `/projects/${project.id}/historique`,
      icon: Calendar,
    },
  ];

  const stepsM2 = [
    {
      id: 'upload',
      title: '1. Plans & Documents',
      desc: 'Téléchargement des fichiers PDF / DWG',
      path: `/dashboard/projects/${project.id}/upload`,
      icon: FileText,
    },
    {
      id: 'mode-choix',
      title: '2. Choix du Mode',
      desc: 'Choix du devis rapide par m²',
      path: `/projects/${project.id}/mode-choix`,
      icon: Layers,
    },
    {
      id: 'analyse',
      title: '3. Analyse par Vision IA',
      desc: 'Extraction des pièces et surfaces',
      path: `/projects/${project.id}/analyse`,
      icon: Cpu,
    },
    {
      id: 'devis',
      title: '4. Devis (m²)',
      desc: 'Saisie des prix au m² par pièce',
      path: `/projects/${project.id}/devis`,
      icon: Sparkles,
    },
    {
      id: 'recap',
      title: '5. Récapitulatif & Export',
      desc: 'Document client final & export PDF',
      path: `/projects/${project.id}/recap`,
      icon: CheckCircle,
    },
  ];

  const pipelineSteps = devisModePipeline === 'm2' ? stepsM2 : stepsDQE;
  const stepIdsOrder = pipelineSteps.map((s) => s.id);
  const maxReachedIndex = stepIdsOrder.indexOf(maxReachedStepId);

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#12B76A';
      case 'processing':
        return '#2A7BDE';
      case 'missing_data':
        return '#E8442A';
      case 'draft':
      default:
        return '#D4D4D8';
    }
  };

  const getStatusBadgeVariant = (status: string): 'done' | 'processing' | 'missing' | 'draft' | 'error' => {
    if (status === 'completed') return 'done';
    if (status === 'processing') return 'processing';
    if (status === 'missing_data') return 'missing';
    if (status === 'draft') return 'draft';
    return 'error';
  };

  const getStatusLabelText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Complété';
      case 'processing':
        return 'En cours d\'analyse';
      case 'missing_data':
        return 'Données manquantes';
      case 'draft':
      default:
        return 'Nouveau / Brouillon';
    }
  };

  // Target current step path
  const currentStepObj = pipelineSteps[Math.max(0, maxReachedIndex)] || pipelineSteps[0];

  return (
    <AppLayout
      currentPath="/dashboard/projects"
      onNavigate={(path) => navigate(path)}
      onNewProject={() => navigate('/dashboard/projects')}
    >
      <div className="space-y-6 font-sans max-w-6xl mx-auto py-2">
        {/* Back Link */}
        <button
          type="button"
          onClick={() => navigate('/dashboard/projects')}
          className="font-semibold text-[12px] text-[#475569] hover:text-[#1E293B] flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Retour à la liste des projets</span>
        </button>

        {/* Header Title & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: getStatusDotColor(project.status),
                }}
                className="rounded-full"
              />
              <span className="font-bold text-[11px] text-[#475569] tracking-wider uppercase">
                Dossier de projet #{project.id}
              </span>
            </div>
            <h1 className="font-black text-[22px] md:text-[26px] tracking-tight text-[#1E293B] mt-1 leading-tight">
              {project.name}
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <Badge variant={getStatusBadgeVariant(project.status)}>
              {getStatusLabelText(project.status)}
            </Badge>

            <button
              type="button"
              onClick={() => navigate(currentStepObj.path)}
              style={{ backgroundColor: '#4F46E5' }}
              className="h-9 px-4 rounded-lg text-white font-semibold text-[13px] flex items-center gap-1.5 hover:opacity-90 transition-all cursor-pointer shadow-xs"
            >
              <span>{project.status === 'completed' ? 'Accéder à l\'Export Final' : 'Continuer (' + currentStepObj.title + ')'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Project Metadata Specs Card */}
        <div style={{ border: '1px solid #E2E8F0' }} className="bg-[#F8FAFC] rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 min-h-[44px]">
            <User size={18} className="text-[#1E293B] flex-shrink-0" />
            <div>
              <span className="block text-[10px] text-[#475569] uppercase font-bold">Client</span>
              <span className="text-[14px] font-semibold text-[#1E293B]">{project.client_name}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 min-h-[44px]">
            <MapPin size={18} className="text-[#1E293B] flex-shrink-0" />
            <div>
              <span className="block text-[10px] text-[#475569] uppercase font-bold">Localisation</span>
              <span className="text-[14px] font-semibold text-[#1E293B]">{project.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 min-h-[44px]">
            <Building2 size={18} className="text-[#1E293B] flex-shrink-0" />
            <div>
              <span className="block text-[10px] text-[#475569] uppercase font-bold">Type d'ouvrage</span>
              <span className="text-[14px] font-semibold text-[#1E293B]">{project.type_batiment}</span>
            </div>
          </div>
        </div>

        {/* Rule Alert Banner for Incomplete Projects */}
        {project.status !== 'completed' && (
          <Alert variant="info">
            <div className="text-[12px] text-[#1E293B] leading-relaxed">
              <span className="font-extrabold block text-[#1E293B] mb-0.5">
                Progression du projet en mode sécurisé
              </span>
              Pour ce projet non encore finalisé, les phases de calcul et de données se débloquent au fur et à mesure que vous complétez chaque étape. Validez l'étape active pour déverrouiller la suivante.
            </div>
          </Alert>
        )}

        {/* Pipeline Progression Modules Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-[14px] text-[#1E293B]">
              Phases d'extraction et traitement
            </h2>
            <span className="text-[11px] font-semibold text-[#475569]">
              {pipelineSteps.length} étapes au total
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {pipelineSteps.map((step, idx) => {
              const IconComponent = step.icon;
              const isReached = maxReachedIndex === -1 ? true : idx <= maxReachedIndex;

              return (
                <div
                  key={step.id}
                  onClick={() => {
                    if (isReached) navigate(step.path);
                  }}
                  style={{
                    border: isReached
                      ? '1px solid #E2E8F0'
                      : '1px solid rgba(0,0,0,0.04)',
                    backgroundColor: isReached ? '#FFFFFF' : '#F8FAFC',
                    opacity: isReached ? 1 : 0.6,
                    cursor: isReached ? 'pointer' : 'not-allowed',
                  }}
                  className={`rounded-xl p-4 flex flex-col justify-between transition-all duration-150 ${
                    isReached ? 'hover:border-[#4F46E5] hover:shadow-xs group' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          isReached
                            ? 'bg-[#EEF2FF] text-[#4F46E5] group-hover:bg-[#4F46E5] group-hover:text-white'
                            : 'bg-[#EFEFEF] text-[#A1A1AA]'
                        }`}
                      >
                        {isReached ? <IconComponent size={16} /> : <Lock size={15} />}
                      </div>

                      {isReached ? (
                        <Badge variant="done">Atteinte</Badge>
                      ) : (
                        <span className="text-[10px] font-bold text-[#A1A1AA] bg-[#EFEFEF] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Lock size={10} />
                          <span>Verrouillée</span>
                        </span>
                      )}
                    </div>

                    <h3 className={`font-extrabold text-[13.5px] mb-0.5 ${isReached ? 'text-[#1E293B] group-hover:text-[#4F46E5]' : 'text-[#475569]'}`}>
                      {step.title}
                    </h3>
                    <p className="text-[11.5px] text-[#475569] leading-snug">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-[rgba(0,0,0,0.06)] flex items-center justify-between text-[11px] font-bold">
                    {isReached ? (
                      <>
                        <span className="text-[#4F46E5]">Ouvrir cette phase</span>
                        <ChevronRight size={13} className="text-[#4F46E5] group-hover:translate-x-0.5 transition-transform" />
                      </>
                    ) : (
                      <span className="text-[#A1A1AA]">Non atteinte</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
