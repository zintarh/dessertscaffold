import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const userSelect = {
  id: true, email: true, firstName: true, lastName: true, name: true,
  userType: true, institutionName: true, researchArea: true, academicLevel: true,
  bio: true, expertise: true, image: true, isActive: true, emailVerified: true,
  createdAt: true, updatedAt: true,
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: userSelect
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({
      success: true,
      user: { ...user, expertise: user.expertise ? JSON.parse(user.expertise) : [] },
      session: { expires: session.expires }
    });
  } catch (error) {
    console.error('Get session error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
