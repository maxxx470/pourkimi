import React from 'react';
import { Plus } from 'lucide-react';
import { DQELot, DQEItem } from '../../../data/mockDQE';
import { LotRow } from './LotRow';
import { SubLotRow } from './SubLotRow';
import { DataRow } from './DataRow';
import { DetailRow } from './DetailRow';
import { SousTotalRow } from './SousTotalRow';
import { formatMontant } from '../../../hooks/useDQE';

export interface DQETableProps {
  lots: DQELot[];
  modeDevis: boolean;
  editMode: boolean;
  selectedLot: 'all' | number;
  totalHT: number;
  tva: number;
  totalTTC: number;
  onPrixChange: (itemId: string, prix: number | null) => void;
  onQuantiteChange: (itemId: string, quantite: number) => void;
  onUniteChange: (itemId: string, unite: string) => void;
  onDeleteItem: (itemId: string) => void;
  onAddItemClick: (lotId: number) => void;
  onAddLotClick?: () => void;
  onDeleteLot?: (lotId: number) => void;
}

export const DQETable: React.FC<DQETableProps> = ({
  lots,
  modeDevis,
  editMode,
  totalHT,
  tva,
  totalTTC,
  onPrixChange,
  onQuantiteChange,
  onUniteChange,
  onDeleteItem,
  onAddItemClick,
  onAddLotClick,
  onDeleteLot,
}) => {
  // Calculate total column count
  let colSpan = 4; // N°, Designation, Unite, Quantite
  if (modeDevis) colSpan += 2; // Prix, Montant
  colSpan += 1; // Obs
  if (editMode) colSpan += 1; // Actions

  return (
    <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-xs overflow-hidden transition-all">
      <div className="overflow-x-auto min-w-0 w-full">
        <table className="w-full text-left border-collapse font-sans min-w-[720px]">
          {/* Table Header */}
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-medium text-[#64748B] uppercase tracking-wider select-none">
              <th className="px-5 py-3.5 w-[50px] text-left">N°</th>
              <th className="px-5 py-3.5 text-left">Désignation des ouvrages</th>
              <th className="px-5 py-3.5 w-[65px] text-center">Unité</th>
              <th className="px-5 py-3.5 w-[85px] text-right">Quantité</th>
              {modeDevis && (
                <th className="px-5 py-3.5 w-[110px] text-right">
                  Prix unit. (FCFA)
                </th>
              )}
              {modeDevis && (
                <th className="px-5 py-3.5 w-[130px] text-right">
                  Montant (FCFA)
                </th>
              )}
              <th className="px-5 py-3.5 w-[90px] text-left">Obs.</th>
              {editMode && (
                <th className="px-5 py-3.5 w-[40px] text-center">Actions</th>
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {lots.map((lot) => (
              <React.Fragment key={lot.id}>
                {/* Lot Header Row */}
                <LotRow lot={lot} colSpan={colSpan} editMode={editMode} onDeleteLot={onDeleteLot} />

                {/* Items */}
                {lot.items.map((item) => {
                  if (item.isSubLot) {
                    return (
                      <React.Fragment key={item.id}>
                        <SubLotRow item={item} colSpan={colSpan} />
                        {(item.children || []).map((child) =>
                          child.isDetail ? (
                            <DetailRow
                              key={child.id}
                              item={child}
                              modeDevis={modeDevis}
                              editMode={editMode}
                              onDelete={onDeleteItem}
                              indent={2}
                            />
                          ) : (
                            <DataRow
                              key={child.id}
                              item={child}
                              modeDevis={modeDevis}
                              editMode={editMode}
                              onPrixChange={onPrixChange}
                              onQuantiteChange={onQuantiteChange}
                              onUniteChange={onUniteChange}
                              onDelete={onDeleteItem}
                              indent={1}
                            />
                          )
                        )}
                      </React.Fragment>
                    );
                  } else if (item.isDetail) {
                    return (
                      <DetailRow
                        key={item.id}
                        item={item}
                        modeDevis={modeDevis}
                        editMode={editMode}
                        onDelete={onDeleteItem}
                        indent={1}
                      />
                    );
                  } else {
                    return (
                      <DataRow
                        key={item.id}
                        item={item}
                        modeDevis={modeDevis}
                        editMode={editMode}
                        onPrixChange={onPrixChange}
                        onQuantiteChange={onQuantiteChange}
                        onUniteChange={onUniteChange}
                        onDelete={onDeleteItem}
                        indent={0}
                      />
                    );
                  }
                })}

                {/* Sous-total row */}
                <SousTotalRow
                  lot={lot}
                  modeDevis={modeDevis}
                  editMode={editMode}
                />

                {/* Add Row Button inside lot */}
                {editMode && (
                  <tr>
                    <td colSpan={colSpan} className="p-0 border-b border-[#E2E8F0]">
                      <button
                        type="button"
                        onClick={() => onAddItemClick(lot.id)}
                        className="w-full py-1.5 px-3 bg-[#EEF2FF]/50 hover:bg-[#EEF2FF] text-[#4F46E5] text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus size={12} />
                        <span>Ajouter un ouvrage au LOT {lot.numero}</span>
                      </button>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}

            {/* TOTAL HT ROW */}
            <tr
              style={{ backgroundColor: '#4F46E5', color: '#ffffff' }}
              className="font-sans text-[13px] font-extrabold select-none"
            >
              <td colSpan={modeDevis ? 5 : 4} className="px-3 py-2.5 text-right uppercase tracking-wider">
                TOTAL GÉNÉRAL HT
              </td>
              {modeDevis && (
                <td className="px-3 py-2.5 text-right font-extrabold whitespace-nowrap text-[14px]">
                  {formatMontant(totalHT)} FCFA
                </td>
              )}
              <td className="px-3 py-2.5"></td>
              {editMode && <td className="px-3 py-2.5"></td>}
            </tr>

            {/* TVA ROW (modeDevis only) */}
            {modeDevis && (
              <tr className="bg-[#F1F5F9] border-t border-b border-[#E2E8F0] font-sans text-[12px] font-bold text-[#1E293B]">
                <td colSpan={5} className="px-3 py-2 text-right">
                  TVA (18%)
                </td>
                <td className="px-3 py-2 text-right text-[#1E293B] whitespace-nowrap">
                  {formatMontant(tva)} FCFA
                </td>
                <td className="px-3 py-2"></td>
                {editMode && <td className="px-3 py-2"></td>}
              </tr>
            )}

            {/* TOTAL TTC ROW (modeDevis only) */}
            {modeDevis && (
              <tr
                style={{ backgroundColor: '#1E293B', color: '#ffffff' }}
                className="font-sans text-[14px] font-extrabold select-none"
              >
                <td colSpan={5} className="px-3 py-2.5 text-right uppercase tracking-wider">
                  TOTAL GENERAL TTC
                </td>
                <td className="px-3 py-2.5 text-right text-[#4F46E5] whitespace-nowrap text-[15px]">
                  {formatMontant(totalTTC)} FCFA
                </td>
                <td className="px-3 py-2.5"></td>
                {editMode && <td className="px-3 py-2.5"></td>}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bouton pour ajouter un lot entier (ex: Plomberie, Électricité...) */}
      {onAddLotClick && (
        <div className="p-2 bg-[#F8FAFC] border-t border-[#E2E8F0]">
          <button
            type="button"
            onClick={onAddLotClick}
            className="w-full py-2 bg-[#EEF2FF] hover:bg-[#C7D2FE] text-[#4F46E5] text-[11px] font-bold uppercase tracking-wider rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus size={13} />
            <span>Ajouter un lot</span>
          </button>
        </div>
      )}
    </div>
  );
};
