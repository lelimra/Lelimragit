import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        {
          authenticated: false,
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      admin: {
        id: session.adminId,
      },
    });
  } catch (error) {
    console.error(
      "Admin session check failed:",
      error
    );

    return NextResponse.json(
      {
        authenticated: false,
        message: "Unable to verify admin session.",
      },
      { status: 500 }
    );
  }
}