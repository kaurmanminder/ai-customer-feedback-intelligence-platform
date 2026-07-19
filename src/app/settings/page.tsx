import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import SettingsClient from './SettingsClient';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('loop_session');

  if (!sessionCookie) {
    redirect('/login');
  }

  let session;
  try {
    session = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString('utf-8'));
  } catch {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { workspace: true }
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <SettingsClient user={{
      name: user.name || 'User',
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      status: 'Active',
      workspaceName: user.workspace.name,
      bio: user.bio || ''
    }} />
  );
}
