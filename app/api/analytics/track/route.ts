import { NextResponse } from "next/server";
import { getAnalyticsIdentity } from "@/lib/analytics/visitor";
import { db } from "@/lib/db";
import { parseUserAgent } from "@/lib/analytics/userAgent";
import { getGeoLocation } from "@/lib/analytics/geolocation";

type TrackRequest = {
    event?: string;
    path?: string;
    title?: string;
    productId?: string | null;
    eventData?: Record<string, unknown> | null;

    deviceType?: string | null;
    screenWidth?: number | null;
    screenHeight?: number | null;
    language?: string | null;
    referrer?: string | null;

    utmSource?: string | null;
    utmMedium?: string | null;
    utmCampaign?: string | null;

    durationSeconds?: number | null;
    previousPath?: string | null;
};

const ALLOWED_EVENTS = new Set([
    "page_view",
    "heartbeat",
    "page_duration",
    "product_view",
    "product_image_view",
    "product_search",
    "category_view",
    "enquiry_started",
    "enquiry_submitted",
    "contact_submitted",
    "whatsapp_click",
    "catalogue_download",
    "external_link_click",
]);

const ALLOWED_DEVICE_TYPES = new Set([
    "mobile",
    "tablet",
    "desktop",
]);

function cleanString(
    value: string | null | undefined,
    maxLength: number
) {
    if (!value) {
        return null;
    }

    return value.trim().slice(0, maxLength);
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as TrackRequest;

        const event = cleanString(body.event, 100);
        const path = cleanString(body.path, 1000);

        if (!event || !ALLOWED_EVENTS.has(event)) {
            return NextResponse.json(
                {
                    error: "Invalid analytics event.",
                },
                {
                    status: 400,
                }
            );
        }

        if (!path) {
            return NextResponse.json(
                {
                    error: "Invalid page path.",
                },
                {
                    status: 400,
                }
            );
        }

        const durationSeconds =
            typeof body.durationSeconds === "number" &&
                Number.isFinite(body.durationSeconds)
                ? Math.max(
                    0,
                    Math.min(
                        Math.floor(body.durationSeconds),
                        86400
                    )
                )
                : 0;

        const userAgent =
            request.headers.get("user-agent");

        const forwardedFor =
            request.headers.get("x-forwarded-for");

        const realIp =
            request.headers.get("x-real-ip");

        const ip =
            forwardedFor
                ?.split(",")[0]
                ?.trim() ||
            realIp ||
            null;

        const { browser, os } =
            parseUserAgent(userAgent);

        const {
            visitorId,
            sessionId,
        } = await getAnalyticsIdentity();

        /*
         * --------------------------------------------------
         * GEOLOCATION
         * --------------------------------------------------
         */

        let geo = {
            country: null as string | null,
            countryCode: null as string | null,
            region: null as string | null,
            city: null as string | null,
        };

        if (ip) {
            const [existingGeoRows] =
                await db.query(
                    `
          SELECT
            country,
            country_code,
            region,
            city
          FROM analytics_visitors
          WHERE visitor_id = ?
          LIMIT 1
          `,
                    [visitorId]
                );

            const existingGeo =
                existingGeoRows as Array<{
                    country: string | null;
                    country_code: string | null;
                    region: string | null;
                    city: string | null;
                }>;

            const current =
                existingGeo[0];

            if (
                !current?.country &&
                !current?.country_code &&
                !current?.region &&
                !current?.city
            ) {
                geo = await getGeoLocation(ip);
            }
        }

        /*
         * --------------------------------------------------
         * DEVICE + LANGUAGE
         * --------------------------------------------------
         */

        const deviceType =
            body.deviceType &&
                ALLOWED_DEVICE_TYPES.has(
                    body.deviceType
                )
                ? body.deviceType
                : null;

        const language =
            typeof body.language === "string"
                ? cleanString(
                    body.language,
                    20
                )
                : null;

        /*
         * --------------------------------------------------
         * UPDATE VISITOR
         * --------------------------------------------------
         */

        await db.query(
            `
      UPDATE analytics_visitors
      SET
        last_seen_at = NOW(),
        device_type = COALESCE(?, device_type),
        language = COALESCE(?, language),
        browser = COALESCE(?, browser),
        os = COALESCE(?, os),
        country = COALESCE(?, country),
        country_code = COALESCE(?, country_code),
        region = COALESCE(?, region),
        city = COALESCE(?, city)
      WHERE visitor_id = ?
      `,
            [
                deviceType,
                language,
                browser,
                os,
                geo.country,
                geo.countryCode,
                geo.region,
                geo.city,
                visitorId,
            ]
        );

        /*
         * --------------------------------------------------
         * UPDATE SESSION
         * --------------------------------------------------
         */

        await db.query(
            `
      UPDATE analytics_sessions
      SET
        last_activity_at = NOW(),
        referrer = COALESCE(?, referrer),
        utm_source = COALESCE(?, utm_source),
        utm_medium = COALESCE(?, utm_medium),
        utm_campaign = COALESCE(?, utm_campaign)
      WHERE session_id = ?
        AND visitor_id = ?
      `,
            [
                cleanString(
                    body.referrer,
                    2000
                ),
                cleanString(
                    body.utmSource,
                    255
                ),
                cleanString(
                    body.utmMedium,
                    255
                ),
                cleanString(
                    body.utmCampaign,
                    255
                ),
                sessionId,
                visitorId,
            ]
        );

        /*
         * --------------------------------------------------
         * HEARTBEAT
         * --------------------------------------------------
         *
         * Heartbeat only keeps the session alive.
         * It does NOT create an analytics event.
         */

        if (event === "heartbeat") {
            await db.query(
                `
        UPDATE analytics_sessions
        SET
          last_activity_at = NOW()
        WHERE session_id = ?
          AND visitor_id = ?
        `,
                [
                    sessionId,
                    visitorId,
                ]
            );

            return NextResponse.json({
                success: true,
            });
        }

        /*
         * --------------------------------------------------
         * GENERIC ANALYTICS EVENT
         * --------------------------------------------------
         */

        const eventData = {
            ...(body.eventData || {}),
            screenWidth:
                body.screenWidth ?? null,
            screenHeight:
                body.screenHeight ?? null,
        };

        await db.query(
            `
      INSERT INTO analytics_events (
        session_id,
        visitor_id,
        event_name,
        path,
        product_id,
        event_data
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
            [
                sessionId,
                visitorId,
                event,
                path,
                body.productId ?? null,
                JSON.stringify(eventData),
            ]
        );

        /*
         * --------------------------------------------------
         * PAGE DURATION
         * --------------------------------------------------
         */

        if (event === "page_duration") {
            await db.query(
                `
        UPDATE analytics_page_views
        SET
          duration_seconds =
            duration_seconds + ?
        WHERE session_id = ?
          AND visitor_id = ?
          AND path = ?
        ORDER BY id DESC
        LIMIT 1
        `,
                [
                    durationSeconds,
                    sessionId,
                    visitorId,
                    path,
                ]
            );

            await db.query(
                `
        UPDATE analytics_sessions
        SET
          last_activity_at = NOW(),
          duration_seconds =
            duration_seconds + ?
        WHERE session_id = ?
          AND visitor_id = ?
        `,
                [
                    durationSeconds,
                    sessionId,
                    visitorId,
                ]
            );
        }

        /*
         * --------------------------------------------------
         * PAGE VIEW
         * --------------------------------------------------
         */

        if (event === "page_view") {
            await db.query(
                `
        INSERT INTO analytics_page_views (
          session_id,
          visitor_id,
          path,
          title,
          viewed_at,
          duration_seconds
        )
        VALUES (?, ?, ?, ?, NOW(), ?)
        `,
                [
                    sessionId,
                    visitorId,
                    path,
                    cleanString(
                        body.title,
                        500
                    ),
                    durationSeconds,
                ]
            );

            /*
             * Update the current page.
             *
             * current_page = where visitor is now
             * exit_page    = most recent page
             */
            await db.query(
                `
        UPDATE analytics_sessions
        SET
          last_activity_at = NOW(),
          current_page = ?,
          exit_page = ?,
          page_views = page_views + 1,
          duration_seconds =
            duration_seconds + ?
        WHERE session_id = ?
          AND visitor_id = ?
        `,
                [
                    path,
                    path,
                    durationSeconds,
                    sessionId,
                    visitorId,
                ]
            );
        }

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error(
            "Analytics tracking error:",
            error
        );

        return NextResponse.json(
            {
                error:
                    "Analytics tracking failed.",
            },
            {
                status: 500,
            }
        );
    }
}