import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('loop_session');

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Decode session from cookie
    let session;
    try {
      session = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString('utf-8'));
    } catch {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const { userId } = session;
    const body = await req.json();
    const { name, email, phoneNumber, role, bio, workspaceName } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Update user and workspace in Prisma
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        phoneNumber,
        role: role as Role,
        bio,
        workspace: workspaceName ? {
          update: {
            name: workspaceName
          }
        } : undefined
      },
      include: {
        workspace: true
      }
    });

    // Update the session cookie with updated values
    const updatedSessionData = {
      userId: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name || 'User',
      role: updatedUser.role,
      workspaceId: updatedUser.workspaceId,
      workspaceName: updatedUser.workspace.name
    };

    const cookieValue = Buffer.from(JSON.stringify(updatedSessionData)).toString('base64');
    const response = NextResponse.json({ success: true, user: updatedUser });

    response.cookies.set('loop_session', cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Profile update error:', error);
    const err = error as Error;
    return NextResponse.json({ error: err.message || 'Failed to update profile' }, { status: 500 });
  }
}
