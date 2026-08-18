export const COLOR_MODE_PRESETS = [
  { id: 'amber', name: 'Amber', hex: '#F59E0B', bgClass: 'bg-amber-500' },
  { id: 'blue', name: 'Blue', hex: '#3B82F6', bgClass: 'bg-blue-500' },
  { id: 'pink', name: 'Pink', hex: '#EC4899', bgClass: 'bg-pink-500' },
  { id: 'rose', name: 'Rose', hex: '#F43F5E', bgClass: 'bg-rose-500' },
  { id: 'emerald', name: 'Emerald', hex: '#10B981', bgClass: 'bg-emerald-500' },
  { id: 'black', name: 'Black', hex: '#111827', bgClass: 'bg-zinc-900' },
];

export const STATUS_COLUMNS = ['To Do', 'Doing', 'Completed', 'On Hold'] as const;

export const ALL_STATUSES = ['Backlog', 'To Do', 'Doing', 'Completed', 'On Hold'] as const;

export const AVAILABLE_MEMBERS = [
  { id: 'Admin', name: 'Admin', role: 'Administrator', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin' },
  { id: 'Dexter', name: 'Dexter', role: 'Lead Developer', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dexter' },
  { id: 'Ankit Dutta', name: 'Ankit Dutta', role: 'Full Stack Engineer', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ankit' },
  { id: 'QA Team', name: 'QA Team', role: 'QA Engineer', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=QATeam' },
  { id: 'Designer', name: 'Designer', role: 'Product Designer', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Designer' },
  { id: 'Security', name: 'Security', role: 'SecOps', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Security' },
  { id: 'Dev Team', name: 'Dev Team', role: 'Engineering Team', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=DevTeam' },
  { id: 'CN', name: 'CN', role: 'Contributor', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=CN' },
] as const;

export const PRIORITY_OPTIONS = [
  { id: 'No Priority', label: 'No Priority', color: 'text-zinc-400' },
  { id: 'Urgent', label: 'Urgent', color: 'text-red-600' },
  { id: 'High', label: 'High', color: 'text-red-500' },
  { id: 'Medium', label: 'Medium', color: 'text-amber-500' },
  { id: 'Low', label: 'Low', color: 'text-zinc-400' },
] as const;

export const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  'Backlog': { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
  'To Do': { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
  'Doing': { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', dot: 'bg-purple-500' },
  'Completed': { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
  'On Hold': { bg: 'bg-zinc-500/10', text: 'text-zinc-600 dark:text-zinc-400', dot: 'bg-zinc-400' },
};
