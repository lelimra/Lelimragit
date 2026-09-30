import { NextRequest, NextResponse } from "next/server";
import {
  createPool,
  RowDataPacket,
  ResultSetHeader,
} from "mysql2/promise";
import { getAdminSession } from "@/lib/admin-auth";

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

const ALLOWED_STATUSES = [
  "NEW",
  "CONTACTED",
  "IN_PROGRESS",
  "APPROVED",
  "REJECTED",
] as const;

type DealerStatus =
  (typeof ALLOWED_STATUSES)[number];

async function requireAdmin(): Promise<boolean> {
  const session =
    await getAdminSession();

  return Boolean(session);
}

function getApplicationId(
  id: string
): string {
  return decodeURIComponent(
    id
  ).trim();
}

function isValidStatus(
  value: unknown
): value is DealerStatus {
  return (
    typeof value ===
      "string" &&
    ALLOWED_STATUSES.includes(
      value as DealerStatus
    )
  );
}

/* =========================================================
   GET SINGLE APPLICATION
   ========================================================= */

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const authorized =
      await requireAdmin();

    if (!authorized) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const { id } =
      await params;

    const inquiryId =
      getApplicationId(id);

    if (!inquiryId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Application ID is required.",
        },
        { status: 400 }
      );
    }

    const [
      rows,
    ] = await pool.execute<
      RowDataPacket[]
    >(
      `
        SELECT
          id,
          inquiry_id,
          role,
          name,
          designation,
          business_name,
          business_type,
          has_gst,
          gst_number,
          pan_number,
          phone,
          whatsapp,
          email,
          address_line,
          landmark,
          city,
          district,
          state,
          pincode,
          godown_area,
          experience_years,
          current_brands,
          target_territory,
          expected_volume,
          interested_products,
          transport_preference,
          message,
          status,
          created_at,
          updated_at
        FROM dealer_applications
        WHERE inquiry_id = ?
        LIMIT 1
      `,
      [inquiryId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Dealer application not found.",
        },
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
      {
        success: false,
        message:
          "Unable to fetch this application.",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   PUT
   UPDATE APPLICATION
   ========================================================= */

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const authorized =
      await requireAdmin();

    if (!authorized) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const { id } =
      await params;

    const inquiryId =
      getApplicationId(id);

    if (!inquiryId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Application ID is required.",
        },
        { status: 400 }
      );
    }

    let body: Record<
      string,
      unknown
    >;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid JSON request body.",
        },
        { status: 400 }
      );
    }

    const status =
      body.status;

    if (
      status !== undefined &&
      !isValidStatus(status)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(
              ", "
            )}.`,
        },
        { status: 400 }
      );
    }

    if (
      status === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No valid fields were provided for update.",
        },
        { status: 400 }
      );
    }

    /* CHECK EXISTS */

    const [
      existingRows,
    ] = await pool.execute<
      RowDataPacket[]
    >(
      `
        SELECT id
        FROM dealer_applications
        WHERE inquiry_id = ?
        LIMIT 1
      `,
      [inquiryId]
    );

    if (
      existingRows.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Dealer application not found.",
        },
        { status: 404 }
      );
    }

    /* UPDATE */

    const [
      result,
    ] = await pool.execute<ResultSetHeader>(
      `
        UPDATE dealer_applications
        SET
          status = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE inquiry_id = ?
      `,
      [
        status,
        inquiryId,
      ]
    );

    if (
      result.affectedRows === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No changes were made.",
        },
        { status: 400 }
      );
    }

    /* RETURN UPDATED RECORD */

    const [
      updatedRows,
    ] = await pool.execute<
      RowDataPacket[]
    >(
      `
        SELECT
          id,
          inquiry_id,
          role,
          name,
          designation,
          business_name,
          business_type,
          has_gst,
          gst_number,
          pan_number,
          phone,
          whatsapp,
          email,
          address_line,
          landmark,
          city,
          district,
          state,
          pincode,
          godown_area,
          experience_years,
          current_brands,
          target_territory,
          expected_volume,
          interested_products,
          transport_preference,
          message,
          status,
          created_at,
          updated_at
        FROM dealer_applications
        WHERE inquiry_id = ?
        LIMIT 1
      `,
      [inquiryId]
    );

    return NextResponse.json({
      success: true,
      message:
        "Dealer application updated successfully.",
      data: updatedRows[0],
    });
  } catch (error) {
    console.error(
      "Dealer application PUT failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to update this application.",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   PATCH
   PARTIAL STATUS UPDATE
   ========================================================= */

export async function PATCH(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  return PUT(request, {
    params,
  });
}

/* =========================================================
   DELETE
   ========================================================= */

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const authorized =
      await requireAdmin();

    if (!authorized) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const { id } =
      await params;

    const inquiryId =
      getApplicationId(id);

    if (!inquiryId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Application ID is required.",
        },
        { status: 400 }
      );
    }

    /* CHECK EXISTS */

    const [
      existingRows,
    ] = await pool.execute<
      RowDataPacket[]
    >(
      `
        SELECT
          id,
          inquiry_id,
          name,
          business_name
        FROM dealer_applications
        WHERE inquiry_id = ?
        LIMIT 1
      `,
      [inquiryId]
    );

    if (
      existingRows.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Dealer application not found.",
        },
        { status: 404 }
      );
    }

    /* DELETE */

    const [
      result,
    ] = await pool.execute<ResultSetHeader>(
      `
        DELETE FROM dealer_applications
        WHERE inquiry_id = ?
      `,
      [inquiryId]
    );

    if (
      result.affectedRows === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Application could not be deleted.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Dealer application deleted successfully.",
      data: {
        inquiry_id:
          inquiryId,
      },
    });
  } catch (error) {
    console.error(
      "Dealer application DELETE failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to delete this application.",
      },
      { status: 500 }
    );
  }
}