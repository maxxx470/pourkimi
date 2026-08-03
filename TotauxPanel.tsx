import React from 'react';

interface TotauxPanelProps {
  totalHT: number;
  tva: number;
  totalTTC: number;
  tvaRate: number;
  formatMontant: (n: number) => string;
}

export const TotauxPanel: React.FC<TotauxPanelProps> = ({
  totalHT,
  tva,
  totalTTC,
  tvaRate,
  formatMontant,
}) => {
  return (
    <div
      style={{
        backgroundColor: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        padding: '14px',
      }}
      className="font-sans shadow-2xs"
    >
      <div
        style={{
          fontSize: '13px',
          fontWeight: 700,
          marginBottom: '10px',
          color: '#1E293B',
        }}
        className="font-sans"
      >
        Totaux
      </div>

      {/* Ligne Total HT */}
      <div
        style={{ padding: '5px 0', fontSize: '12px' }}
        className="flex items-center justify-between font-sans"
      >
        <span style={{ color: '#475569' }} className="font-medium">
          Total HT
        </span>
        <span style={{ color: '#4F46E5', fontWeight: 800 }} className="font-sans">
          {formatMontant(totalHT)} FCFA
        </span>
      </div>

      {/* Ligne TVA */}
      <div
        style={{ padding: '5px 0', fontSize: '12px' }}
        className="flex items-center justify-between font-sans"
      >
        <span style={{ color: '#475569' }} className="font-medium">
          TVA {tvaRate}%
        </span>
        <span style={{ color: '#475569', fontWeight: 700 }} className="font-sans">
          {formatMontant(tva)} FCFA
        </span>
      </div>

      {/* Ligne Total TTC */}
      <div
        style={{
          borderTop: '1px solid #E2E8F0',
          marginTop: '4px',
          paddingTop: '8px',
        }}
        className="flex items-center justify-between font-sans"
      >
        <span style={{ color: '#1E293B', fontWeight: 800, fontSize: '13px' }}>
          Total TTC
        </span>
        <span style={{ color: '#4F46E5', fontWeight: 800, fontSize: '15px' }}>
          {formatMontant(totalTTC)} FCFA
        </span>
      </div>
    </div>
  );
};
