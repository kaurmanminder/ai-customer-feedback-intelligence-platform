import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('loop_session');

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Decode session from cookie
    const session = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString('utf-8'));
    const { workspaceId } = session;

    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace ID not found' }, { status: 400 });
    }

    // 2. Fetch feedbacks and themes
    const feedbacks = await prisma.feedback.findMany({
      where: { workspaceId },
      include: {
        themes: {
          include: {
            theme: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error('Fetch feedback error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
