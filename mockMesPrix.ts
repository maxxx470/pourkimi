import { MonPrix } from '../types/materiaux';

export const CORPS_METIER_MAP: Record<string, string> = {
  all: 'Tous',
  ciment_beton: 'Ciment & Béton',
  granulats: 'Granulats',
  acier: 'Acier & Ferraillage',
  agglos: 'Agglos & Blocs',
  bois_coffrage: 'Bois & Coffrage',
  menuiserie_portes: 'Menuiserie — Portes',
  menuiserie_fenetres: 'Menuiserie — Fenêtres',
  menuiserie_accessoires: 'Menuiserie — Accessoires',
  revetements_sol: 'Revêtements Sol',
  enduits_peinture: 'Enduits & Peinture',
  plomberie: 'Plomberie',
  electricite: 'Électricité',
  isolation: 'Isolation',
  toiture: 'Toiture & Couverture',
  terrassement_vrd: 'Terrassement & VRD',
};

export const MOCK_MES_PRIX: MonPrix[] = [
  // CIMENT & BÉTON
  { id: 'mp1', designation: 'Ciment Portland CPJ45 (sac 50kg)', unite: 'sac', prixSuggere: 6500, prixActuel: 6500, corpsMetier: 'ciment_beton', isSuggestion: true },
  { id: 'mp2', designation: 'Ciment blanc (sac 50kg)', unite: 'sac', prixSuggere: 8500, prixActuel: 8500, corpsMetier: 'ciment_beton', isSuggestion: true },
  { id: 'mp3', designation: 'Béton de propreté dosé 150 kg/m³', unite: 'm³', prixSuggere: 85000, prixActuel: 85000, corpsMetier: 'ciment_beton', isSuggestion: true },
  { id: 'mp4', designation: 'Béton armé dosé 350 kg/m³', unite: 'm³', prixSuggere: 120000, prixActuel: 120000, corpsMetier: 'ciment_beton', isSuggestion: true },
  { id: 'mp5', designation: "Mortier de ciment prêt à l'emploi", unite: 'm³', prixSuggere: 95000, prixActuel: 95000, corpsMetier: 'ciment_beton', isSuggestion: true },
  { id: 'mp6', designation: 'Chape en mortier (finition sol)', unite: 'm²', prixSuggere: 5500, prixActuel: 5500, corpsMetier: 'ciment_beton', isSuggestion: true },

  // GRANULATS
  { id: 'mp7', designation: 'Sable de carrière propre lavé', unite: 'm³', prixSuggere: 25000, prixActuel: 25000, corpsMetier: 'granulats', isSuggestion: true },
  { id: 'mp8', designation: 'Sable de mer pour béton', unite: 'm³', prixSuggere: 22000, prixActuel: 22000, corpsMetier: 'granulats', isSuggestion: true },
  { id: 'mp9', designation: 'Gravier 5/15 pour béton', unite: 'm³', prixSuggere: 28000, prixActuel: 28000, corpsMetier: 'granulats', isSuggestion: true },
  { id: 'mp10', designation: 'Gravier 15/25 pour fondations', unite: 'm³', prixSuggere: 26000, prixActuel: 26000, corpsMetier: 'granulats', isSuggestion: true },
  { id: 'mp11', designation: 'Ballast pour terrassement', unite: 'm³', prixSuggere: 18000, prixActuel: 18000, corpsMetier: 'granulats', isSuggestion: true },
  { id: 'mp12', designation: 'Latérite pour remblaiement', unite: 'm³', prixSuggere: 15000, prixActuel: 15000, corpsMetier: 'granulats', isSuggestion: true },

  // ACIER & FERRAILLAGE
  { id: 'mp13', designation: 'Fer à béton HA Ø6', unite: 'kg', prixSuggere: 850, prixActuel: 850, corpsMetier: 'acier', isSuggestion: true },
  { id: 'mp14', designation: 'Fer à béton HA Ø8', unite: 'kg', prixSuggere: 850, prixActuel: 850, corpsMetier: 'acier', isSuggestion: true },
  { id: 'mp15', designation: 'Fer à béton HA Ø10', unite: 'kg', prixSuggere: 850, prixActuel: 850, corpsMetier: 'acier', isSuggestion: true },
  { id: 'mp16', designation: 'Fer à béton HA Ø12', unite: 'kg', prixSuggere: 850, prixActuel: 850, corpsMetier: 'acier', isSuggestion: true },
  { id: 'mp17', designation: 'Fer à béton HA Ø14', unite: 'kg', prixSuggere: 880, prixActuel: 880, corpsMetier: 'acier', isSuggestion: true },
  { id: 'mp18', designation: 'Fer à béton HA Ø16', unite: 'kg', prixSuggere: 900, prixActuel: 900, corpsMetier: 'acier', isSuggestion: true },
  { id: 'mp19', designation: 'Treillis soudé ST25 pour dalles', unite: 'kg', prixSuggere: 3200, prixActuel: 3200, corpsMetier: 'acier', isSuggestion: true },
  { id: 'mp20', designation: 'Treillis soudé ST35 pour dalles lourdes', unite: 'kg', prixSuggere: 3500, prixActuel: 3500, corpsMetier: 'acier', isSuggestion: true },
  { id: 'mp21', designation: "Fil de fer d'attache", unite: 'kg', prixSuggere: 1200, prixActuel: 1200, corpsMetier: 'acier', isSuggestion: true },

  // AGGLOS & BLOCS
  { id: 'mp22', designation: 'Agglos creux 20 cm murs extérieurs', unite: 'm²', prixSuggere: 7500, prixActuel: 7500, corpsMetier: 'agglos', isSuggestion: true },
  { id: 'mp23', designation: 'Agglos creux 15 cm murs intérieurs', unite: 'm²', prixSuggere: 6500, prixActuel: 6500, corpsMetier: 'agglos', isSuggestion: true },
  { id: 'mp24', designation: 'Agglos pleins 10 cm cloisons', unite: 'm²', prixSuggere: 8500, prixActuel: 8500, corpsMetier: 'agglos', isSuggestion: true },
  { id: 'mp25', designation: 'Agglos pleins 20 cm fondations', unite: 'm²', prixSuggere: 9500, prixActuel: 9500, corpsMetier: 'agglos', isSuggestion: true },
  { id: 'mp26', designation: 'Blocs de béton préfabriqués', unite: 'u', prixSuggere: 850, prixActuel: 850, corpsMetier: 'agglos', isSuggestion: true },
  { id: 'mp27', designation: 'Briques cuites traditionnelles', unite: 'm²', prixSuggere: 12000, prixActuel: 12000, corpsMetier: 'agglos', isSuggestion: true },

  // BOIS & COFFRAGE
  { id: 'mp28', designation: 'Planche de coffrage bois ordinaire', unite: 'm²', prixSuggere: 5500, prixActuel: 5500, corpsMetier: 'bois_coffrage', isSuggestion: true },
  { id: 'mp29', designation: 'Contreplaqué pour coffrage dalles', unite: 'm²', prixSuggere: 8500, prixActuel: 8500, corpsMetier: 'bois_coffrage', isSuggestion: true },
  { id: 'mp30', designation: 'Bastaing 10×15 pour étaiement', unite: 'ml', prixSuggere: 4500, prixActuel: 4500, corpsMetier: 'bois_coffrage', isSuggestion: true },
  { id: 'mp31', designation: 'Chevron 8×8 pour ossature', unite: 'ml', prixSuggere: 3500, prixActuel: 3500, corpsMetier: 'bois_coffrage', isSuggestion: true },
  { id: 'mp32', designation: 'Panneau OSB pour plancher', unite: 'm²', prixSuggere: 6500, prixActuel: 6500, corpsMetier: 'bois_coffrage', isSuggestion: true },

  // MENUISERIE — PORTES
  { id: 'mp33', designation: 'Porte bois massif chêne/iroko', unite: 'u', prixSuggere: 45000, prixActuel: 45000, corpsMetier: 'menuiserie_portes', isSuggestion: true },
  { id: 'mp34', designation: 'Porte bois panneauté peinture comprise', unite: 'u', prixSuggere: 35000, prixActuel: 35000, corpsMetier: 'menuiserie_portes', isSuggestion: true },
  { id: 'mp35', designation: 'Porte métal acier galvanisé', unite: 'u', prixSuggere: 35000, prixActuel: 35000, corpsMetier: 'menuiserie_portes', isSuggestion: true },
  { id: 'mp36', designation: 'Porte PVC double paroi', unite: 'u', prixSuggere: 28000, prixActuel: 28000, corpsMetier: 'menuiserie_portes', isSuggestion: true },
  { id: 'mp37', designation: 'Porte blindée sécurité renforcée', unite: 'u', prixSuggere: 125000, prixActuel: 125000, corpsMetier: 'menuiserie_portes', isSuggestion: true },
  { id: 'mp38', designation: 'Porte coulissante bois ou aluminium', unite: 'u', prixSuggere: 65000, prixActuel: 65000, corpsMetier: 'menuiserie_portes', isSuggestion: true },

  // MENUISERIE — FENÊTRES
  { id: 'mp39', designation: 'Fenêtre aluminium double vitrage', unite: 'u', prixSuggere: 72000, prixActuel: 72000, corpsMetier: 'menuiserie_fenetres', isSuggestion: true },
  { id: 'mp40', designation: 'Fenêtre PVC double vitrage', unite: 'u', prixSuggere: 55000, prixActuel: 55000, corpsMetier: 'menuiserie_fenetres', isSuggestion: true },
  { id: 'mp41', designation: 'Fenêtre bois double vitrage', unite: 'u', prixSuggere: 85000, prixActuel: 85000, corpsMetier: 'menuiserie_fenetres', isSuggestion: true },
  { id: 'mp42', designation: 'Porte-fenêtre aluminium double vitrage', unite: 'u', prixSuggere: 95000, prixActuel: 95000, corpsMetier: 'menuiserie_fenetres', isSuggestion: true },
  { id: 'mp43', designation: 'Baie vitrée coulissante aluminium', unite: 'u', prixSuggere: 125000, prixActuel: 125000, corpsMetier: 'menuiserie_fenetres', isSuggestion: true },
  { id: 'mp44', designation: 'Volet roulant aluminium électrique', unite: 'u', prixSuggere: 85000, prixActuel: 85000, corpsMetier: 'menuiserie_fenetres', isSuggestion: true },

  // MENUISERIE — ACCESSOIRES
  { id: 'mp45', designation: 'Ferronnerie porte (gonds, poignées, serrure)', unite: 'lot', prixSuggere: 15000, prixActuel: 15000, corpsMetier: 'menuiserie_accessoires', isSuggestion: true },
  { id: 'mp46', designation: 'Ferronnerie fenêtre (crémones, poignées)', unite: 'lot', prixSuggere: 8500, prixActuel: 8500, corpsMetier: 'menuiserie_accessoires', isSuggestion: true },
  { id: 'mp47', designation: 'Moustiquaire pour fenêtre', unite: 'u', prixSuggere: 12000, prixActuel: 12000, corpsMetier: 'menuiserie_accessoires', isSuggestion: true },

  // REVÊTEMENTS SOL
  { id: 'mp48', designation: 'Carrelage intérieur 30×30 ou 40×40', unite: 'm²', prixSuggere: 8500, prixActuel: 8500, corpsMetier: 'revetements_sol', isSuggestion: true },
  { id: 'mp49', designation: 'Carrelage extérieur antidérapant', unite: 'm²', prixSuggere: 12000, prixActuel: 12000, corpsMetier: 'revetements_sol', isSuggestion: true },
  { id: 'mp50', designation: 'Carrelage mural cuisine/salle de bain', unite: 'm²', prixSuggere: 9500, prixActuel: 9500, corpsMetier: 'revetements_sol', isSuggestion: true },
  { id: 'mp51', designation: 'Grès cérame haut de gamme', unite: 'm²', prixSuggere: 18000, prixActuel: 18000, corpsMetier: 'revetements_sol', isSuggestion: true },
  { id: 'mp52', designation: 'Parquet flottant stratifié', unite: 'm²', prixSuggere: 15000, prixActuel: 15000, corpsMetier: 'revetements_sol', isSuggestion: true },
  { id: 'mp53', designation: 'Parquet massif chêne', unite: 'm²', prixSuggere: 35000, prixActuel: 35000, corpsMetier: 'revetements_sol', isSuggestion: true },
  { id: 'mp54', designation: 'PVC sol en rouleau', unite: 'm²', prixSuggere: 6500, prixActuel: 6500, corpsMetier: 'revetements_sol', isSuggestion: true },
  { id: 'mp55', designation: 'Moquette en rouleau', unite: 'm²', prixSuggere: 8500, prixActuel: 8500, corpsMetier: 'revetements_sol', isSuggestion: true },

  // ENDUITS & PEINTURE
  { id: 'mp56', designation: 'Enduit de façade hydrofuge', unite: 'm²', prixSuggere: 4500, prixActuel: 4500, corpsMetier: 'enduits_peinture', isSuggestion: true },
  { id: 'mp57', designation: 'Enduit intérieur lissage', unite: 'm²', prixSuggere: 3500, prixActuel: 3500, corpsMetier: 'enduits_peinture', isSuggestion: true },
  { id: 'mp58', designation: 'Enduit à la chaux traditionnel', unite: 'm²', prixSuggere: 5500, prixActuel: 5500, corpsMetier: 'enduits_peinture', isSuggestion: true },
  { id: 'mp59', designation: 'Peinture acrylique murale', unite: 'm²', prixSuggere: 2800, prixActuel: 2800, corpsMetier: 'enduits_peinture', isSuggestion: true },
  { id: 'mp60', designation: 'Peinture glycéro bois et métal', unite: 'L', prixSuggere: 8500, prixActuel: 8500, corpsMetier: 'enduits_peinture', isSuggestion: true },
  { id: 'mp61', designation: 'Peinture façade hydrofuge', unite: 'L', prixSuggere: 12000, prixActuel: 12000, corpsMetier: 'enduits_peinture', isSuggestion: true },
  { id: 'mp62', designation: 'Sous-couche avant peinture', unite: 'L', prixSuggere: 4500, prixActuel: 4500, corpsMetier: 'enduits_peinture', isSuggestion: true },
  { id: 'mp63', designation: 'Lasure protection bois', unite: 'L', prixSuggere: 7500, prixActuel: 7500, corpsMetier: 'enduits_peinture', isSuggestion: true },

  // PLOMBERIE
  { id: 'mp64', designation: 'Tuyau PVC évacuation Ø100', unite: 'ml', prixSuggere: 3500, prixActuel: 3500, corpsMetier: 'plomberie', isSuggestion: true },
  { id: 'mp65', designation: 'Tuyau PVC évacuation Ø50', unite: 'ml', prixSuggere: 2500, prixActuel: 2500, corpsMetier: 'plomberie', isSuggestion: true },
  { id: 'mp66', designation: 'Tuyau PEHD alimentation Ø25', unite: 'ml', prixSuggere: 4500, prixActuel: 4500, corpsMetier: 'plomberie', isSuggestion: true },
  { id: 'mp67', designation: 'Raccord PVC (coude, té, manchon)', unite: 'u', prixSuggere: 850, prixActuel: 850, corpsMetier: 'plomberie', isSuggestion: true },
  { id: 'mp68', designation: 'Robinet mitigeur lavabo', unite: 'u', prixSuggere: 25000, prixActuel: 25000, corpsMetier: 'plomberie', isSuggestion: true },
  { id: 'mp69', designation: 'Robinet mitigeur douche/baignoire', unite: 'u', prixSuggere: 35000, prixActuel: 35000, corpsMetier: 'plomberie', isSuggestion: true },
  { id: 'mp70', designation: 'WC suspendu avec réservoir encastré', unite: 'u', prixSuggere: 85000, prixActuel: 85000, corpsMetier: 'plomberie', isSuggestion: true },
  { id: 'mp71', designation: 'Lavabo céramique', unite: 'u', prixSuggere: 45000, prixActuel: 45000, corpsMetier: 'plomberie', isSuggestion: true },
  { id: 'mp72', designation: 'Baignoire acrylique', unite: 'u', prixSuggere: 125000, prixActuel: 125000, corpsMetier: 'plomberie', isSuggestion: true },
  { id: 'mp73', designation: 'Receveur de douche céramique', unite: 'u', prixSuggere: 65000, prixActuel: 65000, corpsMetier: 'plomberie', isSuggestion: true },
  { id: 'mp74', designation: 'Chauffe-eau électrique 100L', unite: 'u', prixSuggere: 185000, prixActuel: 185000, corpsMetier: 'plomberie', isSuggestion: true },

  // ÉLECTRICITÉ
  { id: 'mp75', designation: 'Câble électrique 1,5 mm²', unite: 'ml', prixSuggere: 350, prixActuel: 350, corpsMetier: 'electricite', isSuggestion: true },
  { id: 'mp76', designation: 'Câble électrique 2,5 mm²', unite: 'ml', prixSuggere: 450, prixActuel: 450, corpsMetier: 'electricite', isSuggestion: true },
  { id: 'mp77', designation: 'Câble électrique 6 mm²', unite: 'ml', prixSuggere: 850, prixActuel: 850, corpsMetier: 'electricite', isSuggestion: true },
  { id: 'mp78', designation: 'Câble électrique 10 mm²', unite: 'ml', prixSuggere: 1350, prixActuel: 1350, corpsMetier: 'electricite', isSuggestion: true },
  { id: 'mp79', designation: "Boîtier d'encastrement simple", unite: 'u', prixSuggere: 450, prixActuel: 450, corpsMetier: 'electricite', isSuggestion: true },
  { id: 'mp80', designation: "Boîtier d'encastrement double", unite: 'u', prixSuggere: 650, prixActuel: 650, corpsMetier: 'electricite', isSuggestion: true },
  { id: 'mp81', designation: 'Interrupteur simple', unite: 'u', prixSuggere: 2500, prixActuel: 2500, corpsMetier: 'electricite', isSuggestion: true },
  { id: 'mp82', designation: 'Interrupteur va-et-vient', unite: 'u', prixSuggere: 3500, prixActuel: 3500, corpsMetier: 'electricite', isSuggestion: true },
  { id: 'mp83', designation: 'Prise électrique 16A', unite: 'u', prixSuggere: 2800, prixActuel: 2800, corpsMetier: 'electricite', isSuggestion: true },
  { id: 'mp84', designation: 'Prise électrique 32A (four)', unite: 'u', prixSuggere: 5500, prixActuel: 5500, corpsMetier: 'electricite', isSuggestion: true },
  { id: 'mp85', designation: 'Tableau électrique 1 rangée', unite: 'u', prixSuggere: 45000, prixActuel: 45000, corpsMetier: 'electricite', isSuggestion: true },
  { id: 'mp86', designation: 'Disjoncteur 16A', unite: 'u', prixSuggere: 8500, prixActuel: 8500, corpsMetier: 'electricite', isSuggestion: true },
  { id: 'mp87', designation: 'Disjoncteur 32A', unite: 'u', prixSuggere: 12000, prixActuel: 12000, corpsMetier: 'electricite', isSuggestion: true },

  // ISOLATION
  { id: 'mp88', designation: 'Laine de verre en rouleau', unite: 'm²', prixSuggere: 3500, prixActuel: 3500, corpsMetier: 'isolation', isSuggestion: true },
  { id: 'mp89', designation: 'Laine de roche en panneau', unite: 'm²', prixSuggere: 4500, prixActuel: 4500, corpsMetier: 'isolation', isSuggestion: true },
  { id: 'mp90', designation: 'Polystyrène expansé en panneau', unite: 'm²', prixSuggere: 5500, prixActuel: 5500, corpsMetier: 'isolation', isSuggestion: true },
  { id: 'mp91', designation: 'Polyuréthane projeté sur site', unite: 'm²', prixSuggere: 8500, prixActuel: 8500, corpsMetier: 'isolation', isSuggestion: true },
  { id: 'mp92', designation: "Membrane d'étanchéité toiture", unite: 'm²', prixSuggere: 6500, prixActuel: 6500, corpsMetier: 'isolation', isSuggestion: true },

  // TOITURE & COUVERTURE
  { id: 'mp93', designation: 'Tuile mécanique béton', unite: 'm²', prixSuggere: 12000, prixActuel: 12000, corpsMetier: 'toiture', isSuggestion: true },
  { id: 'mp94', designation: 'Tuile plate terre cuite', unite: 'm²', prixSuggere: 18000, prixActuel: 18000, corpsMetier: 'toiture', isSuggestion: true },
  { id: 'mp95', designation: 'Tôle bac acier galvanisée', unite: 'm²', prixSuggere: 9500, prixActuel: 9500, corpsMetier: 'toiture', isSuggestion: true },
  { id: 'mp96', designation: 'Tôle bac acier isolée sandwich', unite: 'm²', prixSuggere: 15000, prixActuel: 15000, corpsMetier: 'toiture', isSuggestion: true },
  { id: 'mp97', designation: 'Ardoise naturelle', unite: 'm²', prixSuggere: 35000, prixActuel: 35000, corpsMetier: 'toiture', isSuggestion: true },
  { id: 'mp98', designation: 'Liteau bois traité', unite: 'ml', prixSuggere: 2500, prixActuel: 2500, corpsMetier: 'toiture', isSuggestion: true },
  { id: 'mp99', designation: 'Chevron toiture bois traité', unite: 'ml', prixSuggere: 4500, prixActuel: 4500, corpsMetier: 'toiture', isSuggestion: true },
  { id: 'mp100', designation: 'Gouttière PVC Ø100', unite: 'ml', prixSuggere: 5500, prixActuel: 5500, corpsMetier: 'toiture', isSuggestion: true },
  { id: 'mp101', designation: 'Gouttière aluminium Ø100', unite: 'ml', prixSuggere: 8500, prixActuel: 8500, corpsMetier: 'toiture', isSuggestion: true },

  // TERRASSEMENT & VRD
  { id: 'mp102', designation: 'Terre végétale à évacuer', unite: 'm³', prixSuggere: 1500, prixActuel: 1500, corpsMetier: 'terrassement_vrd', isSuggestion: true },
  { id: 'mp103', designation: 'Terre de remblai compactable', unite: 'm³', prixSuggere: 4500, prixActuel: 4500, corpsMetier: 'terrassement_vrd', isSuggestion: true },
  { id: 'mp104', designation: 'Grave 0/31,5 pour fond de forme', unite: 'm³', prixSuggere: 18000, prixActuel: 18000, corpsMetier: 'terrassement_vrd', isSuggestion: true },
  { id: 'mp105', designation: 'Grave ciment pour chaussée', unite: 'm²', prixSuggere: 8500, prixActuel: 8500, corpsMetier: 'terrassement_vrd', isSuggestion: true },
  { id: 'mp106', designation: 'Pavé autobloquant béton', unite: 'm²', prixSuggere: 12000, prixActuel: 12000, corpsMetier: 'terrassement_vrd', isSuggestion: true },
  { id: 'mp107', designation: 'Bordure béton pour trottoir', unite: 'ml', prixSuggere: 4500, prixActuel: 4500, corpsMetier: 'terrassement_vrd', isSuggestion: true },
  { id: 'mp108', designation: 'Caniveau béton', unite: 'ml', prixSuggere: 8500, prixActuel: 8500, corpsMetier: 'terrassement_vrd', isSuggestion: true },
];
