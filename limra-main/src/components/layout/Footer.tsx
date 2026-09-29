import Link from "next/link";

import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  
  ChevronRight,
} from "lucide-react";

const WHATSAPP_NUMBER = "918919854467";

const getGeneralWhatsAppUrl = () => {
  const message = encodeURIComponent(
    "Hello LIMRA INDUSTRY, I would like to enquire about your ceiling fans."
  );

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
};

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#07192f] text-slate-300">

      {/* =========================================================
          TOP BUSINESS / WHOLESALE BANNER
      ========================================================= */}
      <div className="border-b border-slate-800/80 bg-[#061527] py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 md:flex-row lg:px-8">

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Trusted Fan Manufacturer
            </span>

            <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
              Looking for Wholesale & Bulk Supply?
            </h3>

            <p className="mt-1 max-w-xl text-sm text-slate-400">
              Partner with LIMRA INDUSTRY for ceiling fans and bulk
              requirements for dealers, retailers, contractors and projects.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">

            <Link
              href="/contact"
              className="rounded-lg bg-[#174e8c] px-5 py-2.5 text-sm font-bold text-white shadow transition-all duration-150 hover:bg-[#134074]"
            >
              Get a Quote
            </Link>

            <a
              href={getGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition-all duration-150 hover:bg-emerald-700"
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span>WhatsApp Us</span>
            </a>

          </div>
        </div>
      </div>


      {/* =========================================================
          MAIN FOOTER
      ========================================================= */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">


          {/* =====================================================
              BRAND & CONTACT
          ===================================================== */}
          <div className="space-y-4 lg:col-span-2">

            <div className="flex flex-col items-start">

              <Link
                href="/"
                className="text-3xl font-bold tracking-tight text-white transition-opacity hover:opacity-80"
              >
                LIMRA
              </Link>

              <span className="mt-2.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                INDUSTRY
              </span>

            </div>


            <p className="max-w-md text-sm leading-relaxed text-slate-300">
              Focused on thoughtfully designed ceiling fans for modern
              residential and commercial spaces. We provide reliable fan
              solutions for homes, businesses, dealers and bulk requirements.
            </p>


            {/* Contact Information */}
            <div className="space-y-2 pt-2 text-xs text-slate-400">

              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                <span>
                  H.No.10-1-31,
                  <br />
                  Fathe Nagar, Balanagar,
                  <br />
                  Hyderabad, Telangana
                </span>
              </div>


              <a
                href="tel:+918919854467"
                className="flex items-center gap-2 transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4 shrink-0" />
                <span>Contact Us</span>
              </a>


              <a
                href="mailto:info@limraindustry.com"
                className="flex items-center gap-2 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 shrink-0" />
                <span>info@limraindustry.com</span>
              </a>

            </div>


            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition-colors hover:bg-[#174e8c] hover:text-white"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>


              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition-colors hover:bg-[#174e8c] hover:text-white"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>


             

            </div>

          </div>


          {/* =====================================================
              PRODUCTS
          ===================================================== */}
          <div>

            <h4 className="mb-4 border-b border-slate-800 pb-2 text-sm font-bold uppercase tracking-wider text-white">
              Products
            </h4>

            <ul className="space-y-2.5 text-sm">

              <li>
                <Link
                  href="/products?category=ceiling-fans"
                  className="flex items-center gap-1.5 transition-colors hover:text-white"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                  <span>Ceiling Fans</span>
                </Link>
              </li>

              <li>
                <Link
                  href="/products?category=table-fans"
                  className="flex items-center gap-1.5 transition-colors hover:text-white"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                  <span>Table Fans</span>
                </Link>
              </li>

              <li>
                <Link
                  href="/products?category=pedestal-fans"
                  className="flex items-center gap-1.5 transition-colors hover:text-white"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                  <span>Pedestal Fans</span>
                </Link>
              </li>

              <li>
                <Link
                  href="/products"
                  className="flex items-center gap-1.5 text-blue-400 transition-colors hover:text-blue-300"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span>All Products</span>
                </Link>
              </li>

            </ul>

          </div>


          {/* =====================================================
              COMPANY & BUSINESS
          ===================================================== */}
          <div>

            <h4 className="mb-4 border-b border-slate-800 pb-2 text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h4>

            <ul className="space-y-2.5 text-sm">

              <li>
                <Link
                  href="/about"
                  className="flex items-center gap-1.5 transition-colors hover:text-white"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                  <span>About Us</span>
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="flex items-center gap-1.5 transition-colors hover:text-white"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                  <span>Wholesale</span>
                </Link>
              </li>

              <li>
                <Link
                  href="/dealers"
                  className="flex items-center gap-1.5 transition-colors hover:text-white"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                  <span>Dealer & Retailer Inquiry</span>
                </Link>
              </li>

              <li>
                <Link
                  href="/catalog"
                  className="flex items-center gap-1.5 transition-colors hover:text-white"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                  <span>Catalogue</span>
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="flex items-center gap-1.5 transition-colors hover:text-white"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                  <span>Contact</span>
                </Link>
              </li>

            </ul>

          </div>


          {/* =====================================================
              TRADE & SUPPLY
          ===================================================== */}
          <div>

            <h4 className="mb-4 border-b border-slate-800 pb-2 text-sm font-bold uppercase tracking-wider text-white">
              Trade & Supply
            </h4>

            <div className="space-y-3 text-xs leading-relaxed text-slate-400">

              <div className="rounded border border-slate-700/60 bg-slate-800/60 p-3">

                <span className="mb-1 block text-xs font-semibold text-slate-200">
                  Manufacturer
                </span>

                Direct manufacturer support for wholesale,
                dealer and bulk requirements.

              </div>


              <div className="rounded border border-slate-700/60 bg-slate-800/60 p-3">

                <span className="mb-1 block text-xs font-semibold text-slate-200">
                  Bulk Supply
                </span>

                Suitable for retailers, distributors,
                contractors and commercial projects.

              </div>

            </div>

          </div>

        </div>


        {/* =========================================================
            BOTTOM BAR
        ========================================================= */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-xs text-slate-400 sm:flex-row">

          <div>
            © {new Date().getFullYear()} LIMRA INDUSTRY. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">

            <span>
              Brand: LIMRA INDUSTRY
            </span>

            <span className="hidden sm:inline">
              •
            </span>

            <span>
              Made in India
            </span>

            <span className="hidden sm:inline">
              •
            </span>

            <Link
              href="/contact"
              className="underline transition-colors hover:text-white"
            >
              Contact
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}

