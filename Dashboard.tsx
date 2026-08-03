import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FolderOpen,
  CheckCircle,
  Cpu,
  Crown,
  Plus,
  X,
  Check,
  Search,
  Sparkles,
  Layers,
  Tag,
  Building2,
  Settings,
  CreditCard,
  Bell,
  ArrowRight,
  Info,
  ChevronRight,
  Calendar,
  User,
  MapPin,
  FileText,
  Upload,
  Download
} from 'lucide-react';
import { SparkleIcon } from '../layouts/AppLayout';
import { AppLayout } from '../layouts/AppLayout';
import { Alert } from '../components/ui/Alert';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SkeletonBlock, SkeletonCard } from '../components/ui/SkeletonLoader';
import { useProjects } from '../hooks/useProjects';
import { Project } from '../types';
import { ParametresPage } from './parametres/ParametresPage';
import { AbonnementPage } from './abonnement/AbonnementPage';
import { NouveautesPage } from './nouveautes/NouveautesPage';

export const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // Fetch initial projects using the 800ms loading hook
  const { projects: initialProjects, isLoading } = useProjects();
  const [projectsList, setProjectsList] = useState<Project[]>([]);

  // Update projects state once loaded
  useEffect(() => {
    if (initialProjects && initialProjects.length > 0) {
      setProjectsList(initialProjects);
    }
  }, [initialProjects]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [locationValue, setLocationValue] = useState('');
  const [buildingType, setBuildingType] = useState('Villa / Maison individuelle');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');

  // Toast State
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleOpenModal = () => {
    setProjectName('');
    setClientName('');
    setLocationValue('');
    setBuildingType('Villa / Maison individuelle');
    setDescription('');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      setFormError('Le nom du projet est obligatoire');
      return;
    }

    const newProject: Project = {
      id: String(projectsList.length + 1),
      user_id: 'user_1',
      name: projectName,
      client_name: clientName || 'Client non spécifié',
      location: locationValue || 'Abidjan, Côte d\'Ivoire',
      type_batiment: buildingType,
      status: 'draft',
      missing_data: null,
      metre_data: null,
      analyse_log: null,
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    };

    setProjectsList([newProject, ...projectsList]);
    setIsModalOpen(false);
    triggerToast('Projet créé — uploadez vos documents');
    navigate(`/dashboard/projects/${newProject.id}/upload`);
  };

  // Stats calculation
  const totalProjects = projectsList.length;
  const completedCount = projectsList.filter((p) => p.status === 'completed').length;
  const processingCount = projectsList.filter((p) => p.status === 'processing').length;
  const missingDataCount = projectsList.filter((p) => p.status === 'missing_data').length;

  const getStatusDotColor = (status: Project['status']) => {
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

  const getStatusBadgeVariant = (status: Project['status']): 'done' | 'processing' | 'missing' | 'draft' | 'error' => {
    if (status === 'completed') return 'done';
    if (status === 'processing') return 'processing';
    if (status === 'missing_data') return 'missing';
    if (status === 'draft') return 'draft';
    return 'error';
  };

  const getStatusLabelText = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'Complété';
      case 'processing':
        return 'En cours';
      case 'missing_data':
        return 'Incomplet';
      case 'draft':
      default:
        return 'Brouillon';
    }
  };

  const renderDashboardMain = () => {
    const hasProjects = projectsList.length > 0;

    return (
      <div className="space-y-6">
        {/* Section header with AI Assistant Pill Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-up" style={{ animationDelay: '0ms' }}>
          <div>
            <span className="font-sans font-bold text-[11px] text-[#475569] tracking-widest uppercase block mb-0.5">
              Vue d'ensemble
            </span>
            <h1 className="font-sans font-black text-[22px] tracking-tight text-[#1E293B] leading-none">
              Dashboard
            </h1>
          </div>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('open-assistant'))}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EEF2FF] text-[#4F46E5] border border-[#4F46E5]/20 hover:bg-[#4F46E5] hover:text-white transition-all duration-200 text-xs font-semibold shadow-2xs hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer self-start sm:self-auto"
          >
            <SparkleIcon size={14} />
            <span>Demander à l'assistant</span>
          </button>
        </div>

        {!isLoading && !hasProjects ? (
          /* Empty Dashboard: Central CTA Card & 3-Step Mini Tutorial */
          <div className="animate-fade-up max-w-xl mx-auto py-8">
            <div className="bg-white border-2 border-dashed border-[#4F46E5]/30 rounded-3xl p-8 sm:p-12 text-center shadow-xs">
              <div className="w-16 h-16 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center mx-auto mb-4 relative">
                <FolderOpen size={36} />
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#4F46E5] text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                  +
                </span>
              </div>

              <h2 className="font-sans font-extrabold text-xl text-[#1E293B]">
                Créer votre premier projet
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#475569] mt-2 max-w-sm mx-auto leading-relaxed">
                Analysez votre premier plan et générez un DQE en quelques minutes.
              </p>

              <button
                type="button"
                onClick={handleOpenModal}
                className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-sans font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <Plus size={16} />
                <span>Créer un projet</span>
              </button>
            </div>

            {/* Mini Tutorial - 3 Horizontal Steps */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/80 p-4 rounded-2xl border border-[#E2E8F0] text-center">
                <div className="w-10 h-10 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center mx-auto mb-2">
                  <Upload size={18} />
                </div>
                <p className="font-sans text-xs font-semibold text-[#1E293B]">
                  1. Uploadez votre plan
                </p>
                <p className="font-sans text-[11px] text-[#64748B] mt-0.5">
                  Format PDF ou DWG
                </p>
              </div>

              <div className="bg-white/80 p-4 rounded-2xl border border-[#E2E8F0] text-center">
                <div className="w-10 h-10 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center mx-auto mb-2">
                  <Cpu size={18} />
                </div>
                <p className="font-sans text-xs font-semibold text-[#1E293B]">
                  2. Laissez l'IA analyser
                </p>
                <p className="font-sans text-[11px] text-[#64748B] mt-0.5">
                  Détection des métrés
                </p>
              </div>

              <div className="bg-white/80 p-4 rounded-2xl border border-[#E2E8F0] text-center">
                <div className="w-10 h-10 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center mx-auto mb-2">
                  <Download size={18} />
                </div>
                <p className="font-sans text-xs font-semibold text-[#1E293B]">
                  3. Exportez votre DQE
                </p>
                <p className="font-sans text-[11px] text-[#64748B] mt-0.5">
                  Prêt pour chiffrage
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Grille 4 cartes statistiques */}
            <div
              className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 animate-fade-up"
              style={{ animationDelay: '50ms' }}
            >
              {isLoading ? (
                <>
                  <div className="h-[112px] rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] overflow-hidden flex flex-col justify-between p-4">
                    <div className="flex justify-between items-center">
                      <SkeletonBlock width="32px" height="32px" borderRadius="8px" />
                      <SkeletonBlock width="80px" height="12px" />
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <SkeletonBlock width="40px" height="24px" />
                        <SkeletonBlock width="90px" height="10px" />
                      </div>
                      <SkeletonBlock width="40px" height="40px" borderRadius="999px" />
                    </div>
                  </div>
                  <div className="h-[112px] rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] overflow-hidden flex flex-col justify-between p-4">
                    <div className="flex justify-between items-center">
                      <SkeletonBlock width="32px" height="32px" borderRadius="8px" />
                      <SkeletonBlock width="80px" height="12px" />
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <SkeletonBlock width="40px" height="24px" />
                        <SkeletonBlock width="90px" height="10px" />
                      </div>
                      <SkeletonBlock width="40px" height="30px" />
                    </div>
                  </div>
                  <div className="h-[112px] rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] overflow-hidden flex flex-col justify-between p-4">
                    <div className="flex justify-between items-center">
                      <SkeletonBlock width="32px" height="32px" borderRadius="8px" />
                      <SkeletonBlock width="80px" height="12px" />
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <SkeletonBlock width="40px" height="24px" />
                        <SkeletonBlock width="90px" height="10px" />
                      </div>
                      <SkeletonBlock width="50px" height="25px" />
                    </div>
                  </div>
                  <div className="h-[112px] rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] overflow-hidden flex flex-col justify-between p-4">
                    <div className="flex justify-between items-center">
                      <SkeletonBlock width="32px" height="32px" borderRadius="8px" />
                      <SkeletonBlock width="80px" height="12px" />
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <SkeletonBlock width="80px" height="24px" />
                        <SkeletonBlock width="90px" height="10px" />
                      </div>
                      <SkeletonBlock width="40px" height="40px" borderRadius="999px" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <StatCard
                    label="Projets ce mois"
                    value={totalProjects}
                    subtext={`${10 - totalProjects} restants sur 10`}
                    background="#EEF2FF"
                    iconColor="#4F46E5"
                    iconBg="rgba(108,94,207,0.15)"
                    labelColor="#5348A8"
                    valueColor="#1E293B"
                    subtextColor="#475569"
                    icon={<FolderOpen size={16} />}
                    graphic="ring"
                    graphicColor="#4F46E5"
                    graphicValue={totalProjects * 10}
                  />

                  <StatCard
                    label="Complétés"
                    value={completedCount}
                    subtext="ce mois"
                    background="#EDFAF3"
                    iconColor="#12B76A"
                    iconBg="rgba(18,183,106,0.15)"
                    labelColor="#0A7A47"
                    valueColor="#1E293B"
                    subtextColor="#475569"
                    icon={<CheckCircle size={16} />}
                    graphic="bars"
                    graphicColor="#12B76A"
                  />

                  <StatCard
                    label="En cours d'analyse"
                    value={processingCount}
                    subtext="Résultat dans ~2 min"
                    background="#EBF3FF"
                    iconColor="#2A7BDE"
                    iconBg="rgba(42,123,222,0.15)"
                    labelColor="#1A5BA8"
                    valueColor="#1E293B"
                    subtextColor="#475569"
                    icon={<Cpu size={16} />}
                    graphic="curve"
                    graphicColor="#2A7BDE"
                  />

                  <StatCard
                    label="Plan actuel"
                    value="Découverte"
                    subtext="Passer au Pro — 12 000 FCFA/mois"
                    background="#FDF8EC"
                    iconColor="#D4960A"
                    iconBg="rgba(212,150,10,0.15)"
                    labelColor="#8A6200"
                    valueColor="#1E293B"
                    subtextColor="#475569"
                    icon={<Crown size={16} />}
                    graphic="ring"
                    graphicColor="#D4960A"
                    graphicValue={35}
                  />
                </>
              )}
            </div>

            {/* Bouton "Créer un projet" - Positionné au-dessus de la liste des projets récents */}
            <div className="flex justify-end mb-6 animate-fade-up" style={{ animationDelay: '75ms' }}>
              <button
                type="button"
                onClick={handleOpenModal}
                className="inline-flex items-center gap-2 rounded-full bg-[#4F46E5] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#4338CA] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-sm"
              >
                <Plus size={16} />
                <span>Créer un projet</span>
              </button>
            </div>

            {/* Section Projets récents */}
            <div className="space-y-3">
              <div
                className="flex items-center justify-between animate-fade-up"
                style={{ animationDelay: '100ms' }}
              >
                <h2 className="font-sans font-bold text-[14px] text-[#1E293B]">
                  Projets récents
                </h2>
                <button
                  onClick={() => navigate('/dashboard/projects')}
                  className="font-sans font-semibold text-[12px] text-[#4F46E5] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Voir tout</span>
                  <ArrowRight size={12} />
                </button>
              </div>

              <div
                className="space-y-2 animate-fade-up"
                style={{ animationDelay: '150ms' }}
              >
                {isLoading ? (
                  <>
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                  </>
                ) : (
                  <>
                    {projectsList.map((project) => (
                      <div
                        key={project.id}
                        onClick={() => navigate(`/dashboard/projects/${project.id}`)}
                        style={{ border: '1px solid #E2E8F0' }}
                        className="bg-[#F8FAFC] rounded-xl p-3 flex flex-row items-center justify-between gap-3 hover:border-[#D4D4D8] hover:bg-[#F1F5F9] transition-all duration-150 cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: getStatusDotColor(project.status),
                            }}
                            className="rounded-full flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="block font-sans font-semibold text-[13px] text-[#1E293B] truncate">
                              {project.name}
                            </span>
                            <span className="block font-sans text-[11px] text-[#475569] mt-0.5 truncate">
                              {project.client_name} · {project.created_at} · {project.status === 'completed' ? '8' : project.status === 'processing' ? '12' : project.status === 'missing_data' ? '5' : '0'} documents
                            </span>
                          </div>
                        </div>
                        
                        <Badge variant={getStatusBadgeVariant(project.status)}>
                          {getStatusLabelText(project.status)}
                        </Badge>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderProjectsView = () => {
    return (
      <div className="space-y-6">
        <div>
          <span className="font-sans font-bold text-[11px] text-[#475569] tracking-widest uppercase block mb-0.5">
            Gestion du cabinet
          </span>
          <h1 className="font-sans font-black text-[22px] tracking-tight text-[#1E293B] leading-none">
            Mes projets
          </h1>
        </div>

        <div className="flex gap-2 w-full max-w-md bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 items-center">
          <Search size={14} className="text-[#475569]" />
          <input
            type="text"
            placeholder="Rechercher un projet..."
            className="bg-transparent border-none outline-none font-sans text-[12.5px] text-[#1E293B] w-full placeholder:text-[#A1A1AA]"
          />
        </div>

        <div className="space-y-2">
          {projectsList.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate(`/dashboard/projects/${project.id}`)}
              style={{ border: '1px solid #E2E8F0' }}
              className="bg-[#F8FAFC] rounded-xl p-3.5 flex items-center justify-between hover:border-[#D4D4D8] hover:bg-[#F1F5F9] transition-all duration-150 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: getStatusDotColor(project.status),
                  }}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-sans font-bold text-[13.5px] text-[#1E293B]">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-[#475569]">
                    <span>{project.client_name}</span>
                    <span>•</span>
                    <span>{project.location}</span>
                    <span>•</span>
                    <span>{project.type_batiment}</span>
                  </div>
                </div>
              </div>
              <Badge variant={getStatusBadgeVariant(project.status)}>
                {getStatusLabelText(project.status)}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProjectDetailView = (id: string) => {
    const project = projectsList.find((p) => p.id === id) || projectsList[0];
    if (!project) return null;

    const pipelineSteps = [
      {
        id: 'upload',
        title: '1. Plans & Documents',
        desc: 'Upload des fichiers PDF / DWG',
        status: 'Complété',
        statusVariant: 'done' as const,
        path: `/dashboard/projects/${project.id}/upload`,
        icon: FileText,
      },
      {
        id: 'analyse',
        title: '2. Analyse par Vision IA',
        desc: 'Extraction automatique des éléments',
        status: 'Terminé',
        statusVariant: 'done' as const,
        path: `/projects/${project.id}/analyse`,
        icon: Cpu,
      },
      {
        id: 'cahier',
        title: '3. Cahier de calcul',
        desc: 'Détail et vérification des formules',
        status: 'Vérifié',
        statusVariant: 'done' as const,
        path: `/projects/${project.id}/cahier-de-calcul`,
        icon: Calendar,
      },
      {
        id: 'dqe',
        title: '4. DQE (Quantitatif & Estimatif)',
        desc: 'Tableau structuré par lots',
        status: 'Prêt',
        statusVariant: 'done' as const,
        path: `/projects/${project.id}/dqe`,
        icon: FolderOpen,
      },
      {
        id: 'devis',
        title: '5. Tarification (Mode A / Mode B)',
        desc: 'Saisie prix unitaires ou prix au m²',
        status: 'Prêt',
        statusVariant: 'done' as const,
        path: `/projects/${project.id}/devis`,
        icon: Sparkles,
      },
      {
        id: 'recap',
        title: '6. Récapitulatif & Export',
        desc: 'Aperçu document, cabinet & export PDF/Excel',
        status: 'Nouveau',
        statusVariant: 'done' as const,
        path: `/projects/${project.id}/recap`,
        icon: CheckCircle,
      },
      {
        id: 'variantes',
        title: '7. Variantes & Optimisations',
        desc: 'Changements de matériaux & comparatifs',
        status: 'Optionnel',
        statusVariant: 'processing' as const,
        path: `/projects/${project.id}/variantes`,
        icon: Layers,
      },
      {
        id: 'historique',
        title: '8. Historique & Traçabilité',
        desc: 'Journal d’activités et versions',
        status: 'Actif',
        statusVariant: 'done' as const,
        path: `/projects/${project.id}/historique`,
        icon: Calendar,
      },
    ];

    return (
      <div className="space-y-6 font-sans">
        {/* Back link */}
        <button
          type="button"
          onClick={() => navigate('/dashboard/projects')}
          className="font-sans font-semibold text-[12px] text-[#475569] hover:text-[#1E293B] flex items-center gap-1 cursor-pointer"
        >
          <span>← Retour à la liste des projets</span>
        </button>

        {/* Detail header */}
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
              <span className="font-sans font-bold text-[11px] text-[#475569] tracking-wider uppercase">
                Projet en cours
              </span>
            </div>
            <h1 className="font-sans font-black text-[22px] tracking-tight text-[#1E293B] mt-1 leading-tight">
              {project.name}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusBadgeVariant(project.status)}>
              {getStatusLabelText(project.status)}
            </Badge>
            <button
              type="button"
              onClick={() => navigate(`/projects/${project.id}/recap`)}
              style={{ backgroundColor: '#4F46E5' }}
              className="h-8 px-3.5 rounded-full text-white font-semibold text-[12px] flex items-center gap-1 hover:opacity-95 transition-all cursor-pointer shadow-xs font-sans"
            >
              <span>Accéder à l'Export Final</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Specs Card */}
        <div style={{ border: '1px solid #E2E8F0' }} className="bg-[#F8FAFC] rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <User size={16} className="text-[#4F46E5]" />
            <div>
              <span className="block font-sans text-[10px] text-[#475569] uppercase font-bold">Client</span>
              <span className="font-sans text-[13px] font-semibold text-[#1E293B]">{project.client_name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <MapPin size={16} className="text-[#4F46E5]" />
            <div>
              <span className="block font-sans text-[10px] text-[#475569] uppercase font-bold">Localisation</span>
              <span className="font-sans text-[13px] font-semibold text-[#1E293B]">{project.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Building2 size={16} className="text-[#4F46E5]" />
            <div>
              <span className="block font-sans text-[10px] text-[#475569] uppercase font-bold">Type</span>
              <span className="font-sans text-[13px] font-semibold text-[#1E293B]">{project.type_batiment}</span>
            </div>
          </div>
        </div>

        {/* Pipeline & Steps Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-sans font-bold text-[14px] text-[#1E293B]">
              Étapes du projet & Moteurs Métrio
            </h2>
            <span className="text-[11px] font-semibold text-[#475569]">
              8 modules disponibles
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {pipelineSteps.map((step) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.id}
                  onClick={() => navigate(step.path)}
                  style={{ border: '1px solid #E2E8F0' }}
                  className="bg-white rounded-xl p-3.5 flex flex-col justify-between hover:border-[#4F46E5] hover:shadow-xs transition-all duration-150 cursor-pointer group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center group-hover:bg-[#4F46E5] group-hover:text-white transition-colors">
                        <IconComponent size={16} />
                      </div>
                      <Badge variant={step.statusVariant}>{step.status}</Badge>
                    </div>
                    <h3 className="font-sans font-extrabold text-[13px] text-[#1E293B] mb-0.5 group-hover:text-[#4F46E5] transition-colors">
                      {step.title}
                    </h3>
                    <p className="font-sans text-[11px] text-[#475569] leading-snug">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[rgba(0,0,0,0.06)] flex items-center justify-between text-[11px] font-bold text-[#4F46E5]">
                    <span>Ouvrir la phase</span>
                    <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderMaterialsView = () => {
    const materials = [
      { name: 'Béton C25/30 pour fondation', category: 'Gros Œuvre', unit: 'm3', ratio: '350 kg ciment/m3' },
      { name: 'Brique creuse de 20cm', category: 'Maçonnerie', unit: 'm2', ratio: '12.5 briques/m2' },
      { name: 'Enduit ciment extérieur', category: 'Finitions', unit: 'm2', ratio: '1.5 cm épaisseur' },
      { name: 'Acier haute adhérence HA12', category: 'Armatures', unit: 'kg', ratio: '75 kg/m3' },
      { name: 'Carrelage grès cérame 60x60', category: 'Revêtement', unit: 'm2', ratio: 'Mortier colle inclus' },
    ];

    return (
      <div className="space-y-6">
        <div>
          <span className="font-sans font-bold text-[11px] text-[#475569] tracking-widest uppercase block mb-0.5">
            Bibliothèque
          </span>
          <h1 className="font-sans font-black text-[22px] tracking-tight text-[#1E293B] leading-none">
            Matériaux
          </h1>
        </div>

        <div style={{ border: '1px solid #E2E8F0' }} className="bg-[#F8FAFC] rounded-2xl overflow-x-auto min-w-0 w-full">
          <table className="w-full text-left border-collapse font-sans text-[12.5px] min-w-[500px]">
            <thead>
              <tr style={{ borderBottom: '1px solid #E2E8F0' }} className="bg-[#F1F5F9] text-[#475569] font-bold text-[11px] uppercase tracking-wider">
                <th className="p-3">Nom du matériau</th>
                <th className="p-3">Catégorie</th>
                <th className="p-3">Unité</th>
                <th className="p-3 text-right">Ratio par défaut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,0,0,0.06)]">
              {materials.map((mat, idx) => (
                <tr key={idx} className="hover:bg-[#F1F5F9]">
                  <td className="p-3 font-semibold text-[#1E293B]">{mat.name}</td>
                  <td className="p-3 text-[#475569]">{mat.category}</td>
                  <td className="p-3"><span className="bg-[#EFEFEF] px-1.5 py-0.5 rounded text-[11px] font-bold text-[#52525B]">{mat.unit}</span></td>
                  <td className="p-3 text-right font-medium text-[#1E293B]">{mat.ratio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderPricesView = () => {
    const prices = [
      { designation: 'Fouilles en rigoles dans terrain ferme', unit: 'm3', price: '4 500' },
      { designation: 'Béton de propreté dosé à 150 kg/m3', unit: 'm3', price: '65 000' },
      { designation: 'Béton armé pour semelles de fondations', unit: 'm3', price: '145 000' },
      { designation: 'Maçonnerie d\'agglo de 20x20x40 posé au mortier', unit: 'm2', price: '11 500' },
      { designation: 'Chape de mortier de ciment taloché fin', unit: 'm2', price: '6 800' },
    ];

    return (
      <div className="space-y-6">
        <div>
          <span className="font-sans font-bold text-[11px] text-[#475569] tracking-widest uppercase block mb-0.5">
            Bibliothèque de prix
          </span>
          <h1 className="font-sans font-black text-[22px] tracking-tight text-[#1E293B] leading-none">
            Mes prix unitaires
          </h1>
        </div>

        <div style={{ border: '1px solid #E2E8F0' }} className="bg-[#F8FAFC] rounded-2xl overflow-x-auto min-w-0 w-full">
          <table className="w-full text-left border-collapse font-sans text-[12.5px] min-w-[500px]">
            <thead>
              <tr style={{ borderBottom: '1px solid #E2E8F0' }} className="bg-[#F1F5F9] text-[#475569] font-bold text-[11px] uppercase tracking-wider">
                <th className="p-3">Désignation des ouvrages</th>
                <th className="p-3">Unité</th>
                <th className="p-3 text-right">Prix Unitaire (FCFA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,0,0,0.06)]">
              {prices.map((p, idx) => (
                <tr key={idx} className="hover:bg-[#F1F5F9]">
                  <td className="p-3 font-semibold text-[#1E293B]">{p.designation}</td>
                  <td className="p-3"><span className="bg-[#EFEFEF] px-1.5 py-0.5 rounded text-[11px] font-bold text-[#52525B]">{p.unit}</span></td>
                  <td className="p-3 text-right font-black text-[#4F46E5]">{p.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderCabinetView = () => {
    return (
      <div className="space-y-6">
        <div>
          <span className="font-sans font-bold text-[11px] text-[#475569] tracking-widest uppercase block mb-0.5">
            Compte d'entreprise
          </span>
          <h1 className="font-sans font-black text-[22px] tracking-tight text-[#1E293B] leading-none">
            Mon cabinet d'études
          </h1>
        </div>

        <div style={{ border: '1px solid #E2E8F0' }} className="bg-[#F8FAFC] rounded-2xl p-5 space-y-4 max-w-xl">
          <div className="flex items-center gap-4 border-b border-[#E2E8F0] pb-4">
            <div className="w-14 h-14 bg-[#EEF2FF] text-[#4F46E5] font-bold text-lg rounded-xl flex items-center justify-center">
              D&A
            </div>
            <div>
              <h3 className="font-sans font-bold text-[15px] text-[#1E293B]">Diallo & Associés</h3>
              <p className="font-sans text-[11px] text-[#475569]">Bureau de métré et économie de la construction</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-[12.5px]">
            <div>
              <span className="block text-[#475569] font-medium">Adresse de facturation</span>
              <span className="font-semibold text-[#1E293B]">Abidjan, Cocody Mermoz</span>
            </div>
            <div>
              <span className="block text-[#475569] font-medium">Numéro de TVA</span>
              <span className="font-semibold text-[#1E293B]">CI-ABJ-2026-B-12</span>
            </div>
            <div>
              <span className="block text-[#475569] font-medium">Taux de TVA par défaut</span>
              <span className="font-semibold text-[#1E293B]">18 %</span>
            </div>
            <div>
              <span className="block text-[#475569] font-medium">Monnaie préférée</span>
              <span className="font-semibold text-[#1E293B]">FCFA (XOF)</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSubscriptionView = () => {
    return (
      <div className="space-y-6">
        <div>
          <span className="font-sans font-bold text-[11px] text-[#475569] tracking-widest uppercase block mb-0.5">
            Options & Tarifs
          </span>
          <h1 className="font-sans font-black text-[22px] tracking-tight text-[#1E293B] leading-none">
            Mon abonnement
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
          {/* Plan Découverte */}
          <div style={{ border: '2px solid #4F46E5' }} className="bg-white rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-[280px]">
            <span className="absolute top-3 right-3 bg-[#EEF2FF] text-[#4F46E5] text-[9px] font-black tracking-wider uppercase px-2 py-1 rounded-full">
              Plan Actuel
            </span>
            <div>
              <h3 className="font-sans font-black text-[18px] text-[#1E293B]">Plan Découverte</h3>
              <p className="font-sans text-[11px] text-[#475569] mt-1">Idéal pour tester l'analyse de plans par IA</p>
              <div className="mt-4">
                <span className="font-sans font-black text-[28px] text-[#1E293B]">Gratuit</span>
              </div>
              <ul className="mt-4 space-y-2 text-[11.5px] text-[#475569]">
                <li className="flex items-center gap-1.5">
                  <Check size={14} className="text-[#12B76A]" />
                  <span>Analyse automatique (jusqu'à 10 projets/mois)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check size={14} className="text-[#12B76A]" />
                  <span>Métrés quantitatifs et estimatifs standards</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Plan Pro */}
          <div style={{ border: '1px solid #E2E8F0' }} className="bg-[#F8FAFC] rounded-2xl p-5 flex flex-col justify-between h-[280px]">
            <div>
              <h3 className="font-sans font-black text-[18px] text-[#1E293B]">Plan Pro</h3>
              <p className="font-sans text-[11px] text-[#475569] mt-1">Pour les architectes et bureaux d'études professionnels</p>
              <div className="mt-4">
                <span className="font-sans font-black text-[28px] text-[#4F46E5]">12 000 FCFA</span>
                <span className="font-sans text-[11px] text-[#475569] ml-1">/ mois</span>
              </div>
              <ul className="mt-4 space-y-2 text-[11.5px] text-[#475569]">
                <li className="flex items-center gap-1.5">
                  <Check size={14} className="text-[#12B76A]" />
                  <span>Projets illimités sans restriction</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check size={14} className="text-[#12B76A]" />
                  <span>Exportation Excel et BIM compatible</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check size={14} className="text-[#12B76A]" />
                  <span>Support prioritaire par ingénieurs spécialisés</span>
                </li>
              </ul>
            </div>
            <Button variant="primary" className="w-full mt-3">
              Passer au Plan Pro
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderNotificationsView = () => {
    const notifications = [
      { id: 1, title: 'Analyse complétée', text: 'Le métré automatique pour la Villa Koné est prêt à être téléchargé.', date: 'Aujourd\'hui', read: false },
      { id: 2, title: 'Pièces manquantes signalées', text: 'Une coupe transversale ou des détails de fondations manquent sur le projet de Kara.', date: 'Hier', read: false },
      { id: 3, title: 'Bienvenue sur Métrio', text: 'Votre compte Découverte est actif. Profitez de 10 calculs offerts ce mois-ci.', date: 'Il y a 3 jours', read: true },
    ];

    return (
      <div className="space-y-6">
        <div>
          <span className="font-sans font-bold text-[11px] text-[#475569] tracking-widest uppercase block mb-0.5">
            Actualités
          </span>
          <h1 className="font-sans font-black text-[22px] tracking-tight text-[#1E293B] leading-none">
            Notifications
          </h1>
        </div>

        <div className="space-y-2 max-w-xl">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              style={{ border: '1px solid #E2E8F0' }}
              className={`rounded-xl p-3 flex gap-3 items-start ${notif.read ? 'bg-[#F8FAFC]' : 'bg-[#EEF2FF]/40'}`}
            >
              <div style={{ backgroundColor: notif.read ? '#EFEFEF' : '#EEF2FF' }} className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bell size={14} className={notif.read ? 'text-[#475569]' : 'text-[#4F46E5]'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-sans font-bold text-[13px] text-[#1E293B] truncate">{notif.title}</h3>
                  <span className="font-sans text-[10px] text-[#475569]">{notif.date}</span>
                </div>
                <p className="font-sans text-[12px] text-[#52525B] mt-0.5 leading-normal">{notif.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderNewsView = () => {
    return (
      <div className="space-y-6">
        <div>
          <span className="font-sans font-bold text-[11px] text-[#475569] tracking-widest uppercase block mb-0.5">
            Historique des mises à jour
          </span>
          <h1 className="font-sans font-black text-[22px] tracking-tight text-[#1E293B] leading-none">
            Nouveautés
          </h1>
        </div>

        <div className="space-y-6 max-w-xl relative pl-4 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E2E8F0]">
          {/* Update 1 */}
          <div className="relative">
            <span style={{ backgroundColor: '#4F46E5' }} className="absolute -left-[13px] top-1.5 w-3 h-3 rounded-full border-2 border-white" />
            <div className="pl-3">
              <span className="font-sans text-[10px] font-bold text-[#4F46E5] tracking-wide uppercase">Version 1.2 — Juillet 2026</span>
              <h3 className="font-sans font-bold text-[14px] text-[#1E293B] mt-0.5">Calcul estimatif automatisé</h3>
              <p className="font-sans text-[12px] text-[#52525B] mt-1 leading-normal">
                Notre intelligence artificielle peut désormais estimer le montant total HT d'un ouvrage à partir de vos bibliothèques de prix unitaires et des quantités calculées automatiquement sur vos plans PDF.
              </p>
            </div>
          </div>

          {/* Update 2 */}
          <div className="relative">
            <span style={{ backgroundColor: '#475569' }} className="absolute -left-[13px] top-1.5 w-3 h-3 rounded-full border-2 border-white" />
            <div className="pl-3">
              <span className="font-sans text-[10px] font-bold text-[#475569] tracking-wide uppercase">Version 1.0 — Juin 2026</span>
              <h3 className="font-sans font-bold text-[14px] text-[#1E293B] mt-0.5">Lancement officiel de Métrio</h3>
              <p className="font-sans text-[12px] text-[#52525B] mt-1 leading-normal">
                Bienvenue sur Métrio ! Bénéficiez de la puissance du traitement d'images assisté par IA pour automatiser la corvée du métré. Importez vos plans de niveau, coupes, élévations et façades au format PDF.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (currentPath === '/dashboard') return renderDashboardMain();
    if (currentPath === '/dashboard/projects') return renderProjectsView();
    if (currentPath.startsWith('/dashboard/projects/')) {
      const parts = currentPath.split('/');
      const id = parts[parts.length - 1];
      return renderProjectDetailView(id);
    }
    if (currentPath === '/dashboard/materials') return renderMaterialsView();
    if (currentPath === '/dashboard/prices') return renderPricesView();
    if (currentPath === '/dashboard/cabinet') return renderCabinetView();
    if (currentPath === '/dashboard/settings' || currentPath === '/dashboard/cabinet') return renderCabinetView();
    if (currentPath === '/dashboard/subscription') return <AbonnementPage />;
    if (currentPath === '/dashboard/notifications') return renderNotificationsView();
    if (currentPath === '/dashboard/news') return <NouveautesPage />;

    // Default main dashboard
    return renderDashboardMain();
  };

  return (
    <AppLayout
      currentPath={currentPath}
      onNavigate={(path) => navigate(path)}
      onNewProject={handleOpenModal}
    >
      {renderContent()}

      {/* Modal Nouveau projet */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay background */}
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity"
          />

          {/* Modal Content Box */}
          <div className="bg-white rounded-[14px] p-6 w-[480px] max-w-[calc(100vw-32px)] relative z-10 shadow-2xl animate-[modalEnter_240ms_cubic-bezier(0.23,1,0.32,1)_forward]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-sans font-black text-[18px] text-[#1E293B]">
                Créer un projet
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateProjectSubmit} className="space-y-4">
              {formError && (
                <Alert variant="error">
                  {formError}
                </Alert>
              )}

              {/* Champ Nom du projet */}
              <div>
                <label className="block font-sans font-bold text-[11px] text-[#475569] uppercase mb-1">
                  Nom du projet <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Villa résidentielle R+2"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full h-[34px] px-3 font-sans text-[13px] bg-white border border-[rgba(0,0,0,0.12)] focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none rounded-lg text-[#1E293B] placeholder:text-[#A1A1AA] transition-all"
                />
              </div>

              {/* Champ Nom du client */}
              <div>
                <label className="block font-sans font-bold text-[11px] text-[#475569] uppercase mb-1">
                  Nom du client
                </label>
                <input
                  type="text"
                  placeholder="M. Koné"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full h-[34px] px-3 font-sans text-[13px] bg-white border border-[rgba(0,0,0,0.12)] focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none rounded-lg text-[#1E293B] placeholder:text-[#A1A1AA] transition-all"
                />
              </div>

              {/* Champ Localisation */}
              <div>
                <label className="block font-sans font-bold text-[11px] text-[#475569] uppercase mb-1">
                  Localisation
                </label>
                <input
                  type="text"
                  placeholder="Abidjan, Côte d'Ivoire"
                  value={locationValue}
                  onChange={(e) => setLocationValue(e.target.value)}
                  className="w-full h-[34px] px-3 font-sans text-[13px] bg-white border border-[rgba(0,0,0,0.12)] focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none rounded-lg text-[#1E293B] placeholder:text-[#A1A1AA] transition-all"
                />
              </div>

              {/* Select Type de bâtiment */}
              <div>
                <label className="block font-sans font-bold text-[11px] text-[#475569] uppercase mb-1">
                  Type de bâtiment
                </label>
                <select
                  value={buildingType}
                  onChange={(e) => setBuildingType(e.target.value)}
                  className="w-full h-[34px] px-2 font-sans text-[13px] bg-white border border-[rgba(0,0,0,0.12)] focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none rounded-lg text-[#1E293B] transition-all cursor-pointer"
                >
                  <option value="Villa / Maison individuelle">Villa / Maison individuelle</option>
                  <option value="Immeuble">Immeuble</option>
                  <option value="Bâtiment public">Bâtiment public</option>
                  <option value="Entrepôt / Industriel">Entrepôt / Industriel</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              {/* Champ Description */}
              <div>
                <label className="block font-sans font-bold text-[11px] text-[#475569] uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Informations complémentaires..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 font-sans text-[13px] bg-white border border-[rgba(0,0,0,0.12)] focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none rounded-lg text-[#1E293B] placeholder:text-[#A1A1AA] resize-none transition-all"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[rgba(0,0,0,0.06)]">
                <Button
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Annuler
                </Button>
                <button
                  type="submit"
                  style={{ backgroundColor: '#4F46E5' }}
                  className="h-8 px-[14px] rounded-full font-sans font-semibold text-[13px] text-white hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Créer le projet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showToast && (
        <div
          style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}
          className="fixed bottom-6 right-6 z-[60] bg-[#1E293B] text-white rounded-xl py-3 px-4 flex items-center gap-3 animate-[toastEnter_240ms_cubic-bezier(0.23,1,0.32,1)_forward]"
        >
          <div className="w-5 h-5 bg-[#12B76A] rounded-full flex items-center justify-center flex-shrink-0">
            <Check size={12} className="text-white font-bold" />
          </div>
          <span className="font-sans font-semibold text-[13px] leading-none">
            {toastMessage}
          </span>
        </div>
      )}

      {/* Animation classes stylesheet */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: none; }
        }
        
        .animate-fade-up {
          animation: fadeUp 280ms cubic-bezier(0.21, 1.02, 0.43, 1.01) forwards;
          opacity: 0;
        }

        @keyframes modalEnter {
          from { opacity: 0; transform: translate(-50%, -46%) scale(0.96); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }

        @keyframes toastEnter {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-up,
          animate-[modalEnter_240ms_cubic-bezier(0.23,1,0.32,1)_forward],
          animate-[toastEnter_240ms_cubic-bezier(0.23,1,0.32,1)_forward] {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </AppLayout>
  );
};
