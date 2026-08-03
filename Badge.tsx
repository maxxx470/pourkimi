import React from 'react';

interface BadgeProps {
  variant: 'done' | 'processing' | 'missing' | 'draft' | 'error';
  children: React.ReactNode;
  id?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant, children, id }) => {
  const baseStyles = 'inline-flex items-center justify-center text-[11px] font-medium px-3.5 py-1 rounded-full uppercase tracking-wider select-none';

  const variantStyles = {
    done: 'bg-[#EDFAF3] text-[#0A7A47]',
    processing: 'bg-[#EEF2FF] text-[#4F46E5]',
    missing: 'bg-[#FEF0EC] text-[#B83218]',
    draft: 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]',
    error: 'bg-[#FEF0EC] text-[#DC2626] border border-[#DC2626]/15',
  };

  return (
    <span
      id={id || `badge_${Math.random().toString(36).substr(2, 9)}`}
      className={`${baseStyles} ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
};
export default Badge;
