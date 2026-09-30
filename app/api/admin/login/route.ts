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

  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;

  const payload = `${adminId}.${expiresAt}`;

  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return `${payload}.${signature}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password are required.",
        },
        { status: 400 },
      );
    }

    // Find administrator by email.
    const [rows] = await db.query(
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
      [email],
    );

    const admins = rows as Array<{
      id: number;
      name: string;
      email: string;
      password_hash: string;
      role: "ADMIN" | "SUPER_ADMIN";
      is_active: number;
    }>;

    const admin = admins[0];

    // Use the same response for unknown users and invalid passwords.
    if (!admin) {
      return NextResponse.json(
        {
          error: "Invalid email or password.",
        },
        { status: 401 },
      );
    }

    // Check whether the account is active.
    if (Number(admin.is_active) !== 1) {
      return NextResponse.json(
        {
          error: "This administrator account is inactive.",
        },
        { status: 403 },
      );
    }

    // Compare submitted password with bcrypt hash.
    const passwordValid = await bcrypt.compare(
      password,
      admin.password_hash,
    );

    if (!passwordValid) {
      return NextResponse.json(
        {
          error: "Invalid email or password.",
        },
        { status: 401 },
      );
    }

    // Create signed session token.
    const sessionToken = createSessionToken(admin.id);

    // Store session in secure HttpOnly cookie.
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

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      {
        error: "Unable to sign in. Please try again.",
      },
      { status: 500 },
    );
  }
}