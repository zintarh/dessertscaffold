import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Enhanced registration schema with all user fields
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password too long"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name too long"),
  userType: z.enum(["STUDENT", "MENTOR", "INSTITUTION"]).default("STUDENT"),
  institutionName: z.string().optional(),
  researchArea: z.string().optional(),
  academicLevel: z
    .enum(["UNDERGRADUATE", "MASTERS", "PHD", "POSTDOC"])
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "User with this email already exists",
        },
        { status: 409 }
      );
    }
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(
      validatedData.password,
      saltRounds
    );

    const userData: any = {
      email: validatedData.email,
      password: hashedPassword,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      name: `${validatedData.firstName} ${validatedData.lastName}`,
      userType: validatedData.userType,
      institutionName: validatedData.institutionName,
      researchArea: validatedData.researchArea,
      academicLevel: validatedData.academicLevel,
      isActive: true, 
    };

    const user = await (prisma as any).user.create({
      data: userData,
    });


    return NextResponse.json(
      {
        success: true,
        message: "Registration successful! You can now sign in.",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        debug:
          process.env.NODE_ENV === "development"
            ? (error as any)?.message
            : undefined,
      },
      { status: 500 }
    );
  }
}
