import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: mentorId } = await params;

    // Get the mentor user
    const mentorUser = await prisma.user.findUnique({
      where: {
        id: mentorId,
        userType: "MENTOR",
      },
    });

    if (!mentorUser) {
      return NextResponse.json(
        { error: "Mentor not found" },
        { status: 404 }
      );
    }

    // Get the mentor profile
    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: mentorId },
    });

    // Combine user and profile data
    const mentorData = {
      id: mentorUser.id,
      name: `${mentorUser.firstName || ''} ${mentorUser.lastName || ''}`.trim() || mentorUser.email,
      email: mentorUser.email,
      userType: mentorUser.userType,
      institutionName: mentorUser.institutionName,
      researchArea: mentorUser.researchArea,
      academicLevel: mentorUser.academicLevel,
      image: mentorUser.image,
      // MentorProfile data with fallbacks
      expertise: mentorProfile?.expertise ? JSON.parse(mentorProfile.expertise) : [],
      hourlyRate: mentorProfile?.hourlyRate || 0,
      rating: mentorProfile?.rating || 0,
      reviewCount: mentorProfile?.reviewCount || 0,
      bio: mentorProfile?.bio || "",
      availability: mentorProfile?.availability || "Available",
      responseTime: mentorProfile?.responseTime || "24-48 hours",
      completedProjects: mentorProfile?.completedProjects || 0,
      specializations: mentorProfile?.specializations ? JSON.parse(mentorProfile.specializations) : [],
      languages: mentorProfile?.languages ? JSON.parse(mentorProfile.languages) : [],
      timezone: mentorProfile?.timezone || "UTC",
      education: mentorProfile?.education ? JSON.parse(mentorProfile.education) : [],
      publications: mentorProfile?.publications ? JSON.parse(mentorProfile.publications) : [],
      socialLinks: mentorProfile?.socialLinks ? JSON.parse(mentorProfile.socialLinks) : {},
      isVerified: mentorProfile?.isVerified || false,
      // Add a flag to indicate if profile is complete
      hasCompleteProfile: !!(mentorProfile && 
        mentorProfile.bio && 
        mentorProfile.expertise && 
        mentorProfile.hourlyRate && 
        mentorProfile.specializations),
      createdAt: mentorUser.createdAt.toISOString(),
      updatedAt: mentorUser.updatedAt.toISOString(),
    };

    return NextResponse.json({ mentor: mentorData });

  } catch (error) {
    console.error("Error fetching mentor:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}