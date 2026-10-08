"use client";

type ComparisonData = {
  current: number;
  previous: number;
};

type AnalyticsComparisonProps = {
  visitors: ComparisonData;
  sessions: ComparisonData;
  pageViews: ComparisonData;
  newVisitors: ComparisonData;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(
    Number.isFinite(value) ? value : 0
  );
}

function getPercentageChange(
  current: number,
  previous: number
) {
  if (previous === 0) {
    if (current === 0) {
      return 0;
    }

    return 100;
  }

  return ((current - previous) / previous) * 100;
}

function ComparisonCard({
  title,
  current,
  previous,
}: {
  title: string;
  current: number;
  previous: number;
}) {
  const percentage = getPercentageChange(
    current,
    previous
  );

  const isPositive = percentage > 0;
  const isNegative = percentage < 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <div className="mt-2 flex items-end justify-between gap-4">
        <p className="text-2xl font-bold text-gray-900">
          {formatNumber(current)}
        </p>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            isPositive
              ? "bg-green-100 text-green-700"
              : isNegative
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {percentage > 0 ? "+" : ""}
          {percentage.toFixed(1)}%
        </span>
      </div>

      <p className="mt-2 text-xs text-gray-500">
        Previous period: {formatNumber(previous)}
      </p>
    </div>
  );
}

export default function AnalyticsComparison({
  visitors,
  sessions,
  pageViews,
  newVisitors,
}: AnalyticsComparisonProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Period Comparison
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Compare the selected period with the previous equivalent period.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ComparisonCard
          title="Visitors"
          current={visitors.current}
          previous={visitors.previous}
        />

        <ComparisonCard
          title="Sessions"
          current={sessions.current}
          previous={sessions.previous}
        />

        <ComparisonCard
          title="Page Views"
          current={pageViews.current}
          previous={pageViews.previous}
        />

        <ComparisonCard
          title="New Visitors"
          current={newVisitors.current}
          previous={newVisitors.previous}
        />
      </div>
    </section>
  );
}