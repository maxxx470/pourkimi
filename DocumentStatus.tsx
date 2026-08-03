import React from 'react';
import { FileText, Loader } from 'lucide-react';
import { DocumentStatus as DocumentStatusType } from '../../../hooks/useAnalyse';

export interface DocumentStatusProps {
  documents: DocumentStatusType[];
}

export const DocumentStatusComponent: React.FC<DocumentStatusProps> = ({ documents }) => {
  return (
    <div
      style={{
        backgroundColor: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: '10px',
        padding: '14px',
        marginBottom: '16px',
      }}
      className="font-sans"
    >
      {/* Card Header */}
      <h3 className="font-bold text-[12px] text-[#1E293B] mb-3">
        Documents traités
      </h3>

      {/* List */}
      <div className="space-y-2">
        {documents.map((doc) => {
          const isDone = doc.status === 'done';
          const isProcessing = doc.status === 'processing';
          const isWaiting = doc.status === 'waiting';
          const isError = doc.status === 'error';

          return (
            <div
              key={doc.id}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: '8px',
                padding: '8px 10px',
              }}
              className="flex items-center justify-between gap-2"
            >
              {/* File Icon & Name */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#EEF2FF',
                    borderRadius: '6px',
                  }}
                  className="flex items-center justify-center flex-shrink-0 text-[#4F46E5]"
                >
                  <FileText size={12} />
                </div>
                <span className="font-semibold text-[11px] text-[#1E293B] truncate">
                  {doc.name}
                </span>
              </div>

              {/* Status Badge */}
              <div className="flex-shrink-0">
                {isDone && (
                  <span className="font-bold text-[10px] px-2 py-0.5 rounded-full bg-[#EDFAF3] text-[#0A7A47]">
                    Analysé
                  </span>
                )}

                {isProcessing && (
                  <span className="font-bold text-[10px] px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center gap-1">
                    <Loader size={10} className="animate-spin text-[#4F46E5]" />
                    <span>En cours</span>
                  </span>
                )}

                {isWaiting && (
                  <span className="font-bold text-[10px] px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569]">
                    En attente
                  </span>
                )}

                {isError && (
                  <span className="font-bold text-[10px] px-2 py-0.5 rounded-full bg-[#FEF0EC] text-[#B83218]">
                    Erreur
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
