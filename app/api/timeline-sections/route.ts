import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timelineId = searchParams.get('timelineId');

    console.log('GET API called for timelineId:', timelineId);

    if (!timelineId) {
      return NextResponse.json(
        { error: 'Timeline ID is required' },
        { status: 400 }
      );
    }

    // Fetch all sections for the timeline with their content
    const sections = await prisma.section.findMany({
      where: { timelineId },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        content: true,
        duration: true,
        order: true,
        isCompleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log('Fetched sections from DB:', sections.length, 'sections');
    sections.forEach(section => {
      console.log(`Section ${section.id}: ${section.title}, content length: ${section.content?.length || 0}`);
    });

    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error fetching sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sections' },
      { status: 500 }
    );
  }
}
