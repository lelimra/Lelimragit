import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type EventRow = {
  event_name: string;
  event_count: number | string;
  unique_visitors: number | string;
};

export async function GET(request: Request) {
  try {
    // Use the same admin-auth check as your other protected admin APIs.
    // Example:
    // await requireAdmin();

    const { searchParams } = new URL(request.url);

    const daysParam = Number(
      searchParams.get("days") || "30"
    );

    const days = [7, 30, 90].includes(daysParam)
      ? daysParam
      : 30;

    const [eventRows] = await db.query(
      `
      SELECT
        event_name,
        COUNT(*) AS event_count,
        COUNT(DISTINCT visitor_id) AS unique_visitors
      FROM analytics_events
      WHERE created_at >= DATE_SUB(
        NOW(),
        INTERVAL ${days} DAY
      )
      GROUP BY event_name
      ORDER BY event_count DESC
      `
    );

    const events = (
      eventRows as EventRow[]
    ).map((row) => ({
      event: row.event_name,
      count: Number(row.event_count || 0),
      uniqueVisitors: Number(
        row.unique_visitors || 0
      ),
    }));

    const [conversionRows] = await db.query(
      `
      SELECT
        COUNT(DISTINCT CASE
          WHEN event_name = 'enquiry_submitted'
          THEN visitor_id
        END) AS enquiry_visitors,

        COUNT(DISTINCT CASE
          WHEN event_name = 'contact_submitted'
          THEN visitor_id
        END) AS contact_visitors,

        COUNT(DISTINCT CASE
          WHEN event_name = 'whatsapp_click'
          THEN visitor_id
        END) AS whatsapp_visitors,

        COUNT(DISTINCT CASE
          WHEN event_name = 'catalogue_download'
          THEN visitor_id
        END) AS catalogue_visitors,

        COUNT(DISTINCT visitor_id) AS total_visitors
      FROM analytics_events
      WHERE created_at >= DATE_SUB(
        NOW(),
        INTERVAL ${days} DAY
      )
      `
    );

    const conversion =
      (
        conversionRows as Array<{
          enquiry_visitors: number | string;
          contact_visitors: number | string;
          whatsapp_visitors: number | string;
          catalogue_visitors: number | string;
          total_visitors: number | string;
        }>
      )[0];

    const totalVisitors = Number(
      conversion?.total_visitors || 0
    );

    const enquiryVisitors = Number(
      conversion?.enquiry_visitors || 0
    );

    const contactVisitors = Number(
      conversion?.contact_visitors || 0
    );

    const whatsappVisitors = Number(
      conversion?.whatsapp_visitors || 0
    );

    const catalogueVisitors = Number(
      conversion?.catalogue_visitors || 0
    );

    return NextResponse.json({
      success: true,
      range: {
        days,
      },
      data: {
        events,

        conversions: {
          enquiries: enquiryVisitors,
          contacts: contactVisitors,
          whatsapp: whatsappVisitors,
          catalogueDownloads: catalogueVisitors,
        },

        conversionRates: {
          enquiryRate:
            totalVisitors > 0
              ? Number(
                  (
                    (enquiryVisitors /
                      totalVisitors) *
                    100
                  ).toFixed(2)
                )
              : 0,

          contactRate:
            totalVisitors > 0
              ? Number(
                  (
                    (contactVisitors /
                      totalVisitors) *
                    100
                  ).toFixed(2)
                )
              : 0,

          whatsappRate:
            totalVisitors > 0
              ? Number(
                  (
                    (whatsappVisitors /
                      totalVisitors) *
                    100
                  ).toFixed(2)
                )
              : 0,

          catalogueRate:
            totalVisitors > 0
              ? Number(
                  (
                    (catalogueVisitors /
                      totalVisitors) *
                    100
                  ).toFixed(2)
                )
              : 0,
        },

        totalVisitors,
      },
    });
  } catch (error) {
    console.error(
      "Analytics events error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to load event analytics.",
      },
      {
        status: 500,
      }
    );
  }
}