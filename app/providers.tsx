'use client';

import { SessionProvider } from 'next-auth/react';
import { Provider as JotaiProvider } from 'jotai';
import React from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <SessionProvider>{children}</SessionProvider>
    </JotaiProvider>
  );
}
