import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { slug: string[] } }) {
  return NextResponse.json({
    success: true,
    message: 'Dynamic route works',
    slug: params.slug,
    timestamp: new Date().toISOString()
  });
}
