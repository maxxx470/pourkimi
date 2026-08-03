import React from 'react';
import { ModeDevis } from '../../../types/devis';

interface ModeSelectorProps {
  mode: ModeDevis;
  onSwitch: (mode: ModeDevis) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, onSwitch }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4.5 font-sans">
      {/* Mode A */}
      <div
        onClick={() => onSwitch('A')}
        style={{
          borderRadius: '12px',
          padding: '14px 16px',
          cursor: 'pointer',
          position: 'relative',
          border: mode === 'A' ? '1.5px solid #4F46E5' : '1.5px solid #E2E8F0',
          backgroundColor: mode === 'A' ? '#EEF2FF' : '#F8FAFC',
        }}
        className="flex-1 transition-all"
      >
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '8px',
            backgroundColor: mode === 'A' ? '#4F46E5' : '#E4E4E7',
            color: mode === 'A' ? '#ffffff' : '#475569',
          }}
          className="flex items-center justify-center font-sans font-extrabold text-[12px] mb-2"
        >
          A
        </div>
        <h3
          style={{ color: mode === 'A' ? '#5348A8' : '#475569' }}
          className="font-sans font-bold text-[13px] mb-1"
        >
          Prix unitaires par ouvrage
        </h3>
        <p
          style={{ color: mode === 'A' ? '#5348A8' : '#475569' }}
          className="font-sans font-medium text-[11px] leading-relaxed opacity-90"
        >
          Saisissez un prix pour chaque ligne du DQE. Total calculé automatiquement.
        </p>
      </div>

      {/* Mode B */}
      <div
        onClick={() => onSwitch('B')}
        style={{
          borderRadius: '12px',
          padding: '14px 16px',
          cursor: 'pointer',
          position: 'relative',
          border: mode === 'B' ? '1.5px solid #4F46E5' : '1.5px solid #E2E8F0',
          backgroundColor: mode === 'B' ? '#EEF2FF' : '#F8FAFC',
        }}
        className="flex-1 transition-all"
      >
        {/* Badge */}
        <div
          style={{
            position: 'absolute',
            top: '-8px',
            right: '12px',
            backgroundColor: mode === 'B' ? '#4F46E5' : '#F1F5F9',
            color: mode === 'B' ? '#ffffff' : '#475569',
            borderRadius: '99px',
            padding: '2px 8px',
            fontSize: '9px',
            fontWeight: 700,
          }}
          className="font-sans"
        >
          Pratique en Afrique
        </div>

        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '8px',
            backgroundColor: mode === 'B' ? '#4F46E5' : '#E4E4E7',
            color: mode === 'B' ? '#ffffff' : '#475569',
          }}
          className="flex items-center justify-center font-sans font-extrabold text-[12px] mb-2"
        >
          B
        </div>
        <h3
          style={{ color: mode === 'B' ? '#5348A8' : '#475569' }}
          className="font-sans font-bold text-[13px] mb-1"
        >
          Prix au m² par pièce
        </h3>
        <p
          style={{ color: mode === 'B' ? '#5348A8' : '#475569' }}
          className="font-sans font-medium text-[11px] leading-relaxed opacity-90"
        >
          Entrez un prix global au m² tout inclus pour chaque pièce du bâtiment.
        </p>
      </div>
    </div>
  );
};
