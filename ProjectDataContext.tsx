import React, { createContext, useContext, useCallback, useState, useEffect, ReactNode } from 'react';
import { CalcLot, Hypothese, MOCK_CAHIER, MOCK_HYPOTHESES, MOCK_PIECES_METRE } from '../data/mockCahier';
import { DQELot, DQEItem, MOCK_DQE_LOTS } from '../data/mockDQE';
import { syncDQEQuantitesFromCahier } from '../data/deriveDQE';
import { Piece } from '../types/devis';
import { MonPrix } from '../types/materiaux';
import { MOCK_MES_PRIX } from '../data/mockMesPrix';
import { LOTS_PREDEFINIS, LotPredefini } from '../data/lotsPredefinis';
import { loadCabinetData, saveCabinetMesPrix, saveCabinetCustomLots, saveCabinetInfo } from './cabinetStorage';
import { CabinetInfo } from '../types/recap';

export type DevisModePipeline = 'dqe' | 'm2' | null;

export type ProjectStepId =
  | 'upload'
  | 'mode-choix'
  | 'analyse'
  | 'cahier'
  | 'dqe'
  | 'devis'
  | 'recap'
  | 'variantes'
  | 'historique';

export const STEP_ORDER_DQE: ProjectStepId[] = [
  'upload',
  'mode-choix',
  'analyse',
  'cahier',
  'dqe',
  'devis',
  'recap',
  'variantes',
  'historique',
];

export const STEP_ORDER_M2: ProjectStepId[] = [
  'upload',
  'mode-choix',
  'analyse',
  'devis',
  'recap',
  'variantes',
  'historique',
];

interface ProjectDataContextValue {
  // --- Choix du mode de devis (fait juste après l'upload, avant l'analyse IA) ---
  devisModePipeline: DevisModePipeline;
  setDevisModePipeline: (mode: DevisModePipeline) => void;

  // --- Suivi de progression des étapes par projet ---
  getProjectMaxReachedStep: (projectId: string, projectStatus?: string) => ProjectStepId;
  advanceProjectStep: (projectId: string, nextStep: ProjectStepId) => void;
  markProjectCompleted: (projectId: string) => void;

  // --- Métré (Cahier de calcul) ---
  cahierLots: CalcLot[];
  hypotheses: Hypothese[];
  updateCahierEditableValue: (itemId: string, value: string) => void;
  recalculateMetre: (itemId: string) => void;

  // --- DQE (dérivé du métré + personnalisations libres) ---
  dqeLots: DQELot[];
  updateDQEPrix: (itemId: string, prix: number | null) => void;
  updateDQEQuantite: (itemId: string, quantite: number) => void;
  updateDQEUnite: (itemId: string, unite: string) => void;
  deleteDQEItem: (itemId: string) => void;
  addDQEItem: (lotId: number, item: Partial<DQEItem>) => void;
  addDQELot: (nom: string, color: string, bgColor: string, corpsMetier?: string) => void;
  deleteDQELot: (lotId: number) => void;

  // --- Bibliothèque de matériaux ("Mes prix") ---
  // Source unique utilisée par la page Bibliothèque ET par l'auto-suggestion
  // de matériaux à l'ajout d'un lot dans le DQE.
  bibliothequeMesPrix: MonPrix[];
  updateBibliothequePrix: (id: string, prix: number) => void;
  deleteBibliothequePrix: (id: string) => void;
  addBibliothequePrix: (item: Omit<MonPrix, 'id'>) => void;

  // --- Modèle Cabinet (persistant entre projets) ---
  // Fusion du catalogue statique + des lots personnalisés déjà créés par le
  // cabinet sur des projets précédents (voir src/store/cabinetStorage.ts).
  lotsPredefinisDisponibles: LotPredefini[];
  cabinetInfo: CabinetInfo;
  updateCabinetInfo: (info: CabinetInfo) => void;

  // --- Devis Mode B (par pièce / m²) ---
  pieces: Piece[];
  updatePiecePrix: (pieceId: string, prix: number) => void;
  applyPrixToAllPieces: (prix: number) => void;
}

const ProjectDataContext = createContext<ProjectDataContextValue | null>(null);

// --- Helpers récursifs sur l'arborescence DQE (lots > sous-lots > détails) ---
function updateItemInList(
  items: DQEItem[],
  itemId: string,
  updater: (item: DQEItem) => DQEItem
): DQEItem[] {
  return items.map((item) => {
    if (item.id === itemId) return updater(item);
    if (item.isSubLot && item.children) {
      return { ...item, children: updateItemInList(item.children, itemId, updater) };
    }
    return item;
  });
}

function deleteItemFromList(items: DQEItem[], itemId: string): DQEItem[] {
  return items
    .filter((item) => item.id !== itemId)
    .map((item) =>
      item.isSubLot && item.children
        ? { ...item, children: deleteItemFromList(item.children, itemId) }
        : item
    );
}

function calculateLotSousTotal(items: DQEItem[]): number {
  let total = 0;
  for (const item of items) {
    if (item.isSubLot && item.children) {
      total += calculateLotSousTotal(item.children);
    } else if (item.montant !== null && !isNaN(item.montant)) {
      total += item.montant;
    }
  }
  return Math.round(total);
}

export const ProjectDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [devisModePipeline, setDevisModePipeline] = useState<DevisModePipeline>(() => {
    try {
      const saved = localStorage.getItem('metrio_devis_mode_pipeline');
      if (saved === 'dqe' || saved === 'm2') return saved;
      return null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (devisModePipeline) {
        localStorage.setItem('metrio_devis_mode_pipeline', devisModePipeline);
      } else {
        localStorage.removeItem('metrio_devis_mode_pipeline');
      }
    } catch {
      // silencieux, non bloquant
    }
  }, [devisModePipeline]);

  const [projectStepProgress, setProjectStepProgress] = useState<Record<string, ProjectStepId>>(() => {
    try {
      const saved = localStorage.getItem('metrio_project_step_progress');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      '1': 'historique',
      '2': 'analyse',
      '3': 'analyse',
      '4': 'upload',
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('metrio_project_step_progress', JSON.stringify(projectStepProgress));
    } catch (e) {
      // ignore
    }
  }, [projectStepProgress]);

  const getProjectMaxReachedStep = useCallback(
    (projectId: string, projectStatus?: string): ProjectStepId => {
      if (projectStatus === 'completed') return 'historique';
      if (projectStepProgress[projectId]) return projectStepProgress[projectId];
      if (projectId === '1') return 'historique';
      if (projectId === '2' || projectId === '3') return 'analyse';
      return 'upload';
    },
    [projectStepProgress]
  );

  const advanceProjectStep = useCallback((projectId: string, nextStep: ProjectStepId) => {
    setProjectStepProgress((prev) => {
      const current =
        prev[projectId] ||
        (projectId === '1' ? 'historique' : projectId === '2' || projectId === '3' ? 'analyse' : 'upload');
      const order = STEP_ORDER_DQE;
      const currentIdx = order.indexOf(current);
      const nextIdx = order.indexOf(nextStep);
      if (nextIdx > currentIdx) {
        return { ...prev, [projectId]: nextStep };
      }
      return prev;
    });
  }, []);

  const markProjectCompleted = useCallback((projectId: string) => {
    setProjectStepProgress((prev) => ({ ...prev, [projectId]: 'historique' }));
  }, []);
  const [cahierLots, setCahierLots] = useState<CalcLot[]>(MOCK_CAHIER);
  const [hypotheses] = useState<Hypothese[]>(MOCK_HYPOTHESES);
  const [dqeLots, setDqeLots] = useState<DQELot[]>(MOCK_DQE_LOTS);
  const [pieces, setPieces] = useState<Piece[]>(MOCK_PIECES_METRE);

  // Charge une seule fois les données déjà mémorisées pour ce cabinet
  // (prix ajustés + lots personnalisés créés sur des projets précédents + infos cabinet).
  const [cabinetInitial] = useState(() => loadCabinetData());
  const [bibliothequeMesPrix, setBibliothequeMesPrix] = useState<MonPrix[]>(
    cabinetInitial.mesPrix && cabinetInitial.mesPrix.length > 0 ? cabinetInitial.mesPrix : MOCK_MES_PRIX
  );
  const [cabinetCustomLots, setCabinetCustomLots] = useState<LotPredefini[]>(cabinetInitial.customLots);

  const defaultCabinetInfo: CabinetInfo = {
    nom: 'Cabinet Architecture Diallo',
    email: 'contact@diallo-archi.com',
    telephone: '+225 07 00 00 00',
    adresse: 'Cocody, Abidjan',
    logoUrl: null,
  };

  const [cabinetInfo, setCabinetInfo] = useState<CabinetInfo>(
    () => cabinetInitial.cabinetInfo ?? defaultCabinetInfo
  );

  // Persistance automatique niveau Cabinet (voir cabinetStorage.ts — à
  // remplacer par une vraie API Supabase quand le backend sera branché).
  useEffect(() => {
    saveCabinetMesPrix(bibliothequeMesPrix);
  }, [bibliothequeMesPrix]);

  useEffect(() => {
    saveCabinetCustomLots(cabinetCustomLots);
  }, [cabinetCustomLots]);

  useEffect(() => {
    saveCabinetInfo(cabinetInfo);
  }, [cabinetInfo]);

  const updateCabinetInfo = useCallback((info: CabinetInfo) => {
    setCabinetInfo(info);
  }, []);

  const lotsPredefinisDisponibles: LotPredefini[] = [
    ...LOTS_PREDEFINIS,
    ...cabinetCustomLots.filter(
      (custom) => !LOTS_PREDEFINIS.some((l) => l.nom.toLowerCase() === custom.nom.toLowerCase())
    ),
  ];

  // Met juste à jour la valeur saisie par l'utilisateur (avant recalcul)
  const updateCahierEditableValue = useCallback((itemId: string, value: string) => {
    setCahierLots((prevLots) =>
      prevLots.map((lot) => ({
        ...lot,
        items: lot.items.map((item) =>
          item.id === itemId ? { ...item, editableValue: value } : item
        ),
      }))
    );
  }, []);

  // Recalcule les quantités du métré et propage automatiquement vers le DQE
  const recalculateMetre = useCallback((itemId: string) => {
    setCahierLots((prevLots) => {
      const nextLots = JSON.parse(JSON.stringify(prevLots)) as CalcLot[];
      const changedIds: string[] = [];

      // 1. Terrassement (Profondeur de fouilles - terr-2)
      if (itemId === 'terr-2') {
        const terrLot = nextLots.find((l) => l.id === 1);
        if (terrLot) {
          const depthItem = terrLot.items.find((i) => i.id === 'terr-2');
          const depthVal = parseFloat(depthItem?.editableValue || '1.20');
          if (!isNaN(depthVal) && depthVal > 0) {
            depthItem!.result = depthVal;

            const emprise = 122.88;
            const volumeFouilles = Number((emprise * depthVal).toFixed(2));
            const volumeRemblai = Number((volumeFouilles * 0.3).toFixed(2));
            const volumeEvacuation = Number((volumeFouilles - volumeRemblai).toFixed(2));

            const terr3 = terrLot.items.find((i) => i.id === 'terr-3');
            if (terr3) {
              terr3.formula = `${emprise} × ${depthVal}`;
              terr3.result = volumeFouilles;
              changedIds.push('terr-3');
            }
            const terr4 = terrLot.items.find((i) => i.id === 'terr-4');
            if (terr4) {
              terr4.formula = `${volumeFouilles} × 0.30`;
              terr4.result = volumeRemblai;
              changedIds.push('terr-4');
            }
            const terr5 = terrLot.items.find((i) => i.id === 'terr-5');
            if (terr5) {
              terr5.formula = `${volumeFouilles} − ${volumeRemblai}`;
              terr5.result = volumeEvacuation;
              changedIds.push('terr-5');
            }
          }
        }
      }

      // 2. Menuiserie (men-1, men-2, men-3)
      if (['men-1', 'men-2', 'men-3'].includes(itemId)) {
        const menLot = nextLots.find((l) => l.id === 5);
        if (menLot) {
          const men1 = menLot.items.find((i) => i.id === 'men-1');
          const men2 = menLot.items.find((i) => i.id === 'men-2');
          const men3 = menLot.items.find((i) => i.id === 'men-3');
          const men4 = menLot.items.find((i) => i.id === 'men-4');

          const count1 = parseFloat(men1?.editableValue || '8') || 0;
          const count2 = parseFloat(men2?.editableValue || '2') || 0;
          const count3 = parseFloat(men3?.editableValue || '10') || 0;

          if (men1) { men1.result = count1; changedIds.push('men-1'); }
          if (men2) { men2.result = count2; changedIds.push('men-2'); }
          if (men3) { men3.result = count3; changedIds.push('men-3'); }

          if (men4) {
            const vitreeFen = count3 * 1.2 * 1.2;
            const vitreePortes = count2 * 1.4 * 2.2;
            const totalVitree = Number((vitreeFen + vitreePortes).toFixed(2));
            men4.formula = `(${count3}×1.20×1.20)+(${count2}×1.40×2.20)`;
            men4.result = totalVitree;
          }
        }
      }

      // Propagation immédiate vers le DQE (et donc vers le Devis, qui lit le DQE)
      if (changedIds.length > 0) {
        const quantiteParId: Record<string, number> = {};
        for (const lot of nextLots) {
          for (const item of lot.items) {
            if (changedIds.includes(item.id)) quantiteParId[item.id] = item.result;
          }
        }
        setDqeLots((prevDqeLots) => syncDQEQuantitesFromCahier(prevDqeLots, quantiteParId));
      }

      return nextLots;
    });
  }, []);

  const updateDQEPrix = useCallback((itemId: string, prix: number | null) => {
    setDqeLots((prevLots) =>
      prevLots.map((lot) => {
        const nextItems = updateItemInList(lot.items, itemId, (item) => ({
          ...item,
          prixUnitaire: prix,
          montant: prix !== null && !isNaN(prix) ? Math.round(item.quantite * prix) : null,
        }));
        return { ...lot, items: nextItems, sousTotal: calculateLotSousTotal(nextItems) };
      })
    );
  }, []);

  const updateDQEQuantite = useCallback((itemId: string, quantite: number) => {
    setDqeLots((prevLots) =>
      prevLots.map((lot) => {
        const nextItems = updateItemInList(lot.items, itemId, (item) => ({
          ...item,
          quantite,
          montant:
            item.prixUnitaire !== null && !isNaN(item.prixUnitaire)
              ? Math.round(quantite * item.prixUnitaire)
              : null,
        }));
        return { ...lot, items: nextItems, sousTotal: calculateLotSousTotal(nextItems) };
      })
    );
  }, []);

  const updateDQEUnite = useCallback((itemId: string, unite: string) => {
    setDqeLots((prevLots) =>
      prevLots.map((lot) => {
        const nextItems = updateItemInList(lot.items, itemId, (item) => ({
          ...item,
          unite,
        }));
        return { ...lot, items: nextItems, sousTotal: calculateLotSousTotal(nextItems) };
      })
    );
  }, []);

  const deleteDQEItem = useCallback((itemId: string) => {
    setDqeLots((prevLots) =>
      prevLots.map((lot) => {
        const nextItems = deleteItemFromList(lot.items, itemId);
        return { ...lot, items: nextItems, sousTotal: calculateLotSousTotal(nextItems) };
      })
    );
  }, []);

  const addDQEItem = useCallback((lotId: number, partialItem: Partial<DQEItem>) => {
    setDqeLots((prevLots) =>
      prevLots.map((lot) => {
        if (lot.id !== lotId) return lot;

        const newItemId = `item-custom-${Date.now()}`;
        const pu = partialItem.prixUnitaire ?? null;
        const qty = partialItem.quantite ?? 1;
        const mnt = pu !== null ? Math.round(qty * pu) : null;

        const newItem: DQEItem = {
          id: newItemId,
          numero: partialItem.numero || `${lot.numero}.${lot.items.length + 1}`,
          designation: partialItem.designation || 'Nouvel ouvrage',
          unite: partialItem.unite || 'u',
          quantite: qty,
          prixUnitaire: pu,
          montant: mnt,
          observation: partialItem.observation || null,
          isSubLot: partialItem.isSubLot || false,
          isDetail: partialItem.isDetail || false,
          isLotHeader: false,
          children: partialItem.isSubLot ? [] : undefined,
        };

        const nextItems = [...lot.items, newItem];
        return { ...lot, items: nextItems, sousTotal: calculateLotSousTotal(nextItems) };
      })
    );
  }, []);

  const addDQELot = useCallback(
    (nom: string, color: string, bgColor: string, corpsMetier?: string) => {
      setDqeLots((prevLots) => {
        const nextId = prevLots.length > 0 ? Math.max(...prevLots.map((l) => l.id)) + 1 : 1;

        // Auto-suggestion : propose les matériaux de la bibliothèque déjà tagués
        // avec ce corps de métier. L'utilisateur garde la main pour ajuster
        // quantités/prix ou supprimer ce qui ne s'applique pas.
        const suggestedItems: DQEItem[] = corpsMetier
          ? bibliothequeMesPrix
              .filter((mp) => mp.corpsMetier === corpsMetier)
              .map((mp, idx) => ({
                id: `item-from-lib-${mp.id}-${Date.now()}`,
                numero: `${nextId}.${idx + 1}`,
                designation: mp.designation,
                unite: mp.unite,
                quantite: 1,
                prixUnitaire: mp.prixActuel,
                montant: mp.prixActuel,
                observation: 'Qté à ajuster',
                isSubLot: false,
                isDetail: false,
                isLotHeader: false,
              }))
          : [];

        const newLot: DQELot = {
          id: nextId,
          numero: String(nextId),
          name: nom.toUpperCase(),
          color,
          bgColor,
          items: suggestedItems,
          sousTotal: calculateLotSousTotal(suggestedItems),
          isCustom: true,
          corpsMetier: corpsMetier ? [corpsMetier] : undefined,
        };

        // Si ce nom de lot n'existe pas encore dans le catalogue (statique ou
        // déjà appris), on le mémorise au niveau Cabinet : il sera proposé
        // directement dans la liste des lots prédéfinis sur les prochains
        // projets, sans que l'utilisateur ait à le re-décrire.
        setCabinetCustomLots((prevCustom) => {
          const alreadyKnown =
            LOTS_PREDEFINIS.some((l) => l.nom.toLowerCase() === nom.toLowerCase()) ||
            prevCustom.some((l) => l.nom.toLowerCase() === nom.toLowerCase());
          if (alreadyKnown) return prevCustom;
          return [...prevCustom, { nom, color, bgColor, corpsMetier: corpsMetier || '' }];
        });

        return [...prevLots, newLot];
      });
    },
    [bibliothequeMesPrix]
  );

  const deleteDQELot = useCallback((lotId: number) => {
    setDqeLots((prevLots) => prevLots.filter((lot) => lot.id !== lotId));
  }, []);

  const updateBibliothequePrix = useCallback((id: string, prix: number) => {
    setBibliothequeMesPrix((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, prixActuel: isNaN(prix) || prix < 0 ? 0 : prix } : item
      )
    );
  }, []);

  const deleteBibliothequePrix = useCallback((id: string) => {
    setBibliothequeMesPrix((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addBibliothequePrix = useCallback((newItem: Omit<MonPrix, 'id'>) => {
    setBibliothequeMesPrix((prev) => [...prev, { ...newItem, id: `mp_user_${Date.now()}` }]);
  }, []);

  const updatePiecePrix = useCallback((pieceId: string, prix: number) => {
    setPieces((prev) =>
      prev.map((p) => {
        if (p.id !== pieceId) return p;
        const pVal = isNaN(prix) || prix <= 0 ? null : prix;
        return {
          ...p,
          prixAuM2: pVal,
          montant: pVal !== null ? Math.round(p.surface_m2 * pVal) : null,
        };
      })
    );
  }, []);

  const applyPrixToAllPieces = useCallback((prix: number) => {
    if (isNaN(prix) || prix <= 0) return;
    setPieces((prev) =>
      prev.map((p) =>
        p.prixAuM2 === null
          ? { ...p, prixAuM2: prix, montant: Math.round(p.surface_m2 * prix) }
          : p
      )
    );
  }, []);

  return (
    <ProjectDataContext.Provider
      value={{
        devisModePipeline,
        setDevisModePipeline,
        getProjectMaxReachedStep,
        advanceProjectStep,
        markProjectCompleted,
        cahierLots,
        hypotheses,
        updateCahierEditableValue,
        recalculateMetre,
        dqeLots,
        updateDQEPrix,
        updateDQEQuantite,
        updateDQEUnite,
        deleteDQEItem,
        addDQEItem,
        addDQELot,
        deleteDQELot,
        bibliothequeMesPrix,
        updateBibliothequePrix,
        deleteBibliothequePrix,
        addBibliothequePrix,
        lotsPredefinisDisponibles,
        cabinetInfo,
        updateCabinetInfo,
        pieces,
        updatePiecePrix,
        applyPrixToAllPieces,
      }}
    >
      {children}
    </ProjectDataContext.Provider>
  );
};

export function useProjectData(): ProjectDataContextValue {
  const ctx = useContext(ProjectDataContext);
  if (!ctx) {
    throw new Error('useProjectData() doit être utilisé à l\'intérieur de <ProjectDataProvider>');
  }
  return ctx;
}
