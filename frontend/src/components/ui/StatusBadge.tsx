import React from 'react';
import { cn } from '../../lib/utils';
import { STATUS_COLORS } from '../../lib/constants';

interface StatusBadgeProps {
  status: string;
  className?: string;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  showDot = true,
}) => {
  const config = STATUS_COLORS[status] || {
    bg: 'bg-zinc-100 dark:bg-zinc-800',
    text: 'text-zinc-700 dark:text-zinc-300',
    dot: 'bg-zinc-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.bg,
        config.text,
        className
      )}
    >
      {showDot && <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />}
      <span>{status}</span>
    </span>
  );
};
