import React from 'react';

interface SkeletonBlockProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export const SkeletonBlock: React.FC<SkeletonBlockProps> = ({
  width = '100%',
  height = '16px',
  borderRadius = '8px',
  className = '',
}) => {
  return (
    <div
      className={`animate-shimmer ${className}`}
      style={{
        width,
        height,
        borderRadius,
      }}
    />
  );
};

export const SkeletonCard: React.FC<{ id?: string }> = ({ id }) => {
  return (
    <div
      id={id || `skel_card_${Math.random().toString(36).substr(2, 9)}`}
      className="bg-surface border border-border rounded-[10px] p-[10px] md:p-[12px] flex flex-col gap-2.5 w-full"
    >
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <SkeletonBlock width="8px" height="8px" borderRadius="999px" />
          <SkeletonBlock width="120px" height="13px" borderRadius="4px" />
        </div>
        <SkeletonBlock width="60px" height="16px" borderRadius="99px" />
      </div>
      <div className="flex gap-4 items-center justify-between w-full">
        <div className="flex flex-col gap-1.5 w-2/3">
          <SkeletonBlock width="80%" height="10px" borderRadius="4px" />
          <SkeletonBlock width="50%" height="10px" borderRadius="4px" />
        </div>
        <SkeletonBlock width="40px" height="12px" borderRadius="4px" />
      </div>
    </div>
  );
};

export const SkeletonRow: React.FC<{ id?: string }> = ({ id }) => {
  return (
    <div
      id={id || `skel_row_${Math.random().toString(36).substr(2, 9)}`}
      className="flex items-center justify-between py-2 border-b border-border w-full gap-4"
    >
      <div className="flex flex-col gap-1.5 w-1/3">
        <SkeletonBlock width="70%" height="12px" />
        <SkeletonBlock width="40%" height="9px" />
      </div>
      <div className="w-1/6">
        <SkeletonBlock width="50px" height="11px" />
      </div>
      <div className="w-1/6">
        <SkeletonBlock width="40px" height="11px" />
      </div>
      <div className="w-1/6 flex justify-end">
        <SkeletonBlock width="60px" height="18px" borderRadius="99px" />
      </div>
    </div>
  );
};
