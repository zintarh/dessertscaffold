import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Test NextAuth environment variables
    const nextAuthUrl = process.env.NEXTAUTH_URL;
    const nextAuthSecret = process.env.NEXTAUTH_SECRET;
    const nodeEnv = process.env.NODE_ENV;
    
    // Check if required environment variables are set
    const hasNextAuthUrl = !!nextAuthUrl;
    const hasNextAuthSecret = !!nextAuthSecret;
    const secretLength = nextAuthSecret ? nextAuthSecret.length : 0;
    
    // Validate secret length (should be at least 32 characters)
    const isSecretValidLength = secretLength >= 32;
    
    // Check if URL is properly formatted
    const isUrlValid = nextAuthUrl ? nextAuthUrl.startsWith('http') : false;
    
    // Test if we can create a basic NextAuth configuration
    let authConfigTest = 'Not tested';
    try {
      // Just test if we can import and create basic auth options
      const { authOptions } = await import('@/lib/auth');
      authConfigTest = 'Success - Auth options loaded';
    } catch (error) {
      authConfigTest = `Failed - ${error instanceof Error ? error.message : 'Unknown error'}`;
    }

    return NextResponse.json({
      success: true,
      message: 'NextAuth configuration test completed',
      environment: {
        NODE_ENV: nodeEnv,
        NEXTAUTH_URL: nextAuthUrl,
        NEXTAUTH_SECRET: nextAuthSecret ? `${nextAuthSecret.substring(0, 8)}...` : 'Not set',
        hasNextAuthUrl,
        hasNextAuthSecret,
        secretLength,
        isSecretValidLength,
        isUrlValid,
        authConfigTest
      },
      recommendations: {
        ...(hasNextAuthUrl ? {} : { NEXTAUTH_URL: '❌ NEXTAUTH_URL is not set' }),
        ...(hasNextAuthSecret ? {} : { NEXTAUTH_SECRET: '❌ NEXTAUTH_SECRET is not set' }),
        ...(isSecretValidLength ? {} : { NEXTAUTH_SECRET: '⚠️ NEXTAUTH_SECRET should be at least 32 characters' }),
        ...(isUrlValid ? {} : { NEXTAUTH_URL: '⚠️ NEXTAUTH_URL should start with http:// or https://' })
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ NextAuth test failed:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorName = error instanceof Error ? error.name : 'Unknown';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';

    return NextResponse.json({
      success: false,
      error: 'NextAuth configuration test failed',
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
