import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// Admin endpoint to fetch recent preview requests
export async function GET(request: NextRequest) {
  try {
    const limitParam = request.nextUrl.searchParams.get("limit");
    const limit = Math.min(
      Math.max(Number.parseInt(limitParam ?? "50", 10) || 50, 1),
      200
    );

    // Fetch recent preview requests of all users from the database
    const recent = db
      .prepare(
        `
        SELECT sh.id as id,
               u.email as user,
               sh.url as url,
               sh.searched_at as searchedAt
        FROM search_history sh
        JOIN users u ON u.id = sh.user_id
        ORDER BY sh.searched_at DESC
        LIMIT ?
      `
      )
      .all(limit) as Array<{
      id: number;
      user: string;
      url: string;
      searchedAt: string;
    }>;

    return NextResponse.json({ recent });
  } catch (error) {
    console.error("Failed to fetch admin recent requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent requests" },
      { status: 500 }
    );
  }
}
