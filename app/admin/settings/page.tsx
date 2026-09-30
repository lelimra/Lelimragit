"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

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
  MessageCircle,
  Power,
  Loader2,
} from "lucide-react";

type SettingKey =
  | "company_name"
  | "company_email"
  | "company_phone"
  | "company_whatsapp"
  | "company_address"
  | "company_description"
  | "website_title"
  | "website_description"
  | "maintenance_mode"
  | "whatsapp_enabled";

type Settings = Record<SettingKey, string>;

type ApiSetting = {
  id: number;
  setting_key: string;
  setting_value: string | null;
  setting_type: string;
  description: string | null;
  is_public: number;
  created_at: string;
  updated_at: string;
};

const defaultSettings: Settings = {
  company_name: "LIMRA INDUSTRY",
  company_email: "",
  company_phone: "",
  company_whatsapp: "",
  company_address: "Hyderabad, Telangana, India",
  company_description:
    "LIMRA INDUSTRY is a ceiling fan manufacturer providing reliable and efficient fan solutions.",
  website_title:
    "LIMRA INDUSTRY | Premium Ceiling Fan Manufacturer",
  website_description:
    "LIMRA INDUSTRY manufactures premium ceiling fans with reliable performance, modern designs and energy-efficient technology.",
  maintenance_mode: "0",
  whatsapp_enabled: "1",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] =
    useState<Settings>(defaultSettings);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  // =========================================================
  // LOAD SETTINGS
  // =========================================================

  async function loadSettings() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/settings",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to load settings."
        );
      }

      const loadedSettings: Settings = {
        ...defaultSettings,
      };

      /*
       * API returns:
       *
       * {
       *   success: true,
       *   settings: [...]
       * }
       */

      const rows = Array.isArray(data.settings)
        ? (data.settings as ApiSetting[])
        : [];

      rows.forEach((setting) => {
        if (
          isSettingKey(setting.setting_key)
        ) {
          loadedSettings[
            setting.setting_key
          ] =
            setting.setting_value ?? "";
        }
      });

      setSettings(loadedSettings);
    } catch (err) {
      console.error(
        "Failed to load settings:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load settings."
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // UPDATE LOCAL VALUE
  // =========================================================

  function updateField(
    key: SettingKey,
    value: string
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setMessage("");
    setError("");
  }

  // =========================================================
  // SAVE ALL SETTINGS
  // =========================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const entries = Object.entries(
        settings
      ) as [SettingKey, string][];

      for (const [key, value] of entries) {
        const response = await fetch(
          "/api/admin/settings",
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              key,
              value,
            }),
          }
        );

        if (response.status === 401) {
          window.location.href =
            "/admin/login";
          return;
        }

        const data =
          await response.json().catch(
            () => ({})
          );

        if (!response.ok) {
          throw new Error(
            data?.error ||
              `Failed to save ${key}.`
          );
        }
      }

      setMessage(
        "Settings saved successfully."
      );

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error(
        "Failed to save settings:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save settings."
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading settings...
        </div>
      </div>
    );
  }

  const maintenanceEnabled =
    settings.maintenance_mode === "1";

  const whatsappEnabled =
    settings.whatsapp_enabled === "1";

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500">
            <Settings2 className="h-4 w-4 shrink-0" />
            <span>Administration</span>
            <span>/</span>
            <span>Settings</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Website Settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage your company information,
            contact details, website SEO and
            website controls.
          </p>
        </div>

        {/* Website status */}
        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold ${
            maintenanceEnabled
              ? "border-amber-200 bg-amber-50 text-amber-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              maintenanceEnabled
                ? "bg-amber-500"
                : "bg-emerald-500"
            }`}
          />

          {maintenanceEnabled
            ? "Maintenance Mode"
            : "Website Online"}
        </div>
      </div>

      {/* =====================================================
          SUCCESS
      ===================================================== */}

      {message && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* =====================================================
          FORM
      ===================================================== */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* =================================================
            COMPANY INFORMATION
        ================================================= */}

        <SettingsCard
          icon={
            <Building2 className="h-5 w-5" />
          }
          title="Company Information"
          description="Basic company information displayed across the website."
        >
          <div className="grid min-w-0 gap-5 md:grid-cols-2">
            <InputField
              label="Company Name"
              value={settings.company_name}
              onChange={(value) =>
                updateField(
                  "company_name",
                  value
                )
              }
              placeholder="LIMRA INDUSTRY"
            />

            <InputField
              label="Company Email"
              type="email"
              value={settings.company_email}
              onChange={(value) =>
                updateField(
                  "company_email",
                  value
                )
              }
              placeholder="info@lelimra.com"
            />

            <div className="md:col-span-2">
              <TextareaField
                label="Company Description"
                value={
                  settings.company_description
                }
                onChange={(value) =>
                  updateField(
                    "company_description",
                    value
                  )
                }
                placeholder="Enter company description"
                rows={4}
              />
            </div>
          </div>
        </SettingsCard>

        {/* =================================================
            CONTACT INFORMATION
        ================================================= */}

        <SettingsCard
          icon={
            <Phone className="h-5 w-5" />
          }
          title="Contact Information"
          description="Contact details used throughout the public website."
        >
          <div className="grid min-w-0 gap-5 md:grid-cols-2">
            <InputField
              label="Phone Number"
              type="tel"
              value={settings.company_phone}
              onChange={(value) =>
                updateField(
                  "company_phone",
                  value
                )
              }
              placeholder="+91 XXXXX XXXXX"
            />

            <InputField
              label="WhatsApp Number"
              type="tel"
              value={
                settings.company_whatsapp
              }
              onChange={(value) =>
                updateField(
                  "company_whatsapp",
                  value
                )
              }
              placeholder="919876543210"
            />

            <div className="md:col-span-2">
              <TextareaField
                label="Company Address"
                value={
                  settings.company_address
                }
                onChange={(value) =>
                  updateField(
                    "company_address",
                    value
                  )
                }
                placeholder="Enter complete company address"
                rows={3}
              />
            </div>
          </div>
        </SettingsCard>

        {/* =================================================
            WEBSITE / SEO
        ================================================= */}

        <SettingsCard
          icon={
            <Globe2 className="h-5 w-5" />
          }
          title="Website & SEO"
          description="Control the default website title and search engine metadata."
        >
          <div className="space-y-5">
            <InputField
              label="Website Title"
              value={
                settings.website_title
              }
              onChange={(value) =>
                updateField(
                  "website_title",
                  value
                )
              }
              placeholder="LIMRA INDUSTRY | Premium Ceiling Fan Manufacturer"
            />

            <TextareaField
              label="Website Description"
              value={
                settings.website_description
              }
              onChange={(value) =>
                updateField(
                  "website_description",
                  value
                )
              }
              placeholder="Enter your website meta description"
              rows={4}
            />

            {/* Search preview */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-slate-400" />

                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  Search Preview
                </p>
              </div>

              <div className="mt-4 min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="break-words text-lg font-medium text-blue-700">
                  {settings.website_title ||
                    "Your website title"}
                </p>

                <p className="mt-1 break-all text-sm text-emerald-700">
                  https://lelimra.com
                </p>

                <p className="mt-2 break-words text-sm leading-6 text-slate-600">
                  {settings.website_description ||
                    "Your website meta description will appear here."}
                </p>
              </div>
            </div>
          </div>
        </SettingsCard>

        {/* =================================================
            BUSINESS CONTROLS
        ================================================= */}

        <SettingsCard
          icon={
            <Store className="h-5 w-5" />
          }
          title="Website Controls"
          description="Control important public website features."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {/* Maintenance */}
            <ToggleField
              icon={
                <Power className="h-4 w-4" />
              }
              title="Maintenance Mode"
              description="Temporarily disable access to the public website."
              enabled={maintenanceEnabled}
              onChange={(enabled) =>
                updateField(
                  "maintenance_mode",
                  enabled ? "1" : "0"
                )
              }
            />

            {/* WhatsApp */}
            <ToggleField
              icon={
                <MessageCircle className="h-4 w-4" />
              }
              title="WhatsApp Contact"
              description="Show WhatsApp contact actions across the website."
              enabled={whatsappEnabled}
              onChange={(enabled) =>
                updateField(
                  "whatsapp_enabled",
                  enabled ? "1" : "0"
                )
              }
            />
          </div>
        </SettingsCard>

        {/* =================================================
            SAVE BAR
        ================================================= */}

        <div className="sticky bottom-4 z-20">
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800">
                Save your changes
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Changes will be saved to your
                website configuration.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

/* =========================================================
   SETTINGS CARD
========================================================= */

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
    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
            {icon}
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-900">
              {title}
            </h2>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="min-w-0 p-5 sm:p-6">
        {children}
      </div>
    </section>
  );
}

/* =========================================================
   INPUT
========================================================= */

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
    <div className="min-w-0">
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="box-border block w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
      />
    </div>
  );
}

/* =========================================================
   TEXTAREA
========================================================= */

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
    <div className="min-w-0">
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        rows={rows}
        className="box-border block w-full min-w-0 resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
      />
    </div>
  );
}

/* =========================================================
   TOGGLE
========================================================= */

function ToggleField({
  icon,
  title,
  description,
  enabled,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <div
      className={`flex min-w-0 items-center justify-between gap-4 rounded-2xl border p-4 transition ${
        enabled
          ? "border-emerald-200 bg-emerald-50/60"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex min-w-0 items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            enabled
              ? "bg-white text-emerald-600 shadow-sm"
              : "bg-white text-slate-500 shadow-sm"
          }`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={title}
        onClick={() => onChange(!enabled)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          enabled
            ? "bg-emerald-600"
            : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

/* =========================================================
   SETTING KEY VALIDATION
========================================================= */

function isSettingKey(
  key: string
): key is SettingKey {
  return (
    key === "company_name" ||
    key === "company_email" ||
    key === "company_phone" ||
    key === "company_whatsapp" ||
    key === "company_address" ||
    key === "company_description" ||
    key === "website_title" ||
    key === "website_description" ||
    key === "maintenance_mode" ||
    key === "whatsapp_enabled"
  );
}