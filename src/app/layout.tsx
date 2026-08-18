import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { TaskProvider } from '../context/TaskContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

export const metadata: Metadata = {
  title: 'Taskly — Collaborative Task Management Workspace',
  description: 'Pixel-perfect task management workspace with Kanban boards, grouped lists, subtasks tracking, and custom theme palettes.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-blue-500 selection:text-white">
        {googleClientId ? (
          <GoogleOAuthProvider clientId={googleClientId}>
            <ThemeProvider>
              <AuthProvider>
                <TaskProvider>
                  {children}
                </TaskProvider>
              </AuthProvider>
            </ThemeProvider>
          </GoogleOAuthProvider>
        ) : (
          <ThemeProvider>
            <AuthProvider>
              <TaskProvider>
                {children}
              </TaskProvider>
            </AuthProvider>
          </ThemeProvider>
        )}
      </body>
    </html>
  );
}
