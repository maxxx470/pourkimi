import { Router, Request, Response } from 'express';

const router = Router();

// Endpoint POST /api/dqe/update-prix
router.post('/update-prix', (req: Request, res: Response) => {
  const { project_id, item_id, prix_unitaire, montant } = req.body;

  // Simulate persistent update or logging
  console.log(`[DQE API] Updated price for project ${project_id}, item ${item_id}: ${prix_unitaire} FCFA, montant: ${montant} FCFA`);

  res.json({
    success: true,
    message: 'Prix unitaire mis à jour avec succès',
    data: { project_id, item_id, prix_unitaire, montant, updated_at: new Date().toISOString() },
  });
});

// Endpoint POST /api/dqe/update-quantite
router.post('/update-quantite', (req: Request, res: Response) => {
  const { project_id, item_id, quantite } = req.body;

  console.log(`[DQE API] Updated quantity for project ${project_id}, item ${item_id}: ${quantite}`);

  res.json({
    success: true,
    message: 'Quantité mise à jour avec succès',
    data: { project_id, item_id, quantite, updated_at: new Date().toISOString() },
  });
});

export default router;
