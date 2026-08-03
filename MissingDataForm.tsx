import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { MissingDataItem } from '../../../services/analyseService';

export interface MissingDataFormProps {
  missingData: MissingDataItem[];
  onSubmit: (answers: Record<string, string>) => void;
}

export const MissingDataForm: React.FC<MissingDataFormProps> = ({
  missingData,
  onSubmit,
}) => {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleInputChange = (fieldKey: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [fieldKey]: value }));
    if (fieldErrors[fieldKey]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[fieldKey];
        return copy;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    missingData.forEach((item) => {
      const val = (formValues[item.champ] || '').trim();
      if (item.obligatoire && !val) {
        errors[item.champ] = 'Ce champ est obligatoire pour continuer';
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    onSubmit(formValues);
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 font-sans space-y-3.5">
      {/* Header */}
      <Alert variant="warning">
        {missingData.length} information{missingData.length > 1 ? 's' : ''} manquante
        {missingData.length > 1 ? 's' : ''}
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {missingData.map((item, idx) => {
          const hasError = !!fieldErrors[item.champ];

          return (
            <div
              key={item.champ}
              style={{
                borderBottom:
                  idx < missingData.length - 1
                    ? '1px solid rgba(212,150,10,0.15)'
                    : 'none',
                paddingBottom: idx < missingData.length - 1 ? '12px' : '0',
              }}
              className="flex flex-col sm:flex-row sm:items-start justify-between gap-3"
            >
              {/* Left Column */}
              <div className="flex-1 min-w-0">
                <label className="block font-semibold text-[12px] text-[#1E293B] mb-0.5">
                  {item.champ}
                </label>
                <p className="font-sans text-[11px] text-[#475569] mb-1.5 leading-relaxed">
                  {item.description}
                </p>

                <input
                  type="text"
                  value={formValues[item.champ] || ''}
                  onChange={(e) => handleInputChange(item.champ, e.target.value)}
                  placeholder={item.valeur_defaut || 'Saisissez la valeur...'}
                  style={{
                    height: '32px',
                    border: hasError
                      ? '1px solid #E8442A'
                      : '1px solid rgba(0,0,0,0.10)',
                    borderRadius: '7px',
                    padding: '0 10px',
                    backgroundColor: '#ffffff',
                  }}
                  className="w-full text-[12px] font-sans text-[#1E293B] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 transition-all"
                />

                {hasError && (
                  <p className="font-sans text-[12px] text-[#E8442A] mt-1 font-medium">
                    {fieldErrors[item.champ]}
                  </p>
                )}
              </div>

              {/* Right Column Badge */}
              <div className="flex-shrink-0 pt-0.5 sm:pt-1">
                {item.obligatoire ? (
                  <span
                    style={{ backgroundColor: '#FEF0EC', color: '#E8442A' }}
                    className="font-bold text-[10px] px-2 py-0.5 rounded-full uppercase"
                  >
                    Obligatoire
                  </span>
                ) : (
                  <span
                    style={{
                      backgroundColor: '#FDF8EC',
                      color: '#D4960A',
                      border: '1px solid rgba(212,150,10,0.2)',
                    }}
                    className="font-bold text-[10px] px-2 py-0.5 rounded-full uppercase"
                  >
                    Recommandé
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            style={{
              height: '36px',
              padding: '0 16px',
              borderRadius: '9999px',
              backgroundColor: '#4F46E5',
            }}
            className="text-white font-semibold text-[13px] flex items-center gap-1.5 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
          >
            <RefreshCw size={14} className="text-white" />
            <span>Relancer l'analyse</span>
          </button>
        </div>
      </form>
    </div>
  );
};
