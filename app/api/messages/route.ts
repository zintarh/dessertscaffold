import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { z } from "zod";
import { sendGmail } from "../../../lib/gmail";

// Validation schema for sending a message
const sendMessageSchema = z.object({
  receiverId: z.string().min(1, "Receiver ID is required"),
  subject: z.string().optional(),
  body: z.string().min(1, "Message body is required"),
});

// GET - Retrieve messages for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get messages where current user is either sender or receiver
    const messages = await (prisma as any).message.findMany({
      where: {
        OR: [
          { senderId: user.id },
          { receiverId: user.id }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            userType: true,
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            userType: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      messages,
    });

  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Send a new message
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the current user
    const sender = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!sender) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Validate request body
    const body = await request.json();
    const validatedData = sendMessageSchema.parse(body);

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: validatedData.receiverId },
    });

    if (!receiver) {
      return NextResponse.json({ error: "Receiver not found" }, { status: 404 });
    }

    // Create the message
    const message = await (prisma as any).message.create({
      data: {
        senderId: sender.id,
        receiverId: validatedData.receiverId,
        subject: validatedData.subject,
        body: validatedData.body,
        status: 'unread',
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            userType: true,
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            userType: true,
          }
        }
      }
    });

    // Send email notification to the mentor if a student is messaging them
    if (sender.userType === 'STUDENT' && receiver.userType === 'MENTOR') {
      try {
        const emailSubject = `New Message from ${sender.name} - DissertScaffold`;
        const emailBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Message Received</h2>
            <p>Hello ${receiver.name},</p>
            <p>You have received a new message from <strong>${sender.name}</strong> on DissertScaffold.</p>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #555;">Message Details:</h3>
              <p><strong>From:</strong> ${sender.name}</p>
              <p><strong>Subject:</strong> ${message.subject}</p>
              <p><strong>Message:</strong></p>
              <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #007bff;">
                ${message.body.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <p>Please log in to DissertScaffold to view and respond to this message.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}/user/my-messages" 
                 style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View Messages
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #666; font-size: 14px;">
              This email was sent from DissertScaffold - Your Academic Writing Companion.<br>
              If you didn't expect this message, please ignore it.
            </p>
          </div>
        `;

        const emailResult = await sendGmail(receiver.email, emailSubject, emailBody);
        
        if (!emailResult.success) {
          console.error('Failed to send email notification:', emailResult.error);
          // Don't fail the message creation if email fails, but log it
        }
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Don't fail the message creation if email fails, but log it
      }
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
