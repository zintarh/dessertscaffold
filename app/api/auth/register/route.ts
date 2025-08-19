import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { sendVerificationEmail, generateVerificationToken, isValidEduNgEmail } from "@/lib/email";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  userType: z.string().optional(),
  institutionName: z.string().optional(),
  researchArea: z.string().optional(),
  academicLevel: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password, firstName, lastName, userType, institutionName, researchArea, academicLevel } = parsed.data;

    // Validate edu.ng email for institution and academic mentor users
    if ((userType === 'institution' || userType === 'mentor') && !isValidEduNgEmail(email)) {
      return NextResponse.json(
        { error: "Institution and Academic Mentor accounts require an edu.ng email address" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);
    const verificationToken = generateVerificationToken();
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        firstName: firstName ?? null,
        lastName: lastName ?? null,
        userType: userType ?? null,
        institutionName: institutionName ?? null,
        researchArea: researchArea ?? null,
        academicLevel: academicLevel ?? null,
        isActive: false,
        verificationToken,
        verificationTokenExpires,
      },
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken, firstName);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail registration if email fails, but log it
    }

    return NextResponse.json({ 
      success: true, 
      message: "Registration successful! Please check your email to verify your account.",
      requiresVerification: true 
    });
  } catch (err) {
    console.error('Registration error:', err);
    console.error('Error stack:', err instanceof Error ? err.stack : 'No stack trace');
    console.error('Error details:', {
      message: err instanceof Error ? err.message : String(err),
      name: err instanceof Error ? err.name : 'Unknown',
      cause: err instanceof Error ? err.cause : undefined
    });
    
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: process.env.NODE_ENV === 'development' ? {
          message: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined
        } : undefined 
      },
      { status: 500 }
    );
  }
}
