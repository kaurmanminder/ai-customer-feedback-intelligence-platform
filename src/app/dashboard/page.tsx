import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
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

  const { workspaceId } = session;

  // 1. Fetch feedbacks from database directly on the server
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

  // 2. Serialize database records (e.g. Dates) into plain JSON for the Client Component
  const serializedFeedbacks = feedbacks.map(fb => ({
    id: fb.id,
    content: fb.content,
    channel: fb.channel,
    sourceRef: fb.sourceRef,
    customerLabel: fb.customerLabel,
    sentiment: fb.sentiment,
    sentimentScore: fb.sentimentScore,
    status: fb.status,
    createdAt: fb.createdAt.toISOString(),
    themes: fb.themes.map(ft => ({
      confidence: ft.confidence,
      theme: {
        id: ft.theme.id,
        name: ft.theme.name,
        color: ft.theme.color,
        description: ft.theme.description
      }
    }))
  }));

  const dbUser = await prisma.user.findUnique({
    where: { id: session.userId }
  });

  return (
    <DashboardClient 
      initialFeedbacks={serializedFeedbacks} 
      user={{
        ...session,
        phoneNumber: dbUser?.phoneNumber || ''
      }}
    />
  );
}
