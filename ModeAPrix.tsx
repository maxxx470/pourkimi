import React from 'react';
import { DQELot, DQEItem } from '../../../data/mockDQE';

interface ModeAPrixProps {
  lots: DQELot[];
  prixUnitaires: Record<string, number>;
  onPrixChange: (itemId: string, prix: number) => void;
  totalHT: number;
  tvaRate: number;
  tva: number;
  totalTTC: number;
  formatMontant: (n: number) => string;
}

export const ModeAPrix: React.FC<ModeAPrixProps> = ({
  lots,
  prixUnitaires,
  onPrixChange,
  totalHT,
  tvaRate,
  tva,
  totalTTC,
  formatMontant,
}) => {
  // Calculate lot sous-total helper
  const getLotSousTotal = (lot: DQELot): number => {
    let sum = 0;
    const process = (items: DQEItem[]) => {
      for (const item of items) {
        if (!item.isSubLot && !item.isDetail) {
          const pu = prixUnitaires[item.id];
          if (pu && item.quantite) {
            sum += Math.round(item.quantite * pu);
          }
        }
        if (item.children) {
          process(item.children);
        }
      }
    };
    process(lot.items);
    return sum;
  };

  const renderItems = (items: DQEItem[], depth = 0): React.ReactNode => {
    return items.map((item) => {
      const isSub = item.isSubLot;
      const isDet = item.isDetail;
      const currentPU = prixUnitaires[item.id];
      const hasPrice = currentPU !== undefined && currentPU !== null && currentPU > 0;
      const montantItem = hasPrice && item.quantite ? Math.round(item.quantite * currentPU) : null;

      if (isSub) {
        return (
          <React.Fragment key={item.id}>
            <tr className="bg-[#F8FAFC] font-bold border-b border-[#E2E8F0]">
              <td className="px-3 py-2 text-[11px] text-[#475569] font-sans font-bold">{item.numero}</td>
              <td colSpan={5} className="px-3 py-2 text-[11px] text-[#1E293B] font-sans font-bold pl-5">
                {item.designation}
              </td>
            </tr>
            {item.children && renderItems(item.children, depth + 1)}
          </React.Fragment>
        );
      }

      return (
        <tr
          key={item.id}
          className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors font-sans text-[11px]"
        >
          {/* N° */}
          <td className="px-3 py-2 text-[#475569] font-medium w-[40px]">{item.numero}</td>

          {/* Désignation */}
          <td
            style={{ paddingLeft: `${12 + depth * 14 + (isDet ? 12 : 0)}px` }}
            className={`px-3 py-2 font-medium ${isDet ? 'text-[#475569]' : 'text-[#1E293B]'}`}
          >
            {item.designation}
          </td>

          {/* Unité */}
          <td className="px-3 py-2 text-[#475569] text-[10px] w-[60px]">{item.unite || '—'}</td>

          {/* Quantité */}
          <td className="px-3 py-2 text-right font-bold text-[#1E293B] w-[80px]">
            {item.quantite ? item.quantite : '—'}
          </td>

          {/* Prix unitaire input */}
          <td className="px-3 py-2 text-right w-[110px]">
            {isDet ? (
              <span className="text-[#A1A1AA] text-[10px]">—</span>
            ) : (
              <input
                type="number"
                min="0"
                value={currentPU !== undefined && currentPU !== null ? currentPU : ''}
                placeholder="0"
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onPrixChange(item.id, isNaN(val) ? 0 : val);
                }}
                className="w-[90px] h-[26px] border border-[#E2E8F0] rounded-[6px] px-2 text-right text-[11px] font-semibold text-[#1E293B] bg-white focus:outline-none focus:border-[#4F46E5] transition-colors shadow-2xs font-sans"
              />
            )}
          </td>

          {/* Montant FCFA */}
          <td className="px-3 py-2 text-right font-bold text-[#4F46E5] w-[120px]">
            {montantItem !== null ? `${formatMontant(montantItem)}` : <span className="text-[#A1A1AA] font-normal">—</span>}
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="border border-[#E2E8F0] rounded-[12px] overflow-hidden bg-white shadow-2xs font-sans mb-8">
      <div className="overflow-x-auto min-w-0 w-full">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-extrabold uppercase text-[#475569] tracking-wider">
              <th className="px-3 py-2.5 w-[40px]">N°</th>
              <th className="px-3 py-2.5">Désignation</th>
              <th className="px-3 py-2.5 w-[60px]">Unité</th>
              <th className="px-3 py-2.5 text-right w-[80px]">Quantité</th>
              <th className="px-3 py-2.5 text-right w-[110px]">Prix unit. FCFA</th>
              <th className="px-3 py-2.5 text-right w-[120px]">Montant FCFA</th>
            </tr>
          </thead>
          <tbody>
            {lots.map((lot) => {
              const lotSousTotal = getLotSousTotal(lot);
              return (
                <React.Fragment key={lot.id}>
                  {/* Lot header */}
                  <tr
                    style={{ backgroundColor: lot.color }}
                    className="text-white font-extrabold text-[11px] uppercase"
                  >
                    <td colSpan={6} className="px-3 py-2 tracking-wide font-sans">
                      LOT {lot.numero} — {lot.name}
                    </td>
                  </tr>

                  {/* Lot items */}
                  {renderItems(lot.items)}

                  {/* Lot subtotal */}
                  <tr className="bg-[#F1F5F9] font-bold border-b border-[#E2E8F0] text-[11px]">
                    <td colSpan={5} className="px-3 py-2.5 text-right text-[#1E293B]">
                      Sous-total LOT {lot.numero}
                    </td>
                    <td className="px-3 py-2.5 text-right text-[#1E293B] font-extrabold">
                      {formatMontant(lotSousTotal)} FCFA
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}

            {/* Total HT */}
            <tr className="bg-[#4F46E5] text-white font-black text-[13px]">
              <td colSpan={5} className="px-3.5 py-3 text-right">
                TOTAL HT
              </td>
              <td className="px-3.5 py-3 text-right">
                {formatMontant(totalHT)} FCFA
              </td>
            </tr>

            {/* TVA */}
            <tr className="bg-[#F1F5F9] text-[#1E293B] font-bold text-[12px]">
              <td colSpan={5} className="px-3.5 py-2.5 text-right">
                TVA ({tvaRate}%)
              </td>
              <td className="px-3.5 py-2.5 text-right font-extrabold">
                {formatMontant(tva)} FCFA
              </td>
            </tr>

            {/* Total TTC */}
            <tr className="bg-[#1E293B] text-white font-black text-[13px]">
              <td colSpan={5} className="px-3.5 py-3 text-right">
                TOTAL TTC
              </td>
              <td className="px-3.5 py-3 text-right">
                {formatMontant(totalTTC)} FCFA
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
