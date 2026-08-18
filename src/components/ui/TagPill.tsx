import React from 'react';
import { Tag } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TagPillProps {
  label: string;
  showIcon?: boolean;
  className?: string;
  onClick?: () => void;
}

export const TagPill: React.FC<TagPillProps> = ({
  label,
  showIcon = true,
  className,
  onClick,
}) => {
  return (
    <span
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60 transition-colors',
        onClick && 'cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700',
        className
      )}
    >
      {showIcon && <Tag className="w-3 h-3 text-zinc-400" />}
      <span>{label}</span>
    </span>
  );
};
