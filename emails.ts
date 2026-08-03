import { Router, Response, Request } from 'express';

const router = Router();

// POST /api/emails/welcome - Welcome email placeholder
router.post('/welcome', async (req: Request, res: Response) => {
  try {
    return res.json({
      status: 'ok',
      message: 'Email de bienvenue planifié (Placeholder)'
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erreur lors de la planification de l\'email' });
  }
});

// POST /api/emails/missing-data - Missing data notification placeholder
router.post('/missing-data', async (req: Request, res: Response) => {
  try {
    return res.json({
      status: 'ok',
      message: 'Email de relance pour données manquantes planifié (Placeholder)'
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erreur lors de la planification de l\'email' });
  }
});

// POST /api/emails/completed - Completion notification placeholder
router.post('/completed', async (req: Request, res: Response) => {
  try {
    return res.json({
      status: 'ok',
      message: 'Email de notification de fin de métré planifié (Placeholder)'
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erreur lors de la planification de l\'email' });
  }
});

export default router;
