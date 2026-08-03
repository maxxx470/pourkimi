export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  company_name: string;
  logo_url: string | null;
  plan: 'decouverte' | 'pro' | 'studio';
  quota_used: number;
  quota_limit: number;
  preferred_currency: string;
  tva_rate: number;
  onboarding_completed: boolean;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  client_name: string;
  location: string;
  type_batiment: string;
  status: 'draft' | 'processing' | 'missing_data' | 'completed' | 'error';
  missing_data: MissingDataItem[] | null;
  metre_data: any | null;
  analyse_log: LogEntry[] | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectDocument {
  id: string;
  project_id: string;
  file_name: string;
  file_url: string;
  file_type: 'plan_niveau' | 'coupe' | 'facade' | 'structure' | 'detail';
  processing_status: 'pending' | 'processing' | 'completed' | 'error';
}

export interface MetreResult {
  id: string;
  project_id: string;
  lot: number;
  lot_name: string;
  numero: string;
  designation: string;
  unite: string;
  quantite: number;
  unit_price: number | null;
  is_lot_header: boolean;
  is_sub_lot_header: boolean;
  is_detail: boolean;
  observation: string | null;
}

export interface MissingDataItem {
  champ: string;
  description: string;
  obligatoire: boolean;
  lot_concerne: string;
}

export interface LogEntry {
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
}

export interface DevisVariant {
  id: string;
  project_id: string;
  name: string;
  mode: 'A' | 'B';
  status: 'draft' | 'completed';
  total_ht: number;
  tva_amount: number;
  total_ttc: number;
}

export interface MaterialItem {
  id: string;
  user_id: string | null;
  name: string;
  category: string;
  unite: string;
  default_ratio: Record<string, number>;
  is_system_default: boolean;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'analyse_complete' | 'missing_data' | 'quota_alerte' | 'export';
  title: string;
  message: string;
  read: boolean;
  project_id: string | null;
  created_at: string;
}
