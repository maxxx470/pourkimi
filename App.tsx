import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthPage } from './pages/auth/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { Button } from './components/ui/Button';
import { LandingPage } from './pages/LandingPage';
import { UploadWizard } from './pages/upload/UploadWizard';
import { ModeChoixPage } from './pages/mode-choix/ModeChoixPage';
import { AnalysePage } from './pages/analyse/AnalysePage';
import { CahierCalculPage } from './pages/cahier/CahierCalculPage';
import { DQEPage } from './pages/dqe/DQEPage';
import { DevisPage } from './pages/devis/DevisPage';
import { RecapPage } from './pages/recap/RecapPage';
import { VariantesPage } from './pages/variantes/VariantesPage';
import { HistoriquePage } from './pages/historique/HistoriquePage';
import { BibliothequePage } from './pages/bibliotheque/BibliothequePage';
import { SettingsPage } from './pages/SettingsPage';
import { AbonnementPage } from './pages/abonnement/AbonnementPage';
import { NouveautesPage } from './pages/nouveautes/NouveautesPage';
import { MentionsLegalesPage } from './pages/legal/MentionsLegalesPage';
import { ConfidentialitePage } from './pages/legal/ConfidentialitePage';
import { ErrorPage } from './pages/error/ErrorPage';
import { ProjectsPage } from './pages/projects/ProjectsPage';
import { ProjectDetailPage } from './pages/projects/ProjectDetailPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { ProjectDataProvider } from './store/ProjectDataContext';

// Simulated auth placeholder layouts
function AuthLayout() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-sans">
      <div className="max-w-sm w-full bg-white p-8 rounded-[14px] border border-border flex flex-col items-center text-center">
        <h2 className="font-extrabold text-[18px] text-text mb-2">Authentification</h2>
        <p className="text-[13px] text-muted mb-6">
          Espace de connexion et d'inscription Métrio
        </p>
        <Button
          variant="primary"
          onClick={() => navigate('/dashboard')}
          className="w-full"
        >
          Retourner au dashboard
        </Button>
      </div>
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  // Simulating connection: set to false so the public landing page is visible
  const isConnectedSimulated = false;

  return (
    <ProjectDataProvider>
      <Routes>
        <Route
          path="/"
          element={
            isConnectedSimulated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LandingPage onNavigate={(path) => navigate(path)} />
            )
          }
        />
        <Route path="/dashboard/projects" element={<ProjectsPage />} />
        <Route path="/dashboard/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/dashboard/notifications" element={<NotificationsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/dashboard/upload" element={<UploadWizard />} />
        <Route path="/dashboard/projects/:id/upload" element={<UploadWizard />} />
        <Route path="/dashboard/projects/:id/mode-choix" element={<ModeChoixPage />} />
        <Route path="/projects/:id/mode-choix" element={<ModeChoixPage />} />
        <Route path="/dashboard/analyse" element={<AnalysePage />} />
        <Route path="/dashboard/projects/:id/analyse" element={<AnalysePage />} />
        <Route path="/projects/:id/analyse" element={<AnalysePage />} />
        <Route path="/dashboard/cahier-de-calcul" element={<CahierCalculPage />} />
        <Route path="/dashboard/projects/:id/cahier-de-calcul" element={<CahierCalculPage />} />
        <Route path="/projects/:id/cahier-de-calcul" element={<CahierCalculPage />} />
        <Route path="/dashboard/dqe" element={<DQEPage />} />
        <Route path="/dashboard/projects/:id/dqe" element={<DQEPage />} />
        <Route path="/projects/:id/dqe" element={<DQEPage />} />
        <Route path="/dqe" element={<DQEPage />} />
        <Route path="/dashboard/devis" element={<DevisPage />} />
        <Route path="/dashboard/projects/:id/devis" element={<DevisPage />} />
        <Route path="/projects/:id/devis" element={<DevisPage />} />
        <Route path="/devis" element={<DevisPage />} />
        <Route path="/dashboard/recap" element={<RecapPage />} />
        <Route path="/dashboard/projects/:id/recap" element={<RecapPage />} />
        <Route path="/projects/:id/recap" element={<RecapPage />} />
        <Route path="/recap" element={<RecapPage />} />
        <Route path="/dashboard/variantes" element={<VariantesPage />} />
        <Route path="/dashboard/projects/:id/variantes" element={<VariantesPage />} />
        <Route path="/projects/:id/variantes" element={<VariantesPage />} />
        <Route path="/variantes" element={<VariantesPage />} />
        <Route path="/dashboard/historique" element={<HistoriquePage />} />
        <Route path="/dashboard/projects/:id/historique" element={<HistoriquePage />} />
        <Route path="/projects/:id/historique" element={<HistoriquePage />} />
        <Route path="/historique" element={<HistoriquePage />} />
        <Route path="/dashboard/materiaux" element={<BibliothequePage />} />
        <Route path="/materiaux" element={<BibliothequePage />} />
        <Route path="/dashboard/settings" element={<SettingsPage />} />
        <Route path="/dashboard/cabinet" element={<SettingsPage />} />
        <Route path="/cabinet" element={<SettingsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/parametres" element={<SettingsPage />} />
        <Route path="/dashboard/subscription" element={<AbonnementPage />} />
        <Route path="/dashboard/abonnement" element={<AbonnementPage />} />
        <Route path="/subscription" element={<AbonnementPage />} />
        <Route path="/abonnement" element={<AbonnementPage />} />
        <Route path="/dashboard/news" element={<NouveautesPage />} />
        <Route path="/dashboard/nouveautes" element={<NouveautesPage />} />
        <Route path="/news" element={<NouveautesPage />} />
        <Route path="/nouveautes" element={<NouveautesPage />} />
        <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
        <Route path="/confidentialite" element={<ConfidentialitePage />} />
        <Route path="/errors" element={<ErrorPage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/404" element={<ErrorPage defaultTab="404" />} />
        <Route path="/500" element={<ErrorPage defaultTab="500" />} />
        <Route path="/maintenance" element={<ErrorPage defaultTab="maint" />} />
        <Route path="/quota" element={<ErrorPage defaultTab="quota" />} />
        <Route path="/dashboard/errors" element={<ErrorPage />} />
        <Route path="/dashboard/" element={<Dashboard />} />
        <Route path="/auth/*" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ProjectDataProvider>
  );
}
