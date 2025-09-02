'use client';

import { Provider as JotaiProvider } from 'jotai';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import AuthProvider from './components/AuthProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <JotaiProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </JotaiProvider>
    </SessionProvider>
  );
}
