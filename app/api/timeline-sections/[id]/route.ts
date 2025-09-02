import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content, isCompleted } = body;

    console.log(
      "PATCH API called for section:",
      id,
      "Updates:",
      { 
        contentLength: content?.length, 
        isCompleted 
      }
    );

    // Prepare update data - only include fields that are provided
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (content !== undefined) {
      updateData.content = content;
    }

    if (isCompleted !== undefined) {
      updateData.isCompleted = isCompleted;
    }

    // Update the section
    const updatedSection = await prisma.section.update({
      where: { id },
      data: updateData,
    });

    console.log(
      "Section updated successfully:",
      updatedSection.id,
      "New state:",
      {
        contentLength: updatedSection.content?.length,
        isCompleted: updatedSection.isCompleted
      }
    );
    
    return NextResponse.json({
      success: true,
      section: updatedSection
    });
  } catch (error) {
    console.error("Error updating section:", error);
    return NextResponse.json(
      { error: "Failed to update section" },
      { status: 500 }
    );
  }
}
