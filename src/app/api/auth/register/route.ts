import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { name, email, password, phoneNumber } = await req.json();

    // 1. Validation check
    if (!name || !email || !password || !phoneNumber) {
      return NextResponse.json(
        { error: 'All fields (name, email, password, phoneNumber) are required' },
        { status: 400 }
      );
    }

    const phoneRegex = /^\+?[0-9\s\-()]{10,20}$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number (at least 10 digits)' },
        { status: 400 }
      );
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email address already exists' },
        { status: 400 }
      );
    }

    // 3. Create workspace and user in a transaction
    const passwordHash = bcrypt.hashSync(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name: `${name}'s Workspace`,
        },
      });

      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          phoneNumber,
          role: 'ADMIN', // The registering user is the admin of their workspace
          workspaceId: workspace.id,
        },
      });

      return { userId: user.id, workspaceId: workspace.id };
    });

    return NextResponse.json({
      success: true,
      message: 'Account registered successfully',
      userId: result.userId,
    });
  } catch (error) {
    console.error('Registration API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
