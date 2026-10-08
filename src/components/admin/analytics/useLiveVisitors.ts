"use client";

import { useCallback, useEffect, useState } from "react";

export type LiveVisitor = {
  sessionId: string;
  visitorId: string;
  lastActivityAt: string;
  currentPage: string;
  pageViews: number;
  referrer: string | null;
  country: string | null;
  countryCode: string | null;
  region: string | null;
  city: string | null;
  deviceType: string | null;
  browser: string | null;
  os: string | null;
  language: string | null;
};

export function useLiveVisitors() {
  const [visitors, setVisitors] = useState<
    LiveVisitor[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const fetchLiveVisitors = useCallback(
    async () => {
      try {
        const response = await fetch(
          "/api/admin/analytics/live",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Live analytics request failed: ${response.status}`
          );
        }

        const json = await response.json();

        const data = Array.isArray(json?.data)
          ? json.data
          : [];

        setVisitors(data);
        setError(null);
      } catch (fetchError) {
        console.error(
          "Live visitors error:",
          fetchError
        );

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load live visitors."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchLiveVisitors();

    const interval = window.setInterval(
      fetchLiveVisitors,
      15000
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [fetchLiveVisitors]);

  return {
    visitors,
    loading,
    error,
    refresh: fetchLiveVisitors,
  };
}