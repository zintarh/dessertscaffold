import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { z } from "zod";
import { sendGmail } from "../../../../lib/gmail";
import { checkAndExpireInvite, createWritingSpaceAccess } from "../../../../lib/utils/invite-utils";

// Validation schema for mentor response
const respondToInvitationSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  action: z.enum(["accept", "decline"]),
  inviteId: z.string().optional(), // New field for invite ID
});

// POST - Mentor responds to invitation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only mentors can respond to invitations
    if (session.user.userType !== "MENTOR") {
      return NextResponse.json(
        { error: "Only mentors can respond to invitations" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = respondToInvitationSchema.parse(body);

    // Find the invite record
    let invite;
    if (validatedData.inviteId) {
      // Find by invite ID (new approach)
      invite = await (prisma as any).invite.findUnique({
        where: {
          id: validatedData.inviteId,
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
    } else {
      // Fallback: find by project and mentor (backward compatibility)
      invite = await (prisma as any).invite.findFirst({
        where: {
          projectId: validatedData.projectId,
          mentorId: session.user.id,
          status: 'pending',
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
    }

    if (!invite) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    if (invite.status !== "pending") {
      return NextResponse.json(
        { error: "This invitation has already been responded to" },
        { status: 400 }
      );
    }

    // Check if invite has expired
    if (invite.expiresAt && new Date() > invite.expiresAt) {
      // Mark as expired if not already
      if (invite.status === "pending") {
        await (prisma as any).invite.update({
          where: { id: invite.id },
          data: { status: "expired" },
        });
      }
      return NextResponse.json(
        { error: "This invitation has expired" },
        { status: 400 }
      );
    }

    // Update the invite status
    const updatedInvite = await (prisma as any).invite.update({
      where: { id: invite.id },
      data: {
        status: validatedData.action === "accept" ? "accepted" : "declined",
        respondedAt: new Date(),
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

    // If accepted, create writing space access for the mentor
    if (validatedData.action === "accept") {
      await createWritingSpaceAccess(
        validatedData.projectId,
        session.user.id,
        invite.studentId
      );
    }

    // Send email notification to student
    const actionText = validatedData.action === "accept" ? "accepted" : "declined";
    try {
      const emailSubject = `Mentor ${actionText} your invitation - DissertScaffold`;
      
      const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4F46E5; margin: 0;">DissertScaffold</h1>
            <p style="color: #6B7280; margin: 5px 0;">Academic Writing Companion</p>
          </div>
          
          <div style="background: ${validatedData.action === "accept" ? "#F0FDF4" : "#FEF2F2"}; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid ${validatedData.action === "accept" ? "#BBF7D0" : "#FECACA"};">
            <h2 style="color: ${validatedData.action === "accept" ? "#166534" : "#991B1B"}; margin-top: 0;">
              ${validatedData.action === "accept" ? "✅ Invitation Accepted" : "❌ Invitation Declined"}
            </h2>
            <p style="color: #374151;">
              <strong>${updatedInvite.mentor.name}</strong> has ${actionText} your invitation to mentor your project: <strong>${updatedInvite.project.title || 'Research Project'}</strong>
            </p>
          </div>

          <div style="background: white; border: 1px solid #E5E7EB; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #1F2937; margin-top: 0;">Project Details</h3>
            <p><strong>Project Title:</strong> ${updatedInvite.project.title || 'Research Project'}</p>
            <p><strong>Document Type:</strong> ${updatedInvite.project.documentType}</p>
            ${updatedInvite.project.researchTopic ? `<p><strong>Research Topic:</strong> ${updatedInvite.project.researchTopic}</p>` : ''}
          </div>

          ${validatedData.action === "accept" ? `
            <div style="background: #EFF6FF; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #BFDBFE;">
              <h3 style="color: #1E40AF; margin-top: 0;">Next Steps</h3>
              <p style="color: #1E40AF;">
                Your mentor now has access to your project and can provide guidance and feedback. 
                You can communicate with them through the platform's messaging system.
              </p>
            </div>
          ` : `
            <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #FDE68A;">
              <h3 style="color: #92400E; margin-top: 0;">What's Next?</h3>
              <p style="color: #92400E;">
                Don't worry! You can invite other mentors to your project or reach out to mentors directly through the community page.
              </p>
            </div>
          `}

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/user/timelines/${validatedData.projectId}" 
               style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
              View Project
            </a>
          </div>

          <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; text-align: center;">
            <p style="color: #6B7280; font-size: 14px; margin: 0;">
              This notification was sent from DissertScaffold.
            </p>
          </div>
        </div>
      `;

      await sendGmail(updatedInvite.student.email, emailSubject, emailBody);
    } catch (emailError) {
      console.error('Failed to send student notification email:', emailError);
      // Don't fail the response if email fails, but log it
    }

    return NextResponse.json({
      success: true,
      message: `Invitation ${actionText} successfully`,
      data: updatedInvite,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error responding to invitation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - Handle email link responses (for Accept/Decline buttons in emails)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const projectId = searchParams.get("projectId");
    const mentorId = searchParams.get("mentorId");
    const inviteId = searchParams.get("inviteId");

    if (!action || !projectId || !mentorId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    if (!["accept", "decline"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    // Find the invite record
    let invite;
    if (inviteId) {
      // Find by invite ID (new approach)
      invite = await (prisma as any).invite.findUnique({
        where: {
          id: inviteId,
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
    } else {
      // Fallback: find by project and mentor (backward compatibility)
      invite = await (prisma as any).invite.findFirst({
        where: {
          projectId,
          mentorId,
          status: 'pending',
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
    }

    if (!invite) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    // Check if invite has expired
    if (invite.expiresAt && new Date() > invite.expiresAt) {
      // Mark as expired if not already
      if (invite.status === "pending") {
        await (prisma as any).invite.update({
          where: { id: invite.id },
          data: { status: "expired" },
        });
      }
      return NextResponse.json(
        { error: "This invitation has expired" },
        { status: 400 }
      );
    }

    if (invite.status !== "pending") {
      return NextResponse.json(
        { error: "This invitation has already been responded to" },
        { status: 400 }
      );
    }

    // Update the invite status
    const updatedInvite = await (prisma as any).invite.update({
      where: { id: invite.id },
      data: {
        status: action === "accept" ? "accepted" : "declined",
        respondedAt: new Date(),
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

    // If accepted, create writing space access for the mentor
    if (action === "accept") {
      await createWritingSpaceAccess(
        projectId,
        mentorId,
        invite.studentId
      );
    }

    // Send email notification to student
    try {
      const actionText = action === "accept" ? "accepted" : "declined";
      const emailSubject = `Mentor ${actionText} your invitation - DissertScaffold`;
      
      const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4F46E5; margin: 0;">DissertScaffold</h1>
            <p style="color: #6B7280; margin: 5px 0;">Academic Writing Companion</p>
          </div>
          
          <div style="background: ${action === "accept" ? "#F0FDF4" : "#FEF2F2"}; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid ${action === "accept" ? "#BBF7D0" : "#FECACA"};">
            <h2 style="color: ${action === "accept" ? "#166534" : "#991B1B"}; margin-top: 0;">
              ${action === "accept" ? "✅ Invitation Accepted" : "❌ Invitation Declined"}
            </h2>
            <p style="color: #374151;">
              <strong>${updatedInvite.mentor.name}</strong> has ${actionText} your invitation to mentor your project: <strong>${updatedInvite.project.title || 'Research Project'}</strong>
            </p>
          </div>

          ${action === "accept" ? `
            <div style="background: #EFF6FF; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #BFDBFE;">
              <h3 style="color: #1E40AF; margin-top: 0;">Next Steps</h3>
              <p style="color: #1E40AF;">
                Your mentor now has access to your project and can provide guidance and feedback. 
                You can communicate with them through the platform's messaging system.
              </p>
            </div>
          ` : `
            <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #FDE68A;">
              <h3 style="color: #92400E; margin-top: 0;">What's Next?</h3>
              <p style="color: #92400E;">
                Don't worry! You can invite other mentors to your project or reach out to mentors directly through the community page.
              </p>
            </div>
          `}

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/user/timelines/${projectId}" 
               style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
              View Project
            </a>
          </div>

          <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; text-align: center;">
            <p style="color: #6B7280; font-size: 14px; margin: 0;">
              This notification was sent from DissertScaffold.
            </p>
          </div>
        </div>
      `;

      await sendGmail(updatedInvite.student.email, emailSubject, emailBody);
    } catch (emailError) {
      console.error('Failed to send student notification email:', emailError);
    }

    // Return a success page instead of JSON for email links
    const actionText = action === "accept" ? "accepted" : "declined";
    const successMessage = action === "accept" 
      ? "You have successfully accepted the mentor invitation!"
      : "You have declined the mentor invitation.";

    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invitation Response - DissertScaffold</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; }
            .container { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center; }
            .success { color: #10b981; }
            .decline { color: #ef4444; }
            .btn { display: inline-block; padding: 12px 24px; background: #4f46e5; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 style="color: #4f46e5;">DissertScaffold</h1>
            <h2 class="${action === "accept" ? "success" : "decline"}">${successMessage}</h2>
            <p>Thank you for your response. The student has been notified.</p>
            <a href="${process.env.NEXTAUTH_URL}" class="btn">Go to DissertScaffold</a>
          </div>
        </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error("Error handling email link response:", error);
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Error - DissertScaffold</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; }
            .container { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center; }
            .error { color: #ef4444; }
            .btn { display: inline-block; padding: 12px 24px; background: #4f46e5; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 style="color: #4f46e5;">DissertScaffold</h1>
            <h2 class="error">Error Processing Response</h2>
            <p>There was an error processing your response. Please try again or contact support.</p>
            <a href="${process.env.NEXTAUTH_URL}" class="btn">Go to DissertScaffold</a>
          </div>
        </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }
}
