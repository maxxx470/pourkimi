import React from 'react';
import { FileText, FileSpreadsheet, Loader2 } from 'lucide-react';

interface ExportPanelProps {
  isLocked: boolean;
  onExportPDF: () => void;
  onExportExcel: () => void;
  isExportingPDF: boolean;
  isExportingExcel: boolean;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  isLocked,
  onExportPDF,
  onExportExcel,
  isExportingPDF,
  isExportingExcel,
}) => {
  return (
    <div
      style={{
        backgroundColor: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        padding: '14px',
        opacity: isLocked ? 0.5 : 1,
        pointerEvents: isLocked ? 'none' : 'auto',
      }}
      className="font-sans shadow-2xs space-y-2.5 transition-all"
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="font-sans font-bold text-[13px] text-[#1E293B]">
          Exporter
        </div>
      </div>

      {/* Bouton Export PDF */}
      <div
        onClick={!isExportingPDF && !isLocked ? onExportPDF : undefined}
        className="flex items-center gap-2.5 p-3 rounded-full border border-[#E2E8F0] bg-white cursor-pointer hover:border-[#4F46E5] hover:bg-[#EEF2FF] transition-all select-none group"
      >
        <div className="w-[34px] h-[34px] rounded-[9px] bg-[#FEF0EC] flex items-center justify-center shrink-0">
          <FileText size={16} className="text-[#E8442A]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-sans font-bold text-[12px] text-[#1E293B] group-hover:text-[#4F46E5] transition-colors">
            Exporter en PDF
          </div>
          <div className="font-sans font-medium text-[10px] text-[#475569] truncate">
            Document mis en page, prêt à imprimer
          </div>
        </div>

        {isExportingPDF && (
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#4F46E5]">
            <Loader2 size={13} className="animate-spin" />
            <span>Génération...</span>
          </div>
        )}
      </div>

      {/* Bouton Export Excel */}
      <div
        onClick={!isExportingExcel && !isLocked ? onExportExcel : undefined}
        className="flex items-center gap-2.5 p-3 rounded-full border border-[#E2E8F0] bg-white cursor-pointer hover:border-[#4F46E5] hover:bg-[#EEF2FF] transition-all select-none group"
      >
        <div className="w-[34px] h-[34px] rounded-[9px] bg-[#EDFAF3] flex items-center justify-center shrink-0">
          <FileSpreadsheet size={16} className="text-[#12B76A]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-sans font-bold text-[12px] text-[#1E293B] group-hover:text-[#4F46E5] transition-colors">
            Exporter en Excel
          </div>
          <div className="font-sans font-medium text-[10px] text-[#475569] truncate">
            DQE complet avec formules
          </div>
        </div>

        {isExportingExcel && (
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#4F46E5]">
            <Loader2 size={13} className="animate-spin" />
            <span>Génération...</span>
          </div>
        )}
      </div>
    </div>
  );
};
