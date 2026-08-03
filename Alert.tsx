import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export interface AlertProps {
  variant: 'error' | 'warning' | 'info' | 'success';
  children: React.ReactNode;
  className?: string;
}

const variantConfig = {
  error: {
    accentColor: '#DC2626',
    iconBg: '#FEF2F2',
    iconColor: '#DC2626',
    Icon: AlertCircle,
  },
  warning: {
    accentColor: '#D97706',
    iconBg: '#FFFBEB',
    iconColor: '#D97706',
    Icon: AlertTriangle,
  },
  info: {
    accentColor: '#4F46E5',
    iconBg: '#EEF2FF',
    iconColor: '#4F46E5',
    Icon: Info,
  },
  success: {
    accentColor: '#16A34A',
    iconBg: '#F0FDF4',
    iconColor: '#16A34A',
    Icon: CheckCircle2,
  },
};

export const Alert: React.FC<AlertProps> = ({ variant, children, className = '' }) => {
  const config = variantConfig[variant] || variantConfig.error;
  const { Icon, accentColor, iconBg, iconColor } = config;

  return (
    <div
      className={`relative overflow-hidden bg-white border border-[#E2E8F0] rounded-xl px-3.5 py-3 flex items-start gap-2.5 shadow-xs ${className}`}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px]"
        style={{ backgroundColor: accentColor }}
      />
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={12} style={{ color: iconColor }} strokeWidth={2.5} />
      </div>
      <div className="text-[13px] font-medium text-[#1E293B] leading-snug flex-1">
        {children}
      </div>
    </div>
  );
};

export default Alert;
