import { useState, useEffect, useRef, useCallback } from 'react';
import {
  AnalyseResponse,
  LogEntry,
  MissingDataItem,
  lancerAnalyse,
} from '../services/analyseService';
import { useProjectData } from '../store/ProjectDataContext';

export interface DocumentStatus {
  id: string;
  name: string;
  type: string;
  status: 'waiting' | 'processing' | 'done' | 'error';
}

export interface UseAnalyseState {
  status: 'idle' | 'processing' | 'missing_data' | 'completed' | 'error';
  globalProgress: number;
  currentPhase: 'lecture' | 'extraction' | 'calcul' | 'finalisation' | null;
  logEntries: LogEntry[];
  documentStatuses: DocumentStatus[];
  missingData: MissingDataItem[];
  estimatedSecondsLeft: number;
  errorMessage: string | null;
}

const INITIAL_DOCUMENTS_DQE: DocumentStatus[] = [
  { id: 'doc-1', name: 'Plan_RDC_Architectural.pdf', type: 'Plan de niveau', status: 'waiting' },
  { id: 'doc-2', name: 'Plan_Etage1_Architectural.pdf', type: 'Plan de niveau', status: 'waiting' },
  { id: 'doc-3', name: 'Coupe_A-A_et_B-B.pdf', type: 'Coupe', status: 'waiting' },
  { id: 'doc-4', name: 'Facade_Principale.pdf', type: 'Façade', status: 'waiting' },
];

const INITIAL_DOCUMENTS_M2: DocumentStatus[] = [
  { id: 'doc-1', name: 'Plan_RDC_Architectural.pdf', type: 'Plan de niveau', status: 'waiting' },
  { id: 'doc-2', name: 'Plan_Etage1_Architectural.pdf', type: 'Plan de niveau', status: 'waiting' },
];

export function useAnalyse(projectId: string = 'p1') {
  const { devisModePipeline } = useProjectData();
  const isM2 = devisModePipeline === 'm2';
  const documentsInitiaux = isM2 ? INITIAL_DOCUMENTS_M2 : INITIAL_DOCUMENTS_DQE;
  const totalDuration = isM2 ? 35 : 75;

  const [state, setState] = useState<UseAnalyseState>({
    status: 'idle',
    globalProgress: 0,
    currentPhase: null,
    logEntries: [],
    documentStatuses: documentsInitiaux,
    missingData: [],
    estimatedSecondsLeft: totalDuration,
    errorMessage: null,
  });

  const apiResponseRef = useRef<AnalyseResponse | null>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const clearAllTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const getTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const addLog = useCallback((log: LogEntry) => {
    setState((prev) => ({
      ...prev,
      currentPhase: log.phase,
      logEntries: [...prev.logEntries, log],
    }));
  }, []);

  const setDocStatus = useCallback((docId: string, status: DocumentStatus['status']) => {
    setState((prev) => ({
      ...prev,
      documentStatuses: prev.documentStatuses.map((doc) =>
        doc.id === docId ? { ...doc, status } : doc
      ),
    }));
  }, []);

  const runAnalysisSequence = useCallback(
    (customAnswers?: Record<string, string>) => {
      clearAllTimers();
      startTimeRef.current = Date.now();
      apiResponseRef.current = null;

      const currentDocs = isM2 ? INITIAL_DOCUMENTS_M2 : INITIAL_DOCUMENTS_DQE;
      const duration = isM2 ? 35 : 75;

      setState({
        status: 'processing',
        globalProgress: 0,
        currentPhase: 'lecture',
        logEntries: [],
        documentStatuses: currentDocs.map((d) => ({ ...d, status: 'waiting' })),
        missingData: [],
        estimatedSecondsLeft: duration,
        errorMessage: null,
      });

      // Launch API call in background
      lancerAnalyse({ project_id: projectId, custom_answers: customAnswers })
        .then((res) => {
          apiResponseRef.current = res;
        })
        .catch((err) => {
          apiResponseRef.current = {
            status: 'error',
            project_id: projectId,
            error_message: err.message || 'Erreur lors de l’analyse',
          };
        });

      // ETA Countdown timer
      intervalRef.current = setInterval(() => {
        setState((prev) => {
          const elapsedSec = Math.floor((Date.now() - startTimeRef.current) / 1000);
          const remainingSec = Math.max(0, duration - elapsedSec);

          let progress = 0;
          if (isM2) {
            if (elapsedSec <= 8) {
              progress = Math.min(20, (elapsedSec / 8) * 20);
            } else if (elapsedSec <= 20) {
              progress = Math.min(50, 20 + ((elapsedSec - 8) / 12) * 30);
            } else if (elapsedSec <= 30) {
              progress = Math.min(85, 50 + ((elapsedSec - 20) / 10) * 35);
            } else {
              progress = Math.min(100, 85 + ((elapsedSec - 30) / 5) * 15);
            }
          } else {
            if (elapsedSec <= 15) {
              progress = Math.min(20, (elapsedSec / 15) * 20);
            } else if (elapsedSec <= 40) {
              progress = Math.min(50, 20 + ((elapsedSec - 15) / 25) * 30);
            } else if (elapsedSec <= 65) {
              progress = Math.min(85, 50 + ((elapsedSec - 40) / 25) * 35);
            } else {
              progress = Math.min(100, 85 + ((elapsedSec - 65) / 10) * 15);
            }
          }

          return {
            ...prev,
            estimatedSecondsLeft: remainingSec,
            globalProgress: Math.round(progress),
          };
        });
      }, 1000);

      // Timeline schedule of events
      const scheduleEvent = (delayMs: number, fn: () => void) => {
        const timer = setTimeout(fn, delayMs);
        timersRef.current.push(timer);
      };

      const handleFinishAnalysis = () => {
        const response = apiResponseRef.current;
        if (response?.status === 'missing_data' && response.missing_data) {
          setState((prev) => ({
            ...prev,
            status: 'missing_data',
            missingData: response.missing_data || [],
            globalProgress: 100,
          }));
        } else if (response?.status === 'error') {
          setState((prev) => ({
            ...prev,
            status: 'error',
            errorMessage: response.error_message || 'Une erreur est survenue lors de l’analyse.',
          }));
        } else {
          setState((prev) => ({
            ...prev,
            status: 'completed',
            globalProgress: 100,
          }));
        }
      };

      if (isM2) {
        // --- Séquence m² (35s) ---
        // PHASE 1 — Lecture (0-8s)
        scheduleEvent(500, () => {
          addLog({
            type: 'info',
            message: 'Lecture des documents en cours...',
            timestamp: getTimestamp(),
            phase: 'lecture',
          });
          setDocStatus('doc-1', 'processing');
        });

        scheduleEvent(3000, () => {
          setDocStatus('doc-1', 'done');
          setDocStatus('doc-2', 'processing');
        });

        scheduleEvent(5000, () => {
          addLog({
            type: 'success',
            message: '2 documents lus avec succès',
            timestamp: getTimestamp(),
            phase: 'lecture',
          });
        });

        scheduleEvent(7000, () => {
          setDocStatus('doc-2', 'done');
          addLog({
            type: 'success',
            message: 'Échelle détectée — 1/100',
            timestamp: getTimestamp(),
            phase: 'lecture',
          });
        });

        // PHASE 2 — Extraction (8-20s)
        scheduleEvent(9000, () => {
          addLog({
            type: 'loading',
            message: 'Extraction des surfaces en cours...',
            timestamp: getTimestamp(),
            phase: 'extraction',
          });
        });

        scheduleEvent(13000, () => {
          addLog({
            type: 'success',
            message: '2 niveaux identifiés (RDC + R+1)',
            timestamp: getTimestamp(),
            phase: 'extraction',
          });
        });

        scheduleEvent(17000, () => {
          addLog({
            type: 'success',
            message: '8 pièces identifiées',
            timestamp: getTimestamp(),
            phase: 'extraction',
          });
        });

        scheduleEvent(20000, () => {
          addLog({
            type: 'success',
            message: 'Dimensions extérieures extraites',
            timestamp: getTimestamp(),
            phase: 'extraction',
          });
        });

        // PHASE 3 — Calcul (20-30s)
        scheduleEvent(22000, () => {
          addLog({
            type: 'loading',
            message: 'Calcul des surfaces par pièce en cours...',
            timestamp: getTimestamp(),
            phase: 'calcul',
          });
        });

        scheduleEvent(26000, () => {
          addLog({
            type: 'success',
            message: 'Surface RDC calculée : 245.80 m²',
            timestamp: getTimestamp(),
            phase: 'calcul',
          });
        });

        scheduleEvent(29000, () => {
          addLog({
            type: 'success',
            message: 'Surface R+1 calculée : 198.40 m²',
            timestamp: getTimestamp(),
            phase: 'calcul',
          });
        });

        // PHASE 4 — Finalisation (30-35s)
        scheduleEvent(31000, () => {
          addLog({
            type: 'loading',
            message: 'Génération du devis par m²...',
            timestamp: getTimestamp(),
            phase: 'finalisation',
          });
        });

        scheduleEvent(33000, () => {
          addLog({
            type: 'success',
            message: 'Devis structuré par pièce et par niveau',
            timestamp: getTimestamp(),
            phase: 'finalisation',
          });
        });

        scheduleEvent(35000, () => {
          addLog({
            type: 'success',
            message: 'Analyse terminée',
            timestamp: getTimestamp(),
            phase: 'finalisation',
          });
          handleFinishAnalysis();
        });
      } else {
        // --- Séquence DQE (75s) ---
        // PHASE 1 — Lecture (0-15s)
        scheduleEvent(500, () => {
          addLog({
            type: 'info',
            message: 'Lecture des documents en cours...',
            timestamp: getTimestamp(),
            phase: 'lecture',
          });
          setDocStatus('doc-1', 'processing');
        });

        scheduleEvent(3000, () => {
          setDocStatus('doc-1', 'done');
          setDocStatus('doc-2', 'processing');
        });

        scheduleEvent(4000, () => {
          addLog({
            type: 'success',
            message: '4 documents lus avec succès',
            timestamp: getTimestamp(),
            phase: 'lecture',
          });
        });

        scheduleEvent(6000, () => {
          setDocStatus('doc-2', 'done');
          setDocStatus('doc-3', 'processing');
          addLog({
            type: 'success',
            message: 'Échelle détectée — 1/100',
            timestamp: getTimestamp(),
            phase: 'lecture',
          });
        });

        scheduleEvent(9000, () => {
          setDocStatus('doc-3', 'done');
          setDocStatus('doc-4', 'processing');
        });

        scheduleEvent(11000, () => {
          setDocStatus('doc-4', 'done');
          addLog({
            type: 'success',
            message: '2 niveaux identifiés (RDC + R+1)',
            timestamp: getTimestamp(),
            phase: 'lecture',
          });
        });

        // PHASE 2 — Extraction (15-40s)
        scheduleEvent(15000, () => {
          addLog({
            type: 'loading',
            message: 'Extraction des dimensions en cours...',
            timestamp: getTimestamp(),
            phase: 'extraction',
          });
        });

        scheduleEvent(19000, () => {
          addLog({
            type: 'success',
            message: '8 pièces identifiées',
            timestamp: getTimestamp(),
            phase: 'extraction',
          });
        });

        scheduleEvent(24000, () => {
          addLog({
            type: 'success',
            message: 'Dimensions extérieures extraites',
            timestamp: getTimestamp(),
            phase: 'extraction',
          });
        });

        scheduleEvent(28000, () => {
          addLog({
            type: 'success',
            message: '14 ouvertures détectées (portes + fenêtres)',
            timestamp: getTimestamp(),
            phase: 'extraction',
          });
        });

        scheduleEvent(32000, () => {
          addLog({
            type: 'success',
            message: 'Hauteur sous plafond : 2.80 m',
            timestamp: getTimestamp(),
            phase: 'extraction',
          });
        });

        scheduleEvent(35000, () => {
          addLog({
            type: 'loading',
            message: 'Lecture des coupes en cours...',
            timestamp: getTimestamp(),
            phase: 'extraction',
          });
        });

        scheduleEvent(38000, () => {
          addLog({
            type: 'success',
            message: 'Épaisseur dalle : détectée 15 cm',
            timestamp: getTimestamp(),
            phase: 'extraction',
          });
        });

        // PHASE 3 — Calcul (40-65s)
        scheduleEvent(41000, () => {
          addLog({
            type: 'loading',
            message: 'Calcul du métré en cours...',
            timestamp: getTimestamp(),
            phase: 'calcul',
          });
        });

        scheduleEvent(45000, () => {
          addLog({
            type: 'success',
            message: 'LOT 1 — Terrassement calculé',
            timestamp: getTimestamp(),
            phase: 'calcul',
          });
        });

        scheduleEvent(48000, () => {
          addLog({
            type: 'success',
            message: 'LOT 2 — Gros œuvre calculé',
            timestamp: getTimestamp(),
            phase: 'calcul',
          });
        });

        scheduleEvent(52000, () => {
          addLog({
            type: 'success',
            message: 'LOT 3 — Maçonnerie calculée',
            timestamp: getTimestamp(),
            phase: 'calcul',
          });
        });

        scheduleEvent(55000, () => {
          addLog({
            type: 'success',
            message: 'LOT 4 — Chape & Dallage calculé',
            timestamp: getTimestamp(),
            phase: 'calcul',
          });
        });

        scheduleEvent(58000, () => {
          addLog({
            type: 'success',
            message: 'LOT 5 — Menuiserie calculée',
            timestamp: getTimestamp(),
            phase: 'calcul',
          });
        });

        scheduleEvent(62000, () => {
          addLog({
            type: 'success',
            message: 'LOT 6 — Enduits & Peinture calculés',
            timestamp: getTimestamp(),
            phase: 'calcul',
          });
        });

        // PHASE 4 — Finalisation (65-75s)
        scheduleEvent(65000, () => {
          addLog({
            type: 'loading',
            message: 'Génération du DQE complet...',
            timestamp: getTimestamp(),
            phase: 'finalisation',
          });
        });

        scheduleEvent(68000, () => {
          addLog({
            type: 'success',
            message: 'DQE structuré en 6 lots',
            timestamp: getTimestamp(),
            phase: 'finalisation',
          });
        });

        scheduleEvent(71000, () => {
          addLog({
            type: 'success',
            message: 'Matériaux décomposés avec dosages',
            timestamp: getTimestamp(),
            phase: 'finalisation',
          });
        });

        scheduleEvent(74000, () => {
          addLog({
            type: 'success',
            message: 'Analyse terminée',
            timestamp: getTimestamp(),
            phase: 'finalisation',
          });
          handleFinishAnalysis();
        });
      }
    },
    [projectId, isM2, addLog, setDocStatus]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  const recommencerAnalyse = (customAnswers?: Record<string, string>) => {
    runAnalysisSequence(customAnswers);
  };

  const simulateMissingData = () => {
    runAnalysisSequence({ simulate_missing: 'true' });
  };

  return {
    state,
    runAnalysisSequence,
    recommencerAnalyse,
    simulateMissingData,
  };
}
