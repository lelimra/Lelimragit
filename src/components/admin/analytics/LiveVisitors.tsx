"use client";

import LiveVisitorStats from "@/components/admin/analytics/LiveVisitorStats";
import { useLiveVisitors } from "@/components/admin/analytics/useLiveVisitors";

function formatPage(path: string | null | undefined) {
  if (!path) {
    return "/";
  }

  return path;
}

function formatLastActivity(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function getLocation(visitor: {
  city: string | null;
  region: string | null;
  country: string | null;
}) {
  const parts = [
    visitor.city,
    visitor.region,
    visitor.country,
  ].filter(Boolean);

  return parts.length > 0
    ? parts.join(", ")
    : "Unknown";
}

function getDeviceLabel(
  deviceType: string | null
) {
  if (!deviceType) {
    return "Unknown";
  }

  return (
    deviceType.charAt(0).toUpperCase() +
    deviceType.slice(1)
  );
}

export default function LiveVisitors() {
  const {
    visitors,
    loading,
    error,
    refresh,
  } = useLiveVisitors();

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />

              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
            </span>

            <h2 className="text-lg font-semibold text-gray-900">
              Live Visitors
            </h2>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Visitors active within the last 5 minutes.
          </p>
        </div>

        <div className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700">
          {visitors.length} active
        </div>
      </div>

      {/* Live visitor statistics */}
      {!loading && !error && (
        <div className="mb-6">
          <LiveVisitorStats
            visitors={visitors}
          />
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-xl bg-gray-100"
              />
            )
          )}
        </div>
      ) : error ? (
        /* Error */
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-medium text-red-800">
            {error}
          </p>

          <button
            type="button"
            onClick={refresh}
            className="mt-3 rounded-lg bg-red-900 px-3 py-2 text-sm font-medium text-white hover:bg-red-800"
          >
            Retry
          </button>
        </div>
      ) : visitors.length === 0 ? (
        /* No visitors */
        <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center">
          <p className="text-sm font-medium text-gray-700">
            No active visitors right now.
          </p>

          <p className="mt-1 text-xs text-gray-500">
            New visitors will appear here automatically.
          </p>
        </div>
      ) : (
        /* Visitor table */
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-3 py-3 font-semibold text-gray-600">
                  Visitor
                </th>

                <th className="px-3 py-3 font-semibold text-gray-600">
                  Current Page
                </th>

                <th className="px-3 py-3 font-semibold text-gray-600">
                  Location
                </th>

                <th className="px-3 py-3 font-semibold text-gray-600">
                  Device
                </th>

                <th className="px-3 py-3 font-semibold text-gray-600">
                  Browser
                </th>

                <th className="px-3 py-3 text-right font-semibold text-gray-600">
                  Last Activity
                </th>
              </tr>
            </thead>

            <tbody>
              {visitors.map(
                (visitor, index) => {
                  const sessionId =
                    visitor?.sessionId ||
                    visitor?.visitorId ||
                    `visitor-${index}`;

                  const pageViews = Number(
                    visitor?.pageViews || 0
                  );

                  return (
                    <tr
                      key={sessionId}
                      className="border-b border-gray-100 last:border-0"
                    >
                      {/* Visitor */}
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

                          <div>
                            <p className="font-medium text-gray-900">
                              Visitor{" "}
                              {index + 1}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-400">
                              {pageViews}{" "}
                              {pageViews === 1
                                ? "page"
                                : "pages"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Current Page */}
                      <td className="max-w-[280px] px-3 py-4">
                        <p className="truncate font-medium text-gray-900">
                          {formatPage(
                            visitor.currentPage
                          )}
                        </p>

                        {visitor.referrer && (
                          <p className="mt-1 max-w-[250px] truncate text-xs text-gray-400">
                            From:{" "}
                            {visitor.referrer}
                          </p>
                        )}
                      </td>

                      {/* Location */}
                      <td className="px-3 py-4 text-gray-600">
                        {getLocation(visitor)}
                      </td>

                      {/* Device */}
                      <td className="px-3 py-4">
                        <p className="text-gray-700">
                          {getDeviceLabel(
                            visitor.deviceType
                          )}
                        </p>

                        {visitor.os && (
                          <p className="mt-1 text-xs text-gray-400">
                            {visitor.os}
                          </p>
                        )}
                      </td>

                      {/* Browser */}
                      <td className="px-3 py-4 text-gray-600">
                        {visitor.browser ||
                          "Unknown"}
                      </td>

                      {/* Last Activity */}
                      <td className="px-3 py-4 text-right text-gray-500">
                        {formatLastActivity(
                          visitor.lastActivityAt
                        )}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}