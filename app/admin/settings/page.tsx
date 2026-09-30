"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Building2,
  Globe2,
  Mail,
  MapPin,
  Phone,
  Save,
  Settings2,
  ShieldCheck,
  Store,
} from "lucide-react";

type Settings = {
  companyName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
  country: string;
  website: string;

  metaTitle: string;
  metaDescription: string;

  gstNumber: string;
  businessHours: string;

  maintenanceMode: boolean;
};

const defaultSettings: Settings = {
  companyName: "LIMRA INDUSTRY",
  tagline: "Premium Ceiling Fan Manufacturer",
  email: "",
  phone: "",
  whatsapp: "",
  address: "",
  city: "Hyderabad",
  state: "Telangana",
  country: "India",
  website: "https://lelimra.com",

  metaTitle: "LIMRA INDUSTRY | Premium Ceiling Fan Manufacturer",
  metaDescription:
    "LIMRA INDUSTRY manufactures premium ceiling fans with reliable performance, modern designs and energy-efficient technology.",

  gstNumber: "",
  businessHours: "Monday - Saturday, 9:00 AM - 6:00 PM",

  maintenanceMode: false,
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/settings", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to load settings.");
      }

      const data = await response.json();

      setSettings({
        ...defaultSettings,
        ...(data.settings || data || {}),
      });
    } catch (err) {
      console.error(err);
      setError("Unable to load settings.");
    } finally {
      setLoading(false);
    }
  }

  function updateField<K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setMessage("");
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(settings),
      });

      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Failed to save settings.");
      }

      setMessage("Settings saved successfully.");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save settings."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
            <Settings2 className="h-4 w-4" />
            Administration
            <span>/</span>
            Settings
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Website Settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage your company information, contact details, website SEO
            and business configuration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold ${
              settings.maintenanceMode
                ? "border-amber-200 bg-amber-50 text-amber-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                settings.maintenanceMode
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
            />

            {settings.maintenanceMode
              ? "Maintenance Mode"
              : "Website Online"}
          </div>
        </div>
      </div>

      {/* Success */}
      {message && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
          <ShieldCheck className="h-5 w-5" />
          {message}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information */}
        <SettingsCard
          icon={<Building2 className="h-5 w-5" />}
          title="Company Information"
          description="Basic information displayed across the website."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Company Name"
              value={settings.companyName}
              onChange={(value) =>
                updateField("companyName", value)
              }
              placeholder="LIMRA INDUSTRY"
            />

            <InputField
              label="Tagline"
              value={settings.tagline}
              onChange={(value) =>
                updateField("tagline", value)
              }
              placeholder="Premium Ceiling Fan Manufacturer"
            />

            <div className="md:col-span-2">
              <InputField
                label="Website"
                value={settings.website}
                onChange={(value) =>
                  updateField("website", value)
                }
                placeholder="https://lelimra.com"
              />
            </div>
          </div>
        </SettingsCard>

        {/* Contact Information */}
        <SettingsCard
          icon={<Phone className="h-5 w-5" />}
          title="Contact Information"
          description="Contact details used on the public website."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Email Address"
              type="email"
              value={settings.email}
              onChange={(value) =>
                updateField("email", value)
              }
              placeholder="info@lelimra.com"
            />

            <InputField
              label="Phone Number"
              value={settings.phone}
              onChange={(value) =>
                updateField("phone", value)
              }
              placeholder="+91 XXXXX XXXXX"
            />

            <InputField
              label="WhatsApp Number"
              value={settings.whatsapp}
              onChange={(value) =>
                updateField("whatsapp", value)
              }
              placeholder="+91 XXXXX XXXXX"
            />

            <InputField
              label="Business Hours"
              value={settings.businessHours}
              onChange={(value) =>
                updateField("businessHours", value)
              }
              placeholder="Monday - Saturday, 9:00 AM - 6:00 PM"
            />

            <div className="md:col-span-2">
              <TextareaField
                label="Address"
                value={settings.address}
                onChange={(value) =>
                  updateField("address", value)
                }
                placeholder="Enter complete company address"
              />
            </div>
          </div>
        </SettingsCard>

        {/* Location */}
        <SettingsCard
          icon={<MapPin className="h-5 w-5" />}
          title="Business Location"
          description="Location information used for contact and business pages."
        >
          <div className="grid gap-5 md:grid-cols-3">
            <InputField
              label="City"
              value={settings.city}
              onChange={(value) =>
                updateField("city", value)
              }
              placeholder="Hyderabad"
            />

            <InputField
              label="State"
              value={settings.state}
              onChange={(value) =>
                updateField("state", value)
              }
              placeholder="Telangana"
            />

            <InputField
              label="Country"
              value={settings.country}
              onChange={(value) =>
                updateField("country", value)
              }
              placeholder="India"
            />
          </div>
        </SettingsCard>

        {/* SEO */}
        <SettingsCard
          icon={<Globe2 className="h-5 w-5" />}
          title="SEO Settings"
          description="Control the default metadata used by search engines."
        >
          <div className="space-y-5">
            <InputField
              label="Meta Title"
              value={settings.metaTitle}
              onChange={(value) =>
                updateField("metaTitle", value)
              }
              placeholder="LIMRA INDUSTRY | Premium Ceiling Fan Manufacturer"
            />

            <TextareaField
              label="Meta Description"
              value={settings.metaDescription}
              onChange={(value) =>
                updateField("metaDescription", value)
              }
              placeholder="Enter your website meta description"
              rows={5}
            />

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Search Preview
              </p>

              <div className="mt-4 rounded-xl bg-white p-4 shadow-sm">
                <div className="truncate text-lg font-medium text-blue-700">
                  {settings.metaTitle || "Your website title"}
                </div>

                <div className="mt-1 text-sm text-emerald-700">
                  {settings.website || "https://lelimra.com"}
                </div>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                  {settings.metaDescription ||
                    "Your website meta description will appear here."}
                </p>
              </div>
            </div>
          </div>
        </SettingsCard>

        {/* Business */}
        <SettingsCard
          icon={<Store className="h-5 w-5" />}
          title="Business Configuration"
          description="Additional company and website configuration."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="GST Number"
              value={settings.gstNumber}
              onChange={(value) =>
                updateField("gstNumber", value)
              }
              placeholder="GSTIN"
            />

            <div className="flex items-end">
              <label className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Maintenance Mode
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Temporarily disable the public website.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.maintenanceMode}
                  onClick={() =>
                    updateField(
                      "maintenanceMode",
                      !settings.maintenanceMode
                    )
                  }
                  className={`relative h-7 w-12 rounded-full transition ${
                    settings.maintenanceMode
                      ? "bg-slate-900"
                      : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                      settings.maintenanceMode
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>
        </SettingsCard>

        {/* Save bar */}
        <div className="sticky bottom-4 z-20">
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Save your changes
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Changes will be applied to the website after saving.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />

              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

function SettingsCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
            {icon}
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900">
              {title}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
      />
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
      />
    </div>
  );
}