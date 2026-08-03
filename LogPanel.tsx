import React, { useEffect, useRef } from 'react';
import {
  FileSearch,
  Cpu,
  Calculator,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Loader,
} from 'lucide-react';
import { LogEntry } from '../../../services/analyseService';

export interface LogPanelProps {
  logEntries: LogEntry[];
  currentPhase: 'lecture' | 'extraction' | 'calcul' | 'finalisation' | null;
}

export const LogPanel: React.FC<LogPanelProps> = ({ logEntries, currentPhase }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logEntries]);

  const phases: Array<{
    id: 'lecture' | 'extraction' | 'calcul' | 'finalisation';
    title: string;
    icon: React.ElementType;
  }> = [
    { id: 'lecture', title: 'Lecture des documents', icon: FileSearch },
    { id: 'extraction', title: 'Extraction des dimensions', icon: Cpu },
    { id: 'calcul', title: 'Calcul du métré', icon: Calculator },
    { id: 'finalisation', title: 'Finalisation & DQE', icon: CheckCircle },
  ];

  const getPhaseStatus = (phaseId: 'lecture' | 'extraction' | 'calcul' | 'finalisation') => {
    const phaseOrder = ['lecture', 'extraction', 'calcul', 'finalisation'];
    const currentIndex = currentPhase ? phaseOrder.indexOf(currentPhase) : -1;
    const targetIndex = phaseOrder.indexOf(phaseId);

    const hasCompletedLogs = logEntries.some((l) => l.phase === phaseId);

    if (currentIndex > targetIndex) return 'done';
    if (currentIndex === targetIndex) return 'processing';
    if (hasCompletedLogs) return 'done';
    return 'waiting';
  };

  return (
    <div className="space-y-3 font-sans">
      {phases.map((phase) => {
        const Icon = phase.icon;
        const phaseStatus = getPhaseStatus(phase.id);
        const phaseLogs = logEntries.filter((l) => l.phase === phase.id);

        const isDone = phaseStatus === 'done';
        const isProcessing = phaseStatus === 'processing';
        const isWaiting = phaseStatus === 'waiting';

        return (
          <div
            key={phase.id}
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '12px 14px',
            }}
            className="transition-all duration-200"
          >
            {/* Phase Card Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon
                  size={15}
                  className={
                    isDone
                      ? 'text-[#12B76A]'
                      : isProcessing
                      ? 'text-[#4F46E5]'
                      : 'text-[#475569]'
                  }
                />
                <span className="font-bold text-[13px] text-[#1E293B]">
                  {phase.title}
                </span>
              </div>

              {/* Status Badge */}
              {isDone && (
                <span className="font-bold text-[10px] px-2 py-0.5 rounded-full bg-[#EDFAF3] text-[#0A7A47]">
                  Terminé
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
            </div>

            {/* Logs List inside Phase */}
            {phaseLogs.length > 0 && (
              <div className="space-y-1.5 pl-2 border-l-2 border-[rgba(0,0,0,0.06)] mt-2">
                {phaseLogs.map((log, idx) => {
                  const isSuccess = log.type === 'success';
                  const isWarning = log.type === 'warning';
                  const isError = log.type === 'error';
                  const isInfo = log.type === 'info';
                  const isLoading = log.type === 'loading';

                  return (
                    <div
                      key={`${phase.id}_${idx}`}
                      className="flex items-center gap-2 text-[12px] animate-[fadeIn_200ms_ease-out_forwards]"
                    >
                      {/* Icon */}
                      {isSuccess && <CheckCircle size={13} className="text-[#12B76A] flex-shrink-0" />}
                      {isWarning && <AlertTriangle size={13} className="text-[#D4960A] flex-shrink-0" />}
                      {isError && <XCircle size={13} className="text-[#E8442A] flex-shrink-0" />}
                      {isInfo && <Info size={13} className="text-[#475569] flex-shrink-0" />}
                      {isLoading && (
                        <Loader size={13} className="text-[#4F46E5] animate-spin flex-shrink-0" />
                      )}

                      {/* Message text */}
                      <span
                        className={`font-medium ${
                          isError
                            ? 'text-[#B83218]'
                            : isInfo
                            ? 'text-[#475569]'
                            : 'text-[#1E293B]'
                        }`}
                      >
                        {log.message}
                        {isLoading && <span className="ml-0.5 inline-block animate-pulse font-bold text-[#4F46E5]">▋</span>}
                      </span>

                      {/* Timestamp */}
                      <span className="ml-auto text-[10px] text-[#475569] flex-shrink-0">
                        {log.timestamp}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <div ref={messagesEndRef} />
    </div>
  );
};
