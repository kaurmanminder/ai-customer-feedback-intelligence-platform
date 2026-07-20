import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function DELETE(req: Request) {
  try {
    // 1. Authenticate user session
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('loop_session');

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let session;
    try {
      session = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString('utf-8'));
    } catch {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const { userId } = session;
    if (!userId) {
      return NextResponse.json({ error: 'Invalid session structure' }, { status: 401 });
    }

    // 2. Parse request body
    const body = await req.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    // 3. Retrieve user's hashed password from database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 4. Compare password with passwordHash
    const isValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 400 });
    }

    // 5. Delete the user (cascades to delete reports)
    await prisma.user.delete({
      where: { id: userId }
    });

    // 6. Clear session cookie and return success
    const response = NextResponse.json({
      success: true,
      message: 'Account permanently deleted'
    });

    response.cookies.set('loop_session', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Delete account API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
