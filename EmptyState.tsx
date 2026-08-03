import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  id?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  id,
}) => {
  return (
    <div
      id={id || `empty_${Math.random().toString(36).substr(2, 9)}`}
      className="flex flex-col items-center justify-center text-center py-10 px-6 bg-white border border-border rounded-[14px] w-full"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-surface border border-border text-primary mb-4">
        <Icon className="w-[18px] h-[18px]" />
      </div>
      <h3 className="font-sans font-bold text-[16px] text-text mb-1 tracking-tight">
        {title}
      </h3>
      <p className="font-sans text-[13px] text-muted max-w-[320px] mb-5 leading-normal">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
export default EmptyState;
