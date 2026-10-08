import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // Add your existing admin-auth check here before querying analytics.
    const { searchParams } = new URL(request.url);

    const daysParam = Number(searchParams.get("days") || "30");
    const days = [7, 30, 90].includes(daysParam) ? daysParam : 30;

    const [overviewRows] = await db.query(
      `
      SELECT
        COUNT(DISTINCT visitor_id) AS visitors,
        COUNT(*) AS sessions,
        COALESCE(SUM(page_views), 0) AS page_views,
        COALESCE(SUM(duration_seconds), 0) AS total_duration,
        COALESCE(AVG(duration_seconds), 0) AS avg_session_duration,
        COALESCE(AVG(page_views), 0) AS pages_per_session,
        COALESCE(
          SUM(CASE WHEN page_views <= 1 THEN 1 ELSE 0 END)
          / NULLIF(COUNT(*), 0) * 100,
          0
        ) AS bounce_rate
      FROM analytics_sessions
      WHERE started_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      `,
      [days]
    );

    const [newVisitorRows] = await db.query(
      `
      SELECT
        COUNT(*) AS new_visitors
      FROM analytics_visitors
      WHERE first_seen_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      `,
      [days]
    );

    const [returningVisitorRows] = await db.query(
      `
      SELECT
        COUNT(DISTINCT visitor_id) AS returning_visitors
      FROM analytics_sessions
      WHERE started_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        AND visitor_id IN (
          SELECT visitor_id
          FROM analytics_sessions
          GROUP BY visitor_id
          HAVING COUNT(*) > 1
        )
      `,
      [days]
    );

    const overview = (overviewRows as any[])[0] || {};
    const newVisitors = (newVisitorRows as any[])[0] || {};
    const returningVisitors = (returningVisitorRows as any[])[0] || {};

    return NextResponse.json({
      success: true,
      range: {
        days,
      },
      data: {
        visitors: Number(overview.visitors || 0),
        sessions: Number(overview.sessions || 0),
        pageViews: Number(overview.page_views || 0),
        newVisitors: Number(newVisitors.new_visitors || 0),
        returningVisitors: Number(
          returningVisitors.returning_visitors || 0
        ),
        avgSessionDuration: Math.round(
          Number(overview.avg_session_duration || 0)
        ),
        pagesPerSession: Number(
          Number(overview.pages_per_session || 0).toFixed(2)
        ),
        bounceRate: Number(
          Number(overview.bounce_rate || 0).toFixed(2)
        ),
      },
    });
  } catch (error) {
    console.error("Analytics overview error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load analytics overview.",
      },
      {
        status: 500,
      }
    );
  }
}