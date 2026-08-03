import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { DropZone } from '../../../components/ui/DropZone';
import { FileItem } from '../../../components/ui/FileItem';
import { UploadedFile } from '../../../hooks/useFileUpload';

export interface StepStructureProps {
  files: UploadedFile[];
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (fileId: string) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export const StepStructure: React.FC<StepStructureProps> = ({
  files,
  onAddFiles,
  onRemoveFile,
  onNext,
  onBack,
  onSkip,
}) => {
  return (
    <div className="space-y-3.5 animate-[fadeUp_220ms_cubic-bezier(0.23,1,0.32,1)_forward]">
      <div
        style={{ border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}
        className="rounded-2xl p-4 md:p-5 mb-3.5"
      >
        <div className="flex items-center justify-between mb-1.5">
          <h2 className="font-sans font-bold text-[14px] text-[#1E293B]">
            Structure & Fondations
          </h2>
          <span
            style={{ backgroundColor: '#FDF8EC', color: '#D4960A' }}
            className="font-sans font-bold text-[10px] px-2 py-0.5 rounded-full uppercase"
          >
            Optionnel
          </span>
        </div>

        <p className="font-sans text-[12px] text-[#475569] leading-relaxed mb-3.5">
          Les plans de structure (poteaux, poutres, semelles) améliorent la précision du métré de
          gros œuvre. Sans eux, des valeurs par défaut seront utilisées.
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

        <div className="flex items-center gap-2">
          <button
            onClick={onSkip}
            style={{ border: '1px dashed rgba(0,0,0,0.12)' }}
            className="h-9 px-3.5 rounded-full bg-transparent text-[#475569] font-sans font-medium text-[13px] hover:bg-[#F8FAFC] hover:text-[#1E293B] transition-colors cursor-pointer"
          >
            Passer cette étape
          </button>

          <button
            onClick={onNext}
            style={{ backgroundColor: '#4F46E5' }}
            className="h-9 px-4 rounded-full text-white font-sans font-semibold text-[13px] hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Continuer</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
