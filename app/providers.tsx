'use client';

import { Provider as JotaiProvider } from 'jotai';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import AuthProvider from './components/dashboard/AuthProvider';
import { ThemeProvider } from './contexts/ThemeContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <JotaiProvider>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </JotaiProvider>
    </SessionProvider>
  );
}
