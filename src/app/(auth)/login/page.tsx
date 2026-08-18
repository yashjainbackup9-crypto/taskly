'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGoogleLogin } from '@react-oauth/google';
import { Triangle, Mail, Lock, User, ArrowRight, Loader2, X, Shield, FileText, Heart } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export default function LoginPage() {
  const { loginAsGuest, loginWithGoogle, loginWithEmail, registerWithEmail, user } = useAuth();
  const router = useRouter();

  const [isEmailMode, setIsEmailMode] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | null>(null);

  // If already logged in, push to tasks
  React.useEffect(() => {
    if (user) {
      router.replace('/tasks');
    }
  }, [user, router]);

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await loginAsGuest();
    } catch (err: any) {
      setError(err.message || 'Failed to login as guest');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async tokenResponse => {
      setIsLoading(true);
      setError('');
      try {
        // Fetch profile info using Google access token
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const googleUser = await userInfoRes.json();

        await loginWithGoogle({
          email: googleUser.email,
          name: googleUser.name || 'Google User',
          avatar: googleUser.picture,
          googleId: googleUser.sub,
        });
      } catch (err: any) {
        setError(err.message || 'Google login failed');
        setIsLoading(false);
      }
    },
    onError: errorResponse => {
      console.error('Google OAuth error:', errorResponse);
      setError('Google sign in was cancelled or failed.');
    },
  });

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (isRegister && !name) {
      setError('Please provide your name');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      if (isRegister) {
        await registerWithEmail(name, email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 selection:bg-blue-500 selection:text-white">
      {/* Centered App Brand */}
      <div className="flex items-center gap-2 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="w-10 h-10 rounded-2xl bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 shadow-md">
          <Triangle className="w-5 h-5 fill-current rotate-180" />
        </div>
        <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Taskly</span>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[420px] bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-8 shadow-xl shadow-zinc-900/5 space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Let's get back on track
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
            Enter your email below to login to your account.
          </p>
        </div>

        {error && (
          <div className="p-3 text-xs bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 rounded-xl text-left">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {/* 1-Click Guest Login Button */}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleGuestLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>Continue as Guest</span>
          </button>

          {/* Google OAuth Login */}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleGoogleLogin()}
            className="w-full py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 text-zinc-800 dark:text-zinc-200 text-xs font-semibold shadow-2xs transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Login with Google</span>
          </button>
        </div>

        {/* Email Password Toggle */}
        <div className="pt-1">
          {!isEmailMode ? (
            <button
              type="button"
              onClick={() => setIsEmailMode(true)}
              className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center justify-center gap-1 mx-auto transition-colors font-medium"
            >
              <span>Or sign in with email & password</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-3 pt-2 text-left animate-in fade-in duration-200">
              {isRegister && (
                <div>
                  <label className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">Full Name</label>
                  <div className="flex items-center gap-2 mt-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Dexter Morgan"
                      className="w-full text-xs bg-transparent focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">Email Address</label>
                <div className="flex items-center gap-2 mt-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="dexter@example.com"
                    className="w-full text-xs bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">Password</label>
                <div className="flex items-center gap-2 mt-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                  <Lock className="w-3.5 h-3.5 text-zinc-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-[11px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                >
                  {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Terms & Policy Links */}
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-relaxed pt-2">
          By clicking continue, you agree to our{' '}
          <button
            type="button"
            onClick={() => setLegalModal('terms')}
            className="underline hover:text-zinc-700 dark:hover:text-zinc-300 font-medium transition-colors"
          >
            Terms of Service
          </button>{' '}
          and{' '}
          <button
            type="button"
            onClick={() => setLegalModal('privacy')}
            className="underline hover:text-zinc-700 dark:hover:text-zinc-300 font-medium transition-colors"
          >
            Privacy Policy
          </button>
        </p>
      </div>

      {/* Made By TheWebVale Credit Badge */}
      <div className="mt-6 flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 animate-in fade-in duration-500">
        <span>Made with</span>
        <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
        <span>by</span>
        <a
          href="https://thewebvale.com"
          target="_blank"
          rel="noreferrer"
          className="font-bold text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
        >
          TheWebVale
        </a>
      </div>

      {/* Terms of Service & Privacy Policy Modal */}
      {legalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setLegalModal(null)}
        >
          <div
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl max-w-lg w-full p-6 text-left space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                {legalModal === 'terms' ? (
                  <FileText className="w-5 h-5 text-blue-500" />
                ) : (
                  <Shield className="w-5 h-5 text-emerald-500" />
                )}
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {legalModal === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {legalModal === 'terms' ? (
              <div className="text-xs text-zinc-600 dark:text-zinc-300 space-y-3 leading-relaxed">
                <p>
                  <b>1. Acceptance of Terms:</b> By accessing and using Taskly, you acknowledge that you agree to be bound by these Terms of Service.
                </p>
                <p>
                  <b>2. Workspace Data & Usage:</b> You retain full ownership of all task data, checklists, and project files uploaded to your account.
                </p>
                <p>
                  <b>3. Security & Fair Use:</b> You agree not to misuse Taskly APIs, attempt unauthorized access, or disrupt collaborative sprint services.
                </p>
                <p>
                  <b>4. Modifications:</b> We reserve the right to refine features, enhance security protocols, and update these terms as the platform evolves.
                </p>
              </div>
            ) : (
              <div className="text-xs text-zinc-600 dark:text-zinc-300 space-y-3 leading-relaxed">
                <p>
                  <b>1. Data Privacy:</b> We respect your privacy. Your email, workspace activity, and attachments are encrypted and never shared with third parties.
                </p>
                <p>
                  <b>2. Information Collected:</b> We collect only necessary authentication information (email, name, profile avatar) to manage your workspace access.
                </p>
                <p>
                  <b>3. Cookies & Local Storage:</b> Taskly utilizes local storage exclusively to remember your theme preferences and active login sessions.
                </p>
                <p>
                  <b>4. Data Erasure:</b> You can request complete deletion of your workspace tasks and account at any time via Settings.
                </p>
              </div>
            )}

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
