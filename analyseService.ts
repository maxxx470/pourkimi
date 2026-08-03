export interface MissingDataItem {
  champ: string;
  description: string;
  obligatoire: boolean;
  lot_concerne: string;
  valeur_defaut?: string;
}

export interface LogEntry {
  type: 'success' | 'warning' | 'error' | 'info' | 'loading';
  message: string;
  timestamp: string;
  phase: 'lecture' | 'extraction' | 'calcul' | 'finalisation';
}

export interface MetreResult {
  id?: string;
  lot_code?: string;
  lot_nom?: string;
  code?: string;
  designation?: string;
  quantite?: number;
  unite?: string;
  prix_unitaire?: number;
  montant_ht?: number;
  [key: string]: unknown;
}

export interface AnalyseRequest {
  project_id: string;
  custom_answers?: Record<string, string>;
}

export interface AnalyseResponse {
  status: 'processing' | 'missing_data' | 'completed' | 'error';
  project_id: string;
  missing_data?: MissingDataItem[];
  results?: MetreResult[];
  analyse_log?: LogEntry[];
  error_message?: string;
}

export async function lancerAnalyse(
  data: AnalyseRequest
): Promise<AnalyseResponse> {
  const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
  const apiUrl = metaEnv?.VITE_API_URL || '';
  const response = await fetch(`${apiUrl}/api/analyse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Erreur serveur : ${response.status}`);
  }

  return response.json();
}
