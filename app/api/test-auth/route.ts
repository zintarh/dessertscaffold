import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // Test if authOptions can be created without errors
    const testAuth = {
      ...authOptions,
      providers: authOptions.providers?.slice(0, 1) // Just test the first provider
    };
    
    return NextResponse.json({
      success: true,
      message: 'Auth configuration loaded successfully',
      details: {
        hasProviders: !!authOptions.providers?.length,
        providerCount: authOptions.providers?.length || 0,
        sessionStrategy: authOptions.session?.strategy,
        hasAdapter: !!authOptions.adapter,
        environment: process.env.NODE_ENV
      }
    });

  } catch (error) {
    console.error('❌ Auth configuration test failed:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorName = error instanceof Error ? error.name : 'Unknown';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';

    return NextResponse.json({
      success: false,
      error: 'Auth configuration failed',
      details: {
        message: errorMessage,
        name: errorName,
        stack: errorStack,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      }
    }, { status: 500 });
  }
}
