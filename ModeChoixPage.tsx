import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileSpreadsheet, Ruler, ArrowRight, Check } from 'lucide-react';
import { AppLayout } from '../../layouts/AppLayout';
import { useProjectData } from '../../store/ProjectDataContext';

export const ModeChoixPage: React.FC = () => {
  const navigate = useNavigate();
  const { id: routeProjectId } = useParams<{ id: string }>();
  const projectId = routeProjectId || 'p1';
  const { setDevisModePipeline, advanceProjectStep } = useProjectData();

  const handleChoose = (mode: 'dqe' | 'm2') => {
    setDevisModePipeline(mode);
    advanceProjectStep(projectId, 'analyse');
    navigate(`/projects/${projectId}/analyse`);
  };

  return (
    <AppLayout
      currentPath="/projects"
      onNavigate={(path) => navigate(path)}
      onNewProject={() => navigate('/dashboard')}
    >
      <div className="max-w-3xl mx-auto py-6 md:py-10 px-4 font-sans pb-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#EEF2FF] border border-[#4F46E5]/20 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
            <span className="font-bold text-[11px] text-[#4F46E5]">Avant de lancer l'analyse IA</span>
          </div>
          <h1 className="font-black text-[24px] md:text-[30px] text-[#1E293B] tracking-tight">
            Quel type de devis souhaitez-vous ?
          </h1>
          <p className="text-[13px] md:text-[14px] text-[#475569] mt-2 max-w-xl mx-auto">
            Ce choix détermine ce que l'IA va extraire de vos plans. Vous pourrez toujours
            recommencer avec l'autre mode plus tard si besoin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mode DQE */}
          <button
            type="button"
            onClick={() => handleChoose('dqe')}
            className="text-left bg-white rounded-2xl border-2 border-[#E2E8F0] hover:border-[#4F46E5] p-6 transition-all cursor-pointer group shadow-xs"
          >
            <div
              style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
            >
              <FileSpreadsheet size={20} />
            </div>
            <h2 className="font-extrabold text-[17px] text-[#1E293B] mb-1.5">
              Devis détaillé (DQE)
            </h2>
            <p className="text-[12.5px] text-[#475569] leading-relaxed mb-4">
              Quantités précises ouvrage par ouvrage, prix unitaires par matériau,
              traçabilité complète. Idéal pour un appel d'offres, une banque, ou un
              client qui exige un document contractuel détaillé.
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                'Extraction IA détaillée par lot',
                'Cahier de calcul (métré) vérifiable',
                'Affectation des prix par ouvrage/matériau',
              ].map((line) => (
                <li key={line} className="flex items-center gap-2 text-[11.5px] text-[#1E293B] font-medium">
                  <Check size={13} className="text-[#12B76A] flex-shrink-0" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#4F46E5] group-hover:gap-2.5 transition-all">
              <span>Choisir ce mode</span>
              <ArrowRight size={14} />
            </div>
          </button>

          {/* Mode m2 */}
          <button
            type="button"
            onClick={() => handleChoose('m2')}
            className="text-left bg-white rounded-2xl border-2 border-[#E2E8F0] hover:border-[#4F46E5] p-6 transition-all cursor-pointer group shadow-xs relative"
          >
            <div
              style={{
                position: 'absolute',
                top: '-10px',
                right: '20px',
                backgroundColor: '#12B76A',
                color: '#ffffff',
              }}
              className="rounded-full px-2.5 py-1 text-[10px] font-extrabold"
            >
              Plus rapide
            </div>
            <div
              style={{ backgroundColor: '#EDFAF3', color: '#12B76A' }}
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
            >
              <Ruler size={20} />
            </div>
            <h2 className="font-extrabold text-[17px] text-[#1E293B] mb-1.5">
              Devis rapide (par m²)
            </h2>
            <p className="text-[12.5px] text-[#475569] leading-relaxed mb-4">
              Un prix au m² par pièce, pour un ordre de grandeur rapide. Idéal pour un
              client particulier qui veut vite savoir combien coûte son projet, sans
              détail ligne par ligne.
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                'Extraction IA allégée (surfaces uniquement)',
                'Prix au m² par pièce, ajustable',
                'Devis obtenu en quelques minutes',
              ].map((line) => (
                <li key={line} className="flex items-center gap-2 text-[11.5px] text-[#1E293B] font-medium">
                  <Check size={13} className="text-[#12B76A] flex-shrink-0" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#12B76A] group-hover:gap-2.5 transition-all">
              <span>Choisir ce mode</span>
              <ArrowRight size={14} />
            </div>
          </button>
        </div>
      </div>
    </AppLayout>
  );
};
