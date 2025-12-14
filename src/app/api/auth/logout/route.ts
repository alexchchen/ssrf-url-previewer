import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json(
    { message: 'Logged out successfully' },
    { status: 200 }
  );

  // clear cookie (log out)
  response.cookies.delete('userId');

  return response;
}
