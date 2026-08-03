import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderOpen,
  Plus,
  X,
  Search,
  Building2,
  MapPin,
  User,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { AppLayout } from '../../layouts/AppLayout';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';
import { SkeletonCard } from '../../components/ui/SkeletonLoader';
import { useProjects } from '../../hooks/useProjects';
import { Project } from '../../types';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { projects: initialProjects, isLoading } = useProjects();
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [locationValue, setLocationValue] = useState('');
  const [buildingType, setBuildingType] = useState('Villa / Maison individuelle');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (initialProjects && initialProjects.length > 0) {
      setProjectsList(initialProjects);
    }
  }, [initialProjects]);

  const handleOpenModal = () => {
    setProjectName('');
    setClientName('');
    setLocationValue('');
    setBuildingType('Villa / Maison individuelle');
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
      id: String(projectsList.length + 10),
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
      updated_at: new Date().toISOString().split('T')[0],
    };

    setProjectsList([newProject, ...projectsList]);
    setIsModalOpen(false);
    navigate(`/dashboard/projects/${newProject.id}/upload`);
  };

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

  const getStatusBadgeVariant = (
    status: Project['status']
  ): 'done' | 'processing' | 'missing' | 'draft' | 'error' => {
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

  const filteredProjects = projectsList.filter((p) => {
    const matchesQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterStatus === 'all') return matchesQuery;
    return matchesQuery && p.status === filterStatus;
  });

  return (
    <AppLayout
      currentPath="/dashboard/projects"
      onNavigate={(path) => navigate(path)}
      onNewProject={handleOpenModal}
    >
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="font-bold text-[11px] text-[#475569] tracking-widest uppercase block mb-0.5">
              Gestion du cabinet
            </span>
            <h1 className="font-black text-[22px] tracking-tight text-[#1E293B] leading-none">
              Mes projets
            </h1>
            <p className="text-[13px] text-[#475569] mt-1">
              Consultez, gérez et poursuivez vos dossiers de métré
            </p>
          </div>

          <button
            onClick={handleOpenModal}
            style={{ backgroundColor: '#4F46E5' }}
            className="h-9 px-4 rounded-full text-white font-semibold text-[13px] flex items-center gap-1.5 hover:opacity-90 transition-all cursor-pointer shadow-xs self-start md:self-auto"
          >
            <Plus size={15} />
            <span>Nouveau projet</span>
          </button>
        </div>

        {/* Filters and search bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 rounded-xl">
          <div className="flex items-center gap-2 flex-1 bg-white border border-[rgba(0,0,0,0.12)] rounded-lg px-3 py-1.5">
            <Search size={15} className="text-[#475569]" />
            <input
              type="text"
              placeholder="Rechercher par projet, client ou lieu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[13px] text-[#1E293B] w-full placeholder:text-[#A1A1AA]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#475569] hover:text-[#1E293B] cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[11px] font-bold text-[#475569] uppercase mr-1 hidden lg:inline">
              Filtre:
            </span>
            {[
              { id: 'all', label: 'Tous' },
              { id: 'completed', label: 'Complétés' },
              { id: 'processing', label: 'En cours' },
              { id: 'missing_data', label: 'Incomplets' },
              { id: 'draft', label: 'Brouillons' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                style={{
                  backgroundColor: filterStatus === f.id ? '#4F46E5' : '#FFFFFF',
                  color: filterStatus === f.id ? '#FFFFFF' : '#475569',
                  border:
                    filterStatus === f.id
                      ? '1px solid #4F46E5'
                      : '1px solid #E2E8F0',
                }}
                className="px-3 py-1 rounded-full text-[11.5px] font-bold transition-all duration-200 active:scale-[0.97] cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/30"
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects List Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : filteredProjects.length === 0 ? (
            <div className="col-span-2 lg:col-span-4 bg-[#F8FAFC] border border-dashed border-[rgba(0,0,0,0.12)] rounded-2xl p-8 text-center">
              <FolderOpen size={32} className="mx-auto text-[#A1A1AA] mb-2" />
              <h3 className="font-bold text-[14px] text-[#1E293B]">
                Aucun projet trouvé
              </h3>
              <p className="text-[12px] text-[#475569] mt-1 max-w-sm mx-auto">
                Modifiez vos termes de recherche ou créez un nouveau projet pour commencer.
              </p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/dashboard/projects/${project.id}`)}
                style={{ border: '1px solid #E2E8F0' }}
                className="bg-white rounded-xl p-3.5 sm:p-4 flex flex-col justify-between hover:border-[#CBD5E1] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-200 active:scale-[0.99] cursor-pointer group min-h-[170px]"
              >
                <div>
                  {/* Top status & badge */}
                  <div className="flex items-center justify-between gap-1.5 mb-2.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: getStatusDotColor(project.status),
                        }}
                        className="rounded-full flex-shrink-0"
                      />
                      <Badge variant={getStatusBadgeVariant(project.status)}>
                        {getStatusLabelText(project.status)}
                      </Badge>
                    </div>
                    <ArrowRight size={14} className="text-[#A1A1AA] group-hover:text-[#4F46E5] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-[13px] sm:text-[14px] text-[#1E293B] group-hover:text-[#4F46E5] transition-colors line-clamp-2 mb-2 leading-snug">
                    {project.name}
                  </h3>

                  {/* Metadata */}
                  <div className="space-y-1 text-[11px] sm:text-[11.5px] text-[#475569]">
                    <div className="flex items-center gap-1.5 truncate">
                      <User size={12} className="flex-shrink-0 text-[#A1A1AA]" />
                      <span className="truncate">{project.client_name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin size={12} className="flex-shrink-0 text-[#A1A1AA]" />
                      <span className="truncate">{project.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Building2 size={12} className="flex-shrink-0 text-[#A1A1AA]" />
                      <span className="truncate">{project.type_batiment}</span>
                    </div>
                  </div>
                </div>

                {/* Footer action / date */}
                <div className="mt-3.5 pt-2.5 border-t border-[rgba(0,0,0,0.06)] flex items-center justify-between text-[11px] text-[#A1A1AA]">
                  <span>{project.created_at || 'Date N/C'}</span>
                  <span
                    style={{ color: '#4F46E5' }}
                    className="font-bold flex items-center gap-0.5 text-[11.5px] group-hover:underline"
                  >
                    Ouvrir
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Nouveau projet */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity"
          />

          <div className="bg-white rounded-[14px] p-6 w-[480px] max-w-[calc(100vw-32px)] relative z-10 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-[18px] text-[#1E293B]">
                Créer un projet
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateProjectSubmit} className="space-y-4">
              {formError && (
                <Alert variant="error">
                  {formError}
                </Alert>
              )}

              <div>
                <label className="block font-bold text-[11px] text-[#475569] uppercase mb-1">
                  Nom du projet <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Villa résidentielle R+2"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full h-[36px] px-3 text-[13px] bg-white border border-[rgba(0,0,0,0.12)] focus:border-[#4F46E5] outline-none rounded-lg text-[#1E293B]"
                />
              </div>

              <div>
                <label className="block font-bold text-[11px] text-[#475569] uppercase mb-1">
                  Nom du client
                </label>
                <input
                  type="text"
                  placeholder="M. Koné"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full h-[36px] px-3 text-[13px] bg-white border border-[rgba(0,0,0,0.12)] focus:border-[#4F46E5] outline-none rounded-lg text-[#1E293B]"
                />
              </div>

              <div>
                <label className="block font-bold text-[11px] text-[#475569] uppercase mb-1">
                  Localisation
                </label>
                <input
                  type="text"
                  placeholder="Abidjan, Côte d'Ivoire"
                  value={locationValue}
                  onChange={(e) => setLocationValue(e.target.value)}
                  className="w-full h-[36px] px-3 text-[13px] bg-white border border-[rgba(0,0,0,0.12)] focus:border-[#4F46E5] outline-none rounded-lg text-[#1E293B]"
                />
              </div>

              <div>
                <label className="block font-bold text-[11px] text-[#475569] uppercase mb-1">
                  Type d'ouvrage
                </label>
                <select
                  value={buildingType}
                  onChange={(e) => setBuildingType(e.target.value)}
                  className="w-full h-[36px] px-3 text-[13px] bg-white border border-[rgba(0,0,0,0.12)] focus:border-[#4F46E5] outline-none rounded-lg text-[#1E293B]"
                >
                  <option value="Villa / Maison individuelle">Villa / Maison individuelle</option>
                  <option value="Immeuble collectif (R+3 à R+10)">Immeuble collectif (R+3 à R+10)</option>
                  <option value="Bâtiment commercial ou bureaux">Bâtiment commercial ou bureaux</option>
                  <option value="Bâtiment public / Équipement">Bâtiment public / Équipement</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-9 px-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] font-semibold text-[13px] cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: '#4F46E5' }}
                  className="h-9 px-4 rounded-full text-white font-semibold text-[13px] cursor-pointer hover:opacity-90"
                >
                  Créer et ajouter des plans
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
};
