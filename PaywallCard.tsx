import React from 'react';
import { Lock, CreditCard, Loader2 } from 'lucide-react';

interface PaywallCardProps {
  price: number;
  onUnlock: () => void;
  isProcessing: boolean;
}

export const PaywallCard: React.FC<PaywallCardProps> = ({
  price,
  onUnlock,
  isProcessing,
}) => {
  const formattedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return (
    <div
      style={{
        backgroundColor: '#FDF8EC',
        border: '1px solid rgba(212,150,10,0.25)',
        borderRadius: '12px',
        padding: '14px',
      }}
      className="font-sans shadow-2xs"
    >
      {/* Titre */}
      <div className="flex items-center gap-1.5 mb-2">
        <Lock size={14} style={{ color: '#8A6200' }} className="shrink-0" />
        <span
          style={{ fontSize: '12px', fontWeight: 700, color: '#8A6200' }}
          className="font-sans"
        >
          Export payant — plan Découverte
        </span>
      </div>

      {/* Texte */}
      <p
        style={{
          fontSize: '11px',
          color: '#7A5800',
          lineHeight: '1.5',
          marginBottom: '10px',
        }}
        className="font-sans"
      >
        Vous avez vu le résultat complet. Débloquez le téléchargement en PDF et Excel pour ce projet.
      </p>

      {/* Prix */}
      <div className="flex items-baseline gap-1 mb-2.5">
        <span
          style={{
            fontSize: '20px',
            fontWeight: 900,
            color: '#7A5800',
          }}
          className="font-sans tracking-tight"
        >
          {formattedPrice}
        </span>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#8A6200',
          }}
          className="font-sans"
        >
          FCFA · paiement unique
        </span>
      </div>

      {/* Bouton Débloquer l'export */}
      <button
        type="button"
        disabled={isProcessing}
        onClick={onUnlock}
        style={{
          width: '100%',
          height: '38px',
          borderRadius: '9999px',
          border: 'none',
          backgroundColor: '#D4960A',
          color: '#ffffff',
          fontSize: '13px',
          fontWeight: 700,
        }}
        className="font-sans flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed shadow-xs"
      >
        {isProcessing ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            <span>Traitement...</span>
          </>
        ) : (
          <>
            <CreditCard size={14} />
            <span>Débloquer l'export</span>
          </>
        )}
      </button>
    </div>
  );
};
