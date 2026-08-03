import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase is not fully configured. Please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
  );
}

// Export a supabase client if configured, otherwise export a proxy that prints clear warnings or returns empty datasets
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (new Proxy({}, {
      get: () => {
        return () => {
          console.error('Supabase client called but not configured.');
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
