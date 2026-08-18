import React from 'react';
import { cn } from '../../lib/utils';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 'md',
  className,
  showBorder = true,
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5 text-[10px]',
    md: 'w-6 h-6 text-xs',
    lg: 'w-8 h-8 text-sm',
    xl: 'w-12 h-12 text-base',
  };

  const getInitials = (n: string) => {
    if (!n) return 'U';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.substring(0, 2).toUpperCase();
  };

  // Generate deterministic color based on name
  const getBgColor = (n: string) => {
    const colors = [
      'bg-indigo-500 text-white',
      'bg-emerald-500 text-white',
      'bg-amber-500 text-white',
      'bg-rose-500 text-white',
      'bg-purple-500 text-white',
      'bg-blue-500 text-white',
      'bg-cyan-500 text-white',
    ];
    let hash = 0;
    for (let i = 0; i < n.length; i++) hash += n.charCodeAt(i);
    return colors[hash % colors.length];
  };

  const avatarUrl = src || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || 'User')}`;

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden flex items-center justify-center shrink-0 font-medium',
        sizeClasses[size],
        showBorder && 'ring-2 ring-white dark:ring-zinc-900',
        getBgColor(name),
        className
      )}
      title={name}
    >
      <img
        src={avatarUrl}
        alt={name}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to text initials if image fails
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
      <span className="absolute">{getInitials(name)}</span>
    </div>
  );
};
