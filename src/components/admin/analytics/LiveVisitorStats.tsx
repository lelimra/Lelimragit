"use client";

type LiveVisitor = {
  sessionId: string;
  visitorId: string;
  deviceType: string | null;
};

type LiveVisitorStatsProps = {
  visitors: LiveVisitor[];
};

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}

export default function LiveVisitorStats({
  visitors,
}: LiveVisitorStatsProps) {
  const safeVisitors = Array.isArray(visitors)
    ? visitors
    : [];

  const activeSessions = new Set(
    safeVisitors
      .map((visitor) => visitor?.sessionId)
      .filter(Boolean)
  ).size;

  const mobileVisitors = safeVisitors.filter(
    (visitor) =>
      visitor?.deviceType === "mobile"
  ).length;

  const desktopVisitors = safeVisitors.filter(
    (visitor) =>
      visitor?.deviceType === "desktop"
  ).length;

  const tabletVisitors = safeVisitors.filter(
    (visitor) =>
      visitor?.deviceType === "tablet"
  ).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Active Visitors"
        value={safeVisitors.length}
      />

      <StatCard
        title="Active Sessions"
        value={activeSessions}
      />

      <StatCard
        title="Mobile"
        value={mobileVisitors}
      />

      <StatCard
        title="Desktop"
        value={desktopVisitors}
      />

      <StatCard
        title="Tablet"
        value={tabletVisitors}
      />
    </div>
  );
}