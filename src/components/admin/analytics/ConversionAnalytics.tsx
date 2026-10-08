"use client";

type ConversionItem = {
  name: string;
  events: number;
  uniqueVisitors: number;
  conversionRate: number;
};

type ConversionAnalyticsProps = {
  conversions: ConversionItem[] | Record<string, Partial<ConversionItem>>;
};

function normalizeConversions(
  conversions: ConversionAnalyticsProps["conversions"]
): ConversionItem[] {
  if (Array.isArray(conversions)) {
    return conversions;
  }

  return Object.entries(conversions || {}).map(([name, value]) => ({
    name,
    events: Number(value?.events ?? 0),
    uniqueVisitors: Number(value?.uniqueVisitors ?? 0),
    conversionRate: Number(value?.conversionRate ?? 0),
  }));
}

function formatEventName(name: string) {
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function ConversionAnalytics({
  conversions,
}: ConversionAnalyticsProps) {
  const normalizedConversions = normalizeConversions(conversions);

  const conversionEvents = [
    "enquiry_submitted",
    "contact_submitted",
    "whatsapp_click",
    "catalogue_download",
  ];

  const getConversion = (name: string) =>
    normalizedConversions.find((item) => item.name === name);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Conversion Analytics
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Track important actions visitors take on your website.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {conversionEvents.map((eventName) => {
          const conversion = getConversion(eventName);

          return (
            <div
              key={eventName}
              className="rounded-xl border border-gray-200 p-5"
            >
              <p className="text-sm font-medium text-gray-500">
                {formatEventName(eventName)}
              </p>

              <div className="mt-3">
                <p className="text-2xl font-bold text-gray-900">
                  {conversion?.events ?? 0}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Total events
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Unique visitors
                </span>

                <span className="font-semibold text-gray-900">
                  {conversion?.uniqueVisitors ?? 0}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Conversion rate
                </span>

                <span className="font-semibold text-gray-900">
                  {(conversion?.conversionRate ?? 0).toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {normalizedConversions.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 font-semibold text-gray-600">
                  Event
                </th>
                <th className="px-4 py-3 font-semibold text-gray-600">
                  Events
                </th>
                <th className="px-4 py-3 font-semibold text-gray-600">
                  Unique Visitors
                </th>
                <th className="px-4 py-3 font-semibold text-gray-600">
                  Conversion Rate
                </th>
              </tr>
            </thead>

            <tbody>
              {normalizedConversions.map((conversion) => (
                <tr
                  key={conversion.name}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {formatEventName(conversion.name)}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {conversion.events}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {conversion.uniqueVisitors}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {conversion.conversionRate.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}