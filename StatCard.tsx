import React from 'react';

export interface StatCardProps {
  label: string;
  value: string | number;
  subtext: string;
  background: string;
  iconColor: string;
  iconBg: string;
  labelColor: string;
  valueColor: string;
  subtextColor: string;
  icon: React.ReactNode;
  graphic: 'ring' | 'bars' | 'curve';
  graphicColor: string;
  graphicValue?: number; // 0-100 pour l'anneau
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  background,
  iconColor,
  iconBg,
  labelColor,
  valueColor,
  subtextColor,
  icon,
  graphic,
  graphicColor,
  graphicValue = 0,
}) => {
  // Render the mini graphics inside StatCard
  const renderGraphic = () => {
    if (graphic === 'ring') {
      const radius = 18;
      const circumference = 2 * Math.PI * radius; // ~113.1
      const strokeDashoffset = circumference - (graphicValue / 100) * circumference;

      return (
        <svg width="48" height="48" viewBox="0 0 48 48" className="flex-shrink-0">
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke={graphicColor}
            strokeWidth="4.5"
            fill="none"
            className="opacity-15"
          />
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke={graphicColor}
            strokeWidth="4.5"
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 24 24)"
            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          />
        </svg>
      );
    }

    if (graphic === 'bars') {
      const heights = [10, 16, 12, 22, 14, 20, 28];
      const barWidth = 4;
      const gap = 3;
      const startX = 2;

      return (
        <svg width="48" height="32" viewBox="0 0 48 32" className="flex-shrink-0">
          {heights.map((h, i) => {
            const isLast = i === heights.length - 1;
            const x = startX + i * (barWidth + gap);
            const y = 32 - h;
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={barWidth}
                height={h}
                fill={graphicColor}
                rx="1.5"
                className={isLast ? 'opacity-100' : 'opacity-30'}
              />
            );
          })}
        </svg>
      );
    }

    if (graphic === 'curve') {
      const points = '2,26 12,22 22,14 32,18 42,8 52,12 62,4';
      return (
        <svg width="64" height="32" viewBox="0 0 64 32" className="flex-shrink-0 overflow-visible">
          <polyline
            fill="none"
            stroke={graphicColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            className="opacity-80"
          />
          <circle
            cx="62"
            cy="4"
            r="3.5"
            fill={graphicColor}
            stroke="#ffffff"
            strokeWidth="1.5"
          />
        </svg>
      );
    }

    return null;
  };

  return (
    <div
      style={{ backgroundColor: background || '#FFFFFF' }}
      className="p-5 sm:p-6 rounded-[20px] border border-[#E2E8F0] flex flex-col justify-between min-h-[120px] relative overflow-hidden shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all duration-200"
    >
      {/* Top row */}
      <div className="flex items-center justify-between w-full gap-1">
        {/* Icon container */}
        <div
          style={{ backgroundColor: iconBg }}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        >
          <span style={{ color: iconColor }}>
            {icon}
          </span>
        </div>
        {/* Label */}
        <span
          style={{ color: labelColor }}
          className="font-sans font-bold text-[9.5px] sm:text-[11px] uppercase tracking-wider text-right truncate"
        >
          {label}
        </span>
      </div>

      {/* Bottom row */}
      <div className="flex items-end justify-between w-full mt-1.5 gap-1">
        <div className="flex flex-col min-w-0">
          <span
            style={{ color: valueColor }}
            className="font-sans font-black text-[20px] sm:text-[24px] md:text-[28px] leading-tight tracking-tight truncate"
          >
            {value}
          </span>
          <span
            style={{ color: subtextColor }}
            className="font-sans text-[10px] sm:text-[11px] leading-normal font-medium opacity-85 truncate"
          >
            {subtext}
          </span>
        </div>

        {/* Graphic */}
        <div className="flex items-center justify-center h-10 sm:h-12 flex-shrink-0">
          {renderGraphic()}
        </div>
      </div>
    </div>
  );
};
