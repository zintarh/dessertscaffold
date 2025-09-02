import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';

// Schema for creating a timeline - now accepting all fields
const createTimelineSchema = z.object({
  documentType: z.enum(['RESEARCH_TIMELINE', 'DISSERTATION']),
  title: z.string().optional(),
  researchTopic: z.string().optional(),
  startDate: z.string().optional(),
  completionDate: z.string().optional(),
  academicLevel: z.string().optional(),
  discipline: z.string().optional(),
  sections: z.array(z.object({
    title: z.string(),
    duration: z.number().optional(),
    order: z.number().optional(),
  })).optional(),
});

// POST /api/timelines - Create a new timeline
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Timeline creation API called');
    
    const session = await getServerSession(authOptions);
    console.log('🔐 Session:', session ? 'Found' : 'Not found');
    
    if (!session?.user?.email) {
      console.log('❌ Unauthorized - no session or user email');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('👤 User ID:', session.user.id);
    console.log('📧 User email:', session.user.email);

    const body = await request.json();
    console.log('📦 Request body received:', body);
    
    const validatedData = createTimelineSchema.parse(body);

    
 
    // Create timeline with all the data
    const timeline = await (prisma as any).timeline.create({
      data: {
        documentType: validatedData.documentType,
        title: validatedData.title || "Untitled Timeline",
        researchTopic: validatedData.researchTopic,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
        completionDate: validatedData.completionDate ? new Date(validatedData.completionDate) : null,
        academicLevel: validatedData.academicLevel,
        discipline: validatedData.discipline,
        userId: session.user.id,
        sections: validatedData.sections ? {
          create: validatedData.sections.map(section => ({
            title: section.title,
            duration: section.duration || 1,
            order: section.order || 1,
          })),
        } : undefined,
      },
      include: {
        sections: true,
      },
    });

    console.log('✅ Timeline created successfully:', timeline);

    return NextResponse.json({
      success: true,
      message: 'Timeline created successfully',
      timeline: {
        id: timeline.id,
        documentType: timeline.documentType,
        title: timeline.title,
        researchTopic: timeline.researchTopic,
        startDate: timeline.startDate?.toISOString(),
        completionDate: timeline.completionDate?.toISOString(),
        academicLevel: timeline.academicLevel,
        discipline: timeline.discipline,
        createdAt: timeline.createdAt.toISOString(),
        updatedAt: timeline.updatedAt.toISOString(),
        sections: timeline.sections?.map((section: any) => ({
          id: section.id,
          title: section.title,
          duration: section.duration,
          order: section.order,
        })),
      },
    }, { status: 201 });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation failed',
        details: error.errors.map(err => ({ field: err.path.join('.'), message: err.message }))
      }, { status: 400 });
    }
    console.error('Create timeline error:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/timelines - Get all timelines for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const timelines = await (prisma as any).timeline.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        sections: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data to include isCompleted field and ensure proper typing
    const transformedTimelines = timelines.map((timeline: any) => ({
      ...timeline,
      sections: timeline.sections.map((section: any) => ({
        ...section,
        isCompleted: section.isCompleted || false, // Ensure isCompleted is always present
      })),
    }));

    return NextResponse.json({
      success: true,
      timelines: transformedTimelines,
    });
  } catch (error) {
    console.error('Get timelines error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/timelines - Delete a timeline
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timelineId = searchParams.get('id');
    
    if (!timelineId) {
      return NextResponse.json({ error: 'Timeline ID is required' }, { status: 400 });
    }

    // Check if timeline exists and belongs to the user
    const existingTimeline = await (prisma as any).timeline.findFirst({
      where: {
        id: timelineId,
        userId: session.user.id,
      },
    });

    if (!existingTimeline) {
      return NextResponse.json({ error: 'Timeline not found or access denied' }, { status: 404 });
    }

    // Delete the timeline (sections will be cascaded due to the relation)
    await (prisma as any).timeline.delete({
      where: {
        id: timelineId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Timeline deleted successfully',
    });
  } catch (error) {
    console.error('Delete timeline error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
