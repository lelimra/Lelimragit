import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

const allowedKeys = [
  "company_name",
  "company_email",
  "company_phone",
  "company_whatsapp",
  "company_address",
  "company_description",
  "website_title",
  "website_description",
  "maintenance_mode",
  "whatsapp_enabled",
] as const;

type SettingKey = (typeof allowedKeys)[number];

function isValidSettingKey(
  key: unknown
): key is SettingKey {
  return (
    typeof key === "string" &&
    allowedKeys.includes(key as SettingKey)
  );
}

/**
 * GET /api/admin/settings
 */
export async function GET() {
  try {
    const admin = await isAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const [rows] = await db.query(`
      SELECT
        id,
        setting_key,
        setting_value,
        setting_type,
        description,
        is_public,
        created_at,
        updated_at
      FROM settings
      ORDER BY id ASC
    `);

    return NextResponse.json({
      success: true,
      settings: rows,
    });
  } catch (error) {
    console.error("GET /api/admin/settings error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load settings.",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/settings
 */
export async function PUT(req: NextRequest) {
  try {
    const admin = await isAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON request body.",
        },
        { status: 400 }
      );
    }

    if (
      typeof body !== "object" ||
      body === null
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    const data = body as {
      key?: unknown;
      value?: unknown;
    };

    // Validate key
    if (!isValidSettingKey(data.key)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid setting key.",
        },
        { status: 400 }
      );
    }

    // Validate value
    if (
      typeof data.value !== "string" ||
      data.value.length > 5000
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Setting value must be a string with a maximum length of 5000 characters.",
        },
        { status: 400 }
      );
    }

    const value = data.value.trim();

    // Determine setting type
    let settingType:
      | "STRING"
      | "TEXT"
      | "NUMBER"
      | "BOOLEAN"
      | "JSON" = "STRING";

    if (
      data.key === "company_address" ||
      data.key === "company_description" ||
      data.key === "website_description"
    ) {
      settingType = "TEXT";
    }

    if (
      data.key === "maintenance_mode" ||
      data.key === "whatsapp_enabled"
    ) {
      if (value !== "0" && value !== "1") {
        return NextResponse.json(
          {
            success: false,
            error:
              `${data.key} must be either 0 or 1.`,
          },
          { status: 400 }
        );
      }

      settingType = "BOOLEAN";
    }

    await db.execute(
      `
        INSERT INTO settings
        (
          setting_key,
          setting_value,
          setting_type
        )
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
          setting_value = VALUES(setting_value),
          setting_type = VALUES(setting_type)
      `,
      [
        data.key,
        value,
        settingType,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Setting updated successfully.",
      key: data.key,
      value,
    });
  } catch (error) {
    console.error("PUT /api/admin/settings error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update setting.",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}