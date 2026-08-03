import React from 'react';
import { Alert } from '../../../components/ui/Alert';
import { Hypothese } from '../../../data/mockCahier';

export interface HypotheseAlertProps {
  hypotheses: Hypothese[];
  onScrollToLot?: (lotName: string) => void;
}

export const HypotheseAlert: React.FC<HypotheseAlertProps> = ({
  hypotheses,
  onScrollToLot,
}) => {
  if (!hypotheses || hypotheses.length === 0) return null;

  return (
    <Alert variant="warning" className="mb-4">
      <div>
        <span>
          {hypotheses.length} valeur{hypotheses.length > 1 ? 's' : ''} par défaut{' '}
          {hypotheses.length > 1 ? 'ont été utilisées' : 'a été utilisée'} —{' '}
        </span>
        {hypotheses.map((hyp, index) => {
          const isLast = index === hypotheses.length - 1;
          const isPenultimate = index === hypotheses.length - 2;

          return (
            <React.Fragment key={hyp.champ}>
              <button
                type="button"
                onClick={() => onScrollToLot?.(hyp.lot_concerne)}
                className="text-[#4F46E5] underline hover:text-[#4338CA] transition-colors font-semibold cursor-pointer"
              >
                {hyp.description || hyp.champ}
              </button>
              {!isLast && (isPenultimate ? ' et ' : ', ')}
            </React.Fragment>
          );
        })}
        <span>. Vérifiez avant de valider.</span>
      </div>
    </Alert>
  );
};
