import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get users search history from database to give to frontend
    const history = db
      .prepare(`
        SELECT id, url, searched_at
        FROM search_history
        WHERE user_id = ?
        ORDER BY searched_at DESC
        LIMIT 50
      `)
      .all(userId.value);

    return NextResponse.json({ history });
  } catch (error) {
    console.error('Failed to fetch history:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
