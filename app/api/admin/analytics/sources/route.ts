import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getTrafficSource(
  referrer: string | null,
  utmSource: string | null
): string {
  if (utmSource) {
    return utmSource.toLowerCase();
  }

  if (!referrer) {
    return "Direct";
  }

  try {
    const hostname = new URL(referrer).hostname.toLowerCase();

    if (
      hostname.includes("google.") ||
      hostname.includes("bing.") ||
      hostname.includes("yahoo.")
    ) {
      return "Search";
    }

    if (
      hostname.includes("facebook.") ||
      hostname.includes("instagram.") ||
      hostname.includes("linkedin.") ||
      hostname.includes("twitter.") ||
      hostname.includes("x.com") ||
      hostname.includes("youtube.")
    ) {
      return "Social";
    }

    return hostname;
  } catch {
    return "Other";
  }
}

export async function GET(request: Request) {
  try {
    // Use the same admin-auth check as your other protected admin APIs.
    // Example:
    // await requireAdmin();

    const { searchParams } = new URL(request.url);

    const daysParam = Number(searchParams.get("days") || "30");
    const limitParam = Number(searchParams.get("limit") || "10");

    const days = [7, 30, 90].includes(daysParam)
      ? daysParam
      : 30;

    const limit = Math.min(
      Math.max(
        Number.isFinite(limitParam) ? limitParam : 10,
        1
      ),
      50
    );

    const [sessionRows] = await db.query(
      `
      SELECT
        referrer,
        utm_source,
        utm_medium,
        utm_campaign,
        visitor_id,
        session_id
      FROM analytics_sessions
      WHERE started_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      `,
      [days]
    );

    const sessions = sessionRows as Array<{
      referrer: string | null;
      utm_source: string | null;
      utm_medium: string | null;
      utm_campaign: string | null;
      visitor_id: string;
      session_id: string;
    }>;

    const sourceMap = new Map<
      string,
      {
        sessions: number;
        visitors: Set<string>;
      }
    >();

    for (const session of sessions) {
      const source = getTrafficSource(
        session.referrer,
        session.utm_source
      );

      const existing = sourceMap.get(source);

      if (existing) {
        existing.sessions += 1;
        existing.visitors.add(session.visitor_id);
      } else {
        sourceMap.set(source, {
          sessions: 1,
          visitors: new Set([session.visitor_id]),
        });
      }
    }

    const sources = Array.from(sourceMap.entries())
      .map(([source, data]) => ({
        source,
        sessions: data.sessions,
        visitors: data.visitors.size,
      }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, limit);

    const mediumMap = new Map<
      string,
      {
        sessions: number;
        visitors: Set<string>;
      }
    >();

    for (const session of sessions) {
      const medium =
        session.utm_medium?.trim() || "none";

      const existing = mediumMap.get(medium);

      if (existing) {
        existing.sessions += 1;
        existing.visitors.add(session.visitor_id);
      } else {
        mediumMap.set(medium, {
          sessions: 1,
          visitors: new Set([session.visitor_id]),
        });
      }
    }

    const mediums = Array.from(mediumMap.entries())
      .map(([medium, data]) => ({
        medium,
        sessions: data.sessions,
        visitors: data.visitors.size,
      }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, limit);

    const campaignMap = new Map<
      string,
      {
        sessions: number;
        visitors: Set<string>;
      }
    >();

    for (const session of sessions) {
      const campaign =
        session.utm_campaign?.trim() || "none";

      const existing = campaignMap.get(campaign);

      if (existing) {
        existing.sessions += 1;
        existing.visitors.add(session.visitor_id);
      } else {
        campaignMap.set(campaign, {
          sessions: 1,
          visitors: new Set([session.visitor_id]),
        });
      }
    }

    const campaigns = Array.from(campaignMap.entries())
      .map(([campaign, data]) => ({
        campaign,
        sessions: data.sessions,
        visitors: data.visitors.size,
      }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      range: {
        days,
      },
      data: {
        sources,
        mediums,
        campaigns,
      },
    });
  } catch (error) {
    console.error("Analytics sources error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load traffic source analytics.",
      },
      {
        status: 500,
      }
    );
  }
}