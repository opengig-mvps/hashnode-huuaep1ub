import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type BlogRequestBody = {
  title: string;
  content: string;
  authorId: number;
  isPublished?: boolean;
};

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Published blogs fetched successfully',
        data: blogs,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching published blogs:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        data: error,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: BlogRequestBody = await request.json();

    const { title, content, authorId, isPublished = false } = body;

    if (!title || !content || isNaN(authorId)) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const author = await prisma.user.findFirst({
      where: { id: authorId },
    });

    if (!author) {
      return NextResponse.json(
        { success: false, message: 'Author not found' },
        { status: 404 }
      );
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        isPublished,
        authorId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Blog created successfully',
        data: { blogId: blog.id.toString() },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', data: error },
      { status: 500 }
    );
  }
}