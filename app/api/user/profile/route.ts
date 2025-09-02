import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { z } from "zod";

// Force TypeScript server restart

const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: z.string().max(20).optional(),
  institutionName: z.string().max(100).optional(),
  researchArea: z.string().max(200).optional(),
  academicLevel: z
    .enum(["UNDERGRADUATE", "MASTERS", "PHD", "POSTDOC"])
    .optional(),
  bio: z.string().max(500).optional(),
  expertise: z.array(z.string()).max(10).optional(),
  
});

const userSelect = {
  id: true,
  email: true,
  userType: true,
  createdAt: true,
  updatedAt: true,
  institutionName: true,
  researchArea: true,
  academicLevel: true,
  firstName: true,
  lastName: true,
  name: true,
  image: true,
  isActive: true,
  emailVerified: true,
  phoneNumber: true,
} as const;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        userType: true,
        createdAt: true,
        updatedAt: true,
        institutionName: true,
        researchArea: true,
        academicLevel: true,
        firstName: true,
        lastName: true,
        name: true,
        image: true,
        isActive: true,
        emailVerified: true,
      },
    });

    // Fetch additional contact fields separately to avoid TypeScript issues
    // const contactFields = await prisma.user.findUnique({
    //   where: { email: session.user.email },
    //   select: {
    //     phoneNumber: true,
    //     linkedinUrl: true,
    //     twitterUrl: true,
    //     websiteUrl: true,
    //   },
    // });

    if (user) {
      return NextResponse.json({
        success: true,
        user: { ...user },
      });
    } else {
      // If user not found in database, return session data as fallback
      return NextResponse.json({
        success: true,
        user: {
          id: '',
          email: session.user.email || '',
          userType: '',
          institutionName: '',
          researchArea: '',
          academicLevel: '',
          firstName: '',
          lastName: '',
          name: session.user.name || '',
          image: session.user.image || '',
          isActive: true,
          emailVerified: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = updateProfileSchema.parse(body);

    // Get the user first
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, userType: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Separate user fields from mentor profile fields
    const { bio, expertise, phone, ...userFields } = validatedData;
    
    // Map phone to phoneNumber for database
    const userData = { ...userFields };
    // if (phone !== undefined) userData = phone;
    
    // Update user fields (excluding bio and expertise)
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: userData,
      select: userSelect,
    });

    // Handle mentor-specific fields (bio, expertise) if user is a mentor
    if ((bio !== undefined || expertise !== undefined) && user.userType === 'MENTOR') {
      const mentorData: Record<string, unknown> = {};
      
      if (bio !== undefined) mentorData.bio = bio;
      if (expertise !== undefined) mentorData.expertise = JSON.stringify(expertise);

      // Upsert mentor profile
      await prisma.mentorProfile.upsert({
        where: { userId: user.id },
        update: mentorData,
        create: {
          userId: user.id,
          ...mentorData,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: { ...updatedUser },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
