import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CountryRow = {
  country: string | null;
  country_code: string | null;
  visitors: number | string;
};

type RegionRow = {
  region: string | null;
  visitors: number | string;
};

type CityRow = {
  city: string | null;
  country: string | null;
  visitors: number | string;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const daysParam = Number(
      searchParams.get("days") || "30"
    );

    const limitParam = Number(
      searchParams.get("limit") || "10"
    );

    const days = [7, 30, 90].includes(daysParam)
      ? daysParam
      : 30;

    const limit = Math.min(
      Math.max(
        Number.isFinite(limitParam)
          ? limitParam
          : 10,
        1
      ),
      50
    );

    /*
     * Countries
     */
    const [countryRows] = await db.query(
      `
      SELECT
        COALESCE(country, 'Unknown') AS country,
        country_code,
        COUNT(*) AS visitors
      FROM analytics_visitors
      WHERE last_seen_at >= DATE_SUB(
        NOW(),
        INTERVAL ${days} DAY
      )
      GROUP BY
        COALESCE(country, 'Unknown'),
        country_code
      ORDER BY visitors DESC
      LIMIT ${limit}
      `
    );

    /*
     * Regions / States
     */
    const [regionRows] = await db.query(
      `
      SELECT
        COALESCE(region, 'Unknown') AS region,
        COUNT(*) AS visitors
      FROM analytics_visitors
      WHERE last_seen_at >= DATE_SUB(
        NOW(),
        INTERVAL ${days} DAY
      )
      GROUP BY COALESCE(region, 'Unknown')
      ORDER BY visitors DESC
      LIMIT ${limit}
      `
    );

    /*
     * Cities
     */
    const [cityRows] = await db.query(
      `
      SELECT
        COALESCE(city, 'Unknown') AS city,
        COALESCE(country, 'Unknown') AS country,
        COUNT(*) AS visitors
      FROM analytics_visitors
      WHERE last_seen_at >= DATE_SUB(
        NOW(),
        INTERVAL ${days} DAY
      )
      GROUP BY
        COALESCE(city, 'Unknown'),
        COALESCE(country, 'Unknown')
      ORDER BY visitors DESC
      LIMIT ${limit}
      `
    );

    const countries = (
      countryRows as CountryRow[]
    ).map((row) => ({
      country: row.country?.trim() || "Unknown",
      countryCode:
        row.country_code?.trim() || null,
      visitors: Number(row.visitors || 0),
    }));

    const regions = (
      regionRows as RegionRow[]
    ).map((row) => ({
      region: row.region?.trim() || "Unknown",
      visitors: Number(row.visitors || 0),
    }));

    const cities = (
      cityRows as CityRow[]
    ).map((row) => ({
      city: row.city?.trim() || "Unknown",
      country:
        row.country?.trim() || "Unknown",
      visitors: Number(row.visitors || 0),
    }));

    return NextResponse.json({
      success: true,
      range: {
        days,
      },
      data: {
        countries,
        regions,
        cities,
      },
    });
  } catch (error) {
    console.error(
      "Analytics countries error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to load geographic analytics.",
      },
      {
        status: 500,
      }
    );
  }
}