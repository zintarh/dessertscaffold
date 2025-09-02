import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const discipline = searchParams.get('discipline');
    const academicLevel = searchParams.get('academicLevel');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    // Filter parameters are handled in the query logic below

    // First get all mentor users
    const mentorUsers = await prisma.user.findMany({
      where: {
        userType: "MENTOR",
        ...(discipline && discipline !== 'all' ? { researchArea: discipline } : {}),
        ...(academicLevel && academicLevel !== 'all' ? { academicLevel: academicLevel } : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Then get their mentor profiles
    const mentorsWithProfiles = await Promise.all(
      mentorUsers.map(async (mentor) => {
        const mentorProfile = await prisma.mentorProfile.findUnique({
          where: { userId: mentor.id },
        });

        // Include all mentors, even those without complete profiles
        // Apply price filter only if mentor has a profile with hourly rate
        if (mentorProfile && mentorProfile.hourlyRate) {
          if (minPrice && mentorProfile.hourlyRate < parseFloat(minPrice)) return null;
          if (maxPrice && mentorProfile.hourlyRate > parseFloat(maxPrice)) return null;
        }

        return {
          id: mentor.id,
          name: `${mentor.firstName || ''} ${mentor.lastName || ''}`.trim() || mentor.email,
          email: mentor.email,
          userType: mentor.userType,
          institutionName: mentor.institutionName,
          researchArea: mentor.researchArea,
          academicLevel: mentor.academicLevel,
          image: mentor.image,
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
        };
      })
    );

    // Filter out null values and return
    const transformedMentors = mentorsWithProfiles.filter(mentor => mentor !== null);

    return NextResponse.json({ mentors: transformedMentors });

  } catch (error) {
    console.error("Error fetching mentors:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
