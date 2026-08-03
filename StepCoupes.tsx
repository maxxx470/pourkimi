import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { DropZone } from '../../../components/ui/DropZone';
import { FileItem } from '../../../components/ui/FileItem';
import { Alert } from '../../../components/ui/Alert';
import { UploadedFile } from '../../../hooks/useFileUpload';

export interface StepCoupesProps {
  files: UploadedFile[];
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (fileId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepCoupes: React.FC<StepCoupesProps> = ({
  files,
  onAddFiles,
  onRemoveFile,
  onNext,
  onBack,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    const hasValidFile = files.some((f) => f.status === 'done' || f.status === 'uploading' || f.status === 'converting');
    if (!hasValidFile) {
      setError('Ajoutez au moins une coupe pour continuer');
      return;
    }
    setError(null);
    onNext();
  };

  return (
    <div className="space-y-3.5 animate-[fadeUp_220ms_cubic-bezier(0.23,1,0.32,1)_forward]">
      <div
        style={{ border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}
        className="rounded-2xl p-4 md:p-5 mb-3.5"
      >
        <div className="flex items-center justify-between mb-1.5">
          <h2 className="font-sans font-bold text-[14px] text-[#1E293B]">
            Coupes
          </h2>
          <span
            style={{ backgroundColor: '#FEF0EC', color: '#E8442A' }}
            className="font-sans font-bold text-[10px] px-2 py-0.5 rounded-full uppercase"
          >
            Obligatoire
          </span>
        </div>

        <p className="font-sans text-[12px] text-[#475569] leading-relaxed mb-3.5">
          Les coupes doivent montrer la hauteur entre chaque plancher et l'épaisseur des
          dalles.
        </p>

        <DropZone onFilesSelected={onAddFiles} />

        {files.length > 0 && (
          <div className="mt-3 flex flex-col gap-1.5">
            {files.map((file) => (
              <FileItem
                key={file.id}
                file={file}
                onRemove={onRemoveFile}
              />
            ))}
          </div>
        )}

        {error && (
          <div className="mt-3.5">
            <Alert variant="error">{error}</Alert>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          style={{ border: '1px solid #E2E8F0' }}
          className="h-9 px-4 rounded-full bg-white text-[#1E293B] font-sans font-semibold text-[13px] hover:bg-[#F8FAFC] transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Retour</span>
        </button>

        <button
          onClick={handleContinue}
          style={{ backgroundColor: '#4F46E5' }}
          className="h-9 px-4 rounded-full text-white font-sans font-semibold text-[13px] hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
        >
          <span>Continuer</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
