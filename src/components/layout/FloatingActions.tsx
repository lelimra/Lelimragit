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
      {/* WhatsApp Floating Button (Stacked above AI Assistant) */}
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp LIMRA INDUSTRY"
        style={{
          position: "fixed",
          right: "24px",
          bottom: "96px", // Positioned safely right above the AI Assistant button
          zIndex: 2147483646,
        }}
        className="group flex items-center gap-2.5 rounded-full bg-emerald-600 px-4 py-3 text-white shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-emerald-400/30"
      >
        <WhatsappIcon className="h-5 w-5" />
        <span className="hidden text-xs font-bold tracking-wide sm:inline">
          WhatsApp Us
        </span>
      </a>

      {/* AI Assistant Floating Button & Modal */}
      <AIAssistantModal />
    </AIAssistantProvider>
  );
}