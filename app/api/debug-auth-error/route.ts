import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Test what the NextAuth error endpoint returns
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const errorUrl = `${baseUrl}/api/auth/error`;
    
    console.log('🔍 Testing auth error endpoint:', errorUrl);
    
    const response = await fetch(errorUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NextAuth-Debug-Test'
      }
    });
    
    const contentType = response.headers.get('content-type');
    const status = response.status;
    const statusText = response.statusText;
    
    // Try to get the response as text first
    const responseText = await response.text();
    
    let parsedResponse;
    let isJson = false;
    
    try {
      parsedResponse = JSON.parse(responseText);
      isJson = true;
    } catch (e) {
      // Not JSON, keep as text
      parsedResponse = responseText;
    }
    
    return NextResponse.json({
      success: true,
      message: 'Auth error endpoint debug completed',
      details: {
        errorUrl,
        status,
        statusText,
        contentType,
        isJson,
        responseLength: responseText.length,
        responsePreview: responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''),
        fullResponse: parsedResponse
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Auth error debug failed:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorName = error instanceof Error ? error.name : 'Unknown';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';

    return NextResponse.json({
      success: false,
      error: 'Auth error debug failed',
      details: {
        message: errorMessage,
        name: errorName,
        stack: errorStack,
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}
