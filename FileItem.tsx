import React from 'react';
import { FileText, CheckCircle, X, RefreshCw } from 'lucide-react';
import { UploadedFile } from '../../hooks/useFileUpload';

export interface FileItemProps {
  file: UploadedFile;
  onRemove: (id: string) => void;
  onRetry?: (id: string) => void;
}

const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes === 0) return '0 KB';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const FileItem: React.FC<FileItemProps> = ({
  file,
  onRemove,
  onRetry,
}) => {
  const isUploading = file.status === 'uploading';
  const isConverting = file.status === 'converting';
  const isDone = file.status === 'done';
  const isError = file.status === 'error';

  return (
    <div
      style={{ border: '1px solid #E2E8F0' }}
      className="bg-white rounded-lg p-[9px_12px] flex items-center gap-2.5 shadow-2xs"
    >
      {/* File Icon */}
      <div
        style={{ borderRadius: '7px', backgroundColor: '#EEF2FF' }}
        className="w-7 h-7 flex items-center justify-center flex-shrink-0 text-[#4F46E5]"
      >
        <FileText size={14} />
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <span className="block font-sans font-semibold text-[12px] text-[#1E293B] truncate">
          {file.name}
        </span>

        {/* Status text & progress */}
        {isUploading && (
          <div className="mt-0.5">
            <span className="block font-sans text-[10px] text-[#475569]">
              En cours d'upload...
            </span>
            <div className="w-full h-[2px] bg-[rgba(0,0,0,0.06)] rounded-full overflow-hidden mt-1">
              <div
                style={{ width: `${file.progress}%`, backgroundColor: '#4F46E5' }}
                className="h-full rounded-full transition-all duration-200"
              />
            </div>
          </div>
        )}

        {isConverting && (
          <div className="mt-0.5">
            <span className="block font-sans text-[10px] text-[#4F46E5]">
              Conversion DWG en cours...
            </span>
            <div className="w-full h-[2px] bg-[rgba(0,0,0,0.06)] rounded-full overflow-hidden mt-1">
              <div
                style={{ width: `${file.progress || 60}%`, backgroundColor: '#4F46E5' }}
                className="h-full rounded-full transition-all duration-200 animate-pulse"
              />
            </div>
          </div>
        )}

        {isDone && (
          <span className="block font-sans text-[10px] text-[#475569] mt-0.5">
            {formatFileSize(file.size)}
          </span>
        )}

        {isError && (
          <span className="block font-sans text-[10px] text-[#E8442A] mt-0.5">
            Erreur — cliquez pour réessayer
          </span>
        )}
      </div>

      {/* Action / Status Icons */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {isDone && (
          <CheckCircle size={16} className="text-[#12B76A]" />
        )}

        {isError && onRetry && (
          <button
            onClick={() => onRetry(file.id)}
            title="Réessayer"
            className="text-[#475569] hover:text-[#4F46E5] p-1 cursor-pointer transition-colors"
          >
            <RefreshCw size={14} />
          </button>
        )}

        {/* Always display remove X icon */}
        <button
          onClick={() => onRemove(file.id)}
          title="Supprimer"
          className="text-[#475569] hover:text-[#E8442A] p-1 cursor-pointer transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
