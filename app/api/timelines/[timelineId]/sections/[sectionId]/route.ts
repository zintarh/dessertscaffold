import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Validation schema for section update
const updateSectionSchema = z.object({
  isCompleted: z.boolean(),
});

// PATCH - Update section completion status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ timelineId: string; sectionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { timelineId, sectionId } = await params;
    const body = await request.json();
    
    // Validate request body
    const validatedData = updateSectionSchema.parse(body);

    // Verify the timeline exists and belongs to the user
    const timeline = await prisma.timeline.findFirst({
      where: {
        id: timelineId,
        userId: session.user.id,
      },
    });

    if (!timeline) {
      return NextResponse.json(
        { success: false, error: "Timeline not found or access denied" },
        { status: 404 }
      );
    }

    // Verify the section exists and belongs to the timeline
    const section = await prisma.section.findFirst({
      where: {
        id: sectionId,
        timelineId: timelineId,
      },
    });

    if (!section) {
      return NextResponse.json(
        { success: false, error: "Section not found" },
        { status: 404 }
      );
    }

    // Update the section's completion status
    const updatedSection = await prisma.section.update({
      where: {
        id: sectionId,
      },
      data: {
        isCompleted: validatedData.isCompleted,
      },
    });

    // Get updated progress stats
    const allSections = await prisma.section.findMany({
      where: {
        timelineId: timelineId,
      },
    });

    const completedSections = allSections.filter(s => s.isCompleted).length;
    const totalSections = allSections.length;
    const progressPercentage = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;

    return NextResponse.json({
      success: true,
      data: {
        section: updatedSection,
        progress: {
          completedSections,
          totalSections,
          progressPercentage,
        },
      },
    });
  } catch (error) {
    console.error("Error updating section:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - Get section details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ timelineId: string; sectionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { timelineId, sectionId } = await params;

    // Verify the timeline exists and belongs to the user
    const timeline = await prisma.timeline.findFirst({
      where: {
        id: timelineId,
        userId: session.user.id,
      },
    });

    if (!timeline) {
      return NextResponse.json(
        { success: false, error: "Timeline not found or access denied" },
        { status: 404 }
      );
    }

    // Get the section
    const section = await prisma.section.findFirst({
      where: {
        id: sectionId,
        timelineId: timelineId,
      },
    });

    if (!section) {
      return NextResponse.json(
        { success: false, error: "Section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: section,
    });
  } catch (error) {
    console.error("Error fetching section:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
