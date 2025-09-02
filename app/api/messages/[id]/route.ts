import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

// PUT - Mark a message as read
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const messageId = params.id;

    // Check if the message exists and belongs to the current user
    const message = await prisma.message.findFirst({
      where: {
        id: messageId,
        OR: [
          { senderId: user.id },
          { recipientId: user.id }
        ]
      }
    });

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Mark the message as read
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
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
        recipient: {
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

    return NextResponse.json({
      success: true,
      message: "Message marked as read",
      data: updatedMessage,
    });

  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a message
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const messageId = params.id;

    // Check if the message exists and belongs to the current user
    const message = await prisma.message.findFirst({
      where: {
        id: messageId,
        OR: [
          { senderId: user.id },
          { recipientId: user.id }
        ]
      }
    });

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Delete the message
    await prisma.message.delete({
      where: { id: messageId }
    });

    return NextResponse.json({
      success: true,
      message: "Message deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
