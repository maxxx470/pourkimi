import React from 'react';
import { Clock, FileUp, RefreshCw, Cpu, Flag, Edit, Eye, History } from 'lucide-react';
import { MetreVersion, VersionTrigger } from '../../../types/versions';
import { formatDate, formatMontant } from '../../../hooks/useVersions';

interface VersionTimelineItemProps {
  version: MetreVersion;
  isLast: boolean;
  onPreview: (id: string) => void;
  onRestore: (id: string) => void;
}

export const VersionTimelineItem: React.FC<VersionTimelineItemProps> = ({
  version,
  isLast,
  onPreview,
  onRestore,
}) => {
  // Dot styling & icon selection
  const renderDotIcon = () => {
    if (version.isCurrent) {
      return <Clock size={15} className="text-white" />;
    }
    switch (version.trigger) {
      case 'export':
        return <FileUp size={15} style={{ color: '#E8442A' }} />;
      case 'auto':
        return <RefreshCw size={15} style={{ color: '#475569' }} />;
      case 'analyse':
        return <Cpu size={15} style={{ color: '#12B76A' }} />;
      case 'initial':
        return <Flag size={15} style={{ color: '#475569' }} />;
      case 'manual':
      default:
        return <Edit size={15} style={{ color: '#4F46E5' }} />;
    }
  };

  // Trigger tag config
  const renderTriggerTag = (trigger: VersionTrigger) => {
    switch (trigger) {
      case 'auto':
        return (
          <span
            style={{ backgroundColor: '#F1F5F9', color: '#475569' }}
            className="font-sans font-bold text-[9px] px-1.5 py-0.5 rounded-full ml-1.5 inline-block"
          >
            Sauvegarde auto
          </span>
        );
      case 'export':
        return (
          <span
            style={{ backgroundColor: '#FEF0EC', color: '#E8442A' }}
            className="font-sans font-bold text-[9px] px-1.5 py-0.5 rounded-full ml-1.5 inline-block"
          >
            Avant export
          </span>
        );
      case 'analyse':
        return (
          <span
            style={{ backgroundColor: '#EDFAF3', color: '#12B76A' }}
            className="font-sans font-bold text-[9px] px-1.5 py-0.5 rounded-full ml-1.5 inline-block"
          >
            Analyse initiale
          </span>
        );
      case 'manual':
        return (
          <span
            style={{ backgroundColor: '#FDF8EC', color: '#D4960A' }}
            className="font-sans font-bold text-[9px] px-1.5 py-0.5 rounded-full ml-1.5 inline-block"
          >
            Manuelle
          </span>
        );
      case 'initial':
      default:
        return null;
    }
  };

  return (
    <div
      style={{ paddingBottom: isLast ? '0px' : '16px' }}
      className="flex flex-row gap-3.5 relative font-sans"
    >
      {/* Ligne de connexion verticale */}
      {!isLast && (
        <div
          style={{
            position: 'absolute',
            left: '15px',
            top: '32px',
            bottom: '0px',
            width: '2px',
            backgroundColor: '#E2E8F0',
          }}
        />
      )}

      {/* Dot - 32px circle */}
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: version.isCurrent ? '#4F46E5' : '#F1F5F9',
        }}
        className="flex items-center justify-center shrink-0 z-10 shadow-2xs border border-[rgba(0,0,0,0.06)]"
      >
        {renderDotIcon()}
      </div>

      {/* Contenu Card */}
      <div
        style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '12px 14px',
        }}
        className="flex-1 shadow-2xs font-sans min-w-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center flex-wrap">
            <span
              style={{
                backgroundColor: version.isCurrent ? '#4F46E5' : '#475569',
                color: '#ffffff',
              }}
              className="font-sans font-extrabold text-[11px] px-2.2 py-0.5 rounded-full"
            >
              V{version.versionNumber}
            </span>
            {renderTriggerTag(version.trigger)}
          </div>

          <span className="font-sans text-[11px] font-medium text-[#475569] shrink-0">
            {formatDate(version.createdAt)}
          </span>
        </div>

        {/* Label */}
        <div className="font-sans font-bold text-[13px] text-[#1E293B] mb-1 leading-snug">
          {version.label}
        </div>

        {/* Meta details */}
        {!version.isCurrent && (
          <div className="font-sans text-[11px] text-[#475569] font-medium mb-2.5">
            {version.lignesCount} lignes •{' '}
            {version.totalTTC !== null
              ? `Total TTC ${formatMontant(version.totalTTC)} FCFA`
              : 'Aucun prix saisi'}
          </div>
        )}

        {/* Meta details if current */}
        {version.isCurrent && (
          <div className="font-sans text-[11px] text-[#4F46E5] font-bold mb-1">
            {version.lignesCount} lignes •{' '}
            {version.totalTTC !== null
              ? `Total TTC ${formatMontant(version.totalTTC)} FCFA`
              : 'Aucun prix saisi'}
          </div>
        )}

        {/* Actions - if not current */}
        {!version.isCurrent && (
          <div className="flex items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => onPreview(version.id)}
              style={{
                height: '28px',
                padding: '0 10px',
                borderRadius: '7px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#ffffff',
                color: '#1E293B',
              }}
              className="font-sans font-bold text-[11px] flex items-center gap-1 hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            >
              <Eye size={12} className="text-[#475569]" />
              <span>Aperçu</span>
            </button>

            <button
              type="button"
              onClick={() => onRestore(version.id)}
              style={{
                height: '28px',
                padding: '0 10px',
                borderRadius: '7px',
                backgroundColor: '#4F46E5',
                color: '#ffffff',
              }}
              className="font-sans font-bold text-[11px] flex items-center gap-1 hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
            >
              <History size={12} />
              <span>Restaurer</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
