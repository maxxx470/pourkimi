import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { CalcLot, CalcItem } from '../../../data/mockCahier';
import { CalcRow } from './CalcRow';

export interface CalcBlockProps {
  lot: CalcLot;
  editMode: boolean;
  editedValues: Record<string, string>;
  onEditValue: (itemId: string, value: string) => void;
  onRecalculate?: (itemId: string) => void;
  recentlyChangedItemId?: string | null;
}

export const CalcBlock: React.FC<CalcBlockProps> = ({
  lot,
  editMode,
  editedValues,
  onEditValue,
  onRecalculate,
  recentlyChangedItemId,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div
      id={`lot-block-${lot.id}`}
      style={{
        backgroundColor: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '10px',
      }}
      className="font-sans transition-all duration-200"
    >
      {/* Header */}
      <div
        onClick={() => setIsExpanded((prev) => !prev)}
        style={{
          borderBottom: isExpanded ? '1px solid #E2E8F0' : 'none',
          padding: '12px 14px',
        }}
        className="flex items-center justify-between cursor-pointer hover:bg-black/[0.01] transition-colors"
      >
        {/* Left Title */}
        <div className="flex items-center gap-2 min-w-0">
          <span
            style={{ backgroundColor: lot.color }}
            className="w-2 h-2 rounded-full flex-shrink-0"
          />
          <h3 className="font-bold text-[13px] text-[#1E293B] truncate">
            LOT {lot.id} — {lot.name}
          </h3>
        </div>

        {/* Right Sources & Toggle */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-1">
            {lot.sources.map((source, idx) => (
              <span
                key={idx}
                style={{
                  backgroundColor: '#F1F5F9',
                  color: '#475569',
                }}
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tight"
              >
                {source}
              </span>
            ))}
          </div>

          <button
            type="button"
            className="text-[#475569] hover:text-[#1E293B] transition-colors p-0.5"
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Body */}
      {isExpanded && (
        <div className="p-3 sm:p-3.5 space-y-1 bg-white/50">
          {lot.items.map((item) => (
            <div key={item.id} className="w-full">
              <CalcRow
                item={item}
                editMode={editMode}
                editedValue={editedValues[item.id]}
                onEdit={(val) => onEditValue(item.id, val)}
                onBlur={() => onRecalculate?.(item.id)}
                isRecentlyChanged={recentlyChangedItemId === item.id}
              />

              {/* Hypothese Note */}
              {item.hypothese && (
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '7px',
                    padding: '7px 10px',
                    marginTop: '4px',
                  }}
                  className="flex items-start gap-1.5 mb-2"
                >
                  <Info size={12} className="text-[#D4960A] flex-shrink-0 mt-0.5" />
                  <span className="text-[11px] text-[#475569] leading-relaxed">
                    {item.hypothese}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
