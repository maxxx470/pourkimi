import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isServerSupabaseConfigured = Boolean(supabaseUrl && supabaseServiceKey);

if (!isServerSupabaseConfigured) {
  console.warn(
    'Backend Supabase is not configured. Define SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your server environment.'
  );
}

export const supabaseAdmin = isServerSupabaseConfigured
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : (new Proxy({}, {
      get: (target, prop) => {
        if (prop === 'auth') {
          return {
            getUser: async (token: string) => {
              // For demonstration and test/local without Supabase credentials, return a mock user
              console.warn('Supabase Admin auth called without config. Returning mock user.');
              return { data: { user: { id: 'mock_user_id', email: 'biledamax@gmail.com' } }, error: null };
            }
          };
        }
        return () => {
          console.warn(`Supabase Admin method "${String(prop)}" called but Server is not configured.`);
          return {
            select: () => ({
              eq: () => Promise.resolve({ data: [], error: null }),
              single: () => Promise.resolve({ data: null, error: null }),
            }),
            insert: () => Promise.resolve({ data: null, error: null }),
            update: () => Promise.resolve({ data: null, error: null }),
            delete: () => Promise.resolve({ data: null, error: null }),
          };
        };
      }
    }) as any);

// Helpers
export async function getProject(projectId: string) {
  if (!isServerSupabaseConfigured) {
    return {
      id: projectId,
      user_id: 'mock_user_id',
      name: 'Villa résidentielle R+2 (Local Mock)',
      client_name: 'M. Touré',
      location: 'Dakar, Sénégal',
      type_batiment: 'Résidentiel',
      status: 'draft',
      missing_data: null,
      metre_data: null,
      analyse_log: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();
  if (error) throw error;
  return data;
}

export async function getProjectDocuments(projectId: string) {
  if (!isServerSupabaseConfigured) {
    return [];
  }
  const { data, error } = await supabaseAdmin
    .from('project_documents')
    .select('*')
    .eq('project_id', projectId);
  if (error) throw error;
  return data;
}

export async function updateProjectStatus(projectId: string, status: string, missingData?: any, analyseLog?: any) {
  if (!isServerSupabaseConfigured) {
    return { id: projectId, status };
  }
  const updateData: any = { status, updated_at: new Date().toISOString() };
  if (missingData !== undefined) updateData.missing_data = missingData;
  if (analyseLog !== undefined) updateData.analyse_log = analyseLog;

  const { data, error } = await supabaseAdmin
    .from('projects')
    .update(updateData)
    .eq('id', projectId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function saveMetreResults(projectId: string, results: any[]) {
  if (!isServerSupabaseConfigured) {
    return { project_id: projectId, count: results.length };
  }
  // Delete old results
  await supabaseAdmin
    .from('metre_results')
    .delete()
    .eq('project_id', projectId);

  // Insert new results
  const { data, error } = await supabaseAdmin
    .from('metre_results')
    .insert(
      results.map((r) => ({
        ...r,
        project_id: projectId,
      }))
    );
  if (error) throw error;
  return data;
}
export default supabaseAdmin;
