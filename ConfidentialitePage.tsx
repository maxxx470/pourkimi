import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function ConfidentialitePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-[#1E293B] flex flex-col selection:bg-[#EEF2FF] selection:text-[#4F46E5]">
      {/* Navigation fixe */}
      <nav
        style={{
          height: '58px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #E2E8F0'
        }}
        className="sticky top-0 z-[100] w-full px-4 sm:px-6 lg:px-8 flex items-center justify-center"
      >
        <div className="w-full max-w-7xl flex items-center justify-between">
          {/* Logo Métrio */}
          <Link
            to="/"
            className="flex items-center gap-2.5 select-none"
          >
            <div
              style={{ borderRadius: '8px', backgroundColor: '#4F46E5' }}
              className="w-8 h-8 flex items-center justify-center text-white shadow-xs"
            >
              <svg
                className="w-4 h-4 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4 20V8l8 6 8-6v12H4zM12 4L4 10V4h16v6L12 4z" />
              </svg>
            </div>
            <span className="font-sans font-black text-[19px] tracking-tight text-[#1E293B]">
              Métrio
            </span>
          </Link>

          {/* Bouton retour */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 font-sans font-semibold text-[13px] text-[#475569] hover:text-[#1E293B] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </button>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h1 className="font-sans font-black text-[28px] sm:text-[36px] text-[#1E293B] tracking-tight mb-2">
          Politique de Confidentialité
        </h1>
        <p className="font-sans font-medium text-[13px] text-[#475569] mb-10 border-b border-[#E2E8F0] pb-4">
          Dernière mise à jour : 1er août 2026
        </p>

        <div className="space-y-8 font-sans text-[14.5px] sm:text-[15px] text-[#52525B] leading-relaxed">
          <section>
            <h2 className="font-sans font-extrabold text-[18px] sm:text-[20px] text-[#1E293B] mb-3">
              1. Introduction
            </h2>
            <p>
              La confidentialité et la sécurité de vos données de projet et de vos plans de construction sont une priorité pour Métrio. Cette politique détaille de manière transparente les informations que nous collectons, la manière dont nous les utilisons et vos droits concernant ces données.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-extrabold text-[18px] sm:text-[20px] text-[#1E293B] mb-3">
              2. Données collectées
            </h2>
            <p className="mb-3">
              Dans le cadre de l'utilisation du service Métrio, nous pouvons être amenés à collecter les catégories de données suivantes :
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Données de compte :</strong> nom, prénom, adresse email, mot de passe, nom de votre entreprise ou cabinet de métré.
              </li>
              <li>
                <strong>Fichiers et documents téléversés :</strong> plans architecturaux et techniques téléversés sur la plateforme (formats PDF, DWG, images PNG/JPG ou scans).
              </li>
              <li>
                <strong>Données de projet et résultats :</strong> métrés calculés, cahiers de calcul, détails quantitatifs estimatifs (DQE) générés, devis personnalisés et historiques d'activité.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans font-extrabold text-[18px] sm:text-[20px] text-[#1E293B] mb-3">
              3. Utilisation des données
            </h2>
            <p className="mb-3">
              Vos données sont utilisées exclusivement pour les finalités suivantes :
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Permettre l'analyse de vos plans et la génération automatique de vos métrés et devis.</li>
              <li>Assurer le fonctionnement de votre compte utilisateur et la sauvegarde de vos projets.</li>
              <li>Vous contacter pour le support technique ou les communications essentielles relatives au service.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans font-extrabold text-[18px] sm:text-[20px] text-[#1E293B] mb-3">
              4. Engagement de conformité
            </h2>
            <p>
              Nous travaillons à mettre nos pratiques en conformité avec les réglementations applicables en matière de protection des données.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-extrabold text-[18px] sm:text-[20px] text-[#1E293B] mb-3">
              5. Durée de conservation
            </h2>
            <p>
              Vos fichiers et données de projet sont conservés tant que votre compte utilisateur reste actif pour vous permettre de retrouver vos métrés et devis. Vous pouvez à tout moment demander la suppression définitive de vos fichiers ou de l'intégralité de votre compte en nous adressant un email à{' '}
              <a
                href="mailto:contact@metrio.app"
                className="text-[#4F46E5] font-bold underline hover:text-[#5243BA] transition-colors"
              >
                contact@metrio.app
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-extrabold text-[18px] sm:text-[20px] text-[#1E293B] mb-3">
              6. Partage des données avec des tiers
            </h2>
            <p>
              Métrio s'engage à ne jamais vendre, louer ni céder vos plans de construction, métrés ou informations personnelles à des tiers à des fins commerciales ou publicitaires. Vos fichiers sont traités uniquement pour exécuter le service que vous demandez.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-extrabold text-[18px] sm:text-[20px] text-[#1E293B] mb-3">
              7. Sécurité
            </h2>
            <p>
              Toutes les connexions et échanges de données avec le site sont chiffrés à l'aide de protocoles HTTPS standards afin de protéger la transmission de vos documents.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-extrabold text-[18px] sm:text-[20px] text-[#1E293B] mb-3">
              8. Vos droits
            </h2>
            <p className="mb-3">
              Vous disposez d'un droit d'accès, de rectification, de portabilité et de suppression des données personnelles vous concernant.
            </p>
            <p>
              Pour exercer l'un de ces droits, il vous suffit de contacter notre équipe par courrier électronique à l'adresse{' '}
              <a
                href="mailto:contact@metrio.app"
                className="text-[#4F46E5] font-bold underline hover:text-[#5243BA] transition-colors"
              >
                contact@metrio.app
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-extrabold text-[18px] sm:text-[20px] text-[#1E293B] mb-3">
              9. Cookies et traceurs
            </h2>
            <p>
              Métrio utilise uniquement des cookies techniquement nécessaires au maintien de la session utilisateur et à la navigation sécurisée sur l'application. Aucun cookie de ciblage publicitaire ni aucun traceur commercial tiers n'est utilisé.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 sm:px-6 lg:px-8 py-6 border-t border-[#E2E8F0] bg-white mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <span className="font-sans font-semibold text-[12px] text-[#475569]">
            © 2026 Métrio · metrio.app
          </span>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <button
              onClick={() => navigate('/')}
              className="font-sans font-semibold text-[12px] text-[#475569] hover:text-[#1E293B] transition-colors cursor-pointer"
            >
              Accueil
            </button>
            <Link
              to="/mentions-legales"
              className="font-sans font-semibold text-[12px] text-[#475569] hover:text-[#1E293B] transition-colors cursor-pointer"
            >
              Mentions légales
            </Link>
            <Link
              to="/confidentialite"
              className="font-sans font-semibold text-[12px] text-[#1E293B] transition-colors cursor-pointer"
            >
              Confidentialité
            </Link>
            <a
              href="mailto:contact@metrio.app"
              className="font-sans font-semibold text-[12px] text-[#475569] hover:text-[#1E293B] transition-colors cursor-pointer"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
