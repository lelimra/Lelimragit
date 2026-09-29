import { NextRequest, NextResponse } from "next/server";
import { createPool, RowDataPacket } from "mysql2/promise";
import { randomInt } from "crypto";

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

const cleanString = (value: unknown, maxLength: number) => {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
};

const allowedRoles = new Set([
  "Super Stockist",
  "Distributor",
  "Dealer",
  "Retailer",
]);

function roleCode(role: string) {
  switch (role) {
    case "Super Stockist":
      return "SS";
    case "Distributor":
      return "DIS";
    case "Dealer":
      return "DLR";
    default:
      return "RTL";
  }
}

function createInquiryId(role: string) {
  const date = new Date();

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `LL-${roleCode(role)}-${y}${m}${d}-${randomInt(10000, 100000)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const role = cleanString(body.role, 30);
    const hasGst = Boolean(body.hasGst);

    const data = {
      name: cleanString(body.name, 150),
      designation: cleanString(body.designation, 80),
      businessName: cleanString(body.businessName, 180),
      businessType: cleanString(body.businessType, 80),

      gstNumber: cleanString(body.gstNumber, 20).toUpperCase(),
      panNumber: cleanString(body.panNumber, 15).toUpperCase(),

      phone: cleanString(body.phone, 20),
      whatsapp: cleanString(body.whatsapp || body.phone, 20),
      email: cleanString(body.email, 180),

      addressLine: cleanString(body.addressLine, 255),
      landmark: cleanString(body.landmark, 180),
      city: cleanString(body.city, 120),
      district: cleanString(body.district, 120),
      state: cleanString(body.state, 120),
      pincode: cleanString(body.pincode, 10),

      godownArea: cleanString(body.godownArea, 100),
      experienceYears: cleanString(body.experienceYears, 50),
      currentBrands: cleanString(body.currentBrands, 255),
      targetTerritory: cleanString(body.targetTerritory, 255),

      expectedVolume: cleanString(body.expectedVolume, 80),
      interestedProducts: cleanString(body.interestedProducts, 180),
      transportPreference: cleanString(body.transportPreference, 180),
      message: cleanString(body.message, 5000),
    };

    if (!allowedRoles.has(role)) {
      return NextResponse.json(
        { message: "Invalid partnership role." },
        { status: 400 }
      );
    }

    const requiredFields: Record<string, string> = {
      name: data.name,
      designation: data.designation,
      businessName: data.businessName,
      businessType: data.businessType,
      phone: data.phone,
      whatsapp: data.whatsapp,
      addressLine: data.addressLine,
      landmark: data.landmark,
      city: data.city,
      district: data.district,
      state: data.state,
      pincode: data.pincode,
      expectedVolume: data.expectedVolume,
      interestedProducts: data.interestedProducts,
    };

    const missing = Object.entries(requiredFields).find(
      ([, value]) => !value
    );

    if (missing) {
      return NextResponse.json(
        { message: `Please provide ${missing[0]}.` },
        { status: 400 }
      );
    }

    if (
      data.phone.replace(/\D/g, "").length !== 10 ||
      data.whatsapp.replace(/\D/g, "").length !== 10
    ) {
      return NextResponse.json(
        {
          message:
            "Please enter valid 10-digit mobile and WhatsApp numbers.",
        },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(data.pincode)) {
      return NextResponse.json(
        { message: "Please enter a valid 6-digit PIN code." },
        { status: 400 }
      );
    }

    if (
      data.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
    ) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (hasGst && data.gstNumber && data.gstNumber.length !== 15) {
      return NextResponse.json(
        { message: "GST number must contain 15 characters." },
        { status: 400 }
      );
    }

    const inquiryId = createInquiryId(role);

    const [result] = await pool.execute(
      `
        INSERT INTO dealer_applications (
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
          message
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        inquiryId,
        role,
        data.name,
        data.designation,
        data.businessName,
        data.businessType,
        hasGst ? 1 : 0,
        hasGst ? data.gstNumber || null : null,
        data.panNumber || null,
        data.phone,
        data.whatsapp,
        data.email || null,
        data.addressLine,
        data.landmark,
        data.city,
        data.district,
        data.state,
        data.pincode,
        data.godownArea || null,
        data.experienceYears || null,
        data.currentBrands || null,
        data.targetTerritory || null,
        data.expectedVolume,
        data.interestedProducts,
        data.transportPreference || null,
        data.message || null,
      ]
    );

    const insertResult = result as {
      insertId: number | bigint;
    };

    return NextResponse.json(
      {
        success: true,
        inquiryId,
        id: Number(insertResult.insertId),
        message: "Dealer application submitted successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Dealer application POST failed:", error);

    return NextResponse.json(
      {
        message:
          "Unable to save your application right now. Please try again.",
      },
      { status: 500 }
    );
  }
}

function isAdmin(request: NextRequest) {
  const configuredKey = process.env.DEALER_ADMIN_KEY;

  return Boolean(
    configuredKey &&
      request.headers.get("x-admin-key") === configuredKey
  );
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json(
      { message: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);

    const requestedLimit = Number(
      searchParams.get("limit") || 50
    );

    const requestedOffset = Number(
      searchParams.get("offset") || 0
    );

    const limit = Math.min(
      Math.max(
        Number.isFinite(requestedLimit)
          ? requestedLimit
          : 50,
        1
      ),
      100
    );

    const offset =
      Number.isFinite(requestedOffset)
        ? Math.max(requestedOffset, 0)
        : 0;

    const [rows] = await pool.query<
      (RowDataPacket & Record<string, unknown>)[]
    >(
      `
        SELECT *
        FROM dealer_applications
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `,
      [limit, offset]
    );

    return NextResponse.json({
      success: true,
      data: rows,
      pagination: {
        limit,
        offset,
        count: rows.length,
      },
    });
  } catch (error) {
    console.error("Dealer application GET failed:", error);

    return NextResponse.json(
      { message: "Unable to fetch dealer applications." },
      { status: 500 }
    );
  }
}
