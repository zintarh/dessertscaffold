import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only mentors can access this endpoint
    if (session.user.userType !== "MENTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch accepted invites for this mentor
    const acceptedInvites = await (prisma as any).invite.findMany({
      where: {
        mentorId: session.user.id,
        status: "accepted",
      },
      include: {
        project: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        respondedAt: "desc",
      },
    });

    // Transform the data to match the component's interface
    const projects = acceptedInvites.map((invite: any) => ({
      id: invite.project.id,
      title: invite.project.title || "Untitled Project",
      documentType: invite.project.documentType,
      student: {
        name: invite.project.user.name || "Unknown Student",
        email: invite.project.user.email,
      },
      acceptedAt: invite.respondedAt,
      status: invite.status,
    }));

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching accepted projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch accepted projects" },
      { status: 500 }
    );
  }
}