import React from 'react';
import { X, History, Loader2 } from 'lucide-react';
import { MetreVersion } from '../../../types/versions';
import { formatDate } from '../../../hooks/useVersions';

interface RestoreConfirmModalProps {
  isOpen: boolean;
  version: MetreVersion | null;
  onConfirm: () => void;
  onCancel: () => void;
  isRestoring: boolean;
}

export const RestoreConfirmModal: React.FC<RestoreConfirmModalProps> = ({
  isOpen,
  version,
  onConfirm,
  onCancel,
  isRestoring,
}) => {
  if (!isOpen || !version) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className="font-sans backdrop-blur-2xs p-4"
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          width: '420px',
          maxWidth: 'calc(100vw - 32px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        }}
        className="overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div
          style={{ padding: '16px 18px', borderBottom: '1px solid #E2E8F0' }}
          className="flex items-center justify-between"
        >
          <h3 className="font-sans font-extrabold text-[15px] text-[#1E293B]">
            Restaurer la version V{version.versionNumber} ?
          </h3>
          <button
            type="button"
            onClick={onCancel}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              color: '#475569',
            }}
            className="flex items-center justify-center hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '14px 18px' }} className="font-sans">
          <p className="font-sans text-[12px] text-[#475569] leading-[1.6]">
            La version actuelle sera automatiquement sauvegardée avant la restauration. Vous pourrez toujours revenir en arrière si nécessaire.
          </p>

          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '10px 12px',
              marginTop: '12px',
            }}
          >
            <div className="font-sans font-semibold text-[11px] text-[#475569] mb-1">
              Vous restaurez :
            </div>
            <div className="font-sans font-bold text-[13px] text-[#1E293B] leading-snug">
              {version.label}
            </div>
            <div className="font-sans text-[11px] text-[#475569] mt-0.5">
              {version.lignesCount} lignes · {formatDate(version.createdAt)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 18px',
            borderTop: '1px solid #E2E8F0',
          }}
          className="flex items-center justify-end gap-2"
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={isRestoring}
            style={{
              height: '34px',
              padding: '0 14px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#ffffff',
              color: '#1E293B',
            }}
            className="font-sans font-semibold text-[12px] hover:bg-[#F8FAFC] transition-colors cursor-pointer disabled:opacity-50"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isRestoring}
            style={{
              height: '34px',
              padding: '0 14px',
              borderRadius: '8px',
              backgroundColor: '#4F46E5',
              color: '#ffffff',
            }}
            className="font-sans font-bold text-[12px] flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer shadow-xs disabled:opacity-60"
          >
            {isRestoring ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Restauration...</span>
              </>
            ) : (
              <>
                <History size={13} />
                <span>Restaurer cette version</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
