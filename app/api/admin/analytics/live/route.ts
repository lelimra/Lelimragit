import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Use the same admin-auth check as your other protected admin APIs.
    // Example:
    // await requireAdmin();

    const [rows] = await db.query(`
      SELECT
        s.session_id,
        s.visitor_id,
        s.last_activity_at,
        s.landing_page,
        s.page_views,
        s.referrer,

        v.country,
        v.country_code,
        v.region,
        v.city,
        v.device_type,
        v.browser,
        v.os,
        v.language

      FROM analytics_sessions s

      INNER JOIN analytics_visitors v
        ON v.visitor_id = s.visitor_id

      WHERE s.last_activity_at >= DATE_SUB(
        NOW(),
        INTERVAL 5 MINUTE
      )

      ORDER BY s.last_activity_at DESC
    `);

    const visitors = (
      rows as Array<{
        session_id: string;
        visitor_id: string;
        last_activity_at: Date | string;
        landing_page: string | null;
        page_views: number | string;
        referrer: string | null;

        country: string | null;
        country_code: string | null;
        region: string | null;
        city: string | null;

        device_type: string | null;
        browser: string | null;
        os: string | null;
        language: string | null;
      }>
    ).map((row) => ({
      sessionId: row.session_id,
      visitorId: row.visitor_id,

      lastActivityAt: row.last_activity_at,

      currentPage: row.landing_page || "/",

      pageViews: Number(row.page_views || 0),

      referrer: row.referrer || null,

      location: {
        country: row.country || "Unknown",
        countryCode: row.country_code || null,
        region: row.region || null,
        city: row.city || null,
      },

      device: row.device_type || "Unknown",
      browser: row.browser || "Unknown",
      os: row.os || "Unknown",
      language: row.language || null,
    }));

    return NextResponse.json({
      success: true,

      data: {
        activeVisitors: visitors.length,
        visitors,
      },
    });
  } catch (error) {
    console.error("Live analytics error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load live visitors.",
      },
      {
        status: 500,
      }
    );
  }
}