"use client";

import { useState } from "react";
import {
  ArrowRight,
  Factory,
  ShoppingBag,
  Users,
  Truck,
} from "lucide-react";
import Swal from "sweetalert2";

export default function WholesaleEnquiry() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWholesaleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (isSubmitting) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      product: String(formData.get("product") || "").trim(),
      quantity: Number(formData.get("quantity")),
      location: String(formData.get("location") || "").trim(),
    };

    // Client-side validation
    if (
      !data.name ||
      !data.phone ||
      !data.product ||
      !data.quantity ||
      !data.location
    ) {
      await Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all required fields.",
        confirmButtonColor: "#0b2f5c",
      });

      return;
    }

    if (data.quantity < 1) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid Quantity",
        text: "Please enter a valid quantity.",
        confirmButtonColor: "#0b2f5c",
      });

      return;
    }

    try {
      setIsSubmitting(true);

      // Loading alert
      Swal.fire({
        title: "Submitting Enquiry...",
        text: "Please wait while we submit your wholesale enquiry.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await fetch("/api/wholesale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to submit your enquiry."
        );
      }

      // Success
      await Swal.fire({
        icon: "success",
        title: "Enquiry Submitted!",
        text: "Thank you. Our wholesale team will contact you shortly.",
        confirmButtonText: "Done",
        confirmButtonColor: "#0b2f5c",
      });

      form.reset();
    } catch (error) {
      console.error("Wholesale enquiry error:", error);

      Swal.close();

      await Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#0b2f5c",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="wholesale-enquiry"
      className="relative overflow-hidden border-y border-slate-200/80 bg-gradient-to-b from-white via-slate-50/50 to-white py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">

          {/* LEFT: VALUE PROPOSITION */}
          <div className="space-y-6 lg:col-span-5">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-[#0b5cab]">
                <Factory className="h-3.5 w-3.5" />
                B2B Procurement Portal
              </span>

              <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-[#07192f] sm:text-4xl lg:text-4xl">
                Get Direct Wholesale Pricing
              </h2>

              <p className="mt-3 text-base leading-relaxed text-slate-600">
                Scale your retail or distribution business with
                factory-direct margins. Submit your requirements and
                our B2B desk will share custom price lists.
              </p>
            </div>

            {/* FEATURE HIGHLIGHTS */}
            <div className="grid grid-cols-2 gap-4 pt-2">

              {/* Factory Direct */}
              <div className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0b5cab] transition group-hover:bg-[#0b2f5c] group-hover:text-white">
                  <Factory className="h-5 w-5" />
                </div>

                <p className="mt-3 text-sm font-black text-[#07192f]">
                  Factory Direct
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Direct manufacturer pricing
                </p>
              </div>

              {/* Bulk Orders */}
              <div className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0b5cab] transition group-hover:bg-[#0b2f5c] group-hover:text-white">
                  <ShoppingBag className="h-5 w-5" />
                </div>

                <p className="mt-3 text-sm font-black text-[#07192f]">
                  Bulk Orders
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Flexible order quantities
                </p>
              </div>

              {/* Dealer Support */}
              <div className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0b5cab] transition group-hover:bg-[#0b2f5c] group-hover:text-white">
                  <Users className="h-5 w-5" />
                </div>

                <p className="mt-3 text-sm font-black text-[#07192f]">
                  Dealer Support
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Business enquiry support
                </p>
              </div>

              {/* Pan India */}
              <div className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0b5cab] transition group-hover:bg-[#0b2f5c] group-hover:text-white">
                  <Truck className="h-5 w-5" />
                </div>

                <p className="mt-3 text-sm font-black text-[#07192f]">
                  Pan-India Supply
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Delivery across India
                </p>
              </div>

            </div>
          </div>

          {/* RIGHT: FORM */}
          <div className="lg:col-span-7">
            <div className="relative semibold  rounded-3xl border border-green-600 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-10">

              <div className="absolute right-0 top-0 -mr-3 -mt-3 hidden rounded-full bg-blue-600 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-md sm:block">
                Fast Quote Reply
              </div>

              <form
                onSubmit={handleWholesaleSubmit}
                className="space-y-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">

                  {/* NAME */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600"
                    >
                      Full Name{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-[#0b2f5c] focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  {/* WHATSAPP */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600"
                    >
                      WhatsApp Number{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="+91 89198 54467"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-[#0b2f5c] focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  {/* PRODUCT */}
                  <div>
                    <label
                      htmlFor="product"
                      className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600"
                    >
                      Product Category{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <select
                      id="product"
                      name="product"
                      required
                      defaultValue=""
                      className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-[#0b2f5c] focus:bg-white focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="" disabled>
                        Select fan category
                      </option>

                      <option value="ceiling-fans">
                        Ceiling Fans (High-Speed & Decorative)
                      </option>

                      <option value="table-fans">
                        Table Fans (Portable Airflow)
                      </option>

                      <option value="pedestal-fans">
                        Pedestal Fans (Heavy-Duty)
                      </option>
                    </select>
                  </div>

                  {/* QUANTITY */}
                  <div>
                    <label
                      htmlFor="quantity"
                      className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600"
                    >
                      Approx. Quantity (Units){" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      required
                      placeholder="e.g. 50"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-[#0b2f5c] focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  {/* LOCATION */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="location"
                      className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600"
                    >
                      Delivery Destination (City / State){" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      id="location"
                      name="location"
                      type="text"
                      required
                      placeholder="e.g. Pune, Maharashtra"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-[#0b2f5c] focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b2f5c] px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-900/20 transition hover:scale-[1.01] hover:bg-[#07192f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Get Wholesale Price Sheet
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-slate-400">
                  🔒 Your details are safe with us. No spam, direct
                  dealer correspondence only.
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}