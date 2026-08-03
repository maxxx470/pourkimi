import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

export interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  acceptedFormats?: string[];
  disabled?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({
  onFilesSelected,
  acceptedFormats = ['PDF', 'PNG', 'JPG', 'DWG'],
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      onFilesSelected(selectedFiles);
      e.target.value = ''; // Reset input
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      onFilesSelected(droppedFiles);
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        border: isDragOver
          ? '1.5px dashed #4F46E5'
          : '1.5px dashed rgba(108,94,207,0.3)',
        backgroundColor: isDragOver ? '#EEF2FF' : '#ffffff',
      }}
      className={`rounded-xl p-[22px_16px] text-center cursor-pointer transition-colors duration-140 select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#4F46E5] hover:bg-[#EEF2FF]'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.png,.jpg,.jpeg,.dwg"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Upload Icon */}
      <div
        style={{ backgroundColor: '#EEF2FF', borderRadius: '12px' }}
        className="w-10 h-10 mx-auto flex items-center justify-center mb-2.5 text-[#4F46E5]"
      >
        <Upload size={20} />
      </div>

      {/* Title */}
      <h3 className="font-sans font-bold text-[13px] text-[#1E293B] mb-1">
        Glissez vos fichiers ici
      </h3>

      {/* Subtitle */}
      <p className="font-sans text-[11px] text-[#475569] mb-2.5">
        ou cliquez pour parcourir — aucune limite de fichiers
      </p>

      {/* Formats Badges */}
      <div className="flex gap-1.5 justify-center flex-wrap">
        {acceptedFormats.map((format) => (
          <span
            key={format}
            style={{ border: '1px solid #E2E8F0' }}
            className="font-sans font-bold text-[10px] px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569]"
          >
            {format}
          </span>
        ))}
      </div>
    </div>
  );
};
