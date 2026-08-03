import React from 'react';
import { RecapData } from '../../../types/recap';
import { formatMontant } from '../../../hooks/useRecap';
import { DQEItem } from '../../../data/mockDQE';

interface DocumentPreviewProps {
  data: RecapData;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ data }) => {
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // Limit to first 2 lots for representative preview
  const previewLots = data.lots.slice(0, 2);
  const remainingLotsCount = data.lots.length - previewLots.length;

  // Helper to extract top non-sublot items for preview
  const getSampleItems = (items: DQEItem[]): DQEItem[] => {
    const list: DQEItem[] = [];
    for (const item of items) {
      if (item.isSubLot && item.children) {
        for (const child of item.children) {
          list.push(child);
          if (list.length >= 2) break;
        }
      } else if (!item.isSubLot) {
        list.push(item);
      }
      if (list.length >= 2) break;
    }
    return list;
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[16px] overflow-hidden mb-4 font-sans shadow-2xs">
      {/* En-tête document */}
      <div
        style={{ backgroundColor: '#4F46E5', color: '#ffffff' }}
        className="p-[16px_20px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 select-none"
      >
        <div>
          <div className="font-sans font-extrabold text-[15px] tracking-tight leading-tight">
            {data.cabinet.nom}
          </div>
          <div className="font-sans text-[10px] opacity-75 font-medium mt-0.5">
            {data.cabinet.email} • {data.cabinet.telephone}
          </div>
        </div>
        <div className="text-left sm:text-right">
          <div className="font-sans font-black text-[16px] tracking-wide uppercase">
            DEVIS QUANTITATIF ESTIMATIF
          </div>
          <div className="font-sans text-[9px] opacity-70 font-medium">
            Généré via Métrio — {currentDate}
          </div>
        </div>
      </div>

      {/* Bloc infos projet */}
      <div className="bg-[#F8FAFC] p-[14px_20px] border-b border-[#E2E8F0]">
        <div className="grid grid-cols-2 gap-x-5 gap-y-2">
          <div>
            <div className="font-sans text-[9px] font-bold uppercase text-[#475569] tracking-wider mb-0.5">
              Projet
            </div>
            <div className="font-sans text-[12px] font-semibold text-[#1E293B]">
              {data.project.nom}
            </div>
          </div>

          <div>
            <div className="font-sans text-[9px] font-bold uppercase text-[#475569] tracking-wider mb-0.5">
              Client
            </div>
            <div className="font-sans text-[12px] font-semibold text-[#1E293B]">
              {data.project.client}
            </div>
          </div>

          <div>
            <div className="font-sans text-[9px] font-bold uppercase text-[#475569] tracking-wider mb-0.5">
              Localisation
            </div>
            <div className="font-sans text-[12px] font-semibold text-[#1E293B]">
              {data.project.localisation}
            </div>
          </div>

          <div>
            <div className="font-sans text-[9px] font-bold uppercase text-[#475569] tracking-wider mb-0.5">
              Établi par
            </div>
            <div className="font-sans text-[12px] font-semibold text-[#1E293B]">
              {data.project.etabliPar}
            </div>
          </div>
        </div>
      </div>

      {/* Corps du document */}
      <div className="p-[16px_20px]">
        <div className="border border-[#E2E8F0] rounded-[8px] overflow-x-auto min-w-0 w-full">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-[#F8FAFC] text-[9px] font-bold text-[#475569] uppercase tracking-wider border-b border-[#E2E8F0] select-none">
                <th className="px-3 py-2 w-[35px] text-left">N°</th>
                <th className="px-3 py-2 text-left">Désignation</th>
                <th className="px-3 py-2 w-[45px] text-center">Unité</th>
                <th className="px-3 py-2 w-[55px] text-right">Qté</th>
                <th className="px-3 py-2 w-[80px] text-right">PU</th>
                <th className="px-3 py-2 w-[95px] text-right">Montant</th>
              </tr>
            </thead>
            <tbody>
              {previewLots.map((lot) => {
                const sampleItems = getSampleItems(lot.items);
                return (
                  <React.Fragment key={lot.id}>
                    {/* Lot Header Row */}
                    <tr
                      style={{ backgroundColor: lot.color, color: '#ffffff' }}
                      className="font-sans font-extrabold text-[10px] uppercase tracking-wider select-none"
                    >
                      <td colSpan={6} className="px-2.5 py-1.5">
                        LOT {lot.numero} — {lot.name}
                      </td>
                    </tr>

                    {/* Sample Items */}
                    {sampleItems.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-[rgba(0,0,0,0.06)] font-sans text-[11px]"
                      >
                        <td className="px-2.5 py-1.5 font-medium text-[#475569] text-[10px]">
                          {item.numero || '-'}
                        </td>
                        <td className="px-2.5 py-1.5 font-medium text-[#1E293B]">
                          {item.designation}
                        </td>
                        <td className="px-2.5 py-1.5 text-center text-[#475569] text-[10px]">
                          {item.unite}
                        </td>
                        <td className="px-2.5 py-1.5 text-right font-semibold text-[#1E293B]">
                          {item.quantite}
                        </td>
                        <td className="px-2.5 py-1.5 text-right text-[#475569] font-medium">
                          {item.prixUnitaire ? formatMontant(item.prixUnitaire) : '—'}
                        </td>
                        <td className="px-2.5 py-1.5 text-right font-bold text-[#1E293B]">
                          {item.montant ? formatMontant(item.montant) : '—'}
                        </td>
                      </tr>
                    ))}

                    {/* Lot Subtotal Row */}
                    <tr className="bg-[#F1F5F9] border-b border-[#E2E8F0] font-sans text-[11px]">
                      <td colSpan={5} className="px-2.5 py-1.5 text-right font-bold text-[#1E293B]">
                        Sous-total LOT {lot.numero}
                      </td>
                      <td className="px-2.5 py-1.5 text-right font-extrabold text-[#4F46E5]">
                        {formatMontant(lot.sousTotal)} FCFA
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}

              {/* Remaining lots indicator */}
              {remainingLotsCount > 0 && (
                <tr className="bg-white border-b border-[#E2E8F0] font-sans">
                  <td
                    colSpan={6}
                    className="px-3 py-2 text-center text-[10px] font-semibold text-[#475569]"
                  >
                    + {remainingLotsCount} autres lots inclus dans le document complet
                  </td>
                </tr>
              )}

              {/* TOTAL HT ROW */}
              <tr
                style={{ backgroundColor: '#4F46E5', color: '#ffffff' }}
                className="font-sans text-[11px] font-extrabold select-none"
              >
                <td colSpan={5} className="px-3 py-2 text-right uppercase tracking-wider">
                  TOTAL HT
                </td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {formatMontant(data.totalHT)} FCFA
                </td>
              </tr>

              {/* TOTAL TTC ROW */}
              <tr
                style={{ backgroundColor: '#1E293B', color: '#ffffff' }}
                className="font-sans text-[11px] font-extrabold select-none"
              >
                <td colSpan={5} className="px-3 py-2 text-right uppercase tracking-wider">
                  TOTAL TTC
                </td>
                <td className="px-3 py-2 text-right whitespace-nowrap text-[#4F46E5]">
                  {formatMontant(data.totalTTC)} FCFA
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="font-sans text-[9px] text-[#475569] text-center pt-3 font-medium">
          Document généré par Métrio — metrio.app • Base d'estimation à valider par un professionnel
        </div>
      </div>
    </div>
  );
};
