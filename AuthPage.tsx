import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSent(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC] font-sans antialiased text-gray-900 overflow-x-hidden">
      {/* PARTIE 2 — Sidebar gauche (branding) — Desktop (lg et plus) : 44% width */}
      <div className="hidden lg:flex lg:w-[44%] bg-white border-r border-gray-100 flex-col justify-between p-12 xl:p-16 min-h-screen select-none">
        {/* A. Logo en haut */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer select-none group w-fit"
        >
          <div className="w-9 h-9 rounded-xl bg-[#4F46E5] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 20V8l8 6 8-6v12H4zM12 4L4 10V4h16v6L12 4z" />
            </svg>
          </div>
          <span className="text-[15px] font-medium text-gray-900 tracking-tight">
            Métrio
          </span>
        </div>

        {/* Branding Content */}
        <div className="my-auto py-8">
          {/* B. Titre principal */}
          <p className="text-[12px] uppercase tracking-[0.18em] text-gray-400 font-semibold mb-6">
            Trois étapes. Un devis.
          </p>
          <h1 className="text-[2.5rem] xl:text-[2.75rem] leading-[1.05] font-medium text-gray-900 tracking-tight mb-6">
            <span className="font-bold">Analysez</span>{' '}
            <span className="font-serif italic font-normal">vos plans.</span>
            <br />
            <span className="font-bold">Générez</span>{' '}
            <span className="font-serif italic font-normal">votre DQE.</span>
            <br />
            <span className="font-serif italic font-normal">
              En quelques minutes.
            </span>
          </h1>

          {/* C. Sous-titre */}
          <p className="text-[15px] text-gray-500 leading-relaxed max-w-sm mb-10">
            Métrio extrait automatiquement les ouvrages de vos plans et génère un
            devis quantitatif estimatif complet. Sans erreur de métré.
          </p>

          {/* D. Les 3 étapes */}
          <div className="space-y-0 max-w-sm">
            <div className="flex items-baseline gap-4 py-3 border-b border-gray-100">
              <span className="font-mono text-[11px] text-gray-300 tabular-nums font-medium">
                01
              </span>
              <div>
                <h3 className="text-[14px] font-medium text-gray-900">
                  Upload
                </h3>
                <p className="text-[12.5px] text-gray-500 mt-0.5">
                  Glissez votre plan PDF ou image
                </p>
              </div>
            </div>

            <div className="flex items-baseline gap-4 py-3 border-b border-gray-100">
              <span className="font-mono text-[11px] text-gray-300 tabular-nums font-medium">
                02
              </span>
              <div>
                <h3 className="text-[14px] font-medium text-gray-900">
                  Analyse
                </h3>
                <p className="text-[12.5px] text-gray-500 mt-0.5">
                  L'IA identifie les ouvrages et calcule les quantités
                </p>
              </div>
            </div>

            <div className="flex items-baseline gap-4 py-3 border-b border-gray-100">
              <span className="font-mono text-[11px] text-gray-300 tabular-nums font-medium">
                03
              </span>
              <div>
                <h3 className="text-[14px] font-medium text-gray-900">
                  Export
                </h3>
                <p className="text-[12.5px] text-gray-500 mt-0.5">
                  Téléchargez votre DQE en PDF ou Excel
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* E. Footer sidebar */}
        <p className="text-[11px] text-gray-300">
          Conçu en Afrique, utilisé par les professionnels du BTP.
        </p>
      </div>

      {/* PARTIE 3 — Zone de connexion (droite) — Desktop : 56% width, Mobile : full */}
      <div className="flex-1 w-full lg:w-[56%] bg-[#F8FAFC] flex flex-col justify-between items-center relative min-h-screen px-6 sm:px-10 py-10 sm:py-16">
        {/* A. Header mobile (lg:hidden) */}
        <div className="w-full lg:hidden flex items-center justify-between mb-8">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-7 h-7 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white shadow-xs">
              <svg
                className="w-4 h-4 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4 20V8l8 6 8-6v12H4zM12 4L4 10V4h16v6L12 4z" />
              </svg>
            </div>
            <span className="text-[15px] font-medium text-gray-900 tracking-tight">
              Métrio
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-[12px] font-medium text-gray-500 hover:text-[#4F46E5] transition-colors cursor-pointer"
          >
            ← Retour au site
          </button>
        </div>

        {/* Center Auth Card */}
        <div className="my-auto w-full max-w-sm flex flex-col justify-center">
          {/* B. Titre zone connexion */}
          <p className="hidden lg:block text-[11px] uppercase tracking-[0.18em] text-gray-400 font-semibold mb-3">
            Connexion
          </p>

          <h2 className="text-[1.75rem] sm:text-[2rem] lg:text-[2.25rem] leading-[1.1] font-medium text-gray-900 tracking-tight mb-3">
            <span className="lg:hidden">
              Bienvenue <span className="font-serif italic font-normal">chez Métrio</span>
            </span>
            <span className="hidden lg:inline">
              Bon <span className="font-serif italic font-normal">retour.</span>
            </span>
          </h2>

          {/* C. Sous-titre */}
          <p className="text-[14px] text-gray-500 leading-relaxed mb-6">
            <span className="lg:hidden">
              Pas de mot de passe à retenir. Google ou un lien magique par email — ton compte se crée tout seul.
            </span>
            <span className="hidden lg:inline">
              Connecte-toi avec Google, ou reçois un lien magique par email. Pas encore de compte ? Il sera créé automatiquement.
            </span>
          </p>

          {/* D. Badge informatif */}
          <div className="mb-6 px-4 py-3 rounded-2xl bg-[#EEF2FF] border border-[#4F46E5]/20 text-[13px] leading-relaxed text-[#4F46E5]">
            Pas encore de compte ? Connecte-toi avec Google, on crée le tien automatiquement.
          </div>

          {isSent ? (
            <div className="w-full py-6 px-4 bg-[#EDFAF3] border border-[#12B76A]/30 rounded-2xl flex flex-col items-center text-center animate-fadeIn">
              <CheckCircle2 className="w-10 h-10 text-[#12B76A] mb-2" />
              <p className="font-extrabold text-[15px] text-[#0A7A47] mb-1">
                Lien magique envoyé !
              </p>
              <p className="text-[13px] text-[#0A7A47]/80">
                Vérifiez votre boîte de réception (<strong>{email}</strong>). Redirection vers le tableau de bord...
              </p>
            </div>
          ) : (
            <div className="w-full flex flex-col">
              {/* E. Bouton Google */}
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-white border border-gray-200 rounded-full text-[14px] font-medium text-gray-900 shadow-[0_2px_8px_rgb(0_0_0_/_0.04)] hover:border-gray-900 hover:shadow-[0_4px_16px_rgb(0_0_0_/_0.06)] transition-all duration-200 cursor-pointer active:scale-[0.98]"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continuer avec Google</span>
              </button>

              {/* F. Séparateur "ou par email" */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[10px] uppercase tracking-[0.16em] text-gray-300 font-bold">
                  ou par email
                </span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* G. Formulaire email */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  placeholder="ton@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full min-h-[48px] px-4 py-3 rounded-full border border-gray-200 focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]/30 outline-none text-base lg:text-[14px] placeholder:text-gray-400 bg-white transition-all duration-200"
                />

                <button
                  type="submit"
                  disabled={!email.trim()}
                  className="w-full min-h-[50px] px-5 py-3 rounded-full bg-[#1E293B] hover:bg-[#4F46E5] text-white text-[14px] font-medium shadow-[0_2px_8px_rgb(0_0_0_/_0.06)] hover:shadow-[0_4px_16px_rgb(79_70_229_/_0.20)] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  Recevoir mon lien de connexion
                </button>
              </form>

              {/* H. Séparateur "1 projet offert" */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[10px] uppercase tracking-[0.16em] text-gray-300 font-bold">
                  1 PROJET OFFERT
                </span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* I. Texte explicatif */}
              <p className="text-[12.5px] text-gray-500 leading-relaxed text-center lg:text-left">
                Une fois connecté, vous pourrez uploader votre premier plan et générer un DQE gratuitement. Sans carte bancaire, sans engagement.
              </p>
            </div>
          )}
        </div>

        {/* J. Footer */}
        <p className="w-full text-center text-[11px] text-gray-300 mt-8">
          En continuant, vous acceptez nos conditions d'utilisation.
        </p>
      </div>
    </div>
  );
}

