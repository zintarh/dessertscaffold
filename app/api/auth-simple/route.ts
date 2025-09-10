import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({
    success: true,
    message: 'Simple auth route works',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: Request) {
  return NextResponse.json({
    success: true,
    message: 'Simple auth POST route works',
    timestamp: new Date().toISOString()
  });
}
