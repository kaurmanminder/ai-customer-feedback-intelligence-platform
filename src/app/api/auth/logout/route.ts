import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear the loop_session cookie
  response.cookies.set('loop_session', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/'
  });
  
  return response;
}
