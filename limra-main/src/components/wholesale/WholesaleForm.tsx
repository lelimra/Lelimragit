"use client";

import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  MessageSquare,
  Send,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { getWholesaleEnquiryWhatsAppUrl } from "@/utils/whatsapp";

interface WholesaleFormProps {
  defaultProduct?: string;
}

export default function WholesaleForm({
  defaultProduct = "",
}: WholesaleFormProps) {
  const t = useTranslations();

  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    city: "",
    state: "",
    mobileNumber: "",
    email: "",
    interestedProduct:
      defaultProduct || t("wholesaleProductCeilingBulk"),
    quantityRequired: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  /* ---------------------------------------------
     STATES
  --------------------------------------------- */

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
    "Other Indian State",
  ];

  /* ---------------------------------------------
     PRODUCT OPTIONS
  --------------------------------------------- */

  const productOptions = [
    {
      value: "ceiling",
      label: t("wholesaleProductCeilingBulk"),
    },
    {
      value: "table",
      label: t("wholesaleProductTableBulk"),
    },
    {
      value: "pedestal",
      label: t("wholesaleProductPedestalBulk"),
    },
    {
      value: "mixed",
      label: t("wholesaleProductMixed"),
    },
    {
      value: "institutional",
      label: t("wholesaleProductInstitutional"),
    },
    {
      value: "dealer",
      label: t("wholesaleProductDealer"),
    },
  ];

  /* ---------------------------------------------
     HANDLE INPUT
  --------------------------------------------- */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ---------------------------------------------
     SUBMIT
  --------------------------------------------- */

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);

    // Frontend-only submission for now.
    // Connect this to your backend/API later.
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  /* ---------------------------------------------
     WHATSAPP
  --------------------------------------------- */

  const handleWhatsAppDirect = () => {
    const selectedProduct =
      productOptions.find(
        (product) => product.value === formData.interestedProduct
      )?.label || formData.interestedProduct;

    const url = getWholesaleEnquiryWhatsAppUrl({
      product: selectedProduct,
      quantity: formData.quantityRequired || "Bulk",
      location: `${formData.city}, ${formData.state}`,
    });

    window.open(url, "_blank", "noopener,noreferrer");
  };

  /* ---------------------------------------------
     RESET
  --------------------------------------------- */

  const resetForm = () => {
    setIsSubmitted(false);

    setFormData({
      name: "",
      businessName: "",
      city: "",
      state: "",
      mobileNumber: "",
      email: "",
      interestedProduct:
        defaultProduct || t("wholesaleProductCeilingBulk"),
      quantityRequired: "",
      message: "",
    });
  };

  /* =================================================
     SUCCESS STATE
  ================================================= */

  if (isSubmitted) {
    return (
      <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">

        {/* Success Header */}
        <div className="border-b border-emerald-100 bg-emerald-50/70 px-6 py-8 text-center sm:px-10">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {t("wholesaleSuccessTitle")}
          </h3>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
            {t("wholesaleSuccessDescription")}{" "}
            <span className="font-semibold text-slate-900">
              {formData.name}
            </span>
          </p>

        </div>

        {/* Summary */}
        <div className="space-y-4 px-6 py-6 sm:px-10">

          <div className="grid gap-3 sm:grid-cols-3">

            {/* Product */}
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {t("wholesaleProductLabel")}
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {
                  productOptions.find(
                    (product) =>
                      product.value === formData.interestedProduct
                  )?.label
                }
              </p>
            </div>

            {/* Quantity */}
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {t("wholesaleQuantityLabel")}
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {formData.quantityRequired || "Bulk"}
              </p>
            </div>

            {/* Contact */}
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {t("wholesaleContactLabel")}
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {formData.mobileNumber}
              </p>
            </div>

          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">

            <button
              type="button"
              onClick={handleWhatsAppDirect}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <MessageSquare className="h-4 w-4" />
              {t("wholesaleSendWhatsApp")}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              {t("wholesaleSubmitAnother")}
            </button>

          </div>

        </div>
      </div>
    );
  }

  /* =================================================
     FORM
  ================================================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >

      {/* ---------------------------------------------
          HEADER
      --------------------------------------------- */}

      <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-6 sm:px-8">

        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Building2 className="h-5 w-5" />
          </div>

          <div>

            <h3 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              {t("wholesaleFormTitle")}
            </h3>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              {t("wholesaleFormDescription")}
            </p>

          </div>

        </div>
      </div>

      {/* ---------------------------------------------
          FIELDS
      --------------------------------------------- */}

      <div className="space-y-6 p-6 sm:p-8">

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          {/* NAME */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600"
            >
              {t("wholesaleName")}{" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              id="name"
              type="text"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t("wholesaleNamePlaceholder")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* BUSINESS */}
          <div>
            <label
              htmlFor="businessName"
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600"
            >
              {t("wholesaleBusinessName")}{" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              id="businessName"
              type="text"
              required
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder={t("wholesaleBusinessPlaceholder")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* CITY */}
          <div>
            <label
              htmlFor="city"
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600"
            >
              {t("wholesaleCity")}{" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              id="city"
              type="text"
              required
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder={t("wholesaleCityPlaceholder")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* STATE */}
          <div>
            <label
              htmlFor="state"
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600"
            >
              {t("wholesaleState")}{" "}
              <span className="text-red-500">*</span>
            </label>

            <select
              id="state"
              required
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
            >
              <option value="">
                {t("wholesaleSelectState")}
              </option>

              {indianStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* PHONE */}
          <div>
            <label
              htmlFor="mobileNumber"
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600"
            >
              {t("wholesalePhone")}{" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              id="mobileNumber"
              type="tel"
              required
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="+91 89198 54467"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600"
            >
              {t("wholesaleEmail")}
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("wholesaleEmailPlaceholder")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* PRODUCT */}
          <div>
            <label
              htmlFor="interestedProduct"
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600"
            >
              {t("wholesaleProduct")}{" "}
              <span className="text-red-500">*</span>
            </label>

            <select
              id="interestedProduct"
              required
              name="interestedProduct"
              value={formData.interestedProduct}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
            >
              {productOptions.map((product) => (
                <option
                  key={product.value}
                  value={product.value}
                >
                  {product.label}
                </option>
              ))}
            </select>
          </div>

          {/* QUANTITY */}
          <div>
            <label
              htmlFor="quantityRequired"
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600"
            >
              {t("wholesaleQuantity")}{" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              id="quantityRequired"
              type="text"
              required
              name="quantityRequired"
              value={formData.quantityRequired}
              onChange={handleChange}
              placeholder={t("wholesaleQuantityPlaceholder")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
            />
          </div>

        </div>

        {/* MESSAGE */}
        <div>

          <label
            htmlFor="message"
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600"
          >
            {t("wholesaleMessage")}
          </label>

          <textarea
            id="message"
            rows={4}
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder={t("wholesaleMessagePlaceholder")}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
          />

        </div>

        {/* BUTTONS */}
        <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-4 w-4" />

            <span>
              {isSubmitting
                ? t("wholesaleSubmitting")
                : t("wholesaleSubmit")}
            </span>
          </button>

          <button
            type="button"
            onClick={handleWhatsAppDirect}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <MessageSquare className="h-4 w-4" />

            <span>
              {t("wholesaleWhatsAppButton")}
            </span>
          </button>

        </div>

        <p className="text-center text-xs leading-5 text-slate-400">
          {t("wholesaleDirectFactory")} •{" "}
          {t("wholesalePanIndiaDispatch")}
        </p>

      </div>
    </form>
  );
}