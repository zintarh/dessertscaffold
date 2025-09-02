'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthSync } from '../../lib/hooks/useAuthSync';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { session, status } = useAuthSync(); // This automatically syncs user state
  const router = useRouter();
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);

  // Protected routes that require authentication
  const protectedRoutes = [
    '/user',
    '/research-evaluation',
    '/writing',
    '/writing-environment',
    '/evaluation',
    '/result'
  ];

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);


  useEffect(() => {
    // Only check routes after hydration and when auth status is determined
    if (!isHydrated || status === 'loading') {
      return;
    }

    // Check if current path is protected
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname?.startsWith(route)
    );

    if (isProtectedRoute && !session) {
      console.log('❌ Access denied: Redirecting to signin');
      // Redirect to signin if trying to access protected route without auth
      router.push('/signin');
    } else if (isProtectedRoute && session) {
      console.log('✅ Access granted: User is authenticated');
    }
  }, [session, status, pathname, router, isHydrated]);






  
  // Show loading state only while hydrating or when auth status is loading
  if (!isHydrated || status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }


  

  return <>{children}</>;
}
