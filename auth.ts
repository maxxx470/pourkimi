import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin, isServerSupabaseConfigured } from '../services/supabase';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // In local development, if Supabase is not configured, we allow bypass to let the app function beautifully.
      if (!isServerSupabaseConfigured) {
        req.user = { id: 'mock_user_id', email: 'biledamax@gmail.com', full_name: 'Amadou Diallo' };
        return next();
      }
      return res.status(401).json({ error: 'Token de connexion manquant ou format invalide' });
    }

    const token = authHeader.split(' ')[1];

    if (!isServerSupabaseConfigured) {
      // Return a simulated user if server credentials are not setup but client has sent a token
      req.user = { id: 'mock_user_id', email: 'biledamax@gmail.com', full_name: 'Amadou Diallo' };
      return next();
    }

    // Validate using Supabase Admin Client
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: 'Token non valide ou session expirée' });
    }

    req.user = data.user;
    next();
  } catch (err) {
    console.error('Error in authMiddleware:', err);
    return res.status(401).json({ error: 'Accès non autorisé' });
  }
};
