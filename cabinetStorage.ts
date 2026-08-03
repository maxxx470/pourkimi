import { MonPrix } from '../types/materiaux';
import { LotPredefini } from '../data/lotsPredefinis';
import { CabinetInfo } from '../types/recap';

// -----------------------------------------------------------------------------
// Persistance niveau CABINET (pas niveau projet).
//
// Objectif : les lots personnalisés créés et les prix ajustés par l'utilisateur
// doivent être réutilisés automatiquement sur TOUS ses projets futurs, sans
// avoir à reconfigurer le tableau DQE à chaque fois (cf. discussion produit).
//
// ⚠️ IMPLÉMENTATION ACTUELLE : localStorage, en attendant le vrai backend.
// Les routes /api/dqe, /api/devis, /api/analyse (routes/*.ts) ne font
// aujourd'hui que des console.log — rien n'est encore persisté côté serveur.
// Cette persistance locale sert de simulation fonctionnelle pour la maquette,
// mais devra être remplacée par de vraies tables Supabase, par exemple :
//   - cabinet_mes_prix       (id, cabinet_id, designation, unite, prix_suggere,
//                              prix_actuel, corps_metier)
//   - cabinet_lots_templates (id, cabinet_id, nom, color, bg_color, corps_metier)
// scopées par cabinet_id (et non par utilisateur — cf. décision "niveau Cabinet").
// -----------------------------------------------------------------------------

const STORAGE_KEY = 'metrio_cabinet_v1';

export interface CabinetData {
  mesPrix: MonPrix[] | null;
  customLots: LotPredefini[];
  cabinetInfo: CabinetInfo | null;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && !!window.localStorage;
}

export function loadCabinetData(): CabinetData {
  if (!isBrowser()) return { mesPrix: null, customLots: [], cabinetInfo: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { mesPrix: null, customLots: [], cabinetInfo: null };
    const parsed = JSON.parse(raw) as CabinetData;
    return {
      mesPrix: parsed.mesPrix ?? null,
      customLots: parsed.customLots ?? [],
      cabinetInfo: parsed.cabinetInfo ?? null,
    };
  } catch (err) {
    console.error('Erreur de lecture des données cabinet:', err);
    return { mesPrix: null, customLots: [], cabinetInfo: null };
  }
}

export function saveCabinetMesPrix(mesPrix: MonPrix[]): void {
  if (!isBrowser()) return;
  try {
    const current = loadCabinetData();
    const next: CabinetData = { ...current, mesPrix };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (err) {
    console.error('Erreur de sauvegarde des prix cabinet:', err);
  }
}

export function saveCabinetCustomLots(customLots: LotPredefini[]): void {
  if (!isBrowser()) return;
  try {
    const current = loadCabinetData();
    const next: CabinetData = { ...current, customLots };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (err) {
    console.error('Erreur de sauvegarde des lots cabinet:', err);
  }
}

export function saveCabinetInfo(cabinetInfo: CabinetInfo): void {
  if (!isBrowser()) return;
  try {
    const current = loadCabinetData();
    const next: CabinetData = { ...current, cabinetInfo };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (err) {
    console.error('Erreur de sauvegarde des informations cabinet:', err);
  }
}
