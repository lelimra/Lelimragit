import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FolderTree,
  Handshake,
  Mail,
  Package,
  Settings,
  ShieldCheck,
  Store,
  Users,
  Activity,
  MessageSquare,
} from "lucide-react";
import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/admin-auth";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-w-0 space-y-6 pb-8">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Administration</span>
            <ChevronRight size={13} />
            <span className="text-slate-700">Dashboard</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
            Monitor and manage your LIMRA Industry website from one place.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm shadow-sm sm:flex">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>

            <span className="font-medium text-slate-700">
              System Operational
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================
          KPI CARDS
      ========================================================= */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStat
          title="Total Products"
          value="—"
          description="Products in catalogue"
          icon={Package}
          href="/admin/products"
          iconClass="bg-blue-50 text-blue-600"
        />

        <DashboardStat
          title="Categories"
          value="—"
          description="Product categories"
          icon={FolderTree}
          href="/admin/categories"
          iconClass="bg-violet-50 text-violet-600"
        />

        <DashboardStat
          title="Enquiries"
          value="—"
          description="Customer enquiries"
          icon={MessageSquare}
          href="/admin/enquiries"
          iconClass="bg-amber-50 text-amber-600"
        />

        <DashboardStat
          title="Dealer Applications"
          value="—"
          description="Partner applications"
          icon={Handshake}
          href="/admin/dealers"
          iconClass="bg-emerald-50 text-emerald-600"
        />
      </section>

      {/* =========================================================
          MAIN GRID
      ========================================================= */}
      <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
        {/* =====================================================
            RECENT ACTIVITY
        ===================================================== */}
        <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                Recent Activity
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Latest activity across your administration panel.
              </p>
            </div>

            <Link
              href="/admin/enquiries"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 transition hover:text-slate-950"
            >
              View enquiries
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            <ActivityRow
              icon={Package}
              iconClass="bg-blue-50 text-blue-600"
              title="Product catalogue"
              description="Manage your website products and product images."
              href="/admin/products"
              action="Open"
            />

            <ActivityRow
              icon={MessageSquare}
              iconClass="bg-amber-50 text-amber-600"
              title="Customer enquiries"
              description="Review and manage incoming product enquiries."
              href="/admin/enquiries"
              action="Review"
            />

            <ActivityRow
              icon={Handshake}
              iconClass="bg-emerald-50 text-emerald-600"
              title="Dealer applications"
              description="Review distributor, dealer and retailer applications."
              href="/admin/dealers"
              action="Review"
            />

            <ActivityRow
              icon={Mail}
              iconClass="bg-violet-50 text-violet-600"
              title="Contact messages"
              description="Manage messages received through the website."
              href="/admin/contact-messages"
              action="View"
            />
          </div>
        </div>

        {/* =====================================================
            QUICK ACTIONS
        ===================================================== */}
        <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
          <div className="border-b border-slate-100 px-5 py-5">
            <h2 className="text-base font-semibold text-slate-950">
              Quick Actions
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Common administrative tasks.
            </p>
          </div>

          <div className="space-y-2 p-3">
            <QuickAction
              href="/admin/products"
              icon={Package}
              title="Manage Products"
              description="Catalogue & images"
            />

            <QuickAction
              href="/admin/categories"
              icon={FolderTree}
              title="Manage Categories"
              description="Organize product catalogue"
            />

            <QuickAction
              href="/admin/dealers"
              icon={Handshake}
              title="Dealer Applications"
              description="Review partner requests"
            />

            <QuickAction
              href="/admin/settings"
              icon={Settings}
              title="Website Settings"
              description="Business configuration"
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          LOWER GRID
      ========================================================= */}
      <section className="grid gap-5 lg:grid-cols-3">
        {/* Catalogue */}
        <DashboardPanel
          icon={Package}
          iconClass="bg-blue-50 text-blue-600"
          title="Product Catalogue"
          description="Manage the products displayed on the public website."
          href="/admin/products"
          action="Manage products"
        >
          <div className="grid grid-cols-2 gap-3">
            <MiniMetric label="Products" value="—" />
            <MiniMetric label="Active" value="—" />
          </div>
        </DashboardPanel>

        {/* Communication */}
        <DashboardPanel
          icon={MessageSquare}
          iconClass="bg-amber-50 text-amber-600"
          title="Communication"
          description="Keep track of customer and business enquiries."
          href="/admin/enquiries"
          action="View enquiries"
        >
          <div className="grid grid-cols-2 gap-3">
            <MiniMetric label="New" value="—" />
            <MiniMetric label="Total" value="—" />
          </div>
        </DashboardPanel>

        {/* Partners */}
        <DashboardPanel
          icon={Users}
          iconClass="bg-emerald-50 text-emerald-600"
          title="Business Partners"
          description="Manage dealer and distribution applications."
          href="/admin/dealers"
          action="View applications"
        >
          <div className="grid grid-cols-2 gap-3">
            <MiniMetric label="New" value="—" />
            <MiniMetric label="Approved" value="—" />
          </div>
        </DashboardPanel>
      </section>

      {/* =========================================================
          SYSTEM STATUS
      ========================================================= */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
        <div className="border-b border-slate-100 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <Activity size={19} className="text-slate-700" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-950">
                System Overview
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Current status of your administration environment.
              </p>
            </div>
          </div>
        </div>

        <div className="grid divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          <SystemStatus
            icon={ShieldCheck}
            title="Admin Security"
            status="Protected"
            statusClass="text-emerald-600"
          />

          <SystemStatus
            icon={Package}
            title="Product Management"
            status="Available"
            statusClass="text-emerald-600"
          />

          <SystemStatus
            icon={Mail}
            title="Communication"
            status="Available"
            statusClass="text-emerald-600"
          />

          <SystemStatus
            icon={Settings}
            title="Configuration"
            status="Available"
            statusClass="text-emerald-600"
          />
        </div>
      </section>

      {/* =========================================================
          FOOTER NOTE
      ========================================================= */}
      <div className="flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          LIMRA Industry Administration
        </p>

        <div className="flex items-center gap-2">
          <CheckCircle2 size={14} className="text-emerald-500" />
          <span>All core systems available</span>
        </div>
      </div>
    </div>
  );
}

/* ===============================================================
   DASHBOARD STAT
================================================================ */

function DashboardStat({
  title,
  value,
  description,
  icon: Icon,
  href,
  iconClass,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  href: string;
  iconClass: string;
}) {
  return (
    <Link
      href={href}
      className="group min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_3px_15px_rgba(15,23,42,0.035)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_8px_25px_rgba(15,23,42,0.07)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={20} strokeWidth={1.9} />
        </div>

        <ArrowRight
          size={17}
          className="mt-1 text-slate-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-slate-500"
        />
      </div>

      <div className="mt-5">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {title}
        </p>

        <div className="mt-1 flex items-end gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-950">
            {value}
          </span>
        </div>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </Link>
  );
}

/* ===============================================================
   ACTIVITY ROW
================================================================ */

function ActivityRow({
  icon: Icon,
  iconClass,
  title,
  description,
  href,
  action,
}: {
  icon: React.ElementType;
  iconClass: string;
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-4 px-5 py-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
      >
        <Icon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">
          {title}
        </p>

        <p className="mt-0.5 truncate text-xs text-slate-500">
          {description}
        </p>
      </div>

      <Link
        href={href}
        className="shrink-0 text-xs font-semibold text-slate-600 transition hover:text-slate-950"
      >
        {action}
      </Link>
    </div>
  );
}

/* ===============================================================
   QUICK ACTION
================================================================ */

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-transparent p-3 transition hover:border-slate-200 hover:bg-slate-50"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-white group-hover:shadow-sm">
        <Icon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800">
          {title}
        </p>

        <p className="mt-0.5 truncate text-xs text-slate-500">
          {description}
        </p>
      </div>

      <ArrowRight
        size={15}
        className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-600"
      />
    </Link>
  );
}

/* ===============================================================
   DASHBOARD PANEL
================================================================ */

function DashboardPanel({
  icon: Icon,
  iconClass,
  title,
  description,
  href,
  action,
  children,
}: {
  icon: React.ElementType;
  iconClass: string;
  title: string;
  description: string;
  href: string;
  action: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_3px_15px_rgba(15,23,42,0.035)]">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={18} />
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-900">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-5">{children}</div>

      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 transition hover:text-slate-950"
      >
        {action}
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}

/* ===============================================================
   MINI METRIC
================================================================ */

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

/* ===============================================================
   SYSTEM STATUS
================================================================ */

function SystemStatus({
  icon: Icon,
  title,
  status,
  statusClass,
}: {
  icon: React.ElementType;
  title: string;
  status: string;
  statusClass: string;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50">
        <Icon size={17} className="text-slate-600" />
      </div>

      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-slate-500">
          {title}
        </p>

        <div className="mt-0.5 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

          <span className={`text-xs font-semibold ${statusClass}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}