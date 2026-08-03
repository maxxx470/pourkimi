import { Piece } from '../types/devis';

export const MOCK_PIECES: Piece[] = [
  { id: 'p1', nom: 'Salon', surface_m2: 42.5, niveau: 'RDC', prixAuM2: 45000, montant: 1912500 },
  { id: 'p2', nom: 'Chambre principale', surface_m2: 18.0, niveau: 'RDC', prixAuM2: 38000, montant: 684000 },
  { id: 'p3', nom: 'Chambre 2', surface_m2: 14.5, niveau: 'RDC', prixAuM2: null, montant: null },
  { id: 'p4', nom: 'Cuisine', surface_m2: 12.0, niveau: 'RDC', prixAuM2: 52000, montant: 624000 },
  { id: 'p5', nom: 'Salle de bain', surface_m2: 6.0, niveau: 'RDC', prixAuM2: null, montant: null },
  { id: 'p6', nom: 'Couloir', surface_m2: 4.8, niveau: 'RDC', prixAuM2: 25000, montant: 120000 },
  { id: 'p7', nom: 'Chambre 3', surface_m2: 14.5, niveau: 'R+1', prixAuM2: null, montant: null },
  { id: 'p8', nom: 'Chambre 4', surface_m2: 12.0, niveau: 'R+1', prixAuM2: null, montant: null },
  { id: 'p9', nom: 'Salle de bain R+1', surface_m2: 5.5, niveau: 'R+1', prixAuM2: null, montant: null },
  { id: 'p10', nom: 'Terrasse couverte', surface_m2: 18.0, niveau: 'R+1', prixAuM2: 28000, montant: 504000 }
];
