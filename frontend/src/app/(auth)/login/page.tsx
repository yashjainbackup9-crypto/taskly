'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGoogleLogin } from '@react-oauth/google';
import { Triangle, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
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
    onError: () => {
      setError('Google authorization was cancelled or failed.');
    },
  });

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (isRegister && !name) {
      setError('Please enter your full name');
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
      setError(err.message || 'Authentication failed. Please check your credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--background)] relative">
      {/* Brand Icon Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shadow-xs">
          <Triangle className="w-4 h-4 text-white dark:text-zinc-900 fill-current" />
        </div>
        <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Taskly</span>
      </div>

      {/* Main Login Card matching Figma screenshot 01_login_guest_screen.png */}
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-150">
        <div className="space-y-1.5">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Let's get back on track
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Enter your email below to login to your account.
          </p>
        </div>

        {error && (
          <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 text-xs text-red-600 dark:text-red-400 text-left">
            {error}
          </div>
        )}

        {/* Primary Auth Actions */}
        <div className="space-y-3">
          {/* Continue as Guest Button (Primary Black Button) */}
          <button
            onClick={handleGuestLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-white shadow-xs transition-all active:scale-98 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>Continue as Guest</span>
          </button>

          {/* Login with Google Button (Outlined White Button) */}
          <button
            onClick={() => handleGoogleLogin()}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200 text-xs font-semibold shadow-2xs transition-all active:scale-98 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.98 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Login with Google</span>
          </button>
        </div>

        {/* Email/Password Toggle (Bonus Feature) */}
        <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800">
          {!isEmailMode ? (
            <button
              onClick={() => setIsEmailMode(true)}
              className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Or sign in with email & password ➔
            </button>
          ) : (
            <form onSubmit={handleEmailAuth} className="space-y-3 pt-2 text-left">
              {isRegister && (
                <div>
                  <label className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">Full Name</label>
                  <div className="flex items-center gap-2 mt-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Dexter"
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

        {/* Footer Terms */}
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-relaxed">
          By clicking continue, you agree to our{' '}
          <a href="#" className="underline hover:text-zinc-700 dark:hover:text-zinc-300">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="underline hover:text-zinc-700 dark:hover:text-zinc-300">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
