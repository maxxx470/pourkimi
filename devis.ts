import { Router, Request, Response } from 'express';

const router = Router();

// Endpoint POST /api/devis/update-prix
router.post('/update-prix', (req: Request, res: Response) => {
  const { project_id, item_id, prix_unitaire, montant } = req.body;
  console.log(`[Devis API] Updated price for item ${item_id} in project ${project_id}: ${prix_unitaire} FCFA, montant: ${montant} FCFA`);
  res.json({
    success: true,
    message: 'Prix unitaire mis à jour avec succès',
    data: { project_id, item_id, prix_unitaire, montant, updated_at: new Date().toISOString() },
  });
});

// Endpoint POST /api/devis/update-prix-piece
router.post('/update-prix-piece', (req: Request, res: Response) => {
  const { project_id, piece_id, prix_au_m2, montant } = req.body;
  console.log(`[Devis API] Updated price per m2 for piece ${piece_id} in project ${project_id}: ${prix_au_m2} FCFA/m², montant: ${montant} FCFA`);
  res.json({
    success: true,
    message: 'Prix pièce mis à jour avec succès',
    data: { project_id, piece_id, prix_au_m2, montant, updated_at: new Date().toISOString() },
  });
});

// Endpoint POST /api/devis/save
router.post('/save', (req: Request, res: Response) => {
  const { project_id, mode, prix_unitaires, prix_pieces } = req.body;
  console.log(`[Devis API] Saved devis for project ${project_id}, mode: ${mode}`);
  res.json({
    success: true,
    message: 'Devis sauvegardé avec succès',
    data: { project_id, mode, updated_at: new Date().toISOString() },
  });
});

export default router;
