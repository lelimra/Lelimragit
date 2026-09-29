"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Swal from "sweetalert2";

import {
  CheckCircle2,
  Handshake,
  MessageSquare,
  Send,
  Building2,
  MapPin,
  FileText,
  HelpCircle,
  Layers,
  Briefcase,
  Store,
  Building,
  ShieldCheck,
  Copy,
  Printer,
} from "lucide-react";

import FormFillingGuide, {
  PartnerRole,
} from "@/components/dealer/FormFillingGuide";

interface DealerFormProps {
  initialRole?: PartnerRole;
}

export default function DealerForm({
  initialRole = "Dealer",
}: DealerFormProps) {
  const t = useTranslations();

  const [selectedRole, setSelectedRole] =
    useState<PartnerRole>(initialRole);

  const [showGuide, setShowGuide] = useState(false);
  const [hasGst, setHasGst] = useState(true);
  const [sameWhatsapp, setSameWhatsapp] = useState(true);

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [inquiryId, setInquiryId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    designation: "Proprietor",
    businessName: "",
    businessType: "Proprietorship",

    gstNumber: "",
    panNumber: "",

    phone: "",
    whatsapp: "",
    email: "",

    addressLine: "",
    landmark: "",
    city: "",
    district: "",
    state: "Telangana",
    pincode: "",

    godownArea: "",
    experienceYears: "5-10 years",

    currentBrands: "",
    targetTerritory: "",

    expectedVolume: "30-100 units",

    interestedProducts:
      "All Fan Ranges (Ceiling, Table & Pedestal)",

    transportPreference: "",
    message: "",
  });

  /* =========================================================
     PARTNER OPTIONS
  ========================================================= */

  const roleOptions = [
    {
      id: "Super Stockist" as PartnerRole,
      title: t("dealerSuperStockist"),
      badge: t("dealerSuperStockistLevel"),
      icon: Layers,
      desc: t("dealerRoleSuperStockistDescription"),
      minUnits: "300 - 1,000+",
    },

    {
      id: "Distributor" as PartnerRole,
      title: t("dealerDistributor"),
      badge: t("dealerDistributorLevel"),
      icon: Briefcase,
      desc: t("dealerRoleDistributorDescription"),
      minUnits: "100 - 300",
    },

    {
      id: "Dealer" as PartnerRole,
      title: t("dealerAuthorizedDealer"),
      badge: t("dealerAuthorizedDealerLevel"),
      icon: Store,
      desc: t("dealerRoleDealerDescription"),
      minUnits: "30 - 100",
    },

    {
      id: "Retailer" as PartnerRole,
      title: t("dealerRetailer"),
      badge: t("dealerRetailerLevel"),
      icon: Building,
      desc: t("dealerRoleRetailerDescription"),
      minUnits: "10 - 30",
    },
  ];

  /* =========================================================
     STATES
  ========================================================= */

  const indianStates = [
    "Telangana",
    "Andhra Pradesh",
    "Karnataka",
    "Maharashtra",
    "Tamil Nadu",
    "Kerala",
    "Gujarat",
    "Madhya Pradesh",
    "Uttar Pradesh",
    "Rajasthan",
    "West Bengal",
    "Delhi NCR",
    "Punjab",
    "Haryana",
    "Odisha",
    "Bihar",
    "Chhattisgarh",
    "Jharkhand",
    "Assam",
    "Other Indian State",
  ];

  /* =========================================================
     INPUT HANDLER
  ========================================================= */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
        HTMLSelectElement |
        HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => {
      const updated = {
        ...previous,
        [name]: value,
      };

      if (name === "phone" && sameWhatsapp) {
        updated.whatsapp = value;
      }

      return updated;
    });
  };

  /* =========================================================
     WHATSAPP TOGGLE
  ========================================================= */

  const handleSameWhatsappToggle = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = e.target.checked;

    setSameWhatsapp(checked);

    if (checked) {
      setFormData((previous) => ({
        ...previous,
        whatsapp: previous.phone,
      }));
    }
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  if (isSubmitting) return;

  setIsSubmitting(true);

  try {
    const response = await fetch(
      "/api/dealer-applications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: selectedRole,
          hasGst,
          ...formData,
          whatsapp:
            formData.whatsapp || formData.phone,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message ||
          "Unable to submit your application."
      );
    }

    // Backend-generated inquiry ID
    setInquiryId(data.inquiryId);

    // Success alert
    await Swal.fire({
      icon: "success",
      title: "Application Submitted!",
      html: `
        <p style="margin-bottom: 10px;">
          Your trade partner application has been submitted successfully.
        </p>

        <p style="font-weight: 700; margin-bottom: 5px;">
          Inquiry Reference
        </p>

        <p style="
          font-size: 18px;
          font-weight: 800;
          color: #0b2f5c;
          margin: 0;
        ">
          ${data.inquiryId}
        </p>
      `,
      confirmButtonText: "Continue",
      confirmButtonColor: "#0b2f5c",
      allowOutsideClick: false,
    });

    // Show your existing success screen
    setIsSubmitted(true);

  } catch (error) {
    console.error(
      "Dealer application submission failed:",
      error
    );

    await Swal.fire({
      icon: "error",
      title: "Submission Failed",
      text:
        error instanceof Error
          ? error.message
          : "Unable to submit your application. Please try again.",
      confirmButtonText: "Try Again",
      confirmButtonColor: "#0b2f5c",
    });
  } finally {
    setIsSubmitting(false);
  }
};

  /* =========================================================
     WHATSAPP
  ========================================================= */

  const handleWhatsAppDirect = () => {
    const phone = "919999999999";

    const message = `
LIMRA INDUSTRIES - Trade Partner Inquiry

Role: ${selectedRole}

Business: ${formData.businessName}

Name: ${formData.name}

Phone: ${formData.phone}

WhatsApp: ${
      formData.whatsapp || formData.phone
    }

GST: ${
      hasGst
        ? formData.gstNumber
        : "Not Registered / In Process"
    }

Location:
${formData.city}, ${formData.district}, ${formData.state}

PIN: ${formData.pincode}

Address:
${formData.addressLine}

Landmark:
${formData.landmark}

Expected Volume:
${formData.expectedVolume}

Products:
${formData.interestedProducts}

Message:
${formData.message}
`;

    const url =
      `https://wa.me/${phone}?text=${encodeURIComponent(
        message
      )}`;

    window.open(url, "_blank");
  };

  /* =========================================================
     COPY SUMMARY
  ========================================================= */

  const copyInquirySummary = async () => {
    const text = `
LIMRA INDUSTRIES TRADE INQUIRY

Reference: ${inquiryId}

Role: ${selectedRole}

Business:
${formData.businessName}

Proprietor:
${formData.name}

Phone:
${formData.phone}

WhatsApp:
${formData.whatsapp || formData.phone}

GST:
${
  hasGst
    ? formData.gstNumber
    : "Not Registered"
}

Location:
${formData.city}, ${formData.district}, ${formData.state}

PIN:
${formData.pincode}

Address:
${formData.addressLine}

Landmark:
${formData.landmark}

Expected Volume:
${formData.expectedVolume}

Products:
${formData.interestedProducts}
`;

    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  /* =========================================================
     SUCCESS SCREEN
  ========================================================= */

  if (isSubmitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-white p-6 text-slate-900 shadow-lg sm:p-10">

        <div className="mx-auto max-w-2xl space-y-5 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <div>

            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-700">
              {t("dealerInquiryReference")}: {inquiryId}
            </span>

            <h3 className="mt-4 text-2xl font-black text-slate-900 sm:text-3xl">
              {t("dealerApplicationReceived")}
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
              {t("dealerApplicationReceivedDescription")}
            </p>

          </div>

          <div className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3.5 text-xs font-semibold text-[#0b2f5c]">

            <ShieldCheck className="h-4 w-4" />

            <span>
              {t("dealerWarrantyConfirmation")}
            </span>

          </div>

          {/* Summary */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-left text-xs">

            <div className="flex items-center justify-between border-b border-slate-200 pb-2">

              <span className="text-sm font-bold text-slate-800">
                {formData.businessName}
              </span>

              <span className="rounded bg-blue-100/70 px-2.5 py-0.5 text-[11px] font-bold uppercase text-[#0b2f5c]">
                {selectedRole}
              </span>

            </div>

            <div className="mt-3 grid gap-2 text-slate-600 sm:grid-cols-2">

              <p>
                <strong>{t("dealerProprietor")}:</strong>{" "}
                {formData.name}
              </p>

              <p>
                <strong>{t("dealerPhone")}:</strong>{" "}
                {formData.phone}
              </p>

              <p>
                <strong>{t("dealerGST")}:</strong>{" "}
                {hasGst
                  ? formData.gstNumber || "Provided"
                  : t("dealerNotRegistered")}
              </p>

              <p>
                <strong>{t("dealerLocation")}:</strong>{" "}
                {formData.city}, {formData.state}
              </p>

              <p>
                <strong>{t("dealerPIN")}:</strong>{" "}
                {formData.pincode}
              </p>

              <p>
                <strong>{t("dealerExpectedVolume")}:</strong>{" "}
                {formData.expectedVolume}
              </p>

            </div>

          </div>

          {/* Actions */}
          <div className="flex flex-col justify-center gap-3 sm:flex-row">

            <button
              type="button"
              onClick={handleWhatsAppDirect}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-emerald-700"
            >
              <MessageSquare className="h-4 w-4" />

              {t("dealerSendWhatsApp")}
            </button>

            <button
              type="button"
              onClick={copyInquirySummary}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-100 px-5 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-200"
            >
              <Copy className="h-4 w-4" />

              {copied
                ? t("dealerCopied")
                : t("dealerCopySummary")}
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              <Printer className="h-4 w-4" />

              {t("dealerPrint")}
            </button>

          </div>

        </div>
      </div>
    );
  }

  /* =========================================================
     FORM
  ========================================================= */

  return (
    <div className="space-y-6">

      {/* Guide */}
      <div className="flex flex-col gap-3 rounded-xl border border-blue-200/80 bg-gradient-to-r from-blue-50 to-indigo-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0b2f5c] text-white">
            <HelpCircle className="h-5 w-5" />
          </div>

          <div>

            <h4 className="text-sm font-bold text-[#07192f]">
              {t("dealerNeedHelpTitle")}
            </h4>

            <p className="text-xs text-slate-600">
              {t("dealerNeedHelpDescription")}
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={() => setShowGuide(!showGuide)}
          className="inline-flex items-center justify-center rounded-lg border border-[#0b2f5c] bg-white px-4 py-2 text-xs font-bold text-[#0b2f5c] transition hover:bg-blue-50"
        >
          {showGuide
            ? t("dealerHideGuide")
            : t("dealerOpenGuide")}
        </button>

      </div>

      {showGuide && (
        <FormFillingGuide
          onSelectRole={(role) => {
            setSelectedRole(role);
            setShowGuide(false);
          }}
        />
      )}

      {/* Main form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >

        {/* =================================================
            FORM HEADER
        ================================================= */}

        <div className="border-b border-slate-100 pb-4">

          <div className="mb-1 flex flex-wrap items-center justify-between gap-2">

            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#174e8c]">
              {t("dealerFormEyebrow")}
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">

              <ShieldCheck className="h-3.5 w-3.5" />

              {t("dealerWarrantyBadge")}

            </span>

          </div>

          <h3 className="text-xl font-black text-slate-900 sm:text-2xl">
            {t("dealerFormTitle")}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            {t("dealerFormDescription")}
          </p>

        </div>

        {/* =================================================
            STEP 1
        ================================================= */}

        <section className="space-y-3">

          <div className="flex items-center justify-between">

            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">

              <Handshake className="h-4 w-4 text-[#0b2f5c]" />

              {t("dealerStep1")}

              <span className="text-red-500">*</span>

            </label>

          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

            {roleOptions.map((option) => {
              const Icon = option.icon;

              const selected =
                selectedRole === option.id;

              return (
                <button
                  type="button"
                  key={option.id}
                  onClick={() =>
                    setSelectedRole(option.id)
                  }
                  className={`relative rounded-xl border-2 p-3.5 text-left transition-all ${
                    selected
                      ? "border-[#0b2f5c] bg-blue-50/70 shadow-sm ring-2 ring-[#0b2f5c]/20"
                      : "border-slate-200 bg-slate-50/40 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >

                  <div className="flex items-center justify-between">

                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                        selected
                          ? "bg-[#0b2f5c] text-white"
                          : "bg-slate-200/70 text-slate-700"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    {selected && (
                      <CheckCircle2 className="h-4 w-4 text-[#0b2f5c]" />
                    )}

                  </div>

                  <div className="mt-2 text-xs font-bold text-slate-900">
                    {option.title}
                  </div>

                  <div className="mt-0.5 text-[10px] font-semibold text-slate-500">
                    {option.badge}
                  </div>

                  <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600">
                    {option.desc}
                  </p>

                  <div className="mt-3 border-t border-slate-200/60 pt-2 text-[10px] font-bold text-[#0b2f5c]">
                    {t("dealerMinimumOrder")}:{" "}
                    {option.minUnits}
                  </div>

                </button>
              );
            })}

          </div>
        </section>

        {/* =================================================
            STEP 2
        ================================================= */}

        <section className="space-y-4 border-t border-slate-100 pt-5">

          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">

            <Building2 className="h-4 w-4 text-[#0b2f5c]" />

            {t("dealerStep2")}

          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div>
              <label className="form-label">
                {t("dealerBusinessName")} *
              </label>

              <input
                required
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder={t("dealerBusinessPlaceholder")}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">
                {t("dealerBusinessType")} *
              </label>

              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="form-input"
              >
                <option value="Proprietorship">
                  {t("dealerProprietorship")}
                </option>

                <option value="Partnership">
                  {t("dealerPartnership")}
                </option>

                <option value="Private Limited / LLP">
                  {t("dealerPrivateLimited")}
                </option>

                <option value="Individual Counter">
                  {t("dealerIndividualCounter")}
                </option>
              </select>
            </div>

          </div>

          {/* GST */}
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">

            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">

              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-800">

                <FileText className="h-3.5 w-3.5 text-[#0b2f5c]" />

                {t("dealerGSTRegistration")}

              </span>

              <div className="flex flex-wrap gap-3">

                <label className="flex cursor-pointer items-center gap-1.5 text-xs">

                  <input
                    type="radio"
                    checked={hasGst}
                    onChange={() => setHasGst(true)}
                  />

                  {t("dealerHasGST")}

                </label>

                <label className="flex cursor-pointer items-center gap-1.5 text-xs">

                  <input
                    type="radio"
                    checked={!hasGst}
                    onChange={() => setHasGst(false)}
                  />

                  {t("dealerNoGST")}

                </label>

              </div>

            </div>

            {hasGst ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                <div>
                  <label className="form-label">
                    {t("dealerGSTNumber")} *
                  </label>

                  <input
                    required
                    maxLength={15}
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gstNumber:
                          e.target.value
                            .toUpperCase()
                            .trim(),
                      })
                    }
                    placeholder="36AAAAA0000A1Z5"
                    className="form-input font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="form-label">
                    {t("dealerPAN")}
                  </label>

                  <input
                    maxLength={10}
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        panNumber:
                          e.target.value
                            .toUpperCase()
                            .trim(),
                      })
                    }
                    placeholder="ABCDE1234F"
                    className="form-input font-mono uppercase"
                  />
                </div>

              </div>
            ) : (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                {t("dealerNoGSTDescription")}
              </div>
            )}

          </div>
        </section>

        {/* =================================================
            STEP 3
        ================================================= */}

        <section className="space-y-4 border-t border-slate-100 pt-5">

          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">

            <Handshake className="h-4 w-4 text-[#0b2f5c]" />

            {t("dealerStep3")}

          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div>
              <label className="form-label">
                {t("dealerFullName")} *
              </label>

              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("dealerNamePlaceholder")}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">
                {t("dealerDesignation")} *
              </label>

              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="form-input"
              >
                <option value="Proprietor">
                  {t("dealerProprietorOwner")}
                </option>

                <option value="Managing Partner">
                  {t("dealerManagingPartner")}
                </option>

                <option value="Director">
                  {t("dealerDirector")}
                </option>

                <option value="Store Manager">
                  {t("dealerStoreManager")}
                </option>
              </select>
            </div>

            <div>
              <label className="form-label">
                {t("dealerMobile")} *
              </label>

              <div className="flex">

                <span className="flex items-center rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 px-3 text-xs font-bold text-slate-600">
                  +91
                </span>

                <input
                  required
                  type="tel"
                  maxLength={10}
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="form-input rounded-l-none"
                />

              </div>
            </div>

            <div>

              <div className="mb-1 flex items-center justify-between">

                <label className="form-label mb-0">
                  {t("dealerWhatsAppNumber")} *
                </label>

                <label className="flex cursor-pointer items-center gap-1 text-[11px] text-slate-500">

                  <input
                    type="checkbox"
                    checked={sameWhatsapp}
                    onChange={handleSameWhatsappToggle}
                  />

                  {t("dealerSameAsMobile")}

                </label>

              </div>

              <div className="flex">

                <span className="flex items-center rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 px-3 text-xs font-bold text-slate-600">
                  +91
                </span>

                <input
                  required
                  type="tel"
                  maxLength={10}
                  name="whatsapp"
                  disabled={sameWhatsapp}
                  value={
                    sameWhatsapp
                      ? formData.phone
                      : formData.whatsapp
                  }
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="form-input rounded-l-none"
                />

              </div>

            </div>

            <div className="sm:col-span-2">

              <label className="form-label">
                {t("dealerEmail")}
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("dealerEmailPlaceholder")}
                className="form-input"
              />

            </div>

          </div>

        </section>

        {/* =================================================
            STEP 4
        ================================================= */}

        <section className="space-y-4 border-t border-slate-100 pt-5">

          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">

            <MapPin className="h-4 w-4 text-[#0b2f5c]" />

            {t("dealerStep4")}

          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div className="sm:col-span-2">

              <label className="form-label">
                {t("dealerAddress")} *
              </label>

              <input
                required
                name="addressLine"
                value={formData.addressLine}
                onChange={handleChange}
                placeholder={t("dealerAddressPlaceholder")}
                className="form-input"
              />

            </div>

            <div>

              <label className="form-label">
                {t("dealerLandmark")} *
              </label>

              <input
                required
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                placeholder={t("dealerLandmarkPlaceholder")}
                className="form-input"
              />

            </div>

            <div>

              <label className="form-label">
                {t("dealerCity")} *
              </label>

              <input
                required
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder={t("dealerCityPlaceholder")}
                className="form-input"
              />

            </div>

            <div>

              <label className="form-label">
                {t("dealerDistrict")} *
              </label>

              <input
                required
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder={t("dealerDistrictPlaceholder")}
                className="form-input"
              />

            </div>

            <div>

              <label className="form-label">
                {t("dealerState")} *
              </label>

              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="form-input"
              >

                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}

              </select>

            </div>

            <div>

              <label className="form-label">
                {t("dealerPIN")} *
              </label>

              <input
                required
                maxLength={6}
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="500001"
                className="form-input font-mono"
              />

            </div>

            <div>

              <label className="form-label">
                {t("dealerGodownArea")}
              </label>

              <input
                name="godownArea"
                value={formData.godownArea}
                onChange={handleChange}
                placeholder={t("dealerGodownAreaPlaceholder")}
                className="form-input"
              />

            </div>

          </div>

        </section>

        {/* =================================================
            STEP 5
        ================================================= */}

        <section className="space-y-4 border-t border-slate-100 pt-5">

          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">

            <Layers className="h-4 w-4 text-[#0b2f5c]" />

            {t("dealerStep5")}

          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div>

              <label className="form-label">
                {t("dealerExpectedVolume")} *
              </label>

              <select
                name="expectedVolume"
                value={formData.expectedVolume}
                onChange={handleChange}
                className="form-input"
              >

                <option value="10-30 units">
                  10 - 30 Units
                </option>

                <option value="30-100 units">
                  30 - 100 Units
                </option>

                <option value="100-300 units">
                  100 - 300 Units
                </option>

                <option value="300-1000+ units">
                  300 - 1,000+ Units
                </option>

              </select>

            </div>

            <div>

              <label className="form-label">
                {t("dealerFanCategories")} *
              </label>

              <select
                name="interestedProducts"
                value={formData.interestedProducts}
                onChange={handleChange}
                className="form-input"
              >

                <option value="All Fan Ranges (Ceiling, Table & Pedestal)">
                  {t("dealerAllFans")}
                </option>

                <option value="Ceiling Fans Only">
                  {t("dealerCeilingFans")}
                </option>

                <option value="Table Fans Only">
                  {t("dealerTableFans")}
                </option>

                <option value="Pedestal Fans Only">
                  {t("dealerPedestalFans")}
                </option>

              </select>

            </div>

            <div>

              <label className="form-label">
                {t("dealerYearsTrade")}
              </label>

              <select
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                className="form-input"
              >

                <option value="New Store">
                  {t("dealerNewStore")}
                </option>

                <option value="1-3 years">
                  1 - 3 years
                </option>

                <option value="3-7 years">
                  3 - 7 years
                </option>

                <option value="7-15 years">
                  7 - 15 years
                </option>

                <option value="15+ years">
                  15+ years
                </option>

              </select>

            </div>

            <div>

              <label className="form-label">
                {t("dealerTransport")}
              </label>

              <input
                name="transportPreference"
                value={formData.transportPreference}
                onChange={handleChange}
                placeholder={t("dealerTransportPlaceholder")}
                className="form-input"
              />

            </div>

            <div className="sm:col-span-2">

              <label className="form-label">
                {t("dealerOtherBrands")}
              </label>

              <input
                name="currentBrands"
                value={formData.currentBrands}
                onChange={handleChange}
                placeholder={t("dealerOtherBrandsPlaceholder")}
                className="form-input"
              />

            </div>

            <div className="sm:col-span-2">

              <label className="form-label">
                {t("dealerRequirements")}
              </label>

              <textarea
                rows={3}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t("dealerRequirementsPlaceholder")}
                className="form-input resize-none"
              />

            </div>

          </div>

        </section>

        {/* =================================================
            SUBMIT
        ================================================= */}

        <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0b2f5c] px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#07192f] disabled:cursor-not-allowed disabled:opacity-60"
          >

            <Send className="h-4 w-4" />

            {isSubmitting
              ? t("dealerSubmitting")
              : t("dealerSubmitApplication", {
                  role: t(
                    selectedRole === "Super Stockist"
                      ? "dealerSuperStockist"
                      : selectedRole === "Distributor"
                        ? "dealerDistributor"
                        : selectedRole === "Dealer"
                          ? "dealerAuthorizedDealer"
                          : "dealerRetailer"
                  ),
                })}

          </button>

          <button
            type="button"
            onClick={handleWhatsAppDirect}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
          >

            <MessageSquare className="h-4 w-4" />

            {t("dealerDirectWhatsApp")}

          </button>

        </div>

        <p className="text-center text-[11px] text-slate-400">
          {t("dealerPrivacyNote")}
        </p>

      </form>

    </div>
  );
}