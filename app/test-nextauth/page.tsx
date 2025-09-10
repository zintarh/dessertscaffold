"use client";

import { useState, useEffect } from 'react';

interface NextAuthTestResult {
  success: boolean;
  message: string;
  error?: string;
  environment?: {
    NODE_ENV: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    hasNextAuthUrl: boolean;
    hasNextAuthSecret: boolean;
    secretLength: number;
    isSecretValidLength: boolean;
    isUrlValid: boolean;
    authConfigTest: string;
  };
  recommendations?: Record<string, string>;
  timestamp?: string;
  details?: {
    message: string;
    name: string;
    stack: string;
    timestamp: string;
    environment: string;
  };
}

export default function TestNextAuthPage() {
  const [result, setResult] = useState<NextAuthTestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runTest = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/test-nextauth');
        const data = await response.json();
        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    runTest();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Testing NextAuth configuration...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 p-4">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">Test Error</h1>
          <p className="mb-4">An unexpected client-side error occurred:</p>
          <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md text-sm overflow-auto">
            {error}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h1 className={`text-3xl font-bold mb-6 ${result?.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {result?.success ? '🔐 NextAuth Configuration Test' : '❌ NextAuth Test Failed'}
          </h1>
          
          <p className="mb-6 text-lg">{result?.message}</p>

          {result?.environment && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Environment Variables</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">NODE_ENV</h3>
                    <p className="text-sm">{result.environment.NODE_ENV}</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">NEXTAUTH_URL</h3>
                    <p className="text-sm">{result.environment.NEXTAUTH_URL || 'Not set'}</p>
                    <span className={`text-xs ${result.environment.hasNextAuthUrl ? 'text-green-600' : 'text-red-600'}`}>
                      {result.environment.hasNextAuthUrl ? '✅ Set' : '❌ Missing'}
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">NEXTAUTH_SECRET</h3>
                    <p className="text-sm">{result.environment.NEXTAUTH_SECRET || 'Not set'}</p>
                    <span className={`text-xs ${result.environment.hasNextAuthSecret ? 'text-green-600' : 'text-red-600'}`}>
                      {result.environment.hasNextAuthSecret ? '✅ Set' : '❌ Missing'}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Length: {result.environment.secretLength} characters
                      {result.environment.isSecretValidLength ? ' ✅' : ' ⚠️ (should be ≥32)'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">URL Validation</h3>
                    <span className={`text-sm ${result.environment.isUrlValid ? 'text-green-600' : 'text-red-600'}`}>
                      {result.environment.isUrlValid ? '✅ Valid format' : '❌ Invalid format'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Auth Configuration Test</h2>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm">{result.environment.authConfigTest}</p>
                </div>
              </div>

              {result?.recommendations && Object.keys(result.recommendations).length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-yellow-600 dark:text-yellow-400">Recommendations</h2>
                  <div className="space-y-2">
                    {Object.entries(result.recommendations).map(([key, value]) => (
                      <div key={key} className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                        <p className="text-sm font-medium">{key}: {value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result?.timestamp && (
                <div className="text-sm text-gray-500">
                  Test completed at: {new Date(result.timestamp).toLocaleString()}
                </div>
              )}
            </div>
          )}

          {result?.details && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400">Error Details</h2>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg space-y-2">
                <p><strong>Error Message:</strong> {result.details.message}</p>
                <p><strong>Error Name:</strong> {result.details.name}</p>
                <p><strong>Environment:</strong> {result.details.environment}</p>
                <p><strong>Timestamp:</strong> {new Date(result.details.timestamp).toLocaleString()}</p>
                {result.details.stack && (
                  <div>
                    <strong>Stack Trace:</strong>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md text-xs overflow-auto max-h-40 mt-2">
                      {result.details.stack}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
