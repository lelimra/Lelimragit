"use client";

import { AIAssistantProvider } from "@/context/AiAssistantContext";
import { AIAssistantModal } from "../common/AiAssistantModel";
import WhatsappIcon from "@mui/icons-material/WhatsApp";

const WHATSAPP_NUMBER = "918919854467";

const getWhatsAppUrl = () => {
  const message = encodeURIComponent(
    "Hello LIMRA INDUSTRY, I would like to enquire about your ceiling fans."
  );

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
};

export default function FloatingActions() {
  return (
    <AIAssistantProvider>
      {/* WhatsApp Floating Button */}
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp LIMRA INDUSTRY"
        className="
          fixed
          bottom-40 right-4
          sm:bottom-24 sm:right-6
          z-[2147483646]
          group
          flex items-center gap-1
          rounded-full
          bg-emrald-200/30 backdrop-blur-md
          px-2 py-2
          shadow-xl
          transition-all duration-300
          hover:-translate-y-0.5
          hover:bg-emerald-100
          hover:shadow-2xl
          focus:outline-none
          focus:ring-4
          focus:ring-emerald-400/30
        "
      >
        <WhatsappIcon className="h-5 text-emerald-500 w-5" />

        <span className="hidden text-sm text-emerald-500 font-bold tracking-wide sm:inline">
          WhatsApp Us
        </span>
      </a>

      {/* AI Assistant Floating Button & Modal */}
      <AIAssistantModal />
    </AIAssistantProvider>
  );
}
