"use client";

type EventItem = {
  name: string;
  events: number;
  uniqueVisitors: number;
};

type EventActivityProps = {
  events: EventItem[];
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(
    Number.isFinite(value) ? value : 0
  );
}

function formatEventName(name: string) {
  if (!name || typeof name !== "string") {
    return "Unknown Event";
  }

  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function EventActivity({
  events,
}: EventActivityProps) {
  const safeEvents = Array.isArray(events)
    ? events.filter(Boolean)
    : [];

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Event Activity
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Important actions recorded across the website.
        </p>
      </div>

      {safeEvents.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <p className="text-sm text-gray-500">
            No event activity available.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 font-semibold text-gray-600">
                  Event
                </th>

                <th className="px-4 py-3 text-right font-semibold text-gray-600">
                  Events
                </th>

                <th className="px-4 py-3 text-right font-semibold text-gray-600">
                  Unique Visitors
                </th>
              </tr>
            </thead>

            <tbody>
              {safeEvents.map((event, index) => {
                const eventName =
                  typeof event?.name === "string" &&
                  event.name.trim()
                    ? event.name.trim()
                    : `unknown_event_${index + 1}`;

                return (
                  <tr
                    key={`${eventName}-${index}`}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {formatEventName(eventName)}
                    </td>

                    <td className="px-4 py-3 text-right text-gray-600">
                      {formatNumber(
                        Number(event?.events || 0)
                      )}
                    </td>

                    <td className="px-4 py-3 text-right text-gray-600">
                      {formatNumber(
                        Number(
                          event?.uniqueVisitors || 0
                        )
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}