import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

// GET - Retrieve messages sent to the current mentor
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

    // Check if user is a mentor
    if (user.userType !== "MENTOR") {
      return NextResponse.json({ error: "Access denied. Only mentors can view received messages." }, { status: 403 });
    }

    // Get messages where current user is the recipient
    const messages = await prisma.message.findMany({
      where: {
        recipientId: user.id
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            userType: true,
            institutionName: true,
            researchArea: true,
            academicLevel: true,
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
    console.error("Error fetching mentor messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
