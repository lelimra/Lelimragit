import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const VISITOR_COOKIE = "limra_visitor_id";
const SESSION_COOKIE = "limra_session_id";

const SESSION_TIMEOUT_MINUTES = 30;

export type AnalyticsIdentity = {
  visitorId: string;
  sessionId: string;
  isNewVisitor: boolean;
  isNewSession: boolean;
};

function getExpiryDate(minutes: number) {
  const date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  return date;
}

export async function getAnalyticsIdentity(): Promise<AnalyticsIdentity> {
  const cookieStore = await cookies();

  let visitorId = cookieStore.get(VISITOR_COOKIE)?.value;
  let sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  let isNewVisitor = false;
  let isNewSession = false;

  if (!visitorId) {
    visitorId = randomUUID();
    isNewVisitor = true;

    await db.query(
      `
      INSERT INTO analytics_visitors (
        visitor_id,
        first_seen_at,
        last_seen_at
      )
      VALUES (?, NOW(), NOW())
      `,
      [visitorId]
    );

    cookieStore.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: getExpiryDate(60 * 24 * 365 * 2),
    });
  } else {
    await db.query(
      `
      UPDATE analytics_visitors
      SET last_seen_at = NOW()
      WHERE visitor_id = ?
      `,
      [visitorId]
    );
  }

  if (!sessionId) {
    sessionId = randomUUID();
    isNewSession = true;
  } else {
    const [rows] = await db.query(
      `
      SELECT
        session_id,
        last_activity_at
      FROM analytics_sessions
      WHERE session_id = ?
      LIMIT 1
      `,
      [sessionId]
    );

    const sessions = rows as Array<{
      session_id: string;
      last_activity_at: Date | string;
    }>;

    if (sessions.length === 0) {
      sessionId = randomUUID();
      isNewSession = true;
    } else {
      const lastActivity = new Date(sessions[0].last_activity_at);
      const now = Date.now();

      const inactiveMinutes =
        (now - lastActivity.getTime()) / (1000 * 60);

      if (inactiveMinutes >= SESSION_TIMEOUT_MINUTES) {
        sessionId = randomUUID();
        isNewSession = true;
      }
    }
  }

  if (isNewSession) {
    await db.query(
      `
      INSERT INTO analytics_sessions (
        session_id,
        visitor_id,
        started_at,
        last_activity_at,
        page_views,
        duration_seconds
      )
      VALUES (?, ?, NOW(), NOW(), 0, 0)
      `,
      [sessionId, visitorId]
    );
  } else {
    await db.query(
      `
      UPDATE analytics_sessions
      SET last_activity_at = NOW()
      WHERE session_id = ?
      `,
      [sessionId]
    );
  }

  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TIMEOUT_MINUTES * 60,
  });

  return {
    visitorId,
    sessionId,
    isNewVisitor,
    isNewSession,
  };
}