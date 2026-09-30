import crypto from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "limra_admin_session";

type AdminSession = {
  adminId: number;
  expiresAt: number;
};

export async function getAdminSession(): Promise<AdminSession | null> {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    return null;
  }

  const [adminIdString, expiresAtString, signature] = parts;

  const adminId = Number(adminIdString);
  const expiresAt = Number(expiresAtString);

  if (
    !Number.isInteger(adminId) ||
    !Number.isFinite(expiresAt) ||
    !signature
  ) {
    return null;
  }

  // Session expired
  if (expiresAt <= Math.floor(Date.now() / 1000)) {
    return null;
  }

  const payload = `${adminId}.${expiresAt}`;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  let receivedBuffer: Buffer;

  try {
    receivedBuffer = Buffer.from(signature, "hex");
  } catch {
    return null;
  }

  const expectedBuffer = Buffer.from(expectedSignature, "hex");

  if (
    receivedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
  ) {
    return null;
  }

  return {
    adminId,
    expiresAt,
  };
}

export async function isAdmin(): Promise<boolean> {
  const session = await getAdminSession();

  return session !== null;
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
}