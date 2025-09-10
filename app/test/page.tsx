"use client";

import { useState, useEffect } from 'react';

interface TestResult {
  success: boolean;
  message: string;
  data?: {
    userCount: number;
    firstUser?: any;
    dbInfo: any;
    timestamp: string;
    environment: string;
    databaseUrl: string;
  };
  details?: {
    message: string;
    name: string;
    stack: string;
    timestamp: string;
    environment: string;
    databaseUrl: string;
  };
}

export default function TestPage() {
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runTest = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/test-db');
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Testing database connection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Test Failed</h1>
          <p className="text-gray-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            {result?.success ? (
              <div className="text-green-500 text-4xl mr-4">✅</div>
            ) : (
              <div className="text-red-500 text-4xl mr-4">❌</div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Database Connection Test
              </h1>
              <p className="text-gray-600">
                {result?.success ? 'Success!' : 'Failed'}
              </p>
            </div>
          </div>

          {result?.success ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-green-800 mb-2">
                  ✅ Connection Successful
                </h2>
                <p className="text-green-700">{result.message}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Database Stats</h3>
                  <p className="text-blue-700">
                    <strong>Users:</strong> {result.data?.userCount}
                  </p>
                  <p className="text-blue-700">
                    <strong>Environment:</strong> {result.data?.environment}
                  </p>
                  <p className="text-blue-700">
                    <strong>Database URL:</strong> {result.data?.databaseUrl}
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-800 mb-2">First User</h3>
                  {result.data?.firstUser ? (
                    <div className="text-purple-700">
                      <p><strong>Email:</strong> {result.data.firstUser.email}</p>
                      <p><strong>Name:</strong> {result.data.firstUser.name}</p>
                      <p><strong>Type:</strong> {result.data.firstUser.userType}</p>
                    </div>
                  ) : (
                    <p className="text-purple-700">No users found</p>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Database Info</h3>
                <pre className="text-sm text-gray-700 overflow-x-auto">
                  {JSON.stringify(result.data?.dbInfo, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-red-800 mb-2">
                  ❌ Connection Failed
                </h2>
                <p className="text-red-700">{result?.message}</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Error Details</h3>
                <div className="text-sm text-gray-700 space-y-2">
                  <p><strong>Message:</strong> {result?.details?.message}</p>
                  <p><strong>Name:</strong> {result?.details?.name}</p>
                  <p><strong>Environment:</strong> {result?.details?.environment}</p>
                  <p><strong>Database URL:</strong> {result?.details?.databaseUrl}</p>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Stack Trace</h3>
                <pre className="text-xs text-gray-700 overflow-x-auto">
                  {result?.details?.stack}
                </pre>
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Test completed at: {result?.data?.timestamp || result?.details?.timestamp}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
