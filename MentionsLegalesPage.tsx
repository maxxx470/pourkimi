import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function MentionsLegalesPage() {
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
          Mentions Légales
        </h1>
        <p className="font-sans font-medium text-[13px] text-[#475569] mb-10 border-b border-[#E2E8F0] pb-4">
          Dernière mise à jour : 1er août 2026
        </p>

        <div className="space-y-8 font-sans text-[14.5px] sm:text-[15px] text-[#52525B] leading-relaxed">
          <section>
            <h2 className="font-sans font-extrabold text-[18px] sm:text-[20px] text-[#1E293B] mb-3">
              1. Éditeur du site
            </h2>
            <p className="mb-3">
              Le site Métrio (accessible à l'adresse metrio.app) est édité par :
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#1E293B] font-medium">
              <li><strong>Raison sociale / Nom :</strong> [NOM DE L'ENTREPRISE/AUTO-ENTREPRENEUR À COMPLÉTER]</li>
              <li><strong>Forme juridique :</strong> [FORME JURIDIQUE À COMPLÉTER]</li>
              <li><strong>Numéro d'enregistrement :</strong> [NUMÉRO D'ENREGISTREMENT À COMPLÉTER SI APPLICABLE]</li>
              <li><strong>Adresse du siège social :</strong> [ADRESSE À COMPLÉTER]</li>
              <li><strong>Courrier électronique :</strong> contact@metrio.app</li>
              <li><strong>Directeur de la publication :</strong> [NOM À COMPLÉTER]</li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans font-extrabold text-[18px] sm:text-[20px] text-[#1E293B] mb-3">
              2. Hébergement du site
            </h2>
            <p className="mb-2">
              Le site Métrio est hébergé par la société Vercel Inc. :
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#1E293B] font-medium">
              <li><strong>Hébergeur :</strong> Vercel Inc.</li>
              <li><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</li>
              <li><strong>Site web :</strong> vercel.com</li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans font-extrabold text-[18px] sm:text-[20px] text-[#1E293B] mb-3">
              3. Propriété intellectuelle
            </h2>
            <p className="mb-3">
              L'ensemble des éléments composant le site Métrio (notamment les textes, graphismes, logiciels, photographies, images, vidéos, sons, plans, logos, marques et interfaces) est la propriété exclusive de l'éditeur ou de ses partenaires.
            </p>
            <p>
              Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est strictement interdite sauf autorisation écrite préalable de l'éditeur.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-extrabold text-[18px] sm:text-[20px] text-[#1E293B] mb-3">
              4. Liens hypertexte
            </h2>
            <p>
              Le site Métrio peut contenir des liens hypertexte orientant vers d'autres sites internet. L'éditeur n'exerce aucun contrôle sur le contenu de ces sites tiers et décline toute responsabilité quant à leur contenu, leur accessibilité ou leurs politiques de confidentialité.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-extrabold text-[18px] sm:text-[20px] text-[#1E293B] mb-3">
              5. Contact
            </h2>
            <p>
              Pour toute question ou demande d'information concernant le site ou les mentions légales, vous pouvez nous contacter directement par email à l'adresse suivante :{' '}
              <a
                href="mailto:contact@metrio.app"
                className="text-[#4F46E5] font-bold underline hover:text-[#5243BA] transition-colors"
              >
                contact@metrio.app
              </a>.
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
              className="font-sans font-semibold text-[12px] text-[#1E293B] transition-colors cursor-pointer"
            >
              Mentions légales
            </Link>
            <Link
              to="/confidentialite"
              className="font-sans font-semibold text-[12px] text-[#475569] hover:text-[#1E293B] transition-colors cursor-pointer"
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
