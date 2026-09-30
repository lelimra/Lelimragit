import { NextRequest, NextResponse } from "next/server";
import {
  createPool,
  RowDataPacket,
  ResultSetHeader,
} from "mysql2/promise";
import { randomInt } from "crypto";
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

/* =========================================================
   HELPERS
   ========================================================= */

const cleanString = (
  value: unknown,
  maxLength: number
): string => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
};

const allowedRoles = new Set([
  "Super Stockist",
  "Distributor",
  "Dealer",
  "Retailer",
]);

function roleCode(role: string): string {
  switch (role) {
    case "Super Stockist":
      return "SS";

    case "Distributor":
      return "DIS";

    case "Dealer":
      return "DLR";

    case "Retailer":
      return "RTL";

    default:
      return "RTL";
  }
}

function createInquiryId(role: string): string {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  const randomNumber = randomInt(
    10000,
    100000
  );

  return `LL-${roleCode(
    role
  )}-${year}${month}${day}-${randomNumber}`;
}

async function requireAdmin(): Promise<boolean> {
  const session = await getAdminSession();

  return Boolean(session);
}

/* =========================================================
   POST
   PUBLIC DEALER APPLICATION
   ========================================================= */

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown>;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    const role = cleanString(
      body.role,
      30
    );

    const hasGst = Boolean(
      body.hasGst
    );

    const data = {
      name: cleanString(
        body.name,
        150
      ),

      designation: cleanString(
        body.designation,
        80
      ),

      businessName: cleanString(
        body.businessName,
        180
      ),

      businessType: cleanString(
        body.businessType,
        80
      ),

      gstNumber: cleanString(
        body.gstNumber,
        20
      ).toUpperCase(),

      panNumber: cleanString(
        body.panNumber,
        15
      ).toUpperCase(),

      phone: cleanString(
        body.phone,
        20
      ),

      whatsapp: cleanString(
        body.whatsapp ||
          body.phone,
        20
      ),

      email: cleanString(
        body.email,
        180
      ),

      addressLine: cleanString(
        body.addressLine,
        255
      ),

      landmark: cleanString(
        body.landmark,
        180
      ),

      city: cleanString(
        body.city,
        120
      ),

      district: cleanString(
        body.district,
        120
      ),

      state: cleanString(
        body.state,
        120
      ),

      pincode: cleanString(
        body.pincode,
        10
      ),

      godownArea: cleanString(
        body.godownArea,
        100
      ),

      experienceYears: cleanString(
        body.experienceYears,
        50
      ),

      currentBrands: cleanString(
        body.currentBrands,
        255
      ),

      targetTerritory: cleanString(
        body.targetTerritory,
        255
      ),

      expectedVolume: cleanString(
        body.expectedVolume,
        80
      ),

      interestedProducts: cleanString(
        body.interestedProducts,
        180
      ),

      transportPreference: cleanString(
        body.transportPreference,
        180
      ),

      message: cleanString(
        body.message,
        5000
      ),
    };

    /* ROLE */

    if (!allowedRoles.has(role)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid partnership role.",
        },
        { status: 400 }
      );
    }

    /* REQUIRED FIELDS */

    const requiredFields: Record<
      string,
      string
    > = {
      name: data.name,
      designation: data.designation,
      businessName:
        data.businessName,
      businessType:
        data.businessType,
      phone: data.phone,
      whatsapp: data.whatsapp,
      addressLine:
        data.addressLine,
      landmark: data.landmark,
      city: data.city,
      district: data.district,
      state: data.state,
      pincode: data.pincode,
      expectedVolume:
        data.expectedVolume,
      interestedProducts:
        data.interestedProducts,
    };

    const missing =
      Object.entries(
        requiredFields
      ).find(
        ([, value]) => !value
      );

    if (missing) {
      return NextResponse.json(
        {
          success: false,
          message: `Please provide ${missing[0]}.`,
        },
        { status: 400 }
      );
    }

    /* PHONE */

    const phoneDigits =
      data.phone.replace(
        /\D/g,
        ""
      );

    const whatsappDigits =
      data.whatsapp.replace(
        /\D/g,
        ""
      );

    if (
      phoneDigits.length !== 10 ||
      whatsappDigits.length !== 10
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter valid 10-digit mobile and WhatsApp numbers.",
        },
        { status: 400 }
      );
    }

    /* PINCODE */

    if (
      !/^\d{6}$/.test(
        data.pincode
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid 6-digit PIN code.",
        },
        { status: 400 }
      );
    }

    /* EMAIL */

    if (
      data.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        data.email
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    /* GST */

    if (hasGst) {
      if (!data.gstNumber) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Please provide your GST number.",
          },
          { status: 400 }
        );
      }

      if (
        !/^[0-9A-Z]{15}$/.test(
          data.gstNumber
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "GST number must contain 15 valid characters.",
          },
          { status: 400 }
        );
      }
    }

    /* PAN */

    if (
      data.panNumber &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(
        data.panNumber
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid PAN number.",
        },
        { status: 400 }
      );
    }

    /* GENERATE UNIQUE INQUIRY ID */

    let inquiryId = "";
    let attempts = 0;

    while (attempts < 5) {
      const generatedId =
        createInquiryId(role);

      const [existing] =
        await pool.execute<
          RowDataPacket[]
        >(
          `
            SELECT id
            FROM dealer_applications
            WHERE inquiry_id = ?
            LIMIT 1
          `,
          [generatedId]
        );

      if (
        existing.length === 0
      ) {
        inquiryId =
          generatedId;
        break;
      }

      attempts++;
    }

    if (!inquiryId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to generate application ID. Please try again.",
        },
        { status: 500 }
      );
    }

    /* INSERT */

    const [result] =
      await pool.execute<ResultSetHeader>(
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
          VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?, ?
          )
        `,
        [
          inquiryId,
          role,
          data.name,
          data.designation,
          data.businessName,
          data.businessType,
          hasGst ? 1 : 0,
          hasGst
            ? data.gstNumber ||
              null
            : null,
          data.panNumber ||
            null,
          phoneDigits,
          whatsappDigits,
          data.email || null,
          data.addressLine,
          data.landmark,
          data.city,
          data.district,
          data.state,
          data.pincode,
          data.godownArea ||
            null,
          data.experienceYears ||
            null,
          data.currentBrands ||
            null,
          data.targetTerritory ||
            null,
          data.expectedVolume,
          data.interestedProducts,
          data.transportPreference ||
            null,
          data.message ||
            null,
        ]
      );

    return NextResponse.json(
      {
        success: true,
        inquiryId,
        id: Number(
          result.insertId
        ),
        message:
          "Dealer application submitted successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Dealer application POST failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to save your application right now. Please try again.",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   GET
   ADMIN DEALER APPLICATION LIST
   ========================================================= */

export async function GET(
  request: NextRequest
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

    const { searchParams } =
      new URL(request.url);

    const requestedLimit =
      Number(
        searchParams.get(
          "limit"
        ) || 50
      );

    const requestedOffset =
      Number(
        searchParams.get(
          "offset"
        ) || 0
      );

    const limit = Math.min(
      Math.max(
        Number.isFinite(
          requestedLimit
        )
          ? Math.floor(
              requestedLimit
            )
          : 50,
        1
      ),
      100
    );

    const offset =
      Number.isFinite(
        requestedOffset
      )
        ? Math.max(
            Math.floor(
              requestedOffset
            ),
            0
          )
        : 0;

    const status =
      cleanString(
        searchParams.get(
          "status"
        ),
        30
      );

    const role =
      cleanString(
        searchParams.get(
          "role"
        ),
        30
      );

    const search =
      cleanString(
        searchParams.get(
          "search"
        ),
        150
      );

    const where: string[] =
      [];

    const values: (
      | string
      | number
      | null
    )[] = [];

    /* STATUS */

    if (status) {
      const allowedStatuses = [
        "NEW",
        "CONTACTED",
        "IN_PROGRESS",
        "APPROVED",
        "REJECTED",
      ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid status filter.",
          },
          { status: 400 }
        );
      }

      where.push(
        "status = ?"
      );

      values.push(status);
    }

    /* ROLE */

    if (role) {
      if (
        !allowedRoles.has(
          role
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid role filter.",
          },
          { status: 400 }
        );
      }

      where.push(
        "role = ?"
      );

      values.push(role);
    }

    /* SEARCH */

    if (search) {
      const searchValue =
        `%${search}%`;

      where.push(`
        (
          inquiry_id LIKE ?
          OR name LIKE ?
          OR business_name LIKE ?
          OR phone LIKE ?
          OR whatsapp LIKE ?
          OR email LIKE ?
          OR city LIKE ?
          OR district LIKE ?
          OR state LIKE ?
        )
      `);

      values.push(
        searchValue,
        searchValue,
        searchValue,
        searchValue,
        searchValue,
        searchValue,
        searchValue,
        searchValue,
        searchValue
      );
    }

    const whereClause =
      where.length > 0
        ? `WHERE ${where.join(
            " AND "
          )}`
        : "";

    /* TOTAL */

    const [
      countRows,
    ] = await pool.query<
      RowDataPacket[]
    >(
      `
        SELECT COUNT(*) AS total
        FROM dealer_applications
        ${whereClause}
      `,
      values
    );

    const total = Number(
      countRows[0]?.total || 0
    );

    /* DATA */

    const [
      rows,
    ] = await pool.query<
      (
        RowDataPacket &
          Record<
            string,
            unknown
          >
      )[]
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
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `,
      [
        ...values,
        limit,
        offset,
      ]
    );

    return NextResponse.json({
      success: true,
      data: rows,
      pagination: {
        limit,
        offset,
        count: rows.length,
        total,
        hasMore:
          offset +
            rows.length <
          total,
      },
    });
  } catch (error) {
    console.error(
      "Dealer application GET failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to fetch dealer applications.",
      },
      { status: 500 }
    );
  }
}