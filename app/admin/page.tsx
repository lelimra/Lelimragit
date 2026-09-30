import Link from "next/link";
import {
  Package,
  Settings,
  ArrowRight,
} from "lucide-react";
import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/admin-auth";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

  // Protect dashboard
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your LIMRA Industry website.
        </p>
      </div>

      {/* Management Cards */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Products */}
        <Link
          href="/admin/products"
          className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-slate-300 hover:shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
              <Package
                size={22}
                className="text-slate-700"
              />
            </div>

            <ArrowRight
              size={20}
              className="text-slate-400 transition-transform group-hover:translate-x-1"
            />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-slate-900">
            Products
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Add, edit, delete and manage products displayed
            on the website.
          </p>
        </Link>

        {/* Settings */}
        <Link
          href="/admin/settings"
          className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-slate-300 hover:shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
              <Settings
                size={22}
                className="text-slate-700"
              />
            </div>

            <ArrowRight
              size={20}
              className="text-slate-400 transition-transform group-hover:translate-x-1"
            />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-slate-900">
            Settings
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Manage website contact information, WhatsApp,
            email and other business settings.
          </p>
        </Link>
      </div>
    </div>
  );
}