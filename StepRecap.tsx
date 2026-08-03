import React from 'react';
import { Cpu, ArrowLeft, FileText, Check } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { UploadedFile } from '../../../hooks/useFileUpload';

export interface StepRecapProps {
  files: {
    plans: UploadedFile[];
    coupes: UploadedFile[];
    facades: UploadedFile[];
    structure: UploadedFile[];
  };
  onBack: () => void;
  onGoToStep: (step: 1 | 2 | 3 | 4) => void;
  onLaunch: () => void;
}

const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes === 0) return '0 KB';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const StepRecap: React.FC<StepRecapProps> = ({
  files,
  onBack,
  onGoToStep,
  onLaunch,
}) => {
  const hasPlans = files.plans.some((f) => f.status === 'done' || f.status === 'uploading' || f.status === 'converting');
  const hasCoupes = files.coupes.some((f) => f.status === 'done' || f.status === 'uploading' || f.status === 'converting');
  const hasFacades = files.facades.some((f) => f.status === 'done' || f.status === 'uploading' || f.status === 'converting');

  const isMissingMandatory = !hasPlans || !hasCoupes || !hasFacades;

  const categories = [
    {
      step: 1 as const,
      key: 'plans' as const,
      label: 'Plans de niveaux',
      color: '#4F46E5',
      isMandatory: true,
      items: files.plans,
      hasFiles: hasPlans,
    },
    {
      step: 2 as const,
      key: 'coupes' as const,
      label: 'Coupes',
      color: '#E8442A',
      isMandatory: true,
      items: files.coupes,
      hasFiles: hasCoupes,
    },
    {
      step: 3 as const,
      key: 'facades' as const,
      label: 'Façades',
      color: '#12B76A',
      isMandatory: true,
      items: files.facades,
      hasFiles: hasFacades,
    },
    {
      step: 4 as const,
      key: 'structure' as const,
      label: 'Structure & Fondations',
      color: '#475569',
      isMandatory: false,
      items: files.structure,
      hasFiles: files.structure.length > 0,
    },
  ];

  return (
    <div className="space-y-4 animate-[fadeUp_220ms_cubic-bezier(0.23,1,0.32,1)_forward]">
      {/* Alert banner if mandatory documents are missing */}
      {isMissingMandatory && (
        <Alert variant="error">
          Des documents obligatoires manquent. Revenez aux étapes concernées avant de lancer l'analyse.
        </Alert>
      )}

      {/* Section Title */}
      <div>
        <h2 className="font-sans font-bold text-[14px] text-[#1E293B] mb-2">
          Récapitulatif des documents
        </h2>
      </div>

      {/* 4 Groups */}
      <div className="space-y-2.5">
        {categories.map((cat) => (
          <div
            key={cat.key}
            style={{ border: '1px solid #E2E8F0' }}
            className="bg-white rounded-xl p-3 md:p-3.5 shadow-2xs"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    backgroundColor: cat.color,
                  }}
                  className="rounded-full flex-shrink-0"
                />
                <span className="font-sans font-bold text-[13px] text-[#1E293B]">
                  {cat.label}
                </span>
              </div>

              {cat.hasFiles ? (
                <span className="font-sans font-bold text-[10px] px-2 py-0.5 rounded-full bg-[#EDFAF3] text-[#0A7A47] flex items-center gap-1">
                  <Check size={10} />
                  <span>{cat.items.length} fichier{cat.items.length > 1 ? 's' : ''}</span>
                </span>
              ) : (
                <span
                  className={`font-sans font-bold text-[10px] px-2 py-0.5 rounded-full ${
                    cat.isMandatory
                      ? 'bg-[#FEF0EC] text-[#E8442A]'
                      : 'bg-[#F1F5F9] text-[#475569]'
                  }`}
                >
                  {cat.isMandatory ? 'Manquant' : 'Passé'}
                </span>
              )}
            </div>

            {/* Content List */}
            {cat.hasFiles ? (
              <div className="space-y-1.5 pl-3 border-l-2 border-[rgba(0,0,0,0.06)] mt-1.5">
                {cat.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-[11px] font-sans">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <FileText size={12} className="text-[#4F46E5] flex-shrink-0" />
                      <span className="font-semibold text-[#1E293B] truncate">{item.name}</span>
                    </div>
                    <span className="text-[#475569] ml-2 flex-shrink-0">{formatFileSize(item.size)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[12px] font-sans mt-1">
                {cat.isMandatory ? (
                  <span className="text-[#E8442A] font-medium">
                    Aucun fichier —{' '}
                    <button
                      onClick={() => onGoToStep(cat.step)}
                      className="underline font-bold hover:text-[#B83218] cursor-pointer"
                    >
                      Ajouter
                    </button>
                  </span>
                ) : (
                  <span className="text-[#475569] font-medium">
                    Passé — valeurs par défaut utilisées
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Actions Row */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          style={{ border: '1px solid #E2E8F0' }}
          className="h-9 px-4 rounded-full bg-white text-[#1E293B] font-sans font-semibold text-[13px] hover:bg-[#F8FAFC] transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Retour</span>
        </button>

        <button
          onClick={onLaunch}
          disabled={isMissingMandatory}
          style={{
            backgroundColor: isMissingMandatory ? 'rgba(108,94,207,0.5)' : '#4F46E5',
            boxShadow: isMissingMandatory ? 'none' : '0 4px 16px rgba(108,94,207,0.3)',
          }}
          className={`h-10 px-5 rounded-full text-white font-sans font-bold text-[14px] flex items-center gap-2 transition-all ${
            isMissingMandatory
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:opacity-95 active:scale-[0.98] cursor-pointer'
          }`}
        >
          <Cpu size={16} className="text-white" />
          <span>Lancer l'analyse IA</span>
        </button>
      </div>
    </div>
  );
};
