import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { blogId: string, userId: string } }
) {
  try {
    const blogId = parseInt(params.blogId, 10);
    const userId = parseInt(params.userId, 10);

    if (isNaN(blogId) || isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid blog ID or user ID' }, { status: 400 });
    }

    const body = await request.json();
    const content = String(body.content);

    if (!content) {
      return NextResponse.json({ success: false, message: 'Comment content is required' }, { status: 400 });
    }

    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      return NextResponse.json({ success: false, message: 'Blog not found' }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        blogId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Comment created successfully',
      data: { commentId: comment.id.toString() },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', data: error }, { status: 500 });
  }
}