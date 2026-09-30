"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password) {
      setNotice("Please enter your email address and password.");
      return;
    }

    setLoading(true);
    setNotice("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Invalid email or password.");
      }

      setPassword("");

      router.replace("/admin");
      router.refresh();
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left: Brand / Enterprise Panel */}
        <section className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-red-950" />

          <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-red-600/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            {/* Logo */}
            <div>
              <div className="inline-flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-black text-red-600 shadow-lg">
                  L
                </div>

                <div>
                  <p className="text-lg font-bold tracking-wide text-white">
                    LE LIMRA
                  </p>

                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                    Industry
                  </p>
                </div>
              </div>
            </div>

            {/* Main message */}
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-red-400" />
                Secure Administration Portal
              </div>

              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                Manage your business
                <span className="block text-red-500">
                  from one place.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
                Access the LE LIMRA administration portal to manage products,
                catalogue content, images, business settings and publishing
                controls.
              </p>

              <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
                <div className="border-l border-white/10 pl-4">
                  <p className="text-sm font-semibold text-white">
                    Products
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Catalogue management
                  </p>
                </div>

                <div className="border-l border-white/10 pl-4">
                  <p className="text-sm font-semibold text-white">
                    Media
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Product images
                  </p>
                </div>

                <div className="border-l border-white/10 pl-4">
                  <p className="text-sm font-semibold text-white">
                    Settings
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Business controls
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <p className="text-xs text-slate-600">
              © {new Date().getFullYear()} LE LIMRA. Authorized personnel only.
            </p>
          </div>
        </section>

        {/* Right: Login */}
        <section className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12 sm:px-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-10 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-lg font-black text-white">
                  L
                </div>

                <div>
                  <p className="font-bold tracking-wide text-slate-900">
                    LE LIMRA
                  </p>

                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    Industry
                  </p>
                </div>
              </div>
            </div>

            {/* Heading */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-red-600">
                Administration
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                Welcome back
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Sign in to access the LE LIMRA administration portal.
              </p>
            </div>

            {/* Login Card */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <form onSubmit={login} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="admin-email"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />

                    <input
                      id="admin-email"
                      type="email"
                      autoComplete="username"
                      inputMode="email"
                      placeholder="admin@lelimra.com"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setNotice("");
                      }}
                      disabled={loading}
                      required
                      className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 disabled:bg-slate-100"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="admin-password"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />

                    <input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setNotice("");
                      }}
                      disabled={loading}
                      required
                      className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 disabled:bg-slate-100"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      disabled={loading}
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4.5 w-4.5" />
                      ) : (
                        <Eye className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {notice && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {notice}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !email.trim() || !password}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in to Admin
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Security notice */}
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-white/70 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

              <div>
                <p className="text-xs font-semibold text-slate-800">
                  Authorized access only
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  This administration area is restricted to authorized
                  LE LIMRA personnel.
                </p>
              </div>
            </div>

            <p className="mt-8 text-center text-xs text-slate-400">
              LE LIMRA Administration Portal
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}