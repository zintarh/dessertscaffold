import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';

// Avatar upload endpoint
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('avatar') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // For now, we'll store the image as base64 in the database
    // In production, you'd want to use a service like AWS S3, Cloudinary, etc.
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Update user's image in database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: dataUrl },
      select: { id: true, image: true }
    });

    return NextResponse.json({ 
      success: true, 
      image: updatedUser.image 
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload avatar' }, 
      { status: 500 }
    );
  }
}
