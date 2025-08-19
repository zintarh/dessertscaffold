import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const verifySchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = verifySchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 400 }
      );
    }

    const { token } = parsed.data;

    // Find user with this verification token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpires: {
          gt: new Date(), // Token must not be expired
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Update user to mark as verified and active
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isActive: true,
        emailVerified: new Date(),
        verificationToken: null,
        verificationTokenExpires: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Email verified successfully! You can now sign in.",
    });
  } catch (err) {
    console.error('Email verification error:', err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // Find user with this verification token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Update user to mark as verified and active
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isActive: true,
        emailVerified: new Date(),
        verificationToken: null,
        verificationTokenExpires: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Email verified successfully! You can now sign in.",
    });
  } catch (err) {
    console.error('Email verification error:', err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
