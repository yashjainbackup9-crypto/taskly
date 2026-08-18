'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sun, Moon, Palette, Settings, LogOut, Check, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Avatar } from '../ui/Avatar';
import { COLOR_MODE_PRESETS } from '../../lib/constants';
import { ColorMode } from '../../types/user';

export const UserProfileMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme, colorMode, setColorMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<'theme' | 'color' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveSubmenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userName = user?.name || 'Dexter';
  const userEmail = user?.email || 'Dexter@gmail.com';

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors text-left group"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar name={userName} size="md" />
          <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">
            {userName}
          </span>
        </div>
        <div className="flex flex-col text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-colors">
          <span className="text-[9px] leading-[7px]">▲</span>
          <span className="text-[9px] leading-[7px]">▼</span>
        </div>
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/80 dark:border-zinc-800 py-3 z-50 animate-in fade-in zoom-in-95 duration-100">
          {/* User Info Header */}
          <div className="flex flex-col items-center text-center px-4 py-2 border-b border-zinc-100 dark:border-zinc-800/80 mb-2">
            <Avatar name={userName} size="xl" className="mb-2 shadow-sm" />
            <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{userName}</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[200px]">
              {userEmail}
            </p>
          </div>

          {/* Menu Items */}
          <div className="px-2 space-y-1">
            {/* Change Theme */}
            <div className="relative">
              <button
                onClick={() => setActiveSubmenu(activeSubmenu === 'theme' ? null : 'theme')}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Sun className="w-4 h-4 text-zinc-500" />
                  <span>Change Theme</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {/* Theme Submenu */}
              {activeSubmenu === 'theme' && (
                <div className="absolute left-full top-0 ml-1.5 w-36 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200/80 dark:border-zinc-800 py-1.5 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Theme
                  </div>
                  <button
                    onClick={() => {
                      setTheme('light');
                      setActiveSubmenu(null);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Sun className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Light</span>
                    </div>
                    {theme === 'light' && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />}
                  </button>
                  <button
                    onClick={() => {
                      setTheme('dark');
                      setActiveSubmenu(null);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Moon className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Dark</span>
                    </div>
                    {theme === 'dark' && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />}
                  </button>
                </div>
              )}
            </div>

            {/* Color Mode */}
            <div className="relative">
              <button
                onClick={() => setActiveSubmenu(activeSubmenu === 'color' ? null : 'color')}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-sm"
                    style={{
                      backgroundColor: COLOR_MODE_PRESETS.find(c => c.id === colorMode)?.hex || '#3B82F6',
                    }}
                  />
                  <span>Color Mode</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {/* Color Mode Submenu */}
              {activeSubmenu === 'color' && (
                <div className="absolute left-full top-0 ml-1.5 w-40 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200/80 dark:border-zinc-800 py-1.5 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Color Mode
                  </div>
                  {COLOR_MODE_PRESETS.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setColorMode(preset.id as ColorMode);
                        setActiveSubmenu(null);
                      }}
                      className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-sm"
                          style={{ backgroundColor: preset.hex }}
                        />
                        <span>{preset.name}</span>
                      </div>
                      {colorMode === preset.id && (
                        <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Settings */}
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/settings');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Settings className="w-4 h-4 text-zinc-500" />
              <span>Settings</span>
            </button>

            {/* Log Out */}
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
