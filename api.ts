import axios from 'axios';
import { supabase } from './supabase';

const baseURL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject the Supabase Auth JWT token dynamically
api.interceptors.request.use(
  async (config) => {
    try {
      if (supabase && typeof supabase.auth?.getSession === 'function') {
        const { data } = await supabase.auth.getSession();
        const token = data?.session?.access_token;
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.warn('Failed to inject Supabase JWT token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle specific HTTP errors (401, 403, 500)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      switch (status) {
        case 401:
          console.error('Session expirée ou non autorisée (401)');
          break;
        case 403:
          console.error('Accès refusé (403)');
          break;
        case 500:
          console.error('Erreur interne du serveur (500)');
          break;
        default:
          break;
      }
    } else {
      console.error('Erreur réseau ou serveur inaccessible');
    }
    return Promise.reject(error);
  }
);
