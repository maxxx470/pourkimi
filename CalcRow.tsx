import React from 'react';
import { CalcItem } from '../../../data/mockCahier';

export interface CalcRowProps {
  item: CalcItem;
  editMode: boolean;
  editedValue?: string;
  onEdit?: (value: string) => void;
  onBlur?: () => void;
  isRecentlyChanged?: boolean;
}

export const CalcRow: React.FC<CalcRowProps> = ({
  item,
  editMode,
  editedValue,
  onEdit,
  onBlur,
  isRecentlyChanged = false,
}) => {
  const currentValue =
    editedValue !== undefined ? editedValue : item.editableValue ?? String(item.result);

  return (
    <div
      style={{
        backgroundColor: isRecentlyChanged ? 'rgba(108,94,207,0.12)' : 'transparent',
        transition: 'background-color 600ms ease-out',
      }}
      className="py-1.5 border-b border-[#E2E8F0] last:border-b-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-sans text-[12px]"
    >
      {/* Label Column */}
      <div className="flex-1 min-w-0 pr-2">
        <span
          className={`leading-snug ${
            item.isFinal ? 'font-bold text-[#1E293B]' : 'font-medium text-[#475569]'
          }`}
        >
          {item.label}
        </span>
      </div>

      {/* Formula & Result Container */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap justify-between sm:justify-end flex-shrink-0">
        {/* Formula */}
        <span
          style={{
            backgroundColor: '#EEF2FF',
            color: '#4F46E5',
          }}
          className="font-mono text-[11px] px-1.5 py-0.5 rounded text-nowrap"
        >
          {item.formula}
        </span>

        {/* Result or Editable Input */}
        <div className="flex items-center gap-1 min-w-[90px] justify-end text-right">
          {editMode && item.isEditable ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={currentValue}
                onChange={(e) => onEdit?.(e.target.value)}
                onBlur={onBlur}
                style={{
                  width: '80px',
                  height: '28px',
                  border: '1px solid rgba(108,94,207,0.3)',
                  borderRadius: '6px',
                  backgroundColor: '#EEF2FF',
                }}
                className="px-2 text-right font-bold text-[12px] text-[#4F46E5] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all font-sans"
              />
              <span className="text-[11px] font-bold text-[#1E293B]">{item.unit}</span>
            </div>
          ) : (
            <div>
              {item.isFinal ? (
                <span className="font-sans">
                  <span className="text-[#475569] text-[11px] font-medium mr-1">=</span>
                  <span className="font-extrabold text-[13px] text-[#4F46E5]">
                    {item.result.toLocaleString('fr-FR', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className="ml-1 font-bold text-[11px] text-[#1E293B]">
                    {item.unit}
                  </span>
                </span>
              ) : (
                <span className="font-bold text-[12px] text-[#1E293B]">
                  {item.result.toLocaleString('fr-FR', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}{' '}
                  {item.unit}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
