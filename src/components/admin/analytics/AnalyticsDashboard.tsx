"use client";

import { useEffect, useMemo, useState } from "react";
import ConversionAnalytics from "@/components/admin/analytics/ConversionAnalytics";
import LiveVisitors from "./LiveVisitors";
import EventActivity from "@/components/admin/analytics/EventActivity";
import AnalyticsComparison from "@/components/admin/analytics/AnalyticsComparison";




type OverviewData = {
    visitors: number;
    sessions: number;
    pageViews: number;
    newVisitors: number;
    avgSessionDuration: number;
    pagesPerSession: number;
};

type TimeseriesItem = {
    date: string;
    visitors: number;
    sessions: number;
    pageViews: number;
    newVisitors: number;
};

type PageAnalytics = {
    path: string;
    views: number;
    uniqueVisitors: number;
    avgDuration: number;
};

type ProductAnalytics = {
    productId: string;
    productName?: string;
    views: number;
    uniqueVisitors: number;
};

type BreakdownItem = {
    name: string;
    visitors: number;
};

type SourceItem = {
    name: string;
    visitors: number;
};

type EventItem = {
    name: string;
    events: number;
    uniqueVisitors: number;
};

type ConversionItem = {
    name: string;
    events: number;
    uniqueVisitors: number;
    conversionRate: number;
};

type ApiResponse<T> = {
    success?: boolean;
    data?: T;
    error?: string;
};

type EventsResponse = {
    events?: unknown;
    conversions?:
    | ConversionItem[]
    | Record<string, Partial<ConversionItem>>;
};

type DashboardSectionProps = {
    title: string;
    description?: string;
    children: React.ReactNode;
};

function Section({
    title,
    description,
    children,
}: DashboardSectionProps) {
    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                    {title}
                </h2>

                {description && (
                    <p className="mt-1 text-sm text-gray-500">
                        {description}
                    </p>
                )}
            </div>

            {children}
        </section>
    );
}

function formatNumber(value: number) {
    return new Intl.NumberFormat("en-IN").format(
        Number.isFinite(value) ? value : 0
    );
}

function formatDuration(seconds: number) {
    const totalSeconds = Math.max(
        0,
        Math.floor(Number(seconds) || 0)
    );

    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    if (minutes === 0) {
        return `${remainingSeconds}s`;
    }

    return `${minutes}m ${remainingSeconds}s`;
}

function formatDate(date: string) {
    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return date;
    }

    return parsed.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
    });
}

function normalizeConversions(
    conversions:
        | ConversionItem[]
        | Record<string, Partial<ConversionItem>>
        | undefined
): ConversionItem[] {
    if (Array.isArray(conversions)) {
        return conversions
            .filter(Boolean)
            .map((item) => ({
                name:
                    typeof item?.name === "string" &&
                        item.name.trim()
                        ? item.name.trim()
                        : "unknown_conversion",
                events: Number(item?.events || 0),
                uniqueVisitors: Number(item?.uniqueVisitors || 0),
                conversionRate: Number(item?.conversionRate || 0),
            }));
    }

    return Object.entries(conversions || {}).map(
        ([name, value]) => ({
            name: name || "unknown_conversion",
            events: Number(value?.events || 0),
            uniqueVisitors: Number(
                value?.uniqueVisitors || 0
            ),
            conversionRate: Number(
                value?.conversionRate || 0
            ),
        })
    );
}

function normalizeEvents(events: unknown): EventItem[] {
    if (!Array.isArray(events)) {
        return [];
    }

    return events
        .filter(Boolean)
        .map((event: any, index) => {
            const name =
                typeof event?.name === "string"
                    ? event.name
                    : typeof event?.event_name === "string"
                        ? event.event_name
                        : typeof event?.eventName === "string"
                            ? event.eventName
                            : `unknown_event_${index + 1}`;

            const eventCount = Number(
                event?.events ??
                event?.count ??
                event?.totalEvents ??
                0
            );

            const uniqueVisitors = Number(
                event?.uniqueVisitors ??
                event?.unique_visitors ??
                event?.uniqueVisitorCount ??
                0
            );

            return {
                name:
                    typeof name === "string" && name.trim()
                        ? name.trim()
                        : `unknown_event_${index + 1}`,
                events: Number.isFinite(eventCount)
                    ? eventCount
                    : 0,
                uniqueVisitors: Number.isFinite(uniqueVisitors)
                    ? uniqueVisitors
                    : 0,
            };
        });
}

function normalizeBreakdown(
    items: unknown
): BreakdownItem[] {
    if (!Array.isArray(items)) {
        return [];
    }

    return items
        .filter(Boolean)
        .map((item: any, index) => {
            const name =
                typeof item?.name === "string"
                    ? item.name
                    : typeof item?.category === "string"
                        ? item.category
                        : typeof item?.country === "string"
                            ? item.country
                            : typeof item?.region === "string"
                                ? item.region
                                : typeof item?.city === "string"
                                    ? item.city
                                    : `Unknown ${index + 1}`;

            const visitors = Number(
                item?.visitors ??
                item?.count ??
                item?.uniqueVisitors ??
                0
            );

            return {
                name:
                    typeof name === "string" && name.trim()
                        ? name.trim()
                        : `Unknown ${index + 1}`,
                visitors: Number.isFinite(visitors)
                    ? visitors
                    : 0,
            };
        });
}

function normalizeSources(items: unknown): SourceItem[] {
    if (!Array.isArray(items)) {
        return [];
    }

    return items
        .filter(Boolean)
        .map((item: any, index) => {
            const name =
                typeof item?.name === "string"
                    ? item.name
                    : typeof item?.source === "string"
                        ? item.source
                        : typeof item?.medium === "string"
                            ? item.medium
                            : typeof item?.campaign === "string"
                                ? item.campaign
                                : `Unknown ${index + 1}`;

            const visitors = Number(
                item?.visitors ??
                item?.count ??
                item?.uniqueVisitors ??
                0
            );

            return {
                name:
                    typeof name === "string" && name.trim()
                        ? name.trim()
                        : `Unknown ${index + 1}`,
                visitors: Number.isFinite(visitors)
                    ? visitors
                    : 0,
            };
        });
}

function KpiCard({
    title,
    value,
    description,
}: {
    title: string;
    value: string | number;
    description?: string;
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
                {title}
            </p>

            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                {value}
            </p>

            {description && (
                <p className="mt-2 text-xs text-gray-500">
                    {description}
                </p>
            )}
        </div>
    );
}

function EmptyState({
    message,
}: {
    message: string;
}) {
    return (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
            <p className="text-sm text-gray-500">
                {message}
            </p>
        </div>
    );
}

function ProgressList({
    items,
    emptyMessage,
}: {
    items: { name: string; value: number }[];
    emptyMessage: string;
}) {
    const safeItems = items.filter(
        (item) =>
            item &&
            typeof item.name === "string" &&
            Number.isFinite(Number(item.value))
    );

    const maxValue = Math.max(
        ...safeItems.map((item) => item.value),
        1
    );

    if (safeItems.length === 0) {
        return <EmptyState message={emptyMessage} />;
    }

    return (
        <div className="space-y-4">
            {safeItems.map((item, index) => {
                const percentage = Math.max(
                    2,
                    Math.round((item.value / maxValue) * 100)
                );

                return (
                    <div
                        key={`${item.name}-${index}`}
                    >
                        <div className="mb-2 flex items-center justify-between gap-4">
                            <span className="truncate text-sm font-medium text-gray-700">
                                {item.name}
                            </span>

                            <span className="shrink-0 text-sm font-semibold text-gray-900">
                                {formatNumber(item.value)}
                            </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                            <div
                                className="h-full rounded-full bg-gray-900 transition-all"
                                style={{
                                    width: `${percentage}%`,
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function TrafficChart({
    data,
}: {
    data: TimeseriesItem[];
}) {
    if (data.length === 0) {
        return (
            <EmptyState message="No traffic data available." />
        );
    }

    const maxVisitors = Math.max(
        ...data.map((item) =>
            Number(item.visitors || 0)
        ),
        1
    );

    return (
        <div className="overflow-x-auto">
            <div className="min-w-[700px]">
                <div className="flex h-64 items-end gap-2 border-b border-l border-gray-200 px-4">
                    {data.map((item, index) => {
                        const visitors = Number(
                            item.visitors || 0
                        );

                        const height = Math.max(
                            3,
                            Math.round(
                                (visitors / maxVisitors) * 220
                            )
                        );

                        return (
                            <div
                                key={`${item.date}-${index}`}
                                className="flex h-full flex-1 flex-col justify-end"
                            >
                                <div className="group relative flex flex-1 items-end justify-center">
                                    <div
                                        className="w-full max-w-8 rounded-t-md bg-gray-900 transition-all hover:bg-gray-700"
                                        style={{
                                            height: `${height}px`,
                                        }}
                                        title={`${visitors} visitors`}
                                    />
                                </div>

                                <div className="mt-3 truncate text-center text-[10px] text-gray-500">
                                    {formatDate(item.date)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default function AnalyticsDashboard() {

    const [comparison, setComparison] = useState<{
        visitors: {
            current: number;
            previous: number;
        };
        sessions: {
            current: number;
            previous: number;
        };
        pageViews: {
            current: number;
            previous: number;
        };
        newVisitors: {
            current: number;
            previous: number;
        };
    } | null>(null);

    const [days, setDays] = useState(30);

    const [overview, setOverview] =
        useState<OverviewData | null>(null);

    const [timeseries, setTimeseries] =
        useState<TimeseriesItem[]>([]);

    const [pages, setPages] =
        useState<PageAnalytics[]>([]);

    const [products, setProducts] =
        useState<ProductAnalytics[]>([]);

    const [sources, setSources] =
        useState<SourceItem[]>([]);

    const [mediums, setMediums] =
        useState<SourceItem[]>([]);

    const [campaigns, setCampaigns] =
        useState<SourceItem[]>([]);

    const [devices, setDevices] =
        useState<BreakdownItem[]>([]);

    const [browsers, setBrowsers] =
        useState<BreakdownItem[]>([]);

    const [operatingSystems, setOperatingSystems] =
        useState<BreakdownItem[]>([]);

    const [countries, setCountries] =
        useState<BreakdownItem[]>([]);

    const [regions, setRegions] =
        useState<BreakdownItem[]>([]);

    const [cities, setCities] =
        useState<BreakdownItem[]>([]);

    const [events, setEvents] =
        useState<EventItem[]>([]);

    const [conversions, setConversions] =
        useState<ConversionItem[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchAnalytics() {
            try {
                setLoading(true);
                setError(null);

                const endpoints = [
                    `/api/admin/analytics/overview?days=${days}`,
                    `/api/admin/analytics/timeseries?days=${days}`,
                    `/api/admin/analytics/pages?days=${days}`,
                    `/api/admin/analytics/products?days=${days}`,
                    `/api/admin/analytics/sources?days=${days}`,
                    `/api/admin/analytics/devices?days=${days}`,
                    `/api/admin/analytics/countries?days=${days}`,
                    `/api/admin/analytics/events?days=${days}`,
                    `/api/admin/analytics/comparison?days=${days}`,

                ];

                const responses = await Promise.all(
                    endpoints.map((endpoint) =>
                        fetch(endpoint, {
                            cache: "no-store",
                        })
                    )
                );

                for (const response of responses) {
                    if (!response.ok) {
                        throw new Error(
                            `Analytics API request failed: ${response.status}`
                        );
                    }
                }

                const [
                    overviewJson,
                    timeseriesJson,
                    pagesJson,
                    productsJson,
                    sourcesJson,
                    devicesJson,
                    countriesJson,
                    eventsJson,
                ] = await Promise.all(
                    responses.map((response) =>
                        response.json()
                    )
                );

                if (cancelled) {
                    return;
                }

                setOverview(
                    overviewJson?.data || null
                );

                setTimeseries(
                    Array.isArray(timeseriesJson?.data)
                        ? timeseriesJson.data
                        : []
                );

                setPages(
                    Array.isArray(pagesJson?.data)
                        ? pagesJson.data
                        : []
                );

                setProducts(
                    Array.isArray(productsJson?.data)
                        ? productsJson.data
                        : []
                );

                const sourceData =
                    sourcesJson?.data || {};

                setSources(
                    normalizeSources(
                        sourceData.sources
                    )
                );

                setMediums(
                    normalizeSources(
                        sourceData.mediums
                    )
                );

                setCampaigns(
                    normalizeSources(
                        sourceData.campaigns
                    )
                );

                const deviceData =
                    devicesJson?.data || {};

                setDevices(
                    normalizeBreakdown(
                        deviceData.devices
                    )
                );

                setBrowsers(
                    normalizeBreakdown(
                        deviceData.browsers
                    )
                );

                setOperatingSystems(
                    normalizeBreakdown(
                        deviceData.operatingSystems ||
                        deviceData.os
                    )
                );

                const countryData =
                    countriesJson?.data || {};

                setCountries(
                    normalizeBreakdown(
                        countryData.countries
                    )
                );

                setRegions(
                    normalizeBreakdown(
                        countryData.regions
                    )
                );

                setCities(
                    normalizeBreakdown(
                        countryData.cities
                    )
                );

                const eventData: EventsResponse =
                    eventsJson?.data || {};

                setEvents(
                    normalizeEvents(
                        eventData.events
                    )
                );

                setConversions(
                    normalizeConversions(
                        eventData.conversions
                    )
                );
            } catch (fetchError) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "Analytics dashboard error:",
                    fetchError
                );

                setError(
                    fetchError instanceof Error
                        ? fetchError.message
                        : "Failed to load analytics."
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchAnalytics();

        return () => {
            cancelled = true;
        };
    }, [days]);

    const trafficTotals = useMemo(() => {
        return timeseries.reduce(
            (total, item) => ({
                visitors:
                    total.visitors +
                    Number(item.visitors || 0),

                sessions:
                    total.sessions +
                    Number(item.sessions || 0),

                pageViews:
                    total.pageViews +
                    Number(item.pageViews || 0),
            }),
            {
                visitors: 0,
                sessions: 0,
                pageViews: 0,
            }
        );
    }, [timeseries]);

    const topPages = useMemo(
        () => pages.slice(0, 10),
        [pages]
    );

    const topProducts = useMemo(
        () => products.slice(0, 10),
        [products]
    );

    const topSources = useMemo(
        () => sources.slice(0, 8),
        [sources]
    );

    const topMediums = useMemo(
        () => mediums.slice(0, 8),
        [mediums]
    );

    const topCampaigns = useMemo(
        () => campaigns.slice(0, 8),
        [campaigns]
    );

    const topDevices = useMemo(
        () => devices.slice(0, 8),
        [devices]
    );

    const topBrowsers = useMemo(
        () => browsers.slice(0, 8),
        [browsers]
    );

    const topOperatingSystems = useMemo(
        () => operatingSystems.slice(0, 8),
        [operatingSystems]
    );

    const topCountries = useMemo(
        () => countries.slice(0, 8),
        [countries]
    );

    const topRegions = useMemo(
        () => regions.slice(0, 8),
        [regions]
    );

    const topCities = useMemo(
        () => cities.slice(0, 8),
        [cities]
    );

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="h-8 w-52 animate-pulse rounded bg-gray-200" />

                        <div className="mt-2 h-4 w-72 animate-pulse rounded bg-gray-100" />
                    </div>

                    <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200" />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map(
                        (_, index) => (
                            <div
                                key={index}
                                className="h-32 animate-pulse rounded-2xl bg-gray-100"
                            />
                        )
                    )}
                </div>

                <div className="h-80 animate-pulse rounded-2xl bg-gray-100" />

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div className="h-80 animate-pulse rounded-2xl bg-gray-100" />

                    <div className="h-80 animate-pulse rounded-2xl bg-gray-100" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h2 className="text-lg font-semibold text-red-900">
                    Analytics could not be loaded
                </h2>

                <p className="mt-2 text-sm text-red-700">
                    {error}
                </p>

                <button
                    type="button"
                    onClick={() =>
                        window.location.reload()
                    }
                    className="mt-4 rounded-lg bg-red-900 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <LiveVisitors />

            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Analytics
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Monitor website traffic, visitors,
                        products and conversions.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <label
                        htmlFor="analytics-range"
                        className="text-sm font-medium text-gray-600"
                    >
                        Period
                    </label>

                    <select
                        id="analytics-range"
                        value={days}
                        onChange={(event) =>
                            setDays(
                                Number(event.target.value)
                            )
                        }
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 outline-none focus:border-gray-900"
                    >
                        <option value={7}>
                            Last 7 days
                        </option>

                        <option value={30}>
                            Last 30 days
                        </option>

                        <option value={90}>
                            Last 90 days
                        </option>
                    </select>
                </div>
            </div>

            {/* Main KPIs */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <KpiCard
                    title="Visitors"
                    value={formatNumber(
                        overview?.visitors || 0
                    )}
                    description="Unique visitors"
                />

                <KpiCard
                    title="Sessions"
                    value={formatNumber(
                        overview?.sessions || 0
                    )}
                    description="Website sessions"
                />

                <KpiCard
                    title="Page Views"
                    value={formatNumber(
                        overview?.pageViews || 0
                    )}
                    description="Total page views"
                />

                <KpiCard
                    title="New Visitors"
                    value={formatNumber(
                        overview?.newVisitors || 0
                    )}
                    description="First-time visitors"
                />
            </div>


            {comparison && (
                <AnalyticsComparison
                    visitors={comparison.visitors}
                    sessions={comparison.sessions}
                    pageViews={comparison.pageViews}
                    newVisitors={comparison.newVisitors}
                />
            )}

            {/* Engagement */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <KpiCard
                    title="Avg. Session Duration"
                    value={formatDuration(
                        overview?.avgSessionDuration || 0
                    )}
                    description="Average time per session"
                />

                <KpiCard
                    title="Pages / Session"
                    value={(
                        overview?.pagesPerSession || 0
                    ).toFixed(2)}
                    description="Average pages viewed per session"
                />
            </div>

            {/* Traffic Overview */}
            <Section
                title="Traffic Overview"
                description={`Daily visitor activity for the last ${days} days.`}
            >
                <TrafficChart data={timeseries} />
            </Section>

            {/* Pages + Products */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <Section
                    title="Top Pages"
                    description="Pages receiving the most traffic."
                >
                    {topPages.length === 0 ? (
                        <EmptyState message="No page analytics available." />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px] text-left text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="px-3 py-3 font-semibold text-gray-600">
                                            Page
                                        </th>

                                        <th className="px-3 py-3 text-right font-semibold text-gray-600">
                                            Views
                                        </th>

                                        <th className="px-3 py-3 text-right font-semibold text-gray-600">
                                            Visitors
                                        </th>

                                        <th className="px-3 py-3 text-right font-semibold text-gray-600">
                                            Avg. Time
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {topPages.map(
                                        (page, index) => {
                                            const path =
                                                typeof page?.path ===
                                                    "string"
                                                    ? page.path
                                                    : "/";

                                            return (
                                                <tr
                                                    key={`${path}-${index}`}
                                                    className="border-b border-gray-100 last:border-0"
                                                >
                                                    <td className="max-w-[300px] truncate px-3 py-3 font-medium text-gray-900">
                                                        {path}
                                                    </td>

                                                    <td className="px-3 py-3 text-right text-gray-600">
                                                        {formatNumber(
                                                            Number(
                                                                page?.views || 0
                                                            )
                                                        )}
                                                    </td>

                                                    <td className="px-3 py-3 text-right text-gray-600">
                                                        {formatNumber(
                                                            Number(
                                                                page?.uniqueVisitors ||
                                                                0
                                                            )
                                                        )}
                                                    </td>

                                                    <td className="px-3 py-3 text-right text-gray-600">
                                                        {formatDuration(
                                                            Number(
                                                                page?.avgDuration ||
                                                                0
                                                            )
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
                </Section>

                <Section
                    title="Top Products"
                    description="Products receiving the most views."
                >
                    {topProducts.length === 0 ? (
                        <EmptyState message="No product analytics available." />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[500px] text-left text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="px-3 py-3 font-semibold text-gray-600">
                                            Product
                                        </th>

                                        <th className="px-3 py-3 text-right font-semibold text-gray-600">
                                            Views
                                        </th>

                                        <th className="px-3 py-3 text-right font-semibold text-gray-600">
                                            Visitors
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {topProducts.map(
                                        (product, index) => {
                                            const productName =
                                                typeof product?.productName ===
                                                    "string" &&
                                                    product.productName.trim()
                                                    ? product.productName
                                                    : product?.productId ||
                                                    "Unknown Product";

                                            return (
                                                <tr
                                                    key={`${product?.productId || "product"}-${index}`}
                                                    className="border-b border-gray-100 last:border-0"
                                                >
                                                    <td className="max-w-[300px] truncate px-3 py-3 font-medium text-gray-900">
                                                        {productName}
                                                    </td>

                                                    <td className="px-3 py-3 text-right text-gray-600">
                                                        {formatNumber(
                                                            Number(
                                                                product?.views || 0
                                                            )
                                                        )}
                                                    </td>

                                                    <td className="px-3 py-3 text-right text-gray-600">
                                                        {formatNumber(
                                                            Number(
                                                                product?.uniqueVisitors ||
                                                                0
                                                            )
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
                </Section>
            </div>

            {/* Traffic Sources */}
            <Section
                title="Traffic Sources"
                description="Where your website visitors are coming from."
            >
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div>
                        <h3 className="mb-5 text-sm font-semibold text-gray-900">
                            Sources
                        </h3>

                        <ProgressList
                            items={topSources.map(
                                (item) => ({
                                    name:
                                        typeof item?.name ===
                                            "string"
                                            ? item.name
                                            : "Unknown",
                                    value: Number(
                                        item?.visitors || 0
                                    ),
                                })
                            )}
                            emptyMessage="No source data available."
                        />
                    </div>

                    <div>
                        <h3 className="mb-5 text-sm font-semibold text-gray-900">
                            Mediums
                        </h3>

                        <ProgressList
                            items={topMediums.map(
                                (item) => ({
                                    name:
                                        typeof item?.name ===
                                            "string"
                                            ? item.name
                                            : "Unknown",
                                    value: Number(
                                        item?.visitors || 0
                                    ),
                                })
                            )}
                            emptyMessage="No medium data available."
                        />
                    </div>

                    <div>
                        <h3 className="mb-5 text-sm font-semibold text-gray-900">
                            Campaigns
                        </h3>

                        <ProgressList
                            items={topCampaigns.map(
                                (item) => ({
                                    name:
                                        typeof item?.name ===
                                            "string"
                                            ? item.name
                                            : "Unknown",
                                    value: Number(
                                        item?.visitors || 0
                                    ),
                                })
                            )}
                            emptyMessage="No campaign data available."
                        />
                    </div>
                </div>
            </Section>

            {/* Technology */}
            <Section
                title="Technology"
                description="Devices, browsers and operating systems used by visitors."
            >
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div>
                        <h3 className="mb-5 text-sm font-semibold text-gray-900">
                            Devices
                        </h3>

                        <ProgressList
                            items={topDevices.map(
                                (item) => ({
                                    name:
                                        typeof item?.name ===
                                            "string"
                                            ? item.name
                                            : "Unknown",
                                    value: Number(
                                        item?.visitors || 0
                                    ),
                                })
                            )}
                            emptyMessage="No device data available."
                        />
                    </div>

                    <div>
                        <h3 className="mb-5 text-sm font-semibold text-gray-900">
                            Browsers
                        </h3>

                        <ProgressList
                            items={topBrowsers.map(
                                (item) => ({
                                    name:
                                        typeof item?.name ===
                                            "string"
                                            ? item.name
                                            : "Unknown",
                                    value: Number(
                                        item?.visitors || 0
                                    ),
                                })
                            )}
                            emptyMessage="No browser data available."
                        />
                    </div>

                    <div>
                        <h3 className="mb-5 text-sm font-semibold text-gray-900">
                            Operating Systems
                        </h3>

                        <ProgressList
                            items={topOperatingSystems.map(
                                (item) => ({
                                    name:
                                        typeof item?.name ===
                                            "string"
                                            ? item.name
                                            : "Unknown",
                                    value: Number(
                                        item?.visitors || 0
                                    ),
                                })
                            )}
                            emptyMessage="No operating-system data available."
                        />
                    </div>
                </div>
            </Section>

            {/* Geographic Analytics */}
            <Section
                title="Geographic Analytics"
                description="Visitor distribution by country, region and city."
            >
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div>
                        <h3 className="mb-5 text-sm font-semibold text-gray-900">
                            Countries
                        </h3>

                        <ProgressList
                            items={topCountries.map(
                                (item) => ({
                                    name:
                                        typeof item?.name ===
                                            "string"
                                            ? item.name
                                            : "Unknown",
                                    value: Number(
                                        item?.visitors || 0
                                    ),
                                })
                            )}
                            emptyMessage="No country data available."
                        />
                    </div>

                    <div>
                        <h3 className="mb-5 text-sm font-semibold text-gray-900">
                            Regions
                        </h3>

                        <ProgressList
                            items={topRegions.map(
                                (item) => ({
                                    name:
                                        typeof item?.name ===
                                            "string"
                                            ? item.name
                                            : "Unknown",
                                    value: Number(
                                        item?.visitors || 0
                                    ),
                                })
                            )}
                            emptyMessage="No region data available."
                        />
                    </div>

                    <div>
                        <h3 className="mb-5 text-sm font-semibold text-gray-900">
                            Cities
                        </h3>

                        <ProgressList
                            items={topCities.map(
                                (item) => ({
                                    name:
                                        typeof item?.name ===
                                            "string"
                                            ? item.name
                                            : "Unknown",
                                    value: Number(
                                        item?.visitors || 0
                                    ),
                                })
                            )}
                            emptyMessage="No city data available."
                        />
                    </div>
                </div>
            </Section>

            {/* Conversion Analytics */}
            <ConversionAnalytics
                conversions={conversions}
            />

            {/* Event Activity */}
            <EventActivity events={events} />

            {/* Traffic Summary */}
            <Section
                title="Traffic Summary"
                description={`Aggregated traffic activity across the selected ${days}-day period.`}
            >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-xl bg-gray-50 p-5">
                        <p className="text-sm text-gray-500">
                            Total Visitors
                        </p>

                        <p className="mt-2 text-2xl font-bold text-gray-900">
                            {formatNumber(
                                trafficTotals.visitors
                            )}
                        </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-5">
                        <p className="text-sm text-gray-500">
                            Total Sessions
                        </p>

                        <p className="mt-2 text-2xl font-bold text-gray-900">
                            {formatNumber(
                                trafficTotals.sessions
                            )}
                        </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-5">
                        <p className="text-sm text-gray-500">
                            Total Page Views
                        </p>

                        <p className="mt-2 text-2xl font-bold text-gray-900">
                            {formatNumber(
                                trafficTotals.pageViews
                            )}
                        </p>
                    </div>
                </div>
            </Section>
        </div>
    );
}