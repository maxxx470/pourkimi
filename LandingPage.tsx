import React, { useState, useEffect } from 'react';
import {
  Upload,
  Cpu,
  Calculator,
  Table2,
  Download,
  Check,
  ArrowRight,
  ChevronDown,
  Image,
  Play,
  FileText,
  Sparkles,
  Layers,
  HelpCircle,
  Mail
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

interface FadeInSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const FadeInSection: React.FC<FadeInSectionProps> = ({ children, className = '', id }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = React.useRef<HTMLDivElement>(null);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const transitionStyle = prefersReduced
    ? {}
    : {
        transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
      };

  return (
    <div
      ref={domRef}
      id={id}
      style={transitionStyle}
      className={className}
    >
      {children}
    </div>
  );
};

interface FAQAccordionItemProps {
  q: string;
  a: string;
}

const FAQAccordionItem: React.FC<FAQAccordionItemProps> = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#4F46E5]/30 rounded-2xl overflow-hidden transition-all duration-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 sm:px-7 sm:py-5 text-left font-sans font-bold text-[15px] sm:text-[16px] text-[#1E293B] hover:text-[#4F46E5] transition-colors cursor-pointer gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/40"
      >
        <span>{q}</span>
        <div className={`w-8 h-8 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#EEF2FF] border-[#4F46E5]/30 text-[#4F46E5]' : 'text-[#64748B]'}`}>
          <ChevronDown size={18} />
        </div>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 sm:px-7 sm:pb-6 text-[14px] text-[#475569] leading-relaxed border-t border-[rgba(0,0,0,0.05)] bg-white pt-4 animate-fadeIn">
          {a}
        </div>
      )}
    </div>
  );
};

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#1E293B] selection:bg-[#EEF2FF] selection:text-[#4F46E5]">
      
      {/* 1. Header / Navigation Fixe */}
      <nav
        className={`sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-[#E2E8F0] transition-all duration-200 ${
          scrolled ? 'shadow-sm py-2' : 'py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Gauche : Logo Métrio */}
          <div
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div
              style={{ borderRadius: '10px', backgroundColor: '#4F46E5' }}
              className="w-8.5 h-8.5 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200"
            >
              <svg
                className="w-4.5 h-4.5 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4 20V8l8 6 8-6v12H4zM12 4L4 10V4h16v6L12 4z" />
              </svg>
            </div>
            <span className="font-sans font-black text-[20px] tracking-tight text-[#1E293B]">
              Métrio
            </span>
          </div>

          {/* Centre : Ancre Links */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('comment-ca-marche')}
              className="font-sans font-semibold text-[14px] text-[#475569] hover:text-[#4F46E5] transition-colors cursor-pointer"
            >
              Comment ça marche
            </button>
            <button
              onClick={() => scrollToSection('couverture')}
              className="font-sans font-semibold text-[14px] text-[#475569] hover:text-[#4F46E5] transition-colors cursor-pointer"
            >
              Couverture
            </button>
            <button
              onClick={() => scrollToSection('tarifs')}
              className="font-sans font-semibold text-[14px] text-[#475569] hover:text-[#4F46E5] transition-colors cursor-pointer"
            >
              Tarifs
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="font-sans font-semibold text-[14px] text-[#475569] hover:text-[#4F46E5] transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </div>

          {/* Droite : Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/auth/login')}
              className="hidden md:inline-flex items-center justify-center px-4 h-9 border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] rounded-full font-sans font-bold text-[13px] text-[#1E293B] transition-all duration-200 cursor-pointer active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/40"
            >
              Se connecter
            </button>
            <button
              onClick={() => onNavigate('/auth/login')}
              style={{ backgroundColor: '#4F46E5' }}
              className="inline-flex items-center justify-center px-5 h-9 text-white hover:bg-[#4338CA] hover:shadow-lg hover:shadow-[#4F46E5]/20 hover:-translate-y-0.5 rounded-full font-sans font-bold text-[13px] transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/40"
            >
              Connexion
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section (A.2) */}
      <FadeInSection className="bg-white px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-16 md:pb-20 text-center border-b border-[#E2E8F0] flex flex-col items-center relative overflow-hidden">
        {/* Subtle background gradient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-gradient-to-b from-[#EEF2FF]/60 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="w-full max-w-5xl flex flex-col items-center">
          {/* Badge Pill with pulsing dot */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-[12px] font-extrabold uppercase tracking-wider mb-6 bg-[#EEF2FF] text-[#4F46E5] border border-[#4F46E5]/20 shadow-2xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>Analyse IA de plans de construction</span>
          </div>

          {/* Headline in 3 lines */}
          <h1 className="font-sans text-[36px] sm:text-[52px] md:text-[64px] lg:text-[72px] tracking-tight leading-[1.08] text-[#1E293B] max-w-4xl mb-6 text-center">
            <div>
              <span className="font-extrabold">Analysez </span>
              <span className="font-serif italic font-normal text-[#4F46E5]">vos plans.</span>
            </div>
            <div>
              <span className="font-extrabold">Générez </span>
              <span className="font-serif italic font-normal text-[#1E293B]">votre DQE.</span>
            </div>
            <div className="bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] bg-clip-text text-transparent font-extrabold pt-1">
              En quelques minutes.
            </div>
          </h1>

          {/* Subtitle */}
          <p className="font-sans font-medium text-[16px] sm:text-[19px] md:text-[20px] text-[#475569] leading-relaxed max-w-2xl mb-8 text-center">
            Métrio extrait automatiquement les ouvrages de vos plans PDF et génère un devis quantitatif estimatif complet. Sans erreur de métré.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md sm:max-w-none mb-4">
            <button
              onClick={() => onNavigate('/dashboard')}
              style={{ backgroundColor: '#4F46E5' }}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 h-12 px-8 text-white hover:bg-[#4338CA] hover:shadow-xl hover:shadow-[#4F46E5]/25 hover:-translate-y-0.5 rounded-full font-sans font-extrabold text-[15px] transition-all duration-200 cursor-pointer shadow-md active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/40"
            >
              <span>Analyser mon premier plan</span>
              <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <button
              onClick={() => scrollToSection('comment-ca-marche')}
              className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-7 bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] hover:border-[#94A3B8] hover:-translate-y-0.5 text-[#1E293B] rounded-full font-sans font-bold text-[15px] transition-all duration-200 cursor-pointer shadow-2xs active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/40"
            >
              <span>Voir comment ça marche ↓</span>
            </button>
          </div>

          {/* Small subtext */}
          <p className="font-sans text-[12.5px] font-semibold text-[#64748B] mb-12">
            1 projet offert · Sans carte bancaire · Sans engagement
          </p>

          {/* 3 Key Stats Box (A.5) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full border border-[#E2E8F0] rounded-2xl p-6 bg-[#F8FAFC] shadow-2xs">
            <div className="flex flex-col items-center text-center group cursor-default">
              <span className="font-sans font-black text-5xl sm:text-6xl text-[#1E293B] group-hover:text-[#4F46E5] transition-colors duration-300 mb-1">
                6
              </span>
              <span className="text-sm font-serif italic text-gray-700 font-medium">lots couverts</span>
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mt-0.5">Terrassement à Peinture</span>
            </div>
            <div className="flex flex-col items-center text-center group cursor-default border-y md:border-y-0 md:border-x border-[#E2E8F0] py-4 md:py-0 px-2">
              <span className="font-sans font-black text-5xl sm:text-6xl text-[#1E293B] group-hover:text-[#4F46E5] transition-colors duration-300 mb-1">
                2 min
              </span>
              <span className="text-sm font-serif italic text-gray-700 font-medium">temps d'analyse moyen</span>
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mt-0.5">Contre des heures à la main</span>
            </div>
            <div className="flex flex-col items-center text-center group cursor-default">
              <span className="font-sans font-black text-5xl sm:text-6xl text-[#1E293B] group-hover:text-[#4F46E5] transition-colors duration-300 mb-1">
                1
              </span>
              <span className="text-sm font-serif italic text-gray-700 font-medium">projet offert</span>
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mt-0.5">Pour tester sans risque</span>
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* 3. Section "Comment ça marche" - 3 étapes (A.3) */}
      <FadeInSection id="comment-ca-marche" className="px-4 sm:px-6 lg:px-8 py-20 border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 text-center flex flex-col items-center">
            <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-[#4F46E5] bg-[#EEF2FF] border border-[#4F46E5]/20 mb-3">
              Simplicité absolue
            </span>
            <h2 className="font-sans font-black text-[30px] sm:text-[40px] text-[#1E293B] tracking-tight">
              Comment ça <span className="font-serif italic font-normal text-[#4F46E5]">marche</span> ?
            </h2>
            <p className="font-sans font-medium text-[16px] text-[#64748B] max-w-xl mt-2">
              Trois étapes simples pour transformer vos fichiers PDF en un DQE chiffré prêt à l'emploi.
            </p>
          </div>

          {/* 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Step 1 */}
            <div className="relative bg-white border border-gray-100 rounded-[1.75rem] p-7 sm:p-9 hover:shadow-xl hover:border-[#4F46E5]/30 hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col justify-between">
              <span className="text-7xl font-serif italic font-bold text-gray-100 select-none absolute top-4 right-6 pointer-events-none group-hover:text-[#EEF2FF] transition-colors duration-300">
                01
              </span>
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-center text-[#4F46E5] mb-5 group-hover:bg-[#4F46E5] group-hover:text-white transition-colors duration-300">
                  <Upload size={22} />
                </div>
                <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-[#4F46E5] bg-[#EEF2FF] mb-3">
                  Phase 01
                </span>
                <h3 className="font-sans font-black text-[20px] text-[#1E293B] mb-2">
                  Upload
                </h3>
                <p className="font-sans font-medium text-[14px] text-[#64748B] leading-relaxed">
                  Glissez votre plan PDF ou image. Métrio accepte tous les formats courants.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative bg-white border border-gray-100 rounded-[1.75rem] p-7 sm:p-9 hover:shadow-xl hover:border-[#4F46E5]/30 hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col justify-between">
              <span className="text-7xl font-serif italic font-bold text-gray-100 select-none absolute top-4 right-6 pointer-events-none group-hover:text-[#EEF2FF] transition-colors duration-300">
                02
              </span>
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-center text-[#4F46E5] mb-5 group-hover:bg-[#4F46E5] group-hover:text-white transition-colors duration-300">
                  <Cpu size={22} />
                </div>
                <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-[#4F46E5] bg-[#EEF2FF] mb-3">
                  Phase 02
                </span>
                <h3 className="font-sans font-black text-[20px] text-[#1E293B] mb-2">
                  Analyse
                </h3>
                <p className="font-sans font-medium text-[14px] text-[#64748B] leading-relaxed">
                  Notre IA identifie les ouvrages, calcule les quantités et les classe par lot.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative bg-white border border-gray-100 rounded-[1.75rem] p-7 sm:p-9 hover:shadow-xl hover:border-[#4F46E5]/30 hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col justify-between">
              <span className="text-7xl font-serif italic font-bold text-gray-100 select-none absolute top-4 right-6 pointer-events-none group-hover:text-[#EEF2FF] transition-colors duration-300">
                03
              </span>
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-center text-[#4F46E5] mb-5 group-hover:bg-[#4F46E5] group-hover:text-white transition-colors duration-300">
                  <Download size={22} />
                </div>
                <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-[#4F46E5] bg-[#EEF2FF] mb-3">
                  Phase 03
                </span>
                <h3 className="font-sans font-black text-[20px] text-[#1E293B] mb-2">
                  Export
                </h3>
                <p className="font-sans font-medium text-[14px] text-[#64748B] leading-relaxed">
                  Téléchargez votre DQE en PDF ou Excel, prêt à être chiffré.
                </p>
              </div>
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* 4. Section Aperçu DQE Généré */}
      <FadeInSection id="demo-dqe" className="px-4 sm:px-6 lg:px-8 py-20 border-b border-[#E2E8F0] bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center flex flex-col items-center">
            <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-[#4F46E5] bg-[#EEF2FF] border border-[#4F46E5]/20 mb-3">
              Le résultat
            </span>
            <h2 className="font-sans font-black text-[28px] sm:text-[38px] text-[#1E293B] tracking-tight">
              Votre DQE, <span className="font-serif italic font-normal text-[#4F46E5]">prêt à l'emploi</span>
            </h2>
            <p className="font-sans font-medium text-[15px] sm:text-[16px] text-[#64748B] max-w-xl mt-2">
              Aperçu d'un extrait de DQE structuré automatiquement par Métrio.
            </p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-7 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#4F46E5]" />
                <span className="font-sans font-extrabold text-[15px] text-[#1E293B]">
                  Détail Quantitatif Estimatif (Extrait fictif)
                </span>
              </div>
              <span className="bg-[#EEF2FF] text-[#4F46E5] text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border border-[#4F46E5]/20">
                Exemple
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-[13px]">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#475569] text-[11px] font-extrabold uppercase tracking-wider">
                    <th className="py-3 px-3">Désignation des travaux</th>
                    <th className="py-3 px-3 text-center">Unité</th>
                    <th className="py-3 px-3 text-right">Quantité</th>
                    <th className="py-3 px-3 text-right">P.U. (FCFA)</th>
                    <th className="py-3 px-3 text-right">Montant HT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[#1E293B]">
                  <tr className="bg-[#FEF0EC]/60 font-bold text-[#E8442A]">
                    <td colSpan={5} className="py-2.5 px-3 text-[11.5px] uppercase tracking-wide">
                      LOT 1 — Terrassement & Fouilles
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-medium">Fouilles en rigoles pour fondations superficielles</td>
                    <td className="py-3 px-3 text-center font-mono text-[#64748B]">m³</td>
                    <td className="py-3 px-3 text-right font-mono">147,46</td>
                    <td className="py-3 px-3 text-right font-mono">1 500</td>
                    <td className="py-3 px-3 text-right font-mono font-bold">221 190 FCFA</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-medium">Remblaiement des fouilles avec apport de terres</td>
                    <td className="py-3 px-3 text-center font-mono text-[#64748B]">m³</td>
                    <td className="py-3 px-3 text-right font-mono">42,10</td>
                    <td className="py-3 px-3 text-right font-mono">2 000</td>
                    <td className="py-3 px-3 text-right font-mono font-bold">84 200 FCFA</td>
                  </tr>

                  <tr className="bg-[#EBF3FF]/60 font-bold text-[#2A7BDE]">
                    <td colSpan={5} className="py-2.5 px-3 text-[11.5px] uppercase tracking-wide">
                      LOT 2 — Gros œuvre (Béton Armé)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-medium">Béton armé pour semelles filantes (dosage 350kg/m³)</td>
                    <td className="py-3 px-3 text-center font-mono text-[#64748B]">m³</td>
                    <td className="py-3 px-3 text-right font-mono">28,50</td>
                    <td className="py-3 px-3 text-right font-mono">85 000</td>
                    <td className="py-3 px-3 text-right font-mono font-bold">2 422 500 FCFA</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-medium">Poteaux en béton armé 20x20cm coulés sur place</td>
                    <td className="py-3 px-3 text-center font-mono text-[#64748B]">ml</td>
                    <td className="py-3 px-3 text-right font-mono">64,00</td>
                    <td className="py-3 px-3 text-right font-mono">12 500</td>
                    <td className="py-3 px-3 text-right font-mono font-bold">800 000 FCFA</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-200 bg-[#F8FAFC] font-bold">
                    <td colSpan={4} className="py-3.5 px-3 text-right text-[12px] uppercase text-[#64748B]">
                      Sous-total exemple fictif HT :
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-[15px] text-[#4F46E5]">
                      3 527 890 FCFA
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* 5. Section Couverture Métier */}
      <FadeInSection id="couverture" className="px-4 sm:px-6 lg:px-8 py-20 border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-12 text-center flex flex-col items-center">
            <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-[#4F46E5] bg-[#EEF2FF] border border-[#4F46E5]/20 mb-3">
              Couverture métier
            </span>
            <h2 className="font-sans font-black text-[28px] sm:text-[38px] text-[#1E293B] tracking-tight">
              6 corps d'état <span className="font-serif italic font-normal text-[#4F46E5]">couverts</span>
            </h2>
            <p className="font-sans font-medium text-[15px] sm:text-[16px] text-[#64748B] max-w-xl mt-2">
              Une prise en charge complète du terrassement aux finitions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              { lot: 'LOT 1', title: 'Terrassement & Fouilles', color: '#E8442A', bg: '#FEF0EC' },
              { lot: 'LOT 2', title: 'Gros œuvre — Béton armé', color: '#2A7BDE', bg: '#EBF3FF' },
              { lot: 'LOT 3', title: 'Maçonnerie & Agglos', color: '#D4960A', bg: '#FDF8EC' },
              { lot: 'LOT 4', title: 'Chape & Revêtements', color: '#12B76A', bg: '#EDFAF3' },
              { lot: 'LOT 5', title: 'Menuiserie bois & alu', color: '#4F46E5', bg: '#EEF2FF' },
              { lot: 'LOT 6', title: 'Enduits, Peinture & Faux-plafonds', color: '#D03F7B', bg: '#FDF0F5' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-5 flex items-center gap-4 shadow-2xs text-left hover:border-[#4F46E5]/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div
                  style={{ backgroundColor: item.bg }}
                  className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200"
                >
                  <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: item.color }} />
                </div>
                <div>
                  <span className="block font-sans font-extrabold text-[10px] uppercase tracking-wider" style={{ color: item.color }}>
                    {item.lot}
                  </span>
                  <span className="block font-sans font-extrabold text-[15px] text-[#1E293B]">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* 6. Section Tarifs */}
      <FadeInSection id="tarifs" className="px-4 sm:px-6 lg:px-8 py-20 border-b border-[#E2E8F0] bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-14 text-center flex flex-col items-center">
            <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-[#4F46E5] bg-[#EEF2FF] border border-[#4F46E5]/20 mb-3">
              Tarification transparente
            </span>
            <h2 className="font-sans font-black text-[28px] sm:text-[38px] text-[#1E293B] tracking-tight">
              Des tarifs simples et <span className="font-serif italic font-normal text-[#4F46E5]">sans surprise</span>
            </h2>
            <p className="font-sans font-medium text-[15px] sm:text-[16px] text-[#64748B] max-w-xl mt-2">
              Commencez gratuitement sans engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {/* Free Plan */}
            <div className="border border-[#E2E8F0] rounded-2xl p-7 bg-white flex flex-col justify-between hover:border-[#CBD5E1] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-sans font-extrabold text-[18px] text-[#1E293B]">Découverte</h3>
                  <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]">Gratuit</span>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-sans font-black text-[32px] text-[#1E293B]">Gratuit</span>
                </div>
                <p className="font-sans font-medium text-[13px] text-[#64748B] mb-6">1 projet complet inclus</p>
                <div className="h-[1px] bg-[#E2E8F0] mb-6" />
                <ul className="space-y-3.5 mb-8">
                  <li className="flex items-center gap-2.5 font-sans font-medium text-[13.5px] text-[#1E293B]">
                    <Check className="w-4 h-4 text-[#12B76A] shrink-0" />
                    <span>1 projet complet offert</span>
                  </li>
                  <li className="flex items-center gap-2.5 font-sans font-medium text-[13.5px] text-[#1E293B]">
                    <Check className="w-4 h-4 text-[#12B76A] shrink-0" />
                    <span>Tableau DQE interactif</span>
                  </li>
                  <li className="flex items-center gap-2.5 font-sans font-medium text-[13.5px] text-[#1E293B]">
                    <Check className="w-4 h-4 text-[#12B76A] shrink-0" />
                    <span>Export PDF & Excel</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onNavigate('/dashboard')}
                style={{ backgroundColor: '#4F46E5' }}
                className="w-full h-11 text-white hover:bg-[#4338CA] hover:shadow-lg hover:shadow-[#4F46E5]/20 hover:-translate-y-0.5 rounded-full font-sans font-extrabold text-[14px] cursor-pointer transition-all duration-200 active:scale-[0.98] shadow-xs"
              >
                Commencer gratuitement
              </button>
            </div>

            {/* Pro Plan */}
            <div className="border-2 border-[#4F46E5] rounded-2xl p-7 bg-white flex flex-col justify-between shadow-xl relative text-left md:scale-[1.03] z-10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#4F46E5] text-white shadow-xs">
                Le plus choisi
              </div>
              <div>
                <div className="flex justify-between items-center mb-3 mt-1">
                  <h3 className="font-sans font-extrabold text-[18px] text-[#1E293B]">Pro</h3>
                  <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-[#EEF2FF] text-[#4F46E5]">Abonnement</span>
                </div>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="font-sans font-black text-[32px] text-[#1E293B]">12 000</span>
                  <span className="font-sans font-bold text-[13px] text-[#64748B]">FCFA / mois</span>
                </div>
                <p className="font-sans font-medium text-[13px] text-[#64748B] mb-6">ou 115 000 FCFA / an (−20%)</p>
                <div className="h-[1px] bg-[#E2E8F0] mb-6" />
                <ul className="space-y-3.5 mb-8">
                  <li className="flex items-center gap-2.5 font-sans font-medium text-[13.5px] text-[#1E293B]">
                    <Check className="w-4 h-4 text-[#12B76A] shrink-0" />
                    <span>10 projets complets / mois</span>
                  </li>
                  <li className="flex items-center gap-2.5 font-sans font-medium text-[13.5px] text-[#1E293B]">
                    <Check className="w-4 h-4 text-[#12B76A] shrink-0" />
                    <span>Exports PDF & Excel illimités</span>
                  </li>
                  <li className="flex items-center gap-2.5 font-sans font-medium text-[13.5px] text-[#1E293B]">
                    <Check className="w-4 h-4 text-[#12B76A] shrink-0" />
                    <span>Variantes de devis</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onNavigate('/dashboard/subscription')}
                style={{ backgroundColor: '#4F46E5' }}
                className="w-full h-11 text-white hover:bg-[#4338CA] hover:shadow-lg hover:shadow-[#4F46E5]/20 hover:-translate-y-0.5 rounded-full font-sans font-extrabold text-[14px] cursor-pointer transition-all duration-200 active:scale-[0.98] shadow-md"
              >
                Découvrir le plan Pro
              </button>
            </div>

            {/* Studio Plan */}
            <div className="border border-[#E2E8F0] rounded-2xl p-7 bg-white flex flex-col justify-between hover:border-[#CBD5E1] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-sans font-extrabold text-[18px] text-[#1E293B]">Studio</h3>
                  <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]">Cabinet</span>
                </div>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="font-sans font-black text-[32px] text-[#1E293B]">25 000</span>
                  <span className="font-sans font-bold text-[13px] text-[#64748B]">FCFA / mois</span>
                </div>
                <p className="font-sans font-medium text-[13px] text-[#64748B] mb-6">ou 240 000 FCFA / an (−20%)</p>
                <div className="h-[1px] bg-[#E2E8F0] mb-6" />
                <ul className="space-y-3.5 mb-8">
                  <li className="flex items-center gap-2.5 font-sans font-medium text-[13.5px] text-[#1E293B]">
                    <Check className="w-4 h-4 text-[#12B76A] shrink-0" />
                    <span>Projets illimités</span>
                  </li>
                  <li className="flex items-center gap-2.5 font-sans font-medium text-[13.5px] text-[#1E293B]">
                    <Check className="w-4 h-4 text-[#12B76A] shrink-0" />
                    <span>Exports illimités</span>
                  </li>
                  <li className="flex items-center gap-2.5 font-sans font-medium text-[13.5px] text-[#1E293B]">
                    <Check className="w-4 h-4 text-[#12B76A] shrink-0" />
                    <span>Support dédié & intégrations</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onNavigate('/dashboard/subscription')}
                className="w-full h-11 border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] hover:border-[#CBD5E1] hover:-translate-y-0.5 text-[#1E293B] rounded-full font-sans font-extrabold text-[14px] cursor-pointer transition-all duration-200 active:scale-[0.98] shadow-2xs"
              >
                Voir les détails
              </button>
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* 7. Section CTA Final (A.6) */}
      <FadeInSection className="relative bg-white border-b border-[#E2E8F0] px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#4F46E5]/10 via-[#7C3AED]/10 to-[#4F46E5]/10 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="font-sans font-black text-[30px] sm:text-[42px] tracking-tight text-[#1E293B] mb-4 text-center">
            Vos plans méritent mieux qu'un Excel vide.
          </h2>
          <p className="font-sans font-medium text-[16px] sm:text-[18px] text-[#475569] mb-8 text-center">
            Générez votre premier DQE en 2 minutes.
          </p>

          <div className="relative group inline-block mb-3">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] blur-lg opacity-35 group-hover:opacity-60 transition-opacity duration-300 animate-pulse" />
            <button
              onClick={() => onNavigate('/dashboard')}
              style={{ backgroundColor: '#4F46E5' }}
              className="relative inline-flex items-center justify-center gap-2.5 h-13 px-9 text-white rounded-full font-sans font-extrabold text-[16px] hover:bg-[#4338CA] transition-all duration-200 cursor-pointer shadow-lg active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/40"
            >
              <span>Démarrer gratuitement</span>
              <ArrowRight size={18} />
            </button>
          </div>

          <p className="font-sans text-[12.5px] font-semibold text-[#64748B]">
            1 projet offert · Sans engagement
          </p>
        </div>
      </FadeInSection>

      {/* 8. Section FAQ (A.4) */}
      <FadeInSection id="faq" className="px-4 sm:px-6 lg:px-8 py-20 border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center flex flex-col items-center">
            <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-[#4F46E5] bg-[#EEF2FF] border border-[#4F46E5]/20 mb-3">
              Questions fréquentes
            </span>
            <h2 className="font-sans font-black text-[28px] sm:text-[38px] text-[#1E293B] tracking-tight">
              Questions <span className="font-serif italic font-normal text-[#4F46E5]">fréquentes</span>
            </h2>
            <p className="font-sans font-medium text-[16px] text-[#64748B] mt-2">
              On répond à tout.
            </p>
          </div>

          <div className="space-y-3.5">
            {[
              {
                q: 'Quels formats de plans acceptez-vous ?',
                a: "PDF, JPEG, PNG. Le format DWG arrive prochainement. Pour l'instant, exportez votre plan DWG en PDF et uploadz-le."
              },
              {
                q: 'Mes plans sont-ils confidentiels ?',
                a: 'Oui. Vos plans ne sont utilisés que pour générer votre DQE. Ils ne sont ni revendus ni exploités à d\'autres fins.'
              },
              {
                q: 'Le DQE généré est-il modifiable ?',
                a: 'Oui. Vous pouvez modifier les quantités, ajouter des ouvrages et ajuster les prix unitaires avant d\'exporter.'
              },
              {
                q: 'Que comprend "1 projet gratuit" ?',
                a: 'Un projet = un plan analysé. Vous pouvez uploader un plan, voir le DQE généré et l\'exporter une fois gratuitement.'
              },
              {
                q: "L'IA peut-elle se tromper sur les quantités ?",
                a: "L'IA est très précise, mais un contrôle humain reste recommandé. Métrio vous donne une base chiffrée solide, pas un devis définitif."
              },
              {
                q: 'Que se passe-t-il après mon projet gratuit ?',
                a: 'Vous pouvez continuer à 1 500 FCFA par export, ou passer à l\'abonnement Pro (12 000 FCFA/mois) pour 10 projets.'
              }
            ].map((faq, idx) => (
              <FAQAccordionItem key={idx} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* 9. Footer Structuré (A.7) */}
      <footer className="bg-gray-50 border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-12 font-sans text-[14px] text-[#64748B]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div className="flex flex-col gap-3">
            <div
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <div
                style={{ borderRadius: '8px', backgroundColor: '#4F46E5' }}
                className="w-7 h-7 flex items-center justify-center text-white"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4 20V8l8 6 8-6v12H4zM12 4L4 10V4h16v6L12 4z" />
                </svg>
              </div>
              <span className="font-sans font-black text-[18px] text-[#1E293B]">
                Métrio
              </span>
            </div>
            <p className="text-[13px] text-[#64748B] leading-relaxed">
              Votre métré, en quelques minutes.
            </p>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-2.5">
            <span className="font-bold text-[12px] uppercase tracking-wider text-[#1E293B]">
              Produit
            </span>
            <button
              onClick={() => scrollToSection('comment-ca-marche')}
              className="text-left text-[13.5px] hover:text-[#4F46E5] transition-colors cursor-pointer"
            >
              Méthode
            </button>
            <button
              onClick={() => scrollToSection('couverture')}
              className="text-left text-[13.5px] hover:text-[#4F46E5] transition-colors cursor-pointer"
            >
              Fonctionnalités
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-left text-[13.5px] hover:text-[#4F46E5] transition-colors cursor-pointer"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollToSection('tarifs')}
              className="text-left text-[13.5px] hover:text-[#4F46E5] transition-colors cursor-pointer"
            >
              Tarifs
            </button>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col gap-2.5">
            <span className="font-bold text-[12px] uppercase tracking-wider text-[#1E293B]">
              Espace & Légal
            </span>
            <button
              onClick={() => onNavigate('/auth/login')}
              className="text-left text-[13.5px] hover:text-[#4F46E5] transition-colors cursor-pointer"
            >
              Connexion
            </button>
            <button
              onClick={() => onNavigate('/mentions-legales')}
              className="text-left text-[13.5px] hover:text-[#4F46E5] transition-colors cursor-pointer"
            >
              CGU
            </button>
            <button
              onClick={() => onNavigate('/confidentialite')}
              className="text-left text-[13.5px] hover:text-[#4F46E5] transition-colors cursor-pointer"
            >
              Confidentialité
            </button>
            <button
              onClick={() => onNavigate('/mentions-legales')}
              className="text-left text-[13.5px] hover:text-[#4F46E5] transition-colors cursor-pointer"
            >
              Mentions légales
            </button>
          </div>

          {/* Col 4 */}
          <div className="flex flex-col gap-2.5">
            <span className="font-bold text-[12px] uppercase tracking-wider text-[#1E293B]">
              Contact
            </span>
            <a
              href="mailto:contact@metrio.app"
              className="text-[13.5px] hover:text-[#4F46E5] transition-colors flex items-center gap-2"
            >
              <Mail size={15} />
              <span>contact@metrio.app</span>
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12.5px] text-[#64748B]">
          <span>© 2026 Métrio. Tous droits réservés.</span>
          <span>Conçu en Afrique, utilisé partout.</span>
        </div>
      </footer>

    </div>
  );
}
