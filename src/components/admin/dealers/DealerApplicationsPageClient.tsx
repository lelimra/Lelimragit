"use client";

import { useEffect, useMemo, useState } from "react";

type DealerStatus =
  | "NEW"
  | "CONTACTED"
  | "IN_PROGRESS"
  | "APPROVED"
  | "REJECTED";

type DealerApplication = {
  id: number;
  inquiry_id: string;

  role: string;

  name: string;
  designation: string;

  business_name: string;
  business_type: string;

  has_gst: number | boolean;
  gst_number: string | null;
  pan_number: string | null;

  phone: string;
  whatsapp: string;
  email: string | null;

  address_line: string;
  landmark: string;

  city: string;
  district: string;
  state: string;
  pincode: string;

  godown_area: string | null;
  experience_years: string | null;
  current_brands: string | null;
  target_territory: string | null;

  expected_volume: string;
  interested_products: string;

  transport_preference: string | null;

  message: string | null;

  status: DealerStatus;

  created_at: string;
  updated_at: string;
};

type StatusFilter = "ALL" | DealerStatus;

const STATUS_OPTIONS: {
  value: StatusFilter;
  label: string;
}[] = [
  { value: "ALL", label: "All Applications" },
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

const ROLE_LABELS: Record<string, string> = {
  SUPER_STOCKIST: "Super Stockist",
  SUPERSTOCKIST: "Super Stockist",
  DISTRIBUTOR: "Distributor",
  DEALER: "Authorized Dealer",
  AUTHORIZED_DEALER: "Authorized Dealer",
  RETAILER: "Retailer",
};

function formatRole(role: string) {
  return (
    ROLE_LABELS[role.toUpperCase()] ||
    role
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

function formatDate(value: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function statusClasses(status: DealerStatus) {
  switch (status) {
    case "NEW":
      return "bg-blue-50 text-blue-700 ring-blue-600/15";

    case "CONTACTED":
      return "bg-violet-50 text-violet-700 ring-violet-600/15";

    case "IN_PROGRESS":
      return "bg-amber-50 text-amber-700 ring-amber-600/15";

    case "APPROVED":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/15";

    case "REJECTED":
      return "bg-red-50 text-red-700 ring-red-600/15";

    default:
      return "bg-slate-100 text-slate-600 ring-slate-500/10";
  }
}

function statusLabel(status: DealerStatus) {
  switch (status) {
    case "NEW":
      return "New";

    case "CONTACTED":
      return "Contacted";

    case "IN_PROGRESS":
      return "In Progress";

    case "APPROVED":
      return "Approved";

    case "REJECTED":
      return "Rejected";

    default:
      return status;
  }
}

function roleClasses(role: string) {
  const normalized = role.toUpperCase();

  if (
    normalized.includes("SUPER")
  ) {
    return "bg-purple-50 text-purple-700";
  }

  if (normalized.includes("DISTRIBUTOR")) {
    return "bg-blue-50 text-blue-700";
  }

  if (
    normalized.includes("DEALER") ||
    normalized.includes("AUTHORIZED")
  ) {
    return "bg-indigo-50 text-indigo-700";
  }

  return "bg-slate-100 text-slate-700";
}

export default function DealerApplicationsPageClient() {
  const [applications, setApplications] = useState<
    DealerApplication[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const [roleFilter, setRoleFilter] =
    useState("ALL");

  const [selectedApplication, setSelectedApplication] =
    useState<DealerApplication | null>(null);

  const [detailLoading, setDetailLoading] =
    useState(false);

  const [error, setError] = useState("");

  /*
   * IMPORTANT:
   * Your API currently requires x-admin-key.
   *
   * If your browser does not already inject this header
   * through your authentication layer, replace this with
   * your proper admin-session authentication.
   */
  const adminKey =
    typeof window !== "undefined"
      ? window.localStorage.getItem(
          "dealer_admin_key"
        )
      : null;

  async function apiFetch(
    url: string,
    options: RequestInit = {}
  ) {
    const headers = new Headers(
      options.headers
    );

    headers.set("Content-Type", "application/json");

    if (adminKey) {
      headers.set("x-admin-key", adminKey);
    }

    return fetch(url, {
      ...options,
      headers,
      cache: "no-store",
    });
  }

  async function loadApplications(
    showRefreshState = false
  ) {
    try {
      if (showRefreshState) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await apiFetch(
        "/api/dealer-applications?limit=100&offset=0"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load dealer applications."
        );
      }

      setApplications(data.data || []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load dealer applications."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  /*
   * =========================================================
   * METRICS
   * =========================================================
   */

  const stats = useMemo(() => {
    const total = applications.length;

    const newApplications = applications.filter(
      (item) => item.status === "NEW"
    ).length;

    const inProgress = applications.filter(
      (item) => item.status === "IN_PROGRESS"
    ).length;

    const approved = applications.filter(
      (item) => item.status === "APPROVED"
    ).length;

    const rejected = applications.filter(
      (item) => item.status === "REJECTED"
    ).length;

    return {
      total,
      newApplications,
      inProgress,
      approved,
      rejected,
    };
  }, [applications]);

  /*
   * =========================================================
   * ROLES
   * =========================================================
   */

  const roles = useMemo(() => {
    const uniqueRoles = Array.from(
      new Set(
        applications
          .map((item) => item.role)
          .filter(Boolean)
      )
    );

    return uniqueRoles.sort();
  }, [applications]);

  /*
   * =========================================================
   * FILTER
   * =========================================================
   */

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applications.filter((application) => {
      const searchable = [
        application.inquiry_id,
        application.name,
        application.business_name,
        application.business_type,
        application.phone,
        application.whatsapp,
        application.email,
        application.city,
        application.district,
        application.state,
        application.pincode,
        application.target_territory,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchable.includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        application.status === statusFilter;

      const matchesRole =
        roleFilter === "ALL" ||
        application.role === roleFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRole
      );
    });
  }, [
    applications,
    search,
    statusFilter,
    roleFilter,
  ]);

  /*
   * =========================================================
   * DETAIL
   * =========================================================
   */

  async function openApplication(
    application: DealerApplication
  ) {
    setSelectedApplication(application);
    setDetailLoading(true);

    try {
      const response = await apiFetch(
        `/api/dealer-applications/${encodeURIComponent(
          application.inquiry_id
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to fetch application."
        );
      }

      setSelectedApplication(data.data);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to fetch application."
      );
    } finally {
      setDetailLoading(false);
    }
  }

  function closeApplication() {
    if (detailLoading) return;

    setSelectedApplication(null);
  }

  /*
   * =========================================================
   * CLEAR FILTERS
   * =========================================================
   */

  function clearFilters() {
    setSearch("");
    setStatusFilter("ALL");
    setRoleFilter("ALL");
  }

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <>
      <main className="min-h-screen bg-transparent p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Dealer Applications
                </h1>

                <span className="inline-flex items-center rounded-full border border-slate-200/70 bg-white/50 px-2.5 py-1 text-xs font-semibold text-slate-600 backdrop-blur-sm">
                  {applications.length} Total
                </span>
              </div>

              <p className="mt-1 max-w-2xl text-sm text-slate-500">
                Review and manage trade partner applications
                from dealers, distributors, retailers and
                super stockists.
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadApplications(true)}
              disabled={refreshing}
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200/70 bg-white/50 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition hover:bg-white/80 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                className={`h-4 w-4 ${
                  refreshing ? "animate-spin" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>

              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>
          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="flex items-start justify-between gap-4 rounded-xl border border-red-200/70 bg-red-50/70 p-4 text-sm text-red-800 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 1.732 3.34z"
                  />
                </svg>

                <div>
                  <p className="font-semibold">
                    Unable to load applications
                  </p>

                  <p className="mt-0.5 text-xs text-red-700/80">
                    {error}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setError("")}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          )}

          {/* =================================================
              STAT CARDS
          ================================================= */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

            {/* Total */}

            <StatCard
              label="Total Applications"
              value={stats.total}
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2m7-10a4 4 0 100-8 4 4 0 000 8zm7-5a4 4 0 010 7m4 8v-2a4 4 0 00-3-3.87"
                  />
                </svg>
              }
            />

            {/* New */}

            <StatCard
              label="New"
              value={stats.newApplications}
              valueClass="text-blue-600"
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
                  />
                </svg>
              }
            />

            {/* In Progress */}

            <StatCard
              label="In Progress"
              value={stats.inProgress}
              valueClass="text-amber-600"
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M12 8v4l3 2m7-2a10 10 0 11-20 0 10 10 0 0120 0z"
                  />
                </svg>
              }
            />

            {/* Approved */}

            <StatCard
              label="Approved"
              value={stats.approved}
              valueClass="text-emerald-600"
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              }
            />

            {/* Rejected */}

            <StatCard
              label="Rejected"
              value={stats.rejected}
              valueClass="text-red-600"
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              }
            />
          </div>

          {/* =================================================
              FILTER BAR
          ================================================= */}

          <div className="rounded-xl border border-slate-200/70 bg-white/45 p-4 shadow-sm backdrop-blur-sm">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">

              {/* Search */}

              <div className="relative flex-1">
                <svg
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search name, company, phone, email, city or inquiry ID..."
                  className="w-full rounded-lg border border-slate-200/70 bg-white/60 py-2.5 pl-9 pr-9 text-sm text-slate-900 outline-none backdrop-blur-sm transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Status */}

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as StatusFilter
                  )
                }
                className="rounded-lg border border-slate-200/70 bg-white/60 px-3.5 py-2.5 text-sm text-slate-700 outline-none backdrop-blur-sm focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Role */}

              <select
                value={roleFilter}
                onChange={(event) =>
                  setRoleFilter(event.target.value)
                }
                className="rounded-lg border border-slate-200/70 bg-white/60 px-3.5 py-2.5 text-sm text-slate-700 outline-none backdrop-blur-sm focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
              >
                <option value="ALL">
                  All Partner Types
                </option>

                {roles.map((role) => (
                  <option
                    key={role}
                    value={role}
                  >
                    {formatRole(role)}
                  </option>
                ))}
              </select>

              {(search ||
                statusFilter !== "ALL" ||
                roleFilter !== "ALL") && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-white/60 hover:text-slate-900"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* =================================================
              RESULTS
          ================================================= */}

          <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white/50 shadow-sm backdrop-blur-sm">

            {/* Loading */}

            {loading ? (
              <LoadingState />
            ) : filteredApplications.length === 0 ? (
              <EmptyState
                hasFilters={
                  Boolean(search) ||
                  statusFilter !== "ALL" ||
                  roleFilter !== "ALL"
                }
                onClear={clearFilters}
              />
            ) : (
              <>
                {/* Desktop Table */}

                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-[1050px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-slate-200/70 bg-white/25 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="px-5 py-3.5">
                          Applicant
                        </th>

                        <th className="px-5 py-3.5">
                          Partner Type
                        </th>

                        <th className="px-5 py-3.5">
                          Location
                        </th>

                        <th className="px-5 py-3.5">
                          Contact
                        </th>

                        <th className="px-5 py-3.5">
                          Status
                        </th>

                        <th className="px-5 py-3.5">
                          Submitted
                        </th>

                        <th className="px-5 py-3.5 text-right">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200/60">
                      {filteredApplications.map(
                        (application) => (
                          <tr
                            key={application.id}
                            className="group transition hover:bg-white/35"
                          >
                            {/* Applicant */}

                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                                  {application.name
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <div className="min-w-0">
                                  <p className="truncate font-semibold text-slate-900">
                                    {application.name}
                                  </p>

                                  <p className="mt-0.5 truncate text-xs text-slate-500">
                                    {application.business_name}
                                  </p>

                                  <p className="mt-0.5 font-mono text-[10px] text-slate-400">
                                    {application.inquiry_id}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Role */}

                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${roleClasses(
                                  application.role
                                )}`}
                              >
                                {formatRole(
                                  application.role
                                )}
                              </span>

                              <p className="mt-1 text-xs text-slate-400">
                                {application.business_type}
                              </p>
                            </td>

                            {/* Location */}

                            <td className="px-5 py-4">
                              <p className="text-sm font-medium text-slate-800">
                                {application.city}
                              </p>

                              <p className="text-xs text-slate-500">
                                {application.district},{" "}
                                {application.state}
                              </p>

                              <p className="mt-0.5 text-[11px] text-slate-400">
                                {application.pincode}
                              </p>
                            </td>

                            {/* Contact */}

                            <td className="px-5 py-4">
                              <a
                                href={`tel:${application.phone}`}
                                className="block text-sm font-medium text-slate-800 hover:text-slate-950"
                              >
                                {application.phone}
                              </a>

                              {application.email && (
                                <a
                                  href={`mailto:${application.email}`}
                                  className="mt-0.5 block max-w-[180px] truncate text-xs text-slate-500 hover:text-slate-900"
                                >
                                  {application.email}
                                </a>
                              )}
                            </td>

                            {/* Status */}

                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusClasses(
                                  application.status
                                )}`}
                              >
                                {statusLabel(
                                  application.status
                                )}
                              </span>
                            </td>

                            {/* Date */}

                            <td className="px-5 py-4">
                              <span className="text-xs text-slate-500">
                                {formatDate(
                                  application.created_at
                                )}
                              </span>
                            </td>

                            {/* Action */}

                            <td className="px-5 py-4 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  openApplication(
                                    application
                                  )
                                }
                                className="rounded-lg border border-slate-200/70 bg-white/60 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-white hover:text-slate-900"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile / Tablet Cards */}

                <div className="divide-y divide-slate-200/60 lg:hidden">
                  {filteredApplications.map(
                    (application) => (
                      <div
                        key={application.id}
                        className="p-4 sm:p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
                              {application.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-900">
                                {application.name}
                              </p>

                              <p className="truncate text-xs text-slate-500">
                                {application.business_name}
                              </p>

                              <p className="mt-1 font-mono text-[10px] text-slate-400">
                                {application.inquiry_id}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${statusClasses(
                              application.status
                            )}`}
                          >
                            {statusLabel(
                              application.status
                            )}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <InfoItem
                            label="Partner Type"
                            value={formatRole(
                              application.role
                            )}
                          />

                          <InfoItem
                            label="Business Type"
                            value={
                              application.business_type
                            }
                          />

                          <InfoItem
                            label="Location"
                            value={`${application.city}, ${application.state}`}
                          />

                          <InfoItem
                            label="Expected Volume"
                            value={
                              application.expected_volume
                            }
                          />

                          <InfoItem
                            label="Phone"
                            value={application.phone}
                          />

                          <InfoItem
                            label="Submitted"
                            value={formatDate(
                              application.created_at
                            )}
                          />
                        </div>

                        <div className="mt-4 flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              openApplication(
                                application
                              )
                            }
                            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                          >
                            View Application
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Footer */}

                <div className="border-t border-slate-200/70 bg-white/20 px-5 py-3">
                  <p className="text-xs text-slate-500">
                    Showing{" "}
                    <strong className="text-slate-700">
                      {filteredApplications.length}
                    </strong>{" "}
                    of{" "}
                    <strong className="text-slate-700">
                      {applications.length}
                    </strong>{" "}
                    applications
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* =====================================================
          DETAIL DRAWER
      ===================================================== */}

      {selectedApplication && (
        <div className="fixed inset-0 z-50">

          {/* Overlay */}

          <button
            type="button"
            aria-label="Close application details"
            onClick={closeApplication}
            className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm"
          />

          {/* Drawer */}

          <aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col border-l border-slate-200 bg-white shadow-2xl">

            {/* Drawer Header */}

            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">
                    Dealer Application
                  </h2>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${statusClasses(
                      selectedApplication.status
                    )}`}
                  >
                    {statusLabel(
                      selectedApplication.status
                    )}
                  </span>
                </div>

                <p className="mt-1 font-mono text-xs text-slate-400">
                  {selectedApplication.inquiry_id}
                </p>
              </div>

              <button
                type="button"
                onClick={closeApplication}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Drawer Content */}

            <div className="flex-1 overflow-y-auto">

              {detailLoading ? (
                <div className="space-y-5 p-6">
                  {[...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className="animate-pulse"
                    >
                      <div className="mb-2 h-3 w-24 rounded bg-slate-200" />
                      <div className="h-5 w-48 rounded bg-slate-100" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6 p-5 sm:p-6">

                  {/* Applicant */}

                  <DetailSection title="Applicant">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <DetailField
                        label="Full Name"
                        value={
                          selectedApplication.name
                        }
                      />

                      <DetailField
                        label="Designation"
                        value={
                          selectedApplication.designation
                        }
                      />

                      <DetailField
                        label="Partner Role"
                        value={formatRole(
                          selectedApplication.role
                        )}
                      />

                      <DetailField
                        label="Business Type"
                        value={
                          selectedApplication.business_type
                        }
                      />
                    </div>
                  </DetailSection>

                  {/* Business */}

                  <DetailSection title="Business Information">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <DetailField
                        label="Business Name"
                        value={
                          selectedApplication.business_name
                        }
                      />

                      <DetailField
                        label="Current Brands"
                        value={
                          selectedApplication.current_brands
                        }
                      />

                      <DetailField
                        label="Business Experience"
                        value={
                          selectedApplication.experience_years
                        }
                      />

                      <DetailField
                        label="Godown / Storage Area"
                        value={
                          selectedApplication.godown_area
                        }
                      />

                      <DetailField
                        label="Target Territory"
                        value={
                          selectedApplication.target_territory
                        }
                      />

                      <DetailField
                        label="Expected Volume"
                        value={
                          selectedApplication.expected_volume
                        }
                      />

                      <DetailField
                        label="Interested Products"
                        value={
                          selectedApplication.interested_products
                        }
                      />

                      <DetailField
                        label="Transport Preference"
                        value={
                          selectedApplication.transport_preference
                        }
                      />
                    </div>
                  </DetailSection>

                  {/* Contact */}

                  <DetailSection title="Contact Information">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <DetailField
                        label="Phone"
                        value={
                          selectedApplication.phone
                        }
                        href={`tel:${selectedApplication.phone}`}
                      />

                      <DetailField
                        label="WhatsApp"
                        value={
                          selectedApplication.whatsapp
                        }
                        href={`https://wa.me/91${selectedApplication.whatsapp.replace(
                          /\D/g,
                          ""
                        )}`}
                      />

                      <DetailField
                        label="Email"
                        value={
                          selectedApplication.email
                        }
                        href={
                          selectedApplication.email
                            ? `mailto:${selectedApplication.email}`
                            : undefined
                        }
                      />
                    </div>
                  </DetailSection>

                  {/* Compliance */}

                  <DetailSection title="Business Documents">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <DetailField
                        label="GST Registered"
                        value={
                          Number(
                            selectedApplication.has_gst
                          ) === 1
                            ? "Yes"
                            : "No"
                        }
                      />

                      <DetailField
                        label="GST Number"
                        value={
                          selectedApplication.gst_number
                        }
                      />

                      <DetailField
                        label="PAN Number"
                        value={
                          selectedApplication.pan_number
                        }
                      />
                    </div>
                  </DetailSection>

                  {/* Address */}

                  <DetailSection title="Business Address">
                    <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
                      <p className="text-sm leading-6 text-slate-700">
                        {selectedApplication.address_line}
                        <br />

                        {selectedApplication.landmark && (
                          <>
                            {selectedApplication.landmark}
                            <br />
                          </>
                        )}

                        {selectedApplication.city},{" "}
                        {selectedApplication.district}
                        <br />

                        {selectedApplication.state} -{" "}
                        {selectedApplication.pincode}
                      </p>
                    </div>
                  </DetailSection>

                  {/* Message */}

                  <DetailSection title="Message / Requirements">
                    <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
                      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                        {selectedApplication.message ||
                          "No additional message provided."}
                      </p>
                    </div>
                  </DetailSection>

                  {/* Timeline */}

                  <DetailSection title="Application Timeline">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <DetailField
                        label="Submitted"
                        value={formatDateTime(
                          selectedApplication.created_at
                        )}
                      />

                      <DetailField
                        label="Last Updated"
                        value={formatDateTime(
                          selectedApplication.updated_at
                        )}
                      />
                    </div>
                  </DetailSection>

                  {/* Status Notice */}

                  <div className="rounded-xl border border-amber-200/70 bg-amber-50/50 p-4">
                    <div className="flex gap-3">
                      <svg
                        className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M13 16h-1v-4h-1m1-4h.01M12 22a10 10 0 110-20 10 10 0 010 20z"
                        />
                      </svg>

                      <div>
                        <p className="text-sm font-semibold text-amber-900">
                          Application status
                        </p>

                        <p className="mt-1 text-xs leading-5 text-amber-800/80">
                          The current API provides application
                          retrieval but does not yet expose a
                          status-update endpoint. Status controls
                          should be connected after the secure
                          update API is added.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}

            <div className="border-t border-slate-200 bg-slate-50/80 px-5 py-4 sm:px-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">

                {selectedApplication.phone && (
                  <a
                    href={`tel:${selectedApplication.phone}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a2 2 0 011.948 1.558l.498 2.49a2 2 0 01-.502 1.814L8.91 10.59a16.016 16.016 0 006.5 6.5l1.728-1.314a2 2 0 011.814-.502l2.49.498A2 2 0 0123 17.72V21a2 2 0 01-2 2h-1C10.163 23 1 13.837 1 3V2a2 2 0 012-2z"
                      />
                    </svg>

                    Call
                  </a>
                )}

                {selectedApplication.email && (
                  <a
                    href={`mailto:${selectedApplication.email}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>

                    Email
                  </a>
                )}

                <button
                  type="button"
                  onClick={closeApplication}
                  className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  icon,
  valueClass = "text-slate-900",
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200/70 bg-white/55 p-5 shadow-sm backdrop-blur-sm transition hover:border-slate-300/80">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </span>

        <div className="text-slate-500">
          {icon}
        </div>
      </div>

      <p
        className={`mt-3 text-3xl font-bold tracking-tight ${valueClass}`}
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-medium text-slate-700">
        {value || "—"}
      </p>
    </div>
  );
}

/* =========================================================
   DETAIL SECTION
========================================================= */

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
        {title}
      </h3>

      {children}
    </section>
  );
}

/* =========================================================
   DETAIL FIELD
========================================================= */

function DetailField({
  label,
  value,
  href,
}: {
  label: string;
  value: string | null | undefined;
  href?: string;
}) {
  const content = (
    <span
      className={`block text-sm font-medium ${
        href
          ? "text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-700"
          : "text-slate-800"
      }`}
    >
      {value || "—"}
    </span>
  );

  return (
    <div>
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      {href && value ? (
        <a
          href={href}
          target={
            href.startsWith("https://wa.me")
              ? "_blank"
              : undefined
          }
          rel={
            href.startsWith("https://wa.me")
              ? "noreferrer"
              : undefined
          }
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}

/* =========================================================
   LOADING
========================================================= */

function LoadingState() {
  return (
    <div className="divide-y divide-slate-200/60">
      {[...Array(7)].map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse items-center gap-4 p-5"
        >
          <div className="h-10 w-10 rounded-lg bg-slate-200/70" />

          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 rounded bg-slate-200/70" />
            <div className="h-3 w-32 rounded bg-slate-100/80" />
          </div>

          <div className="hidden h-6 w-24 rounded-full bg-slate-200/70 sm:block" />

          <div className="h-8 w-16 rounded-lg bg-slate-200/70" />
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-200/70 bg-slate-100/60">
        <svg
          className="h-6 w-6 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a3 3 0 006 0M9 5h6m-3 7h3m-3 4h3m-8-4h.01m-.01 4h.01"
          />
        </svg>
      </div>

      <h3 className="mt-4 text-base font-semibold text-slate-900">
        {hasFilters
          ? "No applications found"
          : "No dealer applications yet"}
      </h3>

      <p className="mt-1 max-w-sm text-sm text-slate-500">
        {hasFilters
          ? "Try changing your search or filters."
          : "New trade partner applications will appear here."}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 text-xs font-semibold text-slate-900 underline underline-offset-4 hover:text-slate-600"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}