import React, { useState, useEffect } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { MonPrix } from '../../../types/materiaux';
import { CORPS_METIER_MAP } from '../../../data/mockMesPrix';

interface MesPrixTableProps {
  prix: MonPrix[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCorpsMetier: string;
  onCorpsMetierChange: (cm: string) => void;
  onPrixChange: (id: string, prix: number) => void;
  onDeletePrix: (id: string) => void;
  formatMontant: (n: number) => string;
}

const PriceInput: React.FC<{
  initialValue: number;
  onSave: (val: number) => void;
}> = ({ initialValue, onSave }) => {
  const [val, setVal] = useState<string>(initialValue.toString());

  useEffect(() => {
    setVal(initialValue.toString());
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s/g, '');
    if (/^\d*$/.test(raw)) {
      setVal(raw);
      const num = parseInt(raw, 10);
      onSave(isNaN(num) ? 0 : num);
    }
  };

  const formattedDisplay = val ? parseInt(val, 10).toLocaleString('fr-FR') : '0';

  return (
    <input
      type="text"
      value={val ? formattedDisplay : ''}
      onChange={handleChange}
      placeholder="0"
      style={{
        width: '110px',
        height: '30px',
        border: '1px solid rgba(0,0,0,0.12)',
        borderRadius: '6px',
        padding: '0 8px',
      }}
      className="font-sans font-bold text-[12px] text-right text-[#1E293B] bg-white focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 transition-all"
    />
  );
};

export const MesPrixTable: React.FC<MesPrixTableProps> = ({
  prix,
  searchQuery,
  onSearchChange,
  selectedCorpsMetier,
  onCorpsMetierChange,
  onPrixChange,
  onDeletePrix,
}) => {
  const corpsKeys = Object.keys(CORPS_METIER_MAP);

  return (
    <div className="font-sans">
      {/* Search Bar */}
      <div className="relative mb-4 max-w-md">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569] pointer-events-none"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher par désignation..."
          style={{
            height: '36px',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            paddingLeft: '34px',
          }}
          className="w-full bg-white text-[12px] font-sans font-medium text-[#1E293B] placeholder-[#A1A1AA] focus:outline-none focus:border-[#4F46E5] transition-colors shadow-2xs"
        />
      </div>

      {/* Corps de Métier Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-4 scrollbar-none">
        {corpsKeys.map((key) => {
          const isSelected = selectedCorpsMetier === key;
          const label = CORPS_METIER_MAP[key];

          return (
            <button
              key={key}
              type="button"
              onClick={() => onCorpsMetierChange(key)}
              style={{
                backgroundColor: isSelected ? '#4F46E5' : '#F8FAFC',
                color: isSelected ? '#ffffff' : '#475569',
                border: isSelected ? '1px solid transparent' : '1px solid #E2E8F0',
              }}
              className="font-sans font-bold text-[11px] px-3 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer shrink-0 shadow-2xs hover:border-[#4F46E5]/40"
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Table Container */}
      <div
        style={{
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
        }}
        className="shadow-2xs"
      >
        <div className="overflow-x-auto min-w-0 w-full">
          <table className="w-full text-left border-collapse font-sans min-w-[600px]">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-medium uppercase tracking-wider text-[#64748B]">
                <th className="py-3.5 px-5">Désignation</th>
                <th className="py-3.5 px-5">Unité</th>
                <th className="py-3.5 px-5 text-center">Type</th>
                <th className="py-3.5 px-5 text-right">Prix (FCFA)</th>
                <th className="py-3.5 px-5 text-center w-16">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,0,0,0.06)] text-[12px]">
              {prix.length > 0 ? (
                prix.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#F8FAFC]/70 transition-colors"
                  >
                    <td className="py-2.5 px-3.5 font-bold text-[#1E293B]">
                      <div className="flex flex-col">
                        <span>{item.designation}</span>
                        <span className="text-[10px] text-[#475569] font-normal">
                          {CORPS_METIER_MAP[item.corpsMetier] || item.corpsMetier}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 font-semibold text-[#475569]">
                      {item.unite}
                    </td>
                    <td className="py-2.5 px-3.5 text-center">
                      <span
                        style={{ backgroundColor: '#F1F5F9', color: '#475569' }}
                        className="font-sans font-extrabold text-[10px] px-2.5 py-0.5 rounded-full inline-block"
                      >
                        Suggestion
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-right">
                      <PriceInput
                        initialValue={item.prixActuel}
                        onSave={(val) => onPrixChange(item.id, val)}
                      />
                    </td>
                    <td className="py-2.5 px-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => onDeletePrix(item.id)}
                        title="Supprimer ce prix"
                        className="p-1.5 rounded-md text-[#475569] hover:text-[#E8442A] hover:bg-[#FEF0EC] transition-all cursor-pointer inline-flex items-center justify-center"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#475569] text-[12px] font-sans">
                    Aucun élément ne correspond à votre recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[11px] text-[#475569] font-medium mt-3 font-sans">
        Ces tarifs sont des suggestions de marché modifiables ou supprimables. Ils n'affectent pas les formules de calcul du DQE.
      </p>
    </div>
  );
};
