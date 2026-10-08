import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getDays(value: string | null) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 30;
  }

  return Math.min(
    Math.max(Math.floor(parsed), 1),
    365
  );
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const days = getDays(
      searchParams.get("days")
    );

    const currentInterval = `${days} DAY`;
    const previousStart = `${days * 2} DAY`;

    const [
      [currentVisitorsRows],
      [previousVisitorsRows],
      [currentSessionsRows],
      [previousSessionsRows],
      [currentPageViewsRows],
      [previousPageViewsRows],
      [currentNewVisitorsRows],
      [previousNewVisitorsRows],
    ] = await Promise.all([
      db.query(
        `SELECT COUNT(*) AS total
         FROM analytics_visitors
         WHERE last_seen_at >= DATE_SUB(NOW(), INTERVAL ${currentInterval})`
      ),

      db.query(
        `SELECT COUNT(*) AS total
         FROM analytics_visitors
         WHERE first_seen_at >= DATE_SUB(NOW(), INTERVAL ${previousStart})
           AND first_seen_at < DATE_SUB(NOW(), INTERVAL ${currentInterval})`
      ),

      db.query(
        `SELECT COUNT(*) AS total
         FROM analytics_sessions
         WHERE started_at >= DATE_SUB(NOW(), INTERVAL ${currentInterval})`
      ),

      db.query(
        `SELECT COUNT(*) AS total
         FROM analytics_sessions
         WHERE started_at >= DATE_SUB(NOW(), INTERVAL ${previousStart})
           AND started_at < DATE_SUB(NOW(), INTERVAL ${currentInterval})`
      ),

      db.query(
        `SELECT COUNT(*) AS total
         FROM analytics_page_views
         WHERE viewed_at >= DATE_SUB(NOW(), INTERVAL ${currentInterval})`
      ),

      db.query(
        `SELECT COUNT(*) AS total
         FROM analytics_page_views
         WHERE viewed_at >= DATE_SUB(NOW(), INTERVAL ${previousStart})
           AND viewed_at < DATE_SUB(NOW(), INTERVAL ${currentInterval})`
      ),

      db.query(
        `SELECT COUNT(*) AS total
         FROM analytics_visitors
         WHERE first_seen_at >= DATE_SUB(NOW(), INTERVAL ${currentInterval})`
      ),

      db.query(
        `SELECT COUNT(*) AS total
         FROM analytics_visitors
         WHERE first_seen_at >= DATE_SUB(NOW(), INTERVAL ${previousStart})
           AND first_seen_at < DATE_SUB(NOW(), INTERVAL ${currentInterval})`
      ),
    ]);

    const getTotal = (
      rows: unknown
    ): number => {
      const row = Array.isArray(rows)
        ? (rows[0] as {
            total?: number | string;
          })
        : undefined;

      return Number(row?.total || 0);
    };

    return NextResponse.json({
      success: true,
      data: {
        days,

        visitors: {
          current: getTotal(currentVisitorsRows),
          previous: getTotal(previousVisitorsRows),
        },

        sessions: {
          current: getTotal(currentSessionsRows),
          previous: getTotal(previousSessionsRows),
        },

        pageViews: {
          current: getTotal(currentPageViewsRows),
          previous: getTotal(previousPageViewsRows),
        },

        newVisitors: {
          current: getTotal(currentNewVisitorsRows),
          previous: getTotal(previousNewVisitorsRows),
        },
      },
    });
  } catch (error) {
    console.error(
      "Analytics comparison error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load analytics comparison.",
      },
      {
        status: 500,
      }
    );
  }
}