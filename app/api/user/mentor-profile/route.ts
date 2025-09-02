import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { z } from "zod";

// Schema for mentor profile updates
const mentorProfileSchema = z.object({
  bio: z.string().min(10, "Bio must be at least 10 characters").max(1000, "Bio too long"),
  expertise: z.array(z.string()).min(1, "At least one expertise area is required"),
  hourlyRate: z.number().min(0, "Hourly rate must be positive"),
  availability: z.enum(["Available", "Limited", "Not Available"]),
  responseTime: z.string().min(1, "Response time is required"),
  languages: z.array(z.string()).min(1, "At least one language is required"),
  timezone: z.string().min(1, "Timezone is required"),
  education: z.array(z.string()),
  publications: z.array(z.string()),
  specializations: z.array(z.string()).min(1, "At least one specialization is required"),
  socialLinks: z.object({
    linkedin: z.string().url().optional().or(z.literal("")),
    twitter: z.string().url().optional().or(z.literal("")),
    github: z.string().url().optional().or(z.literal("")),
    website: z.string().url().optional().or(z.literal("")),
  }),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user and check if they're a mentor
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.userType !== "MENTOR") {
      return NextResponse.json({ error: "Only mentors can access this endpoint" }, { status: 403 });
    }

    // Get existing mentor profile from MentorProfile table
    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: user.id },
    });

    // Return existing mentor profile or empty structure
    if (mentorProfile) {
      return NextResponse.json({
        mentorProfile: {
          ...mentorProfile,
          expertise: mentorProfile.expertise ? JSON.parse(mentorProfile.expertise) : [],
          languages: mentorProfile.languages ? JSON.parse(mentorProfile.languages) : [],
          education: mentorProfile.education ? JSON.parse(mentorProfile.education) : [],
          publications: mentorProfile.publications ? JSON.parse(mentorProfile.publications) : [],
          specializations: mentorProfile.specializations ? JSON.parse(mentorProfile.specializations) : [],
          socialLinks: mentorProfile.socialLinks ? JSON.parse(mentorProfile.socialLinks) : {},
        }
      });
    }

    // Return empty profile structure for new mentors
    return NextResponse.json({
      mentorProfile: {
        bio: "",
        expertise: [],
        hourlyRate: 50,
        availability: "Available",
        responseTime: "24-48 hours",
        languages: ["English"],
        timezone: "UTC",
        education: [],
        publications: [],
        specializations: [],
        socialLinks: {
          linkedin: "",
          twitter: "",
          github: "",
          website: "",
        },
      }
    });

  } catch (error) {
    console.error("Error fetching mentor profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user and check if they're a mentor
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.userType !== "MENTOR") {
      return NextResponse.json({ error: "Only mentors can access this endpoint" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = mentorProfileSchema.parse(body);

    // Prepare data for database (convert arrays to JSON strings)
    const profileData = {
      bio: validatedData.bio,
      expertise: JSON.stringify(validatedData.expertise),
      hourlyRate: validatedData.hourlyRate,
      availability: validatedData.availability,
      responseTime: validatedData.responseTime,
      languages: JSON.stringify(validatedData.languages),
      timezone: validatedData.timezone,
      education: JSON.stringify(validatedData.education),
      publications: JSON.stringify(validatedData.publications),
      specializations: JSON.stringify(validatedData.specializations),
      socialLinks: JSON.stringify(validatedData.socialLinks),
    };

    let updatedProfile;

    // Check if mentor profile already exists
    const existingProfile = await prisma.mentorProfile.findUnique({
      where: { userId: user.id },
    });

    if (existingProfile) {
      // Update existing profile
      updatedProfile = await prisma.mentorProfile.update({
        where: { userId: user.id },
        data: profileData,
      });
    } else {
      // Create new profile
      updatedProfile = await prisma.mentorProfile.create({
        data: {
          ...profileData,
          userId: user.id,
        },
      });
    }

    // Return updated profile with parsed JSON fields
    return NextResponse.json({
      message: "Mentor profile updated successfully",
      mentorProfile: {
        ...updatedProfile,
        expertise: JSON.parse(updatedProfile.expertise || "[]"),
        languages: JSON.parse(updatedProfile.languages || "[]"),
        education: JSON.parse(updatedProfile.education || "[]"),
        publications: JSON.parse(updatedProfile.publications || "[]"),
        specializations: JSON.parse(updatedProfile.specializations || "[]"),
        socialLinks: JSON.parse(updatedProfile.socialLinks || "{}"),
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format validation errors for better user experience
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
      }));
      
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: formattedErrors,
          message: "Please check the following fields and try again:"
        },
        { status: 400 }
      );
    }

    console.error("Error updating mentor profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
