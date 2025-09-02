import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { generatePasswordResetToken } from '@/lib/auth-utils';
import { sendPasswordResetEmail } from '@/lib/email';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(req: NextRequest) {
  try {
    const { email } = forgotPasswordSchema.parse(await req.json());

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, firstName: true, isActive: true }
    });

    if (!user?.isActive) {
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    }

    const resetToken = generatePasswordResetToken();
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken: resetToken, verificationTokenExpires: resetTokenExpires }
    });

    try {
      await sendPasswordResetEmail(user.email, resetToken, user.firstName || user.email);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      return NextResponse.json({ error: 'Failed to send password reset email' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
