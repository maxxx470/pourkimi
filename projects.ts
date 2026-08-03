import { Router, Response } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest, authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { supabaseAdmin, isServerSupabaseConfigured } from '../services/supabase';

const router = Router();

// Zod validation schemas
const createProjectSchema = z.object({
  name: z.string().min(2, "Le nom doit avoir au moins 2 caractères"),
  client_name: z.string().min(1, "Le nom du client est requis"),
  location: z.string().min(1, "La localisation est requise"),
  type_batiment: z.string().min(1, "Le type de bâtiment est requis"),
});

const updateProjectSchema = z.object({
  name: z.string().min(2).optional(),
  client_name: z.string().optional(),
  location: z.string().optional(),
  type_batiment: z.string().optional(),
  status: z.enum(['draft', 'processing', 'missing_data', 'completed', 'error']).optional(),
});

// In-memory fallback list to ensure the application works without database provisioning
let inMemoryProjects: any[] = [
  {
    id: 'proj_1',
    user_id: 'mock_user_id',
    name: 'Villa R+1 Riviera',
    client_name: 'M. Diop',
    location: 'Abidjan, Côte d\'Ivoire',
    type_batiment: 'Résidentiel R+1',
    status: 'completed',
    missing_data: null,
    metre_data: { lotCount: 6, totalHt: 14500000 },
    analyse_log: [
      { type: 'info', message: 'Analyse démarrée', timestamp: new Date().toISOString() },
      { type: 'success', message: 'Calculs terminés avec succès', timestamp: new Date().toISOString() }
    ],
    created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
  },
  {
    id: 'proj_2',
    user_id: 'mock_user_id',
    name: 'Immeuble R+4 Plateau',
    client_name: 'SOGECI',
    location: 'Abidjan, Côte d\'Ivoire',
    type_batiment: 'Bureaux',
    status: 'processing',
    missing_data: null,
    metre_data: null,
    analyse_log: [
      { type: 'info', message: 'Extraction des plans de coffrage en cours', timestamp: new Date().toISOString() }
    ],
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  }
];

// GET /api/projects - list projects
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id || 'mock_user_id';
    
    if (!isServerSupabaseConfigured) {
      // Filter in-memory projects
      const userProjects = inMemoryProjects.filter(p => p.user_id === userId);
      return res.json(userProjects);
    }

    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json(data || []);
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({ error: 'Impossible de récupérer la liste des projets' });
  }
});

// POST /api/projects - create project
router.post('/', authMiddleware, validate(createProjectSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id || 'mock_user_id';
    const { name, client_name, location, type_batiment } = req.body;

    const newProject = {
      id: `proj_${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      name,
      client_name,
      location,
      type_batiment,
      status: 'draft' as const,
      missing_data: null,
      metre_data: null,
      analyse_log: [
        { type: 'info', message: 'Projet créé', timestamp: new Date().toISOString() }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!isServerSupabaseConfigured) {
      inMemoryProjects.unshift(newProject);
      return res.status(201).json(newProject);
    }

    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert(newProject)
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(data);
  } catch (error: any) {
    console.error('Error creating project:', error);
    return res.status(500).json({ error: 'Impossible de créer le projet' });
  }
});

// GET /api/projects/:id - get project
router.get('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id || 'mock_user_id';
    const { id } = req.params;

    if (!isServerSupabaseConfigured) {
      const project = inMemoryProjects.find(p => p.id === id && p.user_id === userId);
      if (!project) {
        return res.status(404).json({ error: 'Projet non trouvé' });
      }
      return res.json(project);
    }

    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Projet non trouvé ou non autorisé' });
    }
    return res.json(data);
  } catch (error: any) {
    console.error('Error fetching project details:', error);
    return res.status(500).json({ error: 'Impossible de récupérer le projet' });
  }
});

// PUT /api/projects/:id - update project
router.put('/:id', authMiddleware, validate(updateProjectSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id || 'mock_user_id';
    const { id } = req.params;
    const updateData = req.body;

    if (!isServerSupabaseConfigured) {
      const projectIndex = inMemoryProjects.findIndex(p => p.id === id && p.user_id === userId);
      if (projectIndex === -1) {
        return res.status(404).json({ error: 'Projet non trouvé' });
      }

      const updatedProject = {
        ...inMemoryProjects[projectIndex],
        ...updateData,
        updated_at: new Date().toISOString(),
      };
      inMemoryProjects[projectIndex] = updatedProject;
      return res.json(updatedProject);
    }

    const { data, error } = await supabaseAdmin
      .from('projects')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      return res.status(404).json({ error: 'Projet non trouvé ou non autorisé pour mise à jour' });
    }
    return res.json(data);
  } catch (error: any) {
    console.error('Error updating project:', error);
    return res.status(500).json({ error: 'Impossible de mettre à jour le projet' });
  }
});

// DELETE /api/projects/:id - delete project
router.delete('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id || 'mock_user_id';
    const { id } = req.params;

    if (!isServerSupabaseConfigured) {
      const projectIndex = inMemoryProjects.findIndex(p => p.id === id && p.user_id === userId);
      if (projectIndex === -1) {
        return res.status(404).json({ error: 'Projet non trouvé' });
      }
      inMemoryProjects.splice(projectIndex, 1);
      return res.json({ success: true, message: 'Projet supprimé avec succès' });
    }

    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      return res.status(404).json({ error: 'Projet non trouvé ou non autorisé pour suppression' });
    }
    return res.json({ success: true, message: 'Projet supprimé avec succès' });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return res.status(500).json({ error: 'Impossible de supprimer le projet' });
  }
});

export default router;
