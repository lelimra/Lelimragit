import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const SESSION_COOKIE = "limra_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

function createSessionToken(adminId: number) {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured");
  }

  const expiresAt =
    Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;

  const payload = `${adminId}.${expiresAt}`;

  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return `${payload}.${signature}`;
}

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // -------------------------------------------------------
    // 1. Parse request body
    // -------------------------------------------------------

    let body: unknown;

    try {
      body = await request.json();
    } catch (error) {
      console.error("ADMIN LOGIN - INVALID JSON:", error);

      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON request body.",
          details:
            process.env.NODE_ENV !== "production"
              ? error instanceof Error
                ? error.message
                : String(error)
              : undefined,
        },
        { status: 400 }
      );
    }

    // -------------------------------------------------------
    // 2. Validate body
    // -------------------------------------------------------

    if (
      typeof body !== "object" ||
      body === null
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Request body must be a JSON object.",
        },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;

    const email =
      typeof data.email === "string"
        ? data.email.trim().toLowerCase()
        : "";

    const password =
      typeof data.password === "string"
        ? data.password
        : "";

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and password are required.",
        },
        { status: 400 }
      );
    }

    // -------------------------------------------------------
    // 3. Check environment configuration
    // -------------------------------------------------------

    const missingEnv: string[] = [];

    if (!process.env.ADMIN_SESSION_SECRET) {
      missingEnv.push("ADMIN_SESSION_SECRET");
    }

    if (!process.env.DB_HOST) {
      missingEnv.push("DB_HOST");
    }

    if (!process.env.DB_USER) {
      missingEnv.push("DB_USER");
    }

    if (!process.env.DB_NAME) {
      missingEnv.push("DB_NAME");
    }

    if (missingEnv.length > 0) {
      const message = `Missing environment variables: ${missingEnv.join(
        ", "
      )}`;

      console.error("ADMIN LOGIN CONFIG ERROR:", message);

      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error.",
          details: message,
        },
        { status: 500 }
      );
    }

    // -------------------------------------------------------
    // 4. Database query
    // -------------------------------------------------------

    let rows;

    try {
      [rows] = await db.query(
        `
          SELECT
            id,
            name,
            email,
            password_hash,
            role,
            is_active
          FROM admin_users
          WHERE email = ?
          LIMIT 1
        `,
        [email]
      );
    } catch (error) {
      console.error(
        "ADMIN LOGIN - DATABASE QUERY ERROR:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: "Database query failed.",
          details:
            error instanceof Error
              ? error.message
              : String(error),
        },
        { status: 500 }
      );
    }

    const admins = rows as Array<{
      id: number;
      name: string;
      email: string;
      password_hash: string;
      role: "ADMIN" | "SUPER_ADMIN";
      is_active: number;
    }>;

    const admin = admins[0];

    // -------------------------------------------------------
    // 5. Admin not found
    // -------------------------------------------------------

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    // -------------------------------------------------------
    // 6. Check active status
    // -------------------------------------------------------

    if (Number(admin.is_active) !== 1) {
      return NextResponse.json(
        {
          success: false,
          error: "This administrator account is inactive.",
        },
        { status: 403 }
      );
    }

    // -------------------------------------------------------
    // 7. Validate password hash
    // -------------------------------------------------------

    if (
      !admin.password_hash ||
      typeof admin.password_hash !== "string"
    ) {
      console.error(
        "ADMIN LOGIN - INVALID PASSWORD HASH FOR:",
        admin.email
      );

      return NextResponse.json(
        {
          success: false,
          error: "Administrator password configuration is invalid.",
          details:
            "The password_hash field is empty or invalid.",
        },
        { status: 500 }
      );
    }

    // -------------------------------------------------------
    // 8. Compare password
    // -------------------------------------------------------

    let passwordValid = false;

    try {
      passwordValid = await bcrypt.compare(
        password,
        admin.password_hash
      );
    } catch (error) {
      console.error(
        "ADMIN LOGIN - BCRYPT ERROR:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: "Password verification failed.",
          details:
            error instanceof Error
              ? error.message
              : String(error),
        },
        { status: 500 }
      );
    }

    if (!passwordValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    // -------------------------------------------------------
    // 9. Create session
    // -------------------------------------------------------

    let sessionToken: string;

    try {
      sessionToken = createSessionToken(admin.id);
    } catch (error) {
      console.error(
        "ADMIN LOGIN - SESSION TOKEN ERROR:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: "Session creation failed.",
          details:
            error instanceof Error
              ? error.message
              : String(error),
        },
        { status: 500 }
      );
    }

    // -------------------------------------------------------
    // 10. Set cookie
    // -------------------------------------------------------

    try {
      const cookieStore = await cookies();

      cookieStore.set({
        name: SESSION_COOKIE,
        value: sessionToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_TTL_SECONDS,
      });
    } catch (error) {
      console.error(
        "ADMIN LOGIN - COOKIE ERROR:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to create login session.",
          details:
            error instanceof Error
              ? error.message
              : String(error),
        },
        { status: 500 }
      );
    }

    // -------------------------------------------------------
    // 11. Success
    // -------------------------------------------------------

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    // -------------------------------------------------------
    // GLOBAL ERROR
    // -------------------------------------------------------

    console.error(
      "ADMIN LOGIN - UNHANDLED ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unhandled admin login error.",
        details:
          error instanceof Error
            ? error.message
            : String(error),
        stack:
          process.env.NODE_ENV !== "production" &&
          error instanceof Error
            ? error.stack
            : undefined,
      },
      { status: 500 }
    );
  }
}