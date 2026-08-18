'use client';

import React, { useState } from 'react';
import { UserPlus, X, Mail, Check, Shield, User, Eye, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Member' | 'Admin' | 'Viewer'>('Member');
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        setEmail('');
        onClose();
      }, 1400);
    }, 600);
  };

  const roleDescriptions = {
    Admin: 'Full access to create, edit, delete tasks and manage workspace settings.',
    Member: 'Can create and edit assigned tasks, add comments, and log work.',
    Viewer: 'Read-only access to view boards, lists, and project progress.',
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Invite Team Member</h2>
              <p className="text-[11px] text-zinc-400">Add collaborators to your workspace</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {isSent ? (
            <div className="py-8 text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
                <Check className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">Invitation Dispatched!</p>
                <p className="text-zinc-500 text-xs max-w-xs mx-auto">
                  An email invite has been delivered to <span className="font-semibold text-zinc-800 dark:text-zinc-200">{email}</span> with {role} permissions.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center rounded-xl border border-zinc-200/90 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-800/40 shadow-2xs focus-within:bg-white dark:focus-within:bg-zinc-900 focus-within:border-blue-500 dark:focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                  <Mail className="w-4 h-4 text-zinc-400 ml-3.5 shrink-0 pointer-events-none" />
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="w-full pl-2.5 pr-3.5 py-2.5 text-xs bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Role & Permissions Segmented Control */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Role & Permissions
                </label>

                {/* Apple / Linear Style Segmented Pill */}
                <div className="p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200/60 dark:border-zinc-700/60 flex items-center gap-1 shadow-2xs">
                  {(['Member', 'Admin', 'Viewer'] as const).map(r => {
                    const isSelected = role === r;
                    return (
                      <button
                        type="button"
                        key={r}
                        onClick={() => setRole(r)}
                        className={cn(
                          'flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-150 text-center flex items-center justify-center gap-1.5',
                          isSelected
                            ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs ring-1 ring-black/5 dark:ring-white/10'
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-750'
                        )}
                      >
                        {r === 'Admin' && <Shield className="w-3 h-3 text-amber-500" />}
                        {r === 'Member' && <User className="w-3 h-3 text-blue-500" />}
                        {r === 'Viewer' && <Eye className="w-3 h-3 text-zinc-400" />}
                        <span>{r}</span>
                      </button>
                    );
                  })}
                </div>

                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 px-1 pt-0.5 leading-relaxed">
                  {roleDescriptions[role]}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!email.trim() || isSubmitting}
                  className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold shadow-xs active:scale-98 transition-all disabled:opacity-40 flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Invitation</span>
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
