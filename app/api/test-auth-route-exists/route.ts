import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(request: Request) {
  try {
    // Check if the NextAuth route file exists
    const nextAuthRoutePath = join(process.cwd(), 'app/api/auth/[...nextauth]/route.ts');
    
    let fileExists = false;
    let fileContent = '';
    let error = '';
    
    try {
      fileContent = readFileSync(nextAuthRoutePath, 'utf8');
      fileExists = true;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unknown error';
    }
    
    return NextResponse.json({
      success: true,
      message: 'NextAuth route file check completed',
      details: {
        filePath: nextAuthRoutePath,
        fileExists,
        fileSize: fileExists ? fileContent.length : 0,
        filePreview: fileExists ? fileContent.substring(0, 200) + '...' : '',
        error: error || null,
        workingDirectory: process.cwd(),
        environment: process.env.NODE_ENV
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Route file check failed:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorName = error instanceof Error ? error.name : 'Unknown';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';

    return NextResponse.json({
      success: false,
      error: 'Route file check failed',
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
