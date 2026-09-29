"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
  ShieldCheck,
  Headphones,
} from "lucide-react";

const enquiryTypes = [
  "productEnquiry",
  "catalogueRequest",
  "dealerDistributorEnquiry",
  "businessPartnership",
  "generalEnquiry",
] as const;

const products = [
  "auro",
  "highBreeze",
  "avencer",
  "enticer",
  "jazz",
  "fantasy",
  "v130",
  "notSureGeneral",
] as const;

export default function ContactPage() {
  const t = useTranslations("Contact");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    // Simulate network submission delay for high-end UX feedback
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  }

  return (
    <main className="min-h-screen bg-slate-50/50 selection:bg-blue-600 selection:text-white">
      {/* =========================================================
          HERO SECTION
      ========================================================= */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-[#07192f] text-white py-20 lg:py-28">
        {/* Subtle Background Pattern */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">

            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-400 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{t("hero.badge")}</span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl">
                {t("hero.title")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">{t("hero.titleHighlight")}</span>
              </h1>

              <p className="max-w-2xl text-base text-slate-300 sm:text-lg leading-relaxed font-normal">
                {t("hero.description")}
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative">
                <div className="absolute -top-3 -right-3 rounded-xl bg-cyan-500 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-950 shadow-md">
                  ISO 9001:2015
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{t("hero.quickAssistance.title")}</h3>
                <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                  {t("hero.quickAssistance.description")}
                </p>
                <div className="space-y-3.5 text-xs font-semibold">
                  <div className="flex items-center gap-3 text-slate-200">
                    <div className="rounded-lg bg-blue-500/20 p-2 text-cyan-400">
                      <Headphones className="h-4 w-4" />
                    </div>
                    <span>{t("hero.quickAssistance.supportTeam")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-200">
                    <div className="rounded-lg bg-blue-500/20 p-2 text-cyan-400">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <span>{t("hero.quickAssistance.manufacturerResponse")}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          CONTACT INFO & INTERACTIVE FORM SECTION
      ========================================================= */}
      <section className="py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 items-start">

            {/* ===================================================
                CONTACT CARDS ASIDE (4 Columns)
            ================================================ === */}
            <aside className="lg:col-span-4 space-y-4">
              <div className="mb-6">
                <h2 className="text-xs font-black uppercase tracking-widest text-blue-600">{t("contactInfo.channels")}</h2>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">{t("contactInfo.title")}</h3>
              </div>

              {/* {t("contactInfo.officeAddress")} Card */}
              <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:border-blue-500/50 hover:shadow-md">
                <div className="flex gap-4 items-start">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0b2f5c] group-hover:bg-[#0b2f5c] group-hover:text-white transition-colors">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t("contactInfo.officeAddress")}</p>
                    <p className="mt-1.5 text-xs font-bold leading-relaxed text-slate-800">
                      H.No.10-1-31, Fathe Nagar,<br />
                      Balanagar, Hyderabad,<br />
                      Telangana, India
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone Card */}
              <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:border-blue-500/50 hover:shadow-md">
                <div className="flex gap-4 items-start">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0b2f5c] group-hover:bg-[#0b2f5c] group-hover:text-white transition-colors">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t("contactInfo.phoneEnquiries")}</p>
                    <p className="mt-1.5 text-xs font-bold text-slate-800">{t("contactInfo.phoneText")}</p>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:border-blue-500/50 hover:shadow-md">
                <div className="flex gap-4 items-start">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0b2f5c] group-hover:bg-[#0b2f5c] group-hover:text-white transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t("form.email")}</p>
                    <p className="mt-1.5 text-xs font-bold text-slate-800">{t("contactInfo.emailText")}</p>
                  </div>
                </div>
              </div>

              {/* Business Partnership Card */}
              <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:border-blue-500/50 hover:shadow-md">
                <div className="flex gap-4 items-start">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0b2f5c] group-hover:bg-[#0b2f5c] group-hover:text-white transition-colors">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t("contactInfo.dealerNetwork")}</p>
                    <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-600">
                      {t("contactInfo.dealerNetworkText")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Response Time Indicator */}
              <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-blue-900 font-medium">
                <Clock className="h-4 w-4 shrink-0 text-blue-600" />
                <span>{t("contactInfo.responseTime")}</span>
              </div>
            </aside>

            {/* ===================================================
                MAIN FORM CONTAINER (8 Columns)
            ================================================ === */}
            <div className="lg:col-span-8 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xl shadow-slate-900/5">
              {!submitted ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-widest text-blue-600">{t("form.secureDispatch")}</span>
                      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
                        {t("form.title")}
                      </h2>
                    </div>
                    <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#0b2f5c]">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {/* Row 1: Name & Company */}
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          {t("form.fullName")} <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          placeholder={t("form.fullNamePlaceholder")}
                          className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-[#0b2f5c] focus:ring-4 focus:ring-[#0b2f5c]/10"
                        />
                      </div>

                      <div>
                        <label htmlFor="company" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          {t("form.companyName")}
                        </label>
                        <input
                          id="company"
                          name="company"
                          type="text"
                          placeholder={t("form.companyNamePlaceholder")}
                          className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-[#0b2f5c] focus:ring-4 focus:ring-[#0b2f5c]/10"
                        />
                      </div>
                    </div>

                    {/* Row 2: Email & Phone */}
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          {t("form.email")} <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="name@example.com"
                          className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-[#0b2f5c] focus:ring-4 focus:ring-[#0b2f5c]/10"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          {t("form.phone")} <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          placeholder="+91 89198 54467"
                          className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-[#0b2f5c] focus:ring-4 focus:ring-[#0b2f5c]/10"
                        />
                      </div>
                    </div>

                    {/* Row 3: {t("form.enquiryType")} & Product Model */}
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="enquiry" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          {t("form.enquiryType")} <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="enquiry"
                          name="enquiry"
                          required
                          defaultValue=""
                          className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-900 outline-none transition-all focus:bg-white focus:border-[#0b2f5c] focus:ring-4 focus:ring-[#0b2f5c]/10"
                        >
                          <option value="" disabled>{t("form.selectEnquiry")}</option>
                          {enquiryTypes.map((type) => (
                            <option key={type} value={type}>{t(`enquiryTypes.${type}`)}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="product" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          {t("form.targetProduct")}
                        </label>
                        <select
                          id="product"
                          name="product"
                          defaultValue=""
                          className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-900 outline-none transition-all focus:bg-white focus:border-[#0b2f5c] focus:ring-4 focus:ring-[#0b2f5c]/10"
                        >
                          <option value="">{t("form.selectModel")}</option>
                          {products.map((product) => (
                            <option key={product} value={product}>{t(`products.${product}`)}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Row 4: Message */}
                    <div>
                      <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        {t("form.message")} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        placeholder={t("form.messagePlaceholder")}
                        className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-[#0b2f5c] focus:ring-4 focus:ring-[#0b2f5c]/10"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b2f5c] px-8 py-4 text-sm font-bold tracking-wide text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-[#07192f] hover:shadow-xl hover:shadow-blue-900/30 active:scale-[0.99] disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <span>{t("form.submitting")}</span>
                      ) : (
                        <>
                          <span>{t("form.send")}</span>
                          <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-[11px] text-slate-400">
                      {t("form.authorization")}
                    </p>
                  </form>
                </>
              ) : (
                /* Success Confirmation State */
                <div className="flex min-h-[480px] flex-col items-center justify-center text-center p-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-lg shadow-emerald-500/10 animate-bounce">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>

                  <span className="mt-6 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-700 uppercase tracking-widest">
                    {t("success.badge")}
                  </span>

                  <h3 className="mt-3 text-3xl font-bold text-slate-900 tracking-tight">
                    {t("success.title")}
                  </h3>

                  <p className="mt-3 max-w-md text-sm text-slate-600 leading-relaxed font-normal">
                    {t("success.description")}
                  </p>

                  <Link
                    href="/products"
                    className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-[#0b2f5c] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#07192f]"
                  >
                    <span>{t("success.products")}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          LOCATION & MAP EMBED SECTION
      ========================================================= */}
      <section className="border-t border-slate-200 bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">

            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-blue-600">{t("location.label")}</span>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
                  {t("location.title")}
                </h2>
              </div>

              <p className="text-sm leading-relaxed text-slate-600">
                {t("location.description")}
              </p>

              <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
                <div className="rounded-xl bg-blue-100 p-2.5 text-[#0b2f5c]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">{t("location.registeredOffice")}</h4>
                  <p className="mt-1 text-sm font-bold text-slate-900 leading-relaxed">
                    H.No.10-1-31, Fathe Nagar,<br />
                    Balanagar, Hyderabad,<br />
                    Telangana, India
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative min-h-[380px] overflow-hidden rounded-3xl border border-slate-200/85 bg-slate-100 shadow-xl shadow-slate-900/5">

                {/* Subtle background pattern */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg, #0b2f5c 25%, transparent 25%), linear-gradient(-45deg, #0b2f5c 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #0b2f5c 75%), linear-gradient(-45deg, transparent 75%, #0b2f5c 75%)",
                    backgroundSize: "40px 40px",
                    backgroundPosition:
                      "0 0, 0 20px, 20px -20px, -20px 0px",
                  }}
                />

                {/* Map */}
                <div className="relative h-[380px] w-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.9813608938875!2d78.45067619999999!3d17.4606062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb90ed63dfdccf%3A0xa80e6d972e25096e!2sH.no%2C%2010-2-158%2C%20Fatehnagar%2C%20Balanagar%2C%20Hyderabad%2C%20Telangana%20500018!5e0!3m2!1sen!2sin!4v1790078238255!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    title={t("location.mapTitle")}
                    className="relative z-10"
                  />
                </div>

            

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          DEALER & PARTNERSHIP CTA BANNER
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#07192f] py-20 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">

            <div className="lg:col-span-8">
              <span className="text-[11px] font-black uppercase tracking-widest text-cyan-400">{t("network.label")}</span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mt-2">
                {t("network.title")}
              </h2>
              <p className="mt-3 max-w-xl text-sm sm:text-base text-slate-300 leading-relaxed">
                {t("network.description")}
              </p>
            </div>

            <div className="lg:col-span-4 lg:text-right">
              <a
                href="#enquiry"
                className="group inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-7 py-4 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-cyan-400/20 transition-all hover:bg-cyan-300 hover:shadow-cyan-400/30"
              >
                <span>{t("network.button")}</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}