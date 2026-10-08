"use client";

import { useEffect, useRef } from "react";
import {
  usePathname,
  useSearchParams,
} from "next/navigation";

function getDeviceType() {
  const width = window.innerWidth;

  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";

  return "desktop";
}

function getUTMParameters() {
  const params = new URLSearchParams(
    window.location.search
  );

  return {
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
  };
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const lastTrackedPath = useRef<string | null>(null);
  const activeTime = useRef(0);
  const lastActiveTime = useRef<number | null>(null);
  const isVisible = useRef(true);

  useEffect(() => {
    if (!pathname) return;

    const query = searchParams?.toString();
    const fullPath = query
      ? `${pathname}?${query}`
      : pathname;

    if (lastTrackedPath.current === fullPath) {
      return;
    }

    lastTrackedPath.current = fullPath;
    activeTime.current = 0;
    lastActiveTime.current = Date.now();
    isVisible.current = true;

    const utm = getUTMParameters();

    const track = async (
      event: string,
      durationSeconds = 0
    ) => {
      try {
        await fetch("/api/analytics/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          keepalive: true,
          body: JSON.stringify({
            event,
            path: fullPath,
            title: document.title,
            durationSeconds,
            deviceType: getDeviceType(),
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            language:
              navigator.language ||
              navigator.languages?.[0] ||
              null,
            referrer: document.referrer || null,
            utmSource: utm.utmSource,
            utmMedium: utm.utmMedium,
            utmCampaign: utm.utmCampaign,
          }),
        });
      } catch (error) {
        console.error(
          "Analytics tracking failed:",
          error
        );
      }
    };

    // Track page view
    track("page_view");

    // Keep session alive
    const sendHeartbeat = () => {
      if (!isVisible.current) return;

      fetch("/api/analytics/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        keepalive: true,
        body: JSON.stringify({
          event: "heartbeat",
          path: window.location.pathname,
        }),
      }).catch(() => {});
    };

    const heartbeatInterval = window.setInterval(
      sendHeartbeat,
      30_000
    );

    // Calculate active time
    const activeTimeInterval = window.setInterval(() => {
      if (!isVisible.current) return;

      const now = Date.now();

      if (lastActiveTime.current) {
        const elapsed =
          (now - lastActiveTime.current) / 1000;

        if (elapsed <= 15) {
          activeTime.current += elapsed;
        }
      }

      lastActiveTime.current = now;
    }, 5_000);

    // Visibility tracking
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        isVisible.current = false;

        const now = Date.now();

        if (lastActiveTime.current) {
          const elapsed =
            (now - lastActiveTime.current) / 1000;

          if (elapsed <= 15) {
            activeTime.current += elapsed;
          }
        }

        lastActiveTime.current = null;
      } else {
        isVisible.current = true;
        lastActiveTime.current = Date.now();

        sendHeartbeat();
      }
    };

    let durationSent = false;

    const sendDuration = () => {
      if (durationSent) return;

      durationSent = true;

      const duration = Math.floor(
        activeTime.current
      );

      if (duration <= 0) return;

      const payload = JSON.stringify({
        event: "page_duration",
        path: fullPath,
        title: document.title,
        durationSeconds: duration,
      });

      try {
        navigator.sendBeacon(
          "/api/analytics/track",
          new Blob([payload], {
            type: "application/json",
          })
        );
      } catch {
        fetch("/api/analytics/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          keepalive: true,
          body: payload,
        }).catch(() => {});
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    window.addEventListener(
      "pagehide",
      sendDuration
    );

    return () => {
      window.clearInterval(heartbeatInterval);
      window.clearInterval(activeTimeInterval);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      window.removeEventListener(
        "pagehide",
        sendDuration
      );

      sendDuration();
    };
  }, [pathname, searchParams]);

  return null;
}