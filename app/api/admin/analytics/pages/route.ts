import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // Use the same admin-auth check as your other protected admin APIs.
    // Example:
    // await requireAdmin();

    const { searchParams } = new URL(request.url);

    const daysParam = Number(searchParams.get("days") || "30");
    const limitParam = Number(searchParams.get("limit") || "10");

    const days = [7, 30, 90].includes(daysParam) ? daysParam : 30;

    const limit = Math.min(
      Math.max(Number.isFinite(limitParam) ? limitParam : 10, 1),
      50
    );

    const [rows] = await db.query(
      `
      SELECT
        path,
        COUNT(*) AS page_views,
        COUNT(DISTINCT visitor_id) AS unique_visitors,
        COALESCE(AVG(duration_seconds), 0) AS avg_duration
      FROM analytics_page_views
      WHERE viewed_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY path
      ORDER BY page_views DESC
      LIMIT ${limit}
      `,
      [days]
    );

    const pages = (
      rows as Array<{
        path: string;
        page_views: number | string;
        unique_visitors: number | string;
        avg_duration: number | string;
      }>
    ).map((row) => ({
      path: row.path,
      pageViews: Number(row.page_views || 0),
      uniqueVisitors: Number(row.unique_visitors || 0),
      avgDuration: Math.round(
        Number(row.avg_duration || 0)
      ),
    }));

    return NextResponse.json({
      success: true,
      range: {
        days,
      },
      data: pages,
    });
  } catch (error) {
    console.error("Analytics pages error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load page analytics.",
      },
      {
        status: 500,
      }
    );
  }
}