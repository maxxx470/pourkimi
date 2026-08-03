import { useState, useEffect } from 'react';
import { Project } from '../types';

export interface UseProjectsReturn {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    user_id: 'user_1',
    name: 'Villa résidentielle R+2 — Abidjan',
    client_name: 'M. Koné',
    location: 'Abidjan, Côte d\'Ivoire',
    type_batiment: 'Villa / Maison individuelle',
    status: 'completed',
    missing_data: null,
    metre_data: null,
    analyse_log: null,
    created_at: '2026-06-12',
    updated_at: '2026-06-12'
  },
  {
    id: '2',
    user_id: 'user_1',
    name: 'Immeuble bureaux R+4 — Lomé',
    client_name: 'SARL BTP Pro',
    location: 'Lomé, Togo',
    type_batiment: 'Immeuble',
    status: 'processing',
    missing_data: null,
    metre_data: null,
    analyse_log: null,
    created_at: '2026-06-20',
    updated_at: '2026-06-20'
  },
  {
    id: '3',
    user_id: 'user_1',
    name: 'École primaire — Kara',
    client_name: 'Mairie de Kara',
    location: 'Kara, Togo',
    type_batiment: 'Bâtiment public',
    status: 'missing_data',
    missing_data: [
      {
        champ: 'Épaisseur chape',
        description: 'Épaisseur de la chape de pose pour le lot carrelage absente sur la coupe A-A.',
        obligatoire: true,
        lot_concerne: 'Chape & Dallage'
      }
    ],
    metre_data: null,
    analyse_log: null,
    created_at: '2026-06-22',
    updated_at: '2026-06-22'
  },
  {
    id: '4',
    user_id: 'user_1',
    name: 'Résidence Les Palmiers — Dakar',
    client_name: 'Groupe Immobilier',
    location: 'Dakar, Sénégal',
    type_batiment: 'Immeuble',
    status: 'draft',
    missing_data: null,
    metre_data: null,
    analyse_log: null,
    created_at: '2026-07-01',
    updated_at: '2026-07-01'
  }
];

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState<number>(0);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      setProjects(MOCK_PROJECTS);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [trigger]);

  const refetch = () => {
    setTrigger((prev) => prev + 1);
  };

  return {
    projects,
    isLoading,
    error,
    refetch,
  };
}
