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
    const days = [7, 30, 90].includes(daysParam) ? daysParam : 30;

    const [sessionRows] = await db.query(
      `
      SELECT
        DATE(started_at) AS date,
        COUNT(*) AS sessions,
        COUNT(DISTINCT visitor_id) AS visitors,
        COALESCE(SUM(page_views), 0) AS page_views
      FROM analytics_sessions
      WHERE started_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY DATE(started_at)
      ORDER BY DATE(started_at) ASC
      `,
      [days - 1]
    );

    const [newVisitorRows] = await db.query(
      `
      SELECT
        DATE(first_seen_at) AS date,
        COUNT(*) AS new_visitors
      FROM analytics_visitors
      WHERE first_seen_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY DATE(first_seen_at)
      ORDER BY DATE(first_seen_at) ASC
      `,
      [days - 1]
    );

    const sessions = sessionRows as Array<{
      date: string | Date;
      sessions: number | string;
      visitors: number | string;
      page_views: number | string;
    }>;

    const newVisitors = newVisitorRows as Array<{
      date: string | Date;
      new_visitors: number | string;
    }>;

    const newVisitorsMap = new Map<string, number>();

    for (const row of newVisitors) {
      const date = formatDate(row.date);

      newVisitorsMap.set(
        date,
        Number(row.new_visitors || 0)
      );
    }

    const sessionMap = new Map<
      string,
      {
        visitors: number;
        sessions: number;
        pageViews: number;
      }
    >();

    for (const row of sessions) {
      const date = formatDate(row.date);

      sessionMap.set(date, {
        visitors: Number(row.visitors || 0),
        sessions: Number(row.sessions || 0),
        pageViews: Number(row.page_views || 0),
      });
    }

    const data = [];

    for (let index = days - 1; index >= 0; index--) {
      const date = new Date();

      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - index);

      const dateKey = formatDate(date);

      const sessionData = sessionMap.get(dateKey);

      data.push({
        date: dateKey,
        visitors: sessionData?.visitors || 0,
        sessions: sessionData?.sessions || 0,
        pageViews: sessionData?.pageViews || 0,
        newVisitors: newVisitorsMap.get(dateKey) || 0,
      });
    }

    return NextResponse.json({
      success: true,
      range: {
        days,
      },
      data,
    });
  } catch (error) {
    console.error("Analytics timeseries error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load analytics timeseries.",
      },
      {
        status: 500,
      }
    );
  }
}

function formatDate(value: string | Date): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value).slice(0, 10);
}