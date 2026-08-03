import React from 'react';
import { X, Eye, History, FileX } from 'lucide-react';
import { MetreVersion } from '../../../types/versions';
import { formatDate, formatMontant } from '../../../hooks/useVersions';

interface PreviewVersionModalProps {
  isOpen: boolean;
  version: MetreVersion | null;
  onClose: () => void;
  onRestoreFromPreview: () => void;
}

export const PreviewVersionModal: React.FC<PreviewVersionModalProps> = ({
  isOpen,
  version,
  onClose,
  onRestoreFromPreview,
}) => {
  if (!isOpen || !version) return null;

  // Sample lot rows for non-null totalTTC versions
  const sampleRows = [
    { code: '01.01', designation: 'Terrassement et fouilles en rigole', unite: 'm³', qte: 120, pu: 8500, totalHT: 1020000 },
    { code: '01.02', designation: 'Béton de propreté dosé à 150 kg/m³', unite: 'm³', qte: 18, pu: 45000, totalHT: 810000 },
    { code: '02.01', designation: 'Béton armé pour semelles et amorces', unite: 'm³', qte: 42, pu: 185000, totalHT: 7770000 },
    { code: '02.02', designation: 'Maçonnerie de agglos creux de 15cm', unite: 'm²', qte: 350, pu: 8200, totalHT: 2870000 },
  ];

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
          width: '640px',
          maxWidth: 'calc(100vw - 32px)',
          maxHeight: '80vh',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        }}
        className="flex flex-col overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div
          style={{ padding: '16px 18px', borderBottom: '1px solid #E2E8F0' }}
          className="flex items-center justify-between bg-[#F8FAFC] shrink-0"
        >
          <div>
            <h3 className="font-sans font-extrabold text-[15px] text-[#1E293B] leading-tight">
              Aperçu — {version.label}
            </h3>
            <p className="font-sans text-[11px] text-[#475569] mt-0.5">
              {version.lignesCount} lignes · Lecture seule
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
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

        {/* Body (scrollable) */}
        <div style={{ padding: '14px 18px' }} className="flex-1 overflow-y-auto font-sans">
          {/* Read-only banner */}
          <div
            style={{
              backgroundColor: '#EBF3FF',
              border: '1px solid rgba(42,123,222,0.15)',
              borderRadius: '8px',
              padding: '8px 12px',
              marginBottom: '12px',
            }}
            className="flex items-center gap-2"
          >
            <Eye size={13} style={{ color: '#2A7BDE' }} className="shrink-0" />
            <span style={{ color: '#1A5BA8' }} className="font-sans font-medium text-[11px]">
              Aperçu en lecture seule — vous ne pouvez pas modifier cette version ici
            </span>
          </div>

          {/* Table representation */}
          {version.totalTTC === null ? (
            <div className="py-12 text-center flex flex-col items-center justify-center border border-dashed border-[rgba(0,0,0,0.1)] rounded-[10px] bg-[#F8FAFC]">
              <FileX size={32} style={{ color: '#D4D4D8' }} className="mb-2" />
              <div className="font-sans text-[12px] text-[#475569] font-medium">
                Aucun prix n'était renseigné à cette étape
              </div>
              <div className="font-sans text-[11px] text-[#A1A1AA] mt-0.5">
                {version.lignesCount} ouvrages détectés lors de l'analyse initiale.
              </div>
            </div>
          ) : (
            <div className="border border-[#E2E8F0] rounded-[10px] overflow-hidden bg-white shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] uppercase tracking-wider text-[#475569] font-extrabold">
                      <th className="py-2 px-3 w-16">Code</th>
                      <th className="py-2 px-3">Désignation</th>
                      <th className="py-2 px-3 w-12 text-center">Unité</th>
                      <th className="py-2 px-3 w-16 text-right">Qté</th>
                      <th className="py-2 px-3 w-24 text-right">Prix Unitaire</th>
                      <th className="py-2 px-3 w-28 text-right">Total HT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(0,0,0,0.05)] text-[11px] text-[#1E293B]">
                    {sampleRows.map((row) => (
                      <tr key={row.code} className="hover:bg-[#F8FAFC]/60">
                        <td className="py-2 px-3 font-mono text-[10px] text-[#475569]">{row.code}</td>
                        <td className="py-2 px-3 font-semibold text-[#1E293B]">{row.designation}</td>
                        <td className="py-2 px-3 text-center text-[#475569]">{row.unite}</td>
                        <td className="py-2 px-3 text-right font-medium">{row.qte}</td>
                        <td className="py-2 px-3 text-right font-mono text-[10px]">{formatMontant(row.pu)}</td>
                        <td className="py-2 px-3 text-right font-bold text-[#1E293B] font-mono text-[10px]">
                          {formatMontant(row.totalHT)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-[#F8FAFC] text-[10px] italic text-[#475569]">
                      <td colSpan={6} className="py-1.5 px-3 text-center">
                        ... et {Math.max(0, version.lignesCount - 4)} autres lignes d'ouvrages
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Total TTC row */}
              <div
                style={{ backgroundColor: '#1E293B', color: '#ffffff' }}
                className="p-3 flex items-center justify-between font-sans font-extrabold text-[13px]"
              >
                <span>TOTAL TTC :</span>
                <span className="text-[#A78BFA] font-mono">
                  {formatMontant(version.totalTTC)} FCFA
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{ padding: '12px 18px', borderTop: '1px solid #E2E8F0' }}
          className="flex items-center justify-between bg-[#F8FAFC] shrink-0"
        >
          <div className="font-sans text-[11px] text-[#475569]">
            Créée le {formatDate(version.createdAt)}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              style={{
                height: '34px',
                padding: '0 14px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#ffffff',
                color: '#1E293B',
              }}
              className="font-sans font-semibold text-[12px] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              Fermer
            </button>

            <button
              type="button"
              onClick={onRestoreFromPreview}
              disabled={version.isCurrent}
              style={{
                height: '34px',
                padding: '0 14px',
                borderRadius: '8px',
                backgroundColor: version.isCurrent ? '#A1A1AA' : '#4F46E5',
                color: '#ffffff',
              }}
              className="font-sans font-bold text-[12px] flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <History size={13} />
              <span>Restaurer cette version</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
