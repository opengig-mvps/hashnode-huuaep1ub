import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { blogId: string, userId: string } }
) {
  try {
    const blogId = parseInt(params.blogId, 10);
    const userId = parseInt(params.userId, 10);

    if (isNaN(blogId) || isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid blog ID or user ID' }, { status: 400 });
    }

    // Validate if the like exists
    const existingLike = await prisma.like.findFirst({
      where: {
        blogId,
        userId,
      },
    });

    if (!existingLike) {
      return NextResponse.json({ success: false, message: 'Like not found' }, { status: 404 });
    }

    // Remove the like
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });

    // Get the updated like count
    const updatedLikeCount = await prisma.like.count({
      where: {
        blogId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Like removed successfully',
      data: { updatedLikeCount },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error removing like:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', data: error }, { status: 500 });
  }
}