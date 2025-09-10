import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // Test if we can create the NextAuth handler
    const handler = NextAuth(authOptions);
    
    return NextResponse.json({
      success: true,
      message: 'NextAuth handler created successfully',
      details: {
        hasHandler: !!handler,
        handlerType: typeof handler,
        authOptionsKeys: Object.keys(authOptions),
        environment: process.env.NODE_ENV
      }
    });

  } catch (error) {
    console.error('❌ NextAuth handler creation failed:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorName = error instanceof Error ? error.name : 'Unknown';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';

    return NextResponse.json({
      success: false,
      error: 'NextAuth handler creation failed',
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
