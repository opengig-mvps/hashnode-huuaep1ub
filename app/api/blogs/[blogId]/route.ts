import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { blogId: string } }
) {
  try {
    const blogId = parseInt(params.blogId, 10);
    if (isNaN(blogId)) {
      return NextResponse.json({ success: false, message: 'Invalid blog ID' }, { status: 400 });
    }

    const blog = await prisma.blog.findFirst({
      where: { id: blogId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                username: true,
                name: true,
              },
            },
          },
        },
        likes: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!blog) {
      return NextResponse.json({ success: false, message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Blog details fetched successfully',
      data: blog,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching blog details:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}