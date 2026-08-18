'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, User, Sun, Palette, Edit2, Loader2, Check } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { Avatar } from '../../../components/ui/Avatar';
import { COLOR_MODE_PRESETS } from '../../../lib/constants';
import { ColorMode } from '../../../types/user';
import { cn } from '../../../lib/utils';

export default function SettingsPage() {
  const { user, updateUserProfile, logout } = useAuth();
  const { theme, setTheme, colorMode, setColorMode } = useTheme();

  const [activeTab, setActiveTab] = useState<'profile' | 'theme' | 'color'>('profile');
  const [fullName, setFullName] = useState(user?.name || 'Dexter');
  const [email, setEmail] = useState(user?.email || 'dexter@gmail.com');
  const [title, setTitle] = useState(user?.title || 'Designer');
  const [username, setUsername] = useState(user?.username || 'Dexuser');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUserProfile({
        name: fullName,
        email,
        title,
        username,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to save profile', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[var(--background)]">
      {/* Settings Left Navigation Sidebar matching Figma screenshot 13 */}
      <div className="w-full lg:w-60 border-r border-zinc-200/80 dark:border-zinc-800 p-4 space-y-4 bg-zinc-50/50 dark:bg-zinc-900/40 shrink-0">
        <Link
          href="/tasks"
          className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to app</span>
        </Link>

        {/* Search inside settings */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs focus:outline-none"
          />
        </div>

        {/* Navigation items */}
        <div className="space-y-1 pt-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors',
              activeTab === 'profile'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs border border-zinc-200/60 dark:border-zinc-700/60'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/40'
            )}
          >
            <User className="w-4 h-4 text-zinc-500" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors',
              activeTab === 'theme'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs border border-zinc-200/60 dark:border-zinc-700/60'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/40'
            )}
          >
            <Sun className="w-4 h-4 text-zinc-500" />
            <span>Theme</span>
          </button>

          <button
            onClick={() => setActiveTab('color')}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors',
              activeTab === 'color'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs border border-zinc-200/60 dark:border-zinc-700/60'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/40'
            )}
          >
            <Palette className="w-4 h-4 text-zinc-500" />
            <span>Color</span>
          </button>
        </div>
      </div>

      {/* Main Settings Content Area */}
      <div className="flex-1 p-6 lg:p-12 max-w-4xl space-y-8 overflow-y-auto">
        {activeTab === 'profile' && (
          <div className="space-y-8">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Profile
            </h1>

            {/* Profile Form Card matching Figma */}
            <form
              onSubmit={handleSaveProfile}
              className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-8 shadow-xs space-y-6"
            >
              {/* Profile Picture */}
              <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800/80">
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Profile picture
                </span>
                <Avatar name={fullName} size="xl" className="shadow-xs" />
              </div>

              {/* Email */}
              <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800/80">
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Email</span>
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-900 dark:text-zinc-100">
                  <span>{email}</span>
                  <Edit2 className="w-3.5 h-3.5 text-zinc-400 cursor-pointer hover:text-zinc-600" />
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Full name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Title */}
              <div className="space-y-1">
                <div className="flex items-baseline justify-between">
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Title</label>
                  <span className="text-[11px] text-zinc-400">Your job title or role</span>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Username */}
              <div className="space-y-1">
                <div className="flex items-baseline justify-between">
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Username</label>
                  <span className="text-[11px] text-zinc-400">One word, like a nickname or first name</span>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Save Button */}
              <div className="pt-2 flex items-center justify-end gap-3">
                {savedSuccess && (
                  <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                    <Check className="w-3.5 h-3.5" /> Saved!
                  </span>
                )}
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>

            {/* Workspace Access Section matching Figma screenshot 13 */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Workspace access
              </h2>
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 flex items-center justify-between shadow-xs">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Remove yourself from the workspace
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors border border-red-200/60 dark:border-red-800/40"
                >
                  Leave Workspace
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Theme Settings Tab */}
        {activeTab === 'theme' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Theme Preferences
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setTheme('light')}
                className={cn(
                  'p-6 rounded-3xl border-2 cursor-pointer transition-all bg-white text-zinc-900 shadow-xs flex flex-col justify-between h-36',
                  theme === 'light' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-zinc-200 dark:border-zinc-800'
                )}
              >
                <div className="flex items-center justify-between">
                  <Sun className="w-6 h-6 text-amber-500" />
                  {theme === 'light' && <Check className="w-5 h-5 text-blue-500" />}
                </div>
                <div>
                  <h3 className="font-bold text-sm">Light Theme</h3>
                  <p className="text-xs text-zinc-500">Clean, high-contrast light mode</p>
                </div>
              </div>

              <div
                onClick={() => setTheme('dark')}
                className={cn(
                  'p-6 rounded-3xl border-2 cursor-pointer transition-all bg-zinc-950 text-zinc-100 shadow-xs flex flex-col justify-between h-36',
                  theme === 'dark' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-zinc-200 dark:border-zinc-800'
                )}
              >
                <div className="flex items-center justify-between">
                  <Sun className="w-6 h-6 text-blue-400" />
                  {theme === 'dark' && <Check className="w-5 h-5 text-blue-400" />}
                </div>
                <div>
                  <h3 className="font-bold text-sm">Dark Theme</h3>
                  <p className="text-xs text-zinc-400">Obsidian dark mode for low-light focus</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Color Mode Palette Tab */}
        {activeTab === 'color' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Color Mode Palettes
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {COLOR_MODE_PRESETS.map(preset => (
                <div
                  key={preset.id}
                  onClick={() => setColorMode(preset.id as ColorMode)}
                  className={cn(
                    'p-5 rounded-2xl border-2 cursor-pointer transition-all bg-white dark:bg-zinc-900 flex items-center justify-between',
                    colorMode === preset.id
                      ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-5 h-5 rounded-md shadow-2xs"
                      style={{ backgroundColor: preset.hex }}
                    />
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {preset.name}
                    </span>
                  </div>
                  {colorMode === preset.id && <Check className="w-4 h-4 text-blue-500" />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
