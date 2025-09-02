import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { z } from "zod";
import { sendGmail } from "../../../lib/gmail";

// Validation schema for mentor invitation
const inviteMentorSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  mentorCode: z.string().min(1, "Mentor code is required"),
});

// POST - Invite a mentor to a project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only students can invite mentors
    if (session.user.userType !== "STUDENT") {
      return NextResponse.json(
        { error: "Only students can invite mentors" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = inviteMentorSchema.parse(body);

    // Find the invite code and verify it's valid
    const inviteCode = await (prisma as any).inviteCode.findUnique({
      where: { code: validatedData.mentorCode },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
            userType: true,
          },
        },
      },
    });

    if (!inviteCode) {
      return NextResponse.json(
        { error: "Invalid mentor code" },
        { status: 400 }
      );
    }

    if (inviteCode.isUsed) {
      return NextResponse.json(
        { error: "This mentor code has already been used" },
        { status: 400 }
      );
    }

    if (inviteCode.expiresAt && inviteCode.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "This mentor code has expired" },
        { status: 400 }
      );
    }

    // Verify the mentor is actually a mentor
    if (inviteCode.mentor.userType !== "MENTOR") {
      return NextResponse.json(
        { error: "Invalid mentor code" },
        { status: 400 }
      );
    }

    // Get project details
    const project = await (prisma as any).timeline.findUnique({
      where: { id: validatedData.projectId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Verify the student owns this project
    if (project.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only invite mentors to your own projects" },
        { status: 403 }
      );
    }

    // Check if mentor already has accepted access to this project
    const existingAccess = await (prisma as any).writingSpaceAccess.findUnique({
      where: {
        timelineId_mentorId: {
          timelineId: validatedData.projectId,
          mentorId: inviteCode.mentor.id,
        },
      },
    });

    if (existingAccess) {
      return NextResponse.json(
        { error: "Mentor already has access to this writing space" },
        { status: 400 }
      );
    }

    // Create the individual invite record (allows multiple invites)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
    
    const invite = await (prisma as any).invite.create({
      data: {
        inviteCodeId: inviteCode.id,
        projectId: validatedData.projectId,
        mentorId: inviteCode.mentor.id,
        studentId: session.user.id,
        status: "pending",
        emailSent: false,
        expiresAt: expiresAt,
      },
      include: {
        project: true,
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
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
    });

    // DO NOT mark invite code as used - allow multiple invites

    // Send email notification to mentor
    try {
      const acceptUrl = `${process.env.NEXTAUTH_URL}/api/mentor-invite/respond?action=accept&projectId=${validatedData.projectId}&mentorId=${inviteCode.mentor.id}&inviteId=${invite.id}`;
      const declineUrl = `${process.env.NEXTAUTH_URL}/api/mentor-invite/respond?action=decline&projectId=${validatedData.projectId}&mentorId=${inviteCode.mentor.id}&inviteId=${invite.id}`;

      const emailSubject = `Mentor Invitation: ${project.title} - DissertScaffold`;
      const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4F46E5; margin: 0;">DissertScaffold</h1>
            <p style="color: #6B7280; margin: 5px 0;">Academic Writing Companion</p>
          </div>
          
          <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #1F2937; margin-top: 0;">Mentor Invitation</h2>
            <p>Hello ${inviteCode.mentor.name},</p>
            <p>You have been invited by <strong>${project.user?.name || 'A student'}</strong> to mentor their research project.</p>
            <p style="color: #DC2626; font-weight: 500;">⏰ This invitation expires on ${expiresAt.toLocaleDateString()} at ${expiresAt.toLocaleTimeString()}</p>
          </div>

          <div style="background: white; border: 1px solid #E5E7EB; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #1F2937; margin-top: 0;">Project Details</h3>
            <p><strong>Project Title:</strong> ${project.title}</p>
            <p><strong>Document Type:</strong> ${project.documentType}</p>
            ${project.researchTopic ? `<p><strong>Research Topic:</strong> ${project.researchTopic}</p>` : ''}
            ${project.academicLevel ? `<p><strong>Academic Level:</strong> ${project.academicLevel}</p>` : ''}
            ${project.discipline ? `<p><strong>Discipline:</strong> ${project.discipline}</p>` : ''}
            ${project.startDate ? `<p><strong>Start Date:</strong> ${new Date(project.startDate).toLocaleDateString()}</p>` : ''}
            ${project.completionDate ? `<p><strong>Completion Date:</strong> ${new Date(project.completionDate).toLocaleDateString()}</p>` : ''}
          </div>

          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #1F2937; margin-top: 0;">Research Overview</h3>
            <p style="color: #4B5563; line-height: 1.6;">
              ${project.researchTopic || 'The student is working on a research project and would like your guidance and mentorship.'}
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #374151; margin-bottom: 20px;">Please respond to this invitation:</p>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
              <a href="${acceptUrl}" 
                 style="background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
                Accept Invitation
              </a>
              <a href="${declineUrl}" 
                 style="background: #EF4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
                Decline Invitation
              </a>
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
      
      // Mark email as sent
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
      success: true,
      message: "Mentor invited successfully",
      data: invite,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error inviting mentor:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - Get mentor invitations for a project
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

    // Verify the user has access to this project
    const project = await (prisma as any).timeline.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Only the project owner can view invitations
    if (project.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Get all mentor invitations for this project
    const invitations = await (prisma as any).mentorProject.findMany({
      where: { projectId },
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
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: invitations,
    });
  } catch (error) {
    console.error("Error fetching mentor invitations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}