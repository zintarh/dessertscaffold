import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(100),
  confirmPassword: z.string().min(1),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { currentPassword, newPassword } = changePasswordSchema.parse(await req.json());

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, password: true }
    });

    if (!user?.password) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { password: await bcrypt.hash(newPassword, 12), updatedAt: new Date() }
    });

    return NextResponse.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation failed',
        details: error.errors.map(err => ({ field: err.path.join('.'), message: err.message }))
      }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
