import { NextRequest, NextResponse } from "next/server";
import { createPool, RowDataPacket } from "mysql2/promise";

export const runtime = "nodejs";

const pool = createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

function isAdmin(request: NextRequest) {
  const configuredKey = process.env.DEALER_ADMIN_KEY;

  return Boolean(
    configuredKey &&
      request.headers.get("x-admin-key") === configuredKey
  );
}

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  if (!isAdmin(request)) {
    return NextResponse.json(
      { message: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;

    const [rows] = await pool.execute<RowDataPacket[]>(
      `
        SELECT *
        FROM dealer_applications
        WHERE inquiry_id = ?
        LIMIT 1
      `,
      [decodeURIComponent(id)]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Application not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error(
      "Dealer application detail GET failed:",
      error
    );

    return NextResponse.json(
      { message: "Unable to fetch this application." },
      { status: 500 }
    );
  }
}
