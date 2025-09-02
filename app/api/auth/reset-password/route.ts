import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8).max(100),
  confirmPassword: z.string().min(1),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = resetPasswordSchema.parse(await req.json());

    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpires: { gt: new Date() },
      },
      select: { id: true }
    });

    if (!user) return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: await bcrypt.hash(newPassword, 12),
        verificationToken: null,
        verificationTokenExpires: null,
        updatedAt: new Date(),
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully! You can now sign in with your new password.',
    });
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
