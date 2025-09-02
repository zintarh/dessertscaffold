import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';
import { sendGmail } from '../../../lib/gmail';

// Schema for generating invite codes
const generateInviteCodeSchema = z.object({
  expiresInDays: z.number().min(1).max(365).optional().default(30), // Default 30 days
});

// Schema for using invite codes
const useInviteCodeSchema = z.object({
  code: z.string().min(1, 'Invite code is required'),
  timelineId: z.string().min(1, 'Timeline ID is required'),
});

// Generate a unique invite code
function generateUniqueCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// GET - Fetch mentor's generated invite codes
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.userType !== 'MENTOR') {
      return NextResponse.json({ error: 'Unauthorized or not a mentor' }, { status: 401 });
    }

    const inviteCodes = await (prisma as any).inviteCode.findMany({
      where: {
        mentorId: session.user.id,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            institutionName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ inviteCodes });
  } catch (error) {
    console.error('Error fetching invite codes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Generate new invite code
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.userType !== 'MENTOR') {
      return NextResponse.json({ error: 'Unauthorized or not a mentor' }, { status: 401 });
    }

    const body = await request.json();
    const { expiresInDays } = generateInviteCodeSchema.parse(body);

    // Generate unique code
    let code: string;
    let isUnique = false;
    let attempts = 0;
    
    do {
      code = generateUniqueCode();
      const existingCode = await (prisma as any).inviteCode.findUnique({
        where: { code },
      });
      isUnique = !existingCode;
      attempts++;
    } while (!isUnique && attempts < 10);

    if (!isUnique) {
      return NextResponse.json({ error: 'Failed to generate unique code' }, { status: 500 });
    }

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const inviteCode = await (prisma as any).inviteCode.create({
      data: {
        code,
        mentorId: session.user.id,
        expiresAt,
      },
    });

    return NextResponse.json({ 
      message: 'Invite code generated successfully', 
      inviteCode 
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Error generating invite code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Use invite code (called by students)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.userType !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized or not a student' }, { status: 401 });
    }

    const body = await request.json();
    const { code, timelineId } = useInviteCodeSchema.parse(body);

    // Find the invite code
    const inviteCode = await (prisma as any).inviteCode.findUnique({
      where: { code },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
            institutionName: true,
            researchArea: true,
          },
        },
      },
    });

    if (!inviteCode) {
      return NextResponse.json({ error: 'Invalid invite code' }, { status: 404 });
    }

    // Remove the isUsed check - invite codes can now be used multiple times
    // The isUsed field is kept for backward compatibility but not enforced

    if (inviteCode.expiresAt && new Date() > inviteCode.expiresAt) {
      return NextResponse.json({ error: 'Invite code has expired' }, { status: 400 });
    }

    // Verify the timeline belongs to the student
    const timeline = await (prisma as any).timeline.findFirst({
      where: {
        id: timelineId,
        userId: session.user.id,
      },
    });

    if (!timeline) {
      return NextResponse.json({ error: 'Timeline not found or access denied' }, { status: 404 });
    }

    // Check if mentor already has active access to this timeline
    const existingAccess = await (prisma as any).writingSpaceAccess.findUnique({
      where: {
        timelineId_mentorId: {
          timelineId,
          mentorId: inviteCode.mentorId,
        },
      },
    });

    // Only prevent invites if mentor already has active access (not just pending invites)
    if (existingAccess) {
      return NextResponse.json({ error: 'Mentor already has access to this writing space' }, { status: 400 });
    }

    // Calculate expiration date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create invite record (no writing space access until mentor accepts)
    const invite = await (prisma as any).invite.create({
      data: {
        inviteCodeId: inviteCode.id,
        projectId: timelineId,
        mentorId: inviteCode.mentorId,
        studentId: session.user.id,
        status: 'pending',
        emailSent: false, // Will be updated after email is sent
        expiresAt,
      },
    });

    // Send email notification to mentor
    try {
      const acceptUrl = `${process.env.NEXTAUTH_URL}/api/mentor-invite/respond?action=accept&projectId=${timelineId}&mentorId=${inviteCode.mentor.id}&inviteId=${invite.id}`;
      const declineUrl = `${process.env.NEXTAUTH_URL}/api/mentor-invite/respond?action=decline&projectId=${timelineId}&mentorId=${inviteCode.mentor.id}&inviteId=${invite.id}`;

      const emailSubject = `Mentor Invitation: ${timeline.title || 'Research Project'} - DissertScaffold`;
      const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4F46E5; margin: 0;">DissertScaffold</h1>
            <p style="color: #6B7280; margin: 5px 0;">Academic Writing Companion</p>
          </div>
          
          <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #1F2937; margin-top: 0;">Mentor Invitation</h2>
            <p>Hello ${inviteCode.mentor.name},</p>
            <p>You have been invited by <strong>${session.user.name || 'A student'}</strong> to mentor their research project.</p>
          </div>

          <div style="background: white; border: 1px solid #E5E7EB; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #1F2937; margin-top: 0;">Project Details</h3>
            <p><strong>Project Title:</strong> ${timeline.title || 'Research Project'}</p>
            <p><strong>Document Type:</strong> ${timeline.documentType}</p>
            ${timeline.researchTopic ? `<p><strong>Research Topic:</strong> ${timeline.researchTopic}</p>` : ''}
            ${timeline.academicLevel ? `<p><strong>Academic Level:</strong> ${timeline.academicLevel}</p>` : ''}
            
            <div style="margin-top: 20px; text-align: center;">
              <a href="${acceptUrl}" 
                 style="background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block; margin-right: 10px;">
                Accept Invitation
              </a>
              <a href="${declineUrl}" 
                 style="background: #EF4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
                Decline Invitation
              </a>
            </div>
            
            <div style="margin-top: 15px; padding: 12px; background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 6px; text-align: center;">
              <p style="color: #92400E; font-size: 14px; margin: 0; font-weight: 500;">
                ⏰ This invitation expires in 7 days
              </p>
            </div>
          </div>

          <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; text-align: center;">
            <p style="color: #6B7280; font-size: 14px; margin: 0;">
              This invitation was sent from DissertScaffold.<br>
              If you didn't expect this invitation, please ignore this email.
            </p>
          </div>
        </div>
      `;

      await sendGmail(inviteCode.mentor.email, emailSubject, emailBody);
      
      // Update invite record to mark email as sent
      await (prisma as any).invite.update({
        where: { id: invite.id },
        data: {
          emailSent: true,
          emailSentAt: new Date(),
        },
      });
      
    } catch (emailError) {
      console.error('Failed to send mentor invitation email:', emailError);
      // Don't fail the invitation if email fails, but log it
    }

    return NextResponse.json({ 
      message: 'Mentor invited successfully', 
      mentor: inviteCode.mentor,
      invite: invite,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Error using invite code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete an invite code
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.userType !== 'MENTOR') {
      return NextResponse.json({ error: 'Unauthorized or not a mentor' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const codeId = searchParams.get('id');

    if (!codeId) {
      return NextResponse.json({ error: 'Invite code ID is required' }, { status: 400 });
    }

    // Check if the invite code exists and belongs to the current mentor
    const existingCode = await (prisma as any).inviteCode.findFirst({
      where: {
        id: codeId,
        mentorId: session.user.id,
      },
    });

    if (!existingCode) {
      return NextResponse.json({ error: 'Invite code not found or access denied' }, { status: 404 });
    }

    // Check if the code has been used
    if (existingCode.isUsed) {
      return NextResponse.json({ error: 'Cannot delete a used invite code' }, { status: 400 });
    }

    // Delete the invite code
    await (prisma as any).inviteCode.delete({
      where: {
        id: codeId,
      },
    });

    return NextResponse.json({ message: 'Invite code deleted successfully' });
  } catch (error) {
    console.error('Error deleting invite code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
