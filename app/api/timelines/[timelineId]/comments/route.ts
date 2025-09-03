import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';

// Schema for creating a comment
const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required').max(1000, 'Comment is too long'),
  sectionId: z.string().optional(),
});

// GET /api/timelines/[timelineId]/comments - Fetch comments for a timeline
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ timelineId: string }> }
) {
  try {
    const { timelineId } = await params;

    // Get comments with author information
    const comments = await (prisma as any).comment.findMany({
      where: {
        timelineId: timelineId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            userType: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST /api/timelines/[timelineId]/comments - Create a new comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ timelineId: string }> }
) {
  try {
    const { timelineId } = await params;
    const body = await request.json();
    const { content, sectionId } = createCommentSchema.parse(body);

    // Get the timeline to check access
    const timeline = await prisma.timeline.findUnique({
      where: { id: timelineId },
      include: {
        writingSpaceAccess: {
          include: {
            mentor: true,
          },
        },
      },
    });

    if (!timeline) {
      return NextResponse.json(
        { error: 'Timeline not found' },
        { status: 404 }
      );
    }

    // Get the authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Check if user has access to this timeline
    const hasAccess = 
      timeline.userId === userId || // Timeline owner
      timeline.writingSpaceAccess.some(access => access.mentorId === userId); // Mentor with access

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Create the comment
    const comment = await (prisma as any).comment.create({
      data: {
        content,
        timelineId,
        sectionId: sectionId || null,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            userType: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
