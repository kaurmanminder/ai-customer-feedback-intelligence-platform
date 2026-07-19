import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 1. Fetch user from database
    const user = await prisma.user.findUnique({
      where: { email },
      include: { workspace: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // 2. Validate password hash
    const isValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // 3. Prepare session info
    const sessionData = {
      userId: user.id,
      email: user.email,
      name: user.name || 'User',
      role: user.role,
      workspaceId: user.workspaceId,
      workspaceName: user.workspace.name
    };

    // 4. Encode as base64 to store in cookie securely
    const cookieValue = Buffer.from(JSON.stringify(sessionData)).toString('base64');

    const response = NextResponse.json({ success: true, user: sessionData });

    // 5. Set session cookie
    response.cookies.set('loop_session', cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
