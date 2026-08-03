import React from 'react';
import { DQEItem } from '../../../data/mockDQE';

export interface SubLotRowProps {
  item: DQEItem;
  colSpan?: number;
}

export const SubLotRow: React.FC<SubLotRowProps> = ({ item, colSpan = 7 }) => {
  return (
    <tr
      style={{ backgroundColor: '#F8FAFC' }}
      className="border-b border-[#E2E8F0] font-sans text-[12px] font-bold text-[#1E293B]"
    >
      <td className="px-3 py-2 text-left font-bold text-[#475569] text-[11px] w-[50px]">
        {item.numero}
      </td>
      <td colSpan={colSpan - 1} className="px-3 py-2 text-left pl-5">
        {item.designation}
      </td>
    </tr>
  );
};
