import { NextResponse } from 'next/server';

export async function GET(
  request: Request, 
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const resolvedParams = await params;
  return NextResponse.json({
    success: true,
    message: 'Dynamic route works',
    slug: resolvedParams.slug,
    timestamp: new Date().toISOString()
  });
}
