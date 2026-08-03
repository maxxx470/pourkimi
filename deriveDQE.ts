import type { CalcLot } from './mockCahier';
import type { DQEItem, DQELot } from './mockDQE';

const RATIO_BETON_CIMENT_KG_PAR_M3 = 350;
const RATIO_BETON_SABLE_M3_PAR_M3 = 0.4;
const RATIO_PARPAINGS_U_PAR_M2 = 12.5;
const RATIO_MORTIER_CIMENT_KG_PAR_M2 = 30;
const RATIO_MORTIER_SABLE_M3_PAR_M2 = 0.06;
const RATIO_CHAPE_CIMENT_SAC_PAR_M2 = 0.45;
const SAC_CIMENT_KG = 50;

const DEFAULT_PRICES: Record<string, number> = {
  'terr-3': 8500,
  'go-0': 125000,
  'go-1': 125000,
  'go-2': 125000,
  'go-3': 125000,
  'go-4': 125000,
  'mac-parpaings': 450,
};

function findCahierResult(cahierLots: CalcLot[], itemId: string): number {
  for (const lot of cahierLots) {
    const item = lot.items.find((i) => i.id === itemId);
    if (item) return item.result;
  }
  return 0;
}

type ItemInput = Partial<DQEItem> & {
  id: string;
  designation: string;
  unite: string;
  quantite: number;
};

function makeItem(partial: ItemInput): DQEItem {
  const prixUnitaire =
    partial.prixUnitaire !== undefined ? partial.prixUnitaire : DEFAULT_PRICES[partial.id] ?? null;
  const montant =
    prixUnitaire !== null && prixUnitaire !== undefined
      ? Math.round(partial.quantite * prixUnitaire)
      : null;
  return {
    numero: '',
    observation: null,
    isSubLot: false,
    isDetail: false,
    isLotHeader: false,
    ...partial,
    prixUnitaire: prixUnitaire ?? null,
    montant,
  };
}

function sousTotalOf(items: DQEItem[]): number {
  let total = 0;
  for (const item of items) {
    if (item.isSubLot && item.children) total += sousTotalOf(item.children);
    else if (item.montant !== null && !isNaN(item.montant)) total += item.montant;
  }
  return Math.round(total);
}

export function buildDQELotsFromCahier(cahierLots: CalcLot[]): DQELot[] {
  const g = (id: string) => findCahierResult(cahierLots, id);
  const lots: DQELot[] = [
    {
      id: 1,
      numero: '1',
      name: 'TERRASSEMENT',
      color: '#92400E',
      bgColor: '#FEF3C7',
      sousTotal: 0,
      items: [
        makeItem({
          id: 'terr-3',
          numero: '1.1',
          designation: 'Fouilles en rigoles',
          unite: 'm³',
          quantite: g('terr-3'),
          observation: `Prof. ${g('terr-2')} m`,
        }),
        makeItem({
          id: 'terr-4',
          numero: '1.2',
          designation: 'Remblai et compactage',
          unite: 'm³',
          quantite: g('terr-4'),
        }),
        makeItem({
          id: 'terr-5',
          numero: '1.3',
          designation: 'Évacuation des déblais',
          unite: 'm³',
          quantite: g('terr-5'),
        }),
      ],
    },
    {
      id: 2,
      numero: '2',
      name: 'GROS ŒUVRE — BÉTON ARMÉ',
      color: '#1E40AF',
      bgColor: '#DBEAFE',
      sousTotal: 0,
      items: [
        {
          ...makeItem({
            id: 'go-sub-semelles',
            numero: '2.1',
            designation: 'Semelles de fondation',
            unite: '',
            quantite: 0,
          }),
          isSubLot: true,
          children: [
            makeItem({
              id: 'go-0',
              numero: '2.1.1',
              designation: 'Béton semelles dosé 350 kg/m³',
              unite: 'm³',
              quantite: g('go-0'),
            }),
            makeItem({
              id: 'go-0-ciment',
              numero: '',
              designation: '↳ Ciment (sacs 50 kg)',
              unite: 'sac',
              quantite: Math.round((g('go-0') * RATIO_BETON_CIMENT_KG_PAR_M3) / SAC_CIMENT_KG),
              isDetail: true,
            }),
            makeItem({
              id: 'go-0-sable',
              numero: '',
              designation: '↳ Sable',
              unite: 'm³',
              quantite: Number((g('go-0') * RATIO_BETON_SABLE_M3_PAR_M3).toFixed(2)),
              isDetail: true,
            }),
          ],
        },
        {
          ...makeItem({
            id: 'go-sub-poteaux',
            numero: '2.2',
            designation: 'Poteaux béton armé',
            unite: '',
            quantite: 0,
          }),
          isSubLot: true,
          children: [
            makeItem({
              id: 'go-1',
              numero: '2.2.1',
              designation: 'Béton poteaux RDC (25×25 cm)',
              unite: 'm³',
              quantite: g('go-1'),
              observation: 'Défaut',
              isDefault: true,
            }),
            makeItem({
              id: 'go-2',
              numero: '2.2.2',
              designation: 'Béton poteaux R+1 (25×25 cm)',
              unite: 'm³',
              quantite: g('go-2'),
              observation: 'Défaut',
              isDefault: true,
            }),
          ],
        },
        {
          ...makeItem({
            id: 'go-sub-dalles',
            numero: '2.3',
            designation: 'Dalles',
            unite: '',
            quantite: 0,
          }),
          isSubLot: true,
          children: [
            makeItem({
              id: 'go-3',
              numero: '2.3.1',
              designation: 'Béton dalle RDC (ép. 15 cm)',
              unite: 'm³',
              quantite: g('go-3'),
            }),
            makeItem({
              id: 'go-4',
              numero: '2.3.2',
              designation: 'Béton dalle R+1 (ép. 15 cm)',
              unite: 'm³',
              quantite: g('go-4'),
            }),
          ],
        },
      ],
    },
    {
      id: 3,
      numero: '3',
      name: 'MAÇONNERIE',
      color: '#3730A3',
      bgColor: '#E0E7FF',
      sousTotal: 0,
      items: [
        makeItem({
          id: 'mac-parpaings',
          numero: '3.1',
          designation: 'Parpaings 15×20×40',
          unite: 'u',
          quantite: Math.round(g('mac-3') * RATIO_PARPAINGS_U_PAR_M2),
        }),
        makeItem({
          id: 'mac-mortier-ciment',
          numero: '3.2',
          designation: 'Mortier de pose — Ciment',
          unite: 'sac 50 kg',
          quantite: Math.round((g('mac-3') * RATIO_MORTIER_CIMENT_KG_PAR_M2) / SAC_CIMENT_KG),
          isDetail: true,
        }),
        makeItem({
          id: 'mac-mortier-sable',
          numero: '3.3',
          designation: 'Mortier de pose — Sable',
          unite: 'm³',
          quantite: Number((g('mac-3') * RATIO_MORTIER_SABLE_M3_PAR_M2).toFixed(2)),
          isDetail: true,
        }),
      ],
    },
    {
      id: 4,
      numero: '4',
      name: 'CHAPE & DALLAGE',
      color: '#0F766E',
      bgColor: '#CCFBF1',
      sousTotal: 0,
      items: [
        makeItem({
          id: 'chp-1',
          numero: '4.1',
          designation: 'Chape de sol RDC (ép. 5 cm)',
          unite: 'm²',
          quantite: g('chp-1'),
        }),
        makeItem({
          id: 'chp-2',
          numero: '4.2',
          designation: 'Chape de sol R+1 (ép. 5 cm)',
          unite: 'm²',
          quantite: g('chp-2'),
        }),
        makeItem({
          id: 'chp-d1',
          numero: '',
          designation: '↳ Ciment chape',
          unite: 'sac 50 kg',
          quantite: Math.round(g('chp-3') * RATIO_CHAPE_CIMENT_SAC_PAR_M2),
          isDetail: true,
        }),
      ],
    },
    {
      id: 5,
      numero: '5',
      name: 'MENUISERIE',
      color: '#9A3412',
      bgColor: '#FFEDD5',
      sousTotal: 0,
      items: [
        makeItem({
          id: 'men-1',
          numero: '5.1',
          designation: 'Portes simples int. 90×220 cm',
          unite: 'u',
          quantite: g('men-1'),
        }),
        makeItem({
          id: 'men-2',
          numero: '5.2',
          designation: 'Portes doubles ext. 140×220 cm',
          unite: 'u',
          quantite: g('men-2'),
        }),
        makeItem({
          id: 'men-3',
          numero: '5.3',
          designation: 'Fenêtres 120×120 cm',
          unite: 'u',
          quantite: g('men-3'),
        }),
      ],
    },
    {
      id: 6,
      numero: '6',
      name: 'ENDUITS & PEINTURE',
      color: '#854D0E',
      bgColor: '#FDE68A',
      sousTotal: 0,
      items: [
        makeItem({
          id: 'end-1',
          numero: '6.1',
          designation: 'Enduit intérieur',
          unite: 'm²',
          quantite: g('end-1'),
          observation: 'Majoration 5%',
        }),
        makeItem({
          id: 'end-2',
          numero: '6.2',
          designation: 'Enduit extérieur',
          unite: 'm²',
          quantite: g('end-2'),
          observation: 'Majoration 5%',
        }),
        makeItem({
          id: 'end-3',
          numero: '6.3',
          designation: 'Peinture intérieure (2 couches)',
          unite: 'm²',
          quantite: g('end-3'),
        }),
        makeItem({
          id: 'end-4',
          numero: '6.4',
          designation: 'Peinture extérieure (2 couches)',
          unite: 'm²',
          quantite: g('end-4'),
        }),
      ],
    },
  ];
  return lots.map((lot) => ({ ...lot, sousTotal: sousTotalOf(lot.items) }));
}

export function syncDQEQuantitesFromCahier(
  dqeLots: DQELot[],
  quantiteParId: Record<string, number>
): DQELot[] {
  const updateItems = (items: DQEItem[]): DQEItem[] =>
    items.map((item) => {
      if (quantiteParId[item.id] !== undefined) {
        const quantite = quantiteParId[item.id];
        const montant =
          item.prixUnitaire !== null && item.prixUnitaire !== undefined
            ? Math.round(quantite * item.prixUnitaire)
            : null;
        return { ...item, quantite, montant };
      }
      if (item.isSubLot && item.children) {
        return { ...item, children: updateItems(item.children) };
      }
      return item;
    });

  return dqeLots.map((lot) => {
    const nextItems = updateItems(lot.items);
    return { ...lot, items: nextItems, sousTotal: sousTotalOf(nextItems) };
  });
}
