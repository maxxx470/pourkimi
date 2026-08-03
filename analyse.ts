import { Router, Response } from 'express';
import { AuthenticatedRequest, authMiddleware } from '../middleware/auth';

const router = Router();

// POST /api/analyse - Launch AI Analysis Endpoint
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { project_id, custom_answers } = req.body || {};
    const targetProjectId = project_id || 'p1';

    // If custom answers provided with missing data test flag or empty mandatory fields
    if (custom_answers && custom_answers.simulate_missing === 'true') {
      return res.json({
        status: 'missing_data',
        project_id: targetProjectId,
        missing_data: [
          {
            champ: 'Hauteur sous plafond R+1',
            description: 'Indiquez la hauteur sous plafond exacte du premier étage si elle diffère du RDC.',
            obligatoire: true,
            lot_concerne: 'LOT 2 — Gros œuvre',
            valeur_defaut: '2.80 m',
          },
          {
            champ: 'Type de menuiseries extérieures',
            description: 'Précisez le matériau (Aluminium, PVC, Bois) pour le chiffrage précis.',
            obligatoire: false,
            lot_concerne: 'LOT 5 — Menuiserie',
            valeur_defaut: 'Aluminium double vitrage',
          },
        ],
      });
    }

    // Standard analysis completion response
    return res.json({
      status: 'completed',
      project_id: targetProjectId,
      results: [
        {
          id: 'res-1',
          lot_code: 'LOT 1',
          lot_nom: 'Terrassement',
          code: '1.1',
          designation: 'Fouille en rigole pour fondations superficielles',
          quantite: 48.5,
          unite: 'm³',
          prix_unitaire: 12000,
          montant_ht: 582000,
        },
        {
          id: 'res-2',
          lot_code: 'LOT 2',
          lot_nom: 'Gros œuvre',
          code: '2.1',
          designation: 'Béton armé pour semelles filantes fck 25 MPa',
          quantite: 22.4,
          unite: 'm³',
          prix_unitaire: 110000,
          montant_ht: 2464000,
        },
        {
          id: 'res-3',
          lot_code: 'LOT 3',
          lot_nom: 'Maçonnerie',
          code: '3.1',
          designation: 'Murs de façades en agglomérés creux de 20cm',
          quantite: 312.0,
          unite: 'm²',
          prix_unitaire: 14500,
          montant_ht: 4524000,
        },
      ],
    });
  } catch (error) {
    console.error('Error triggering AI analysis:', error);
    return res.status(500).json({
      status: 'error',
      project_id: req.body?.project_id || 'p1',
      error_message: 'Échec de la communication avec le moteur d\'analyse IA.',
    });
  }
});

export default router;

