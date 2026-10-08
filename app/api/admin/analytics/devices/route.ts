import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type BreakdownRow = {
  category: string | null;
  visitors: number | string;
};

function buildBreakdown(rows: BreakdownRow[]) {
  return rows.map((row) => ({
    name: row.category?.trim() || "Unknown",
    visitors: Number(row.visitors || 0),
  }));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const daysParam = Number(
      searchParams.get("days") || "30"
    );

    const days = [7, 30, 90].includes(daysParam)
      ? daysParam
      : 30;

    /*
     * Device type
     */
    const [deviceRows] = await db.query(
      `
      SELECT
        COALESCE(device_type, 'Unknown') AS category,
        COUNT(*) AS visitors
      FROM analytics_visitors
      WHERE last_seen_at >= DATE_SUB(NOW(), INTERVAL ${days} DAY)
      GROUP BY COALESCE(device_type, 'Unknown')
      ORDER BY visitors DESC
      `
    );

    /*
     * Browser
     */
    const [browserRows] = await db.query(
      `
      SELECT
        COALESCE(browser, 'Unknown') AS category,
        COUNT(*) AS visitors
      FROM analytics_visitors
      WHERE last_seen_at >= DATE_SUB(NOW(), INTERVAL ${days} DAY)
      GROUP BY COALESCE(browser, 'Unknown')
      ORDER BY visitors DESC
      `
    );

    /*
     * Operating system
     */
    const [osRows] = await db.query(
      `
      SELECT
        COALESCE(os, 'Unknown') AS category,
        COUNT(*) AS visitors
      FROM analytics_visitors
      WHERE last_seen_at >= DATE_SUB(NOW(), INTERVAL ${days} DAY)
      GROUP BY COALESCE(os, 'Unknown')
      ORDER BY visitors DESC
      `
    );

    return NextResponse.json({
      success: true,
      range: {
        days,
      },
      data: {
        devices: buildBreakdown(
          deviceRows as BreakdownRow[]
        ),
        browsers: buildBreakdown(
          browserRows as BreakdownRow[]
        ),
        operatingSystems: buildBreakdown(
          osRows as BreakdownRow[]
        ),
      },
    });
  } catch (error) {
    console.error(
      "Analytics devices error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load device analytics.",
      },
      {
        status: 500,
      }
    );
  }
}