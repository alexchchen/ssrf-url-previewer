import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// check if user is authenticated
// do this by checking for userId cookie if it exists, user is authenticated
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId');

  if (userId) {
    return NextResponse.json({ isAuthenticated: true, userId: userId.value });
  }

  return NextResponse.json({ isAuthenticated: false });
}
