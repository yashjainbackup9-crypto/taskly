import React from 'react';
import { TaskPriority } from '../../types/task';
import { cn } from '../../lib/utils';

interface PrioritySignalProps {
  priority: TaskPriority | string;
  showLabel?: boolean;
  className?: string;
}

export const PrioritySignal: React.FC<PrioritySignalProps> = ({
  priority,
  showLabel = true,
  className,
}) => {
  const getPriorityConfig = () => {
    switch (priority) {
      case 'Urgent':
        return {
          label: 'Urgent',
          color: 'text-red-600 dark:text-red-400',
          barColor: 'bg-red-600 dark:bg-red-400',
          bars: 4,
        };
      case 'High':
        return {
          label: 'High',
          color: 'text-red-500 dark:text-red-400',
          barColor: 'bg-red-500 dark:bg-red-400',
          bars: 3,
        };
      case 'Medium':
        return {
          label: 'Medium',
          color: 'text-amber-500 dark:text-amber-400',
          barColor: 'bg-amber-500 dark:bg-amber-400',
          bars: 2,
        };
      case 'Low':
        return {
          label: 'Low',
          color: 'text-zinc-400 dark:text-zinc-500',
          barColor: 'bg-zinc-400 dark:bg-zinc-500',
          bars: 1,
        };
      default:
        return {
          label: 'No Priority',
          color: 'text-zinc-400 dark:text-zinc-600',
          barColor: 'bg-zinc-300 dark:bg-zinc-700',
          bars: 0,
        };
    }
  };

  const config = getPriorityConfig();

  return (
    <div className={cn('inline-flex items-center gap-1.5 text-xs font-medium', config.color, className)}>
      <div className="flex items-end gap-[2px] h-3 w-3.5">
        <span
          className={cn(
            'w-[2.5px] rounded-full transition-all',
            config.bars >= 1 ? config.barColor : 'bg-zinc-200 dark:bg-zinc-800',
            'h-1.5'
          )}
        />
        <span
          className={cn(
            'w-[2.5px] rounded-full transition-all',
            config.bars >= 2 ? config.barColor : 'bg-zinc-200 dark:bg-zinc-800',
            'h-2.5'
          )}
        />
        <span
          className={cn(
            'w-[2.5px] rounded-full transition-all',
            config.bars >= 3 ? config.barColor : 'bg-zinc-200 dark:bg-zinc-800',
            'h-3.5'
          )}
        />
      </div>
      {showLabel && <span>{config.label}</span>}
    </div>
  );
};
