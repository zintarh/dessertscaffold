import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

// GET - Get writing space access for a project
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Verify the user owns this project or has access to it
    const project = await (prisma as any).timeline.findFirst({
      where: {
        id: projectId,
        OR: [
          { userId: session.user.id }, // Owner
          {
            writingSpaceAccess: {
              some: {
                mentorId: session.user.id,
                accessType: "COMMENT",
              },
            },
          }, // Mentor with access
        ],
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    // Get all writing space access for this project
    const accessList = await (prisma as any).writingSpaceAccess.findMany({
      where: { timelineId: projectId },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            researchArea: true,
            institutionName: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { grantedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: accessList,
    });
  } catch (error) {
    console.error("Error fetching writing space access:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
