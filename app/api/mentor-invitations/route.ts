import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

// GET - Get mentor invitations for the current mentor
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only mentors can view their invitations
    if (session.user.userType !== "MENTOR") {
      return NextResponse.json(
        { error: "Only mentors can view invitations" },
        { status: 403 }
      );
    }

    // Get all invitations for this mentor from the new Invite model
    const invitations = await (prisma as any).invite.findMany({
      where: { 
        mentorId: session.user.id,
        status: { in: ["pending", "accepted", "declined"] } // Exclude expired for now
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            documentType: true,
            researchTopic: true,
            academicLevel: true,
            discipline: true,
            startDate: true,
            completionDate: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            institutionName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform data to match expected format
    const transformedInvitations = invitations.map((invite: any) => ({
      id: invite.id,
      role: invite.status === "accepted" ? "active" : invite.status,
      invitedAt: invite.createdAt,
      respondedAt: invite.respondedAt,
      project: invite.project,
      student: invite.student,
    }));

    return NextResponse.json({
      success: true,
      data: transformedInvitations,
    });
  } catch (error) {
    console.error("Error fetching mentor invitations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
