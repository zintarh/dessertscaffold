import { NextRequest, NextResponse } from "next/server";
import { sendGmail } from "../../../lib/gmail";

export async function POST(request: NextRequest) {
  try {
    const { to, subject, body } = await request.json();

    if (!to || !subject || !body) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, body" },
        { status: 400 }
      );
    }

    console.log('Testing Gmail API with:', { to, subject });
    
    const result = await sendGmail(to, subject, body);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Test email sent successfully",
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error,
          message: "Failed to send test email"
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Test Gmail API error:', error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Check if Gmail API is configured
  const requiredEnvVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET', 
    'GOOGLE_REFRESH_TOKEN'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    return NextResponse.json({
      configured: false,
      missing: missingVars,
      message: "Gmail API is not fully configured"
    });
  }

  return NextResponse.json({
    configured: true,
    message: "Gmail API appears to be configured. Use POST to test sending emails."
  });
}
