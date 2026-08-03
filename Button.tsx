import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  children,
  className = '',
  type = 'button',
  id,
  ...props
}) => {
  // Base classes: pill rounded-full, font-medium, Inter font
  const baseStyles = 'inline-flex items-center justify-center font-sans font-medium rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white cursor-pointer select-none';
  
  // Heights and paddings according to Part 6
  const sizeStyles = {
    sm: 'h-8 px-4 text-[13px]',
    md: 'h-10 px-6 text-[14px]',
    lg: 'h-11 px-7 text-[15px]',
  };

  // Variants according to Part 6 & animation rules
  const variantStyles = {
    primary: 'bg-[#4F46E5] hover:bg-[#4338CA] hover:shadow-lg hover:shadow-[#4F46E5]/20 hover:-translate-y-0.5 text-white border-none shadow-xs active:scale-[0.98]',
    secondary: 'bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] hover:-translate-y-0.5 active:scale-[0.98]',
    danger: 'bg-[#FEF0EC] text-[#DC2626] border border-[#DC2626]/20 hover:bg-[#FEE2E2] hover:-translate-y-0.5 active:scale-[0.98]',
    ghost: 'bg-transparent text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B] active:scale-[0.98]',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      id={id || `btn_${Math.random().toString(36).substr(2, 9)}`}
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        ${className}
      `}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin text-current" />}
      <span>{children}</span>
    </button>
  );
};
