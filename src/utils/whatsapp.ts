
import { siteConfig } from "@/data/site";

/**
 * Creates a formatted WhatsApp click-to-chat URL
 * Using the central WhatsApp phone number in /data/site.ts
 */
export function getProductEnquiryWhatsAppUrl(productName: string, model?: string): string {
  const cleanPhone = siteConfig.whatsapp.replace(/[^0-9]/g, "");
  const modelPart = model ? ` (Model: ${model})` : "";
  const message = `Hello ${siteConfig.brandName}, I am interested in ${productName}${modelPart}. Please share the price and details.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Creates a formatted WhatsApp wholesale inquiry URL
 */
export function getWholesaleEnquiryWhatsAppUrl(customDetails?: {
  product?: string;
  quantity?: string;
  location?: string;
}): string {
  const cleanPhone = siteConfig.whatsapp.replace(/[^0-9]/g, "");
  let message = `Hello ${siteConfig.brandName}, I am interested in bulk fan supply. Please share your wholesale price list.`;

  if (customDetails?.product || customDetails?.quantity) {
    message += `\n\nDetails:`;
    if (customDetails.product) message += `\nInterested in: ${customDetails.product}`;
    if (customDetails.quantity) message += `\nQuantity: ${customDetails.quantity}`;
    if (customDetails.location) message += `\nCity/State: ${customDetails.location}`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Creates a detailed B2B Trade Partner Inquiry WhatsApp URL
 * Supports Super Stockist, Distributor, Dealer, and Retailer roles
 */
export interface TradePartnerInquiryPayload {
  role: "Super Stockist" | "Distributor" | "Dealer" | "Retailer" | string;
  name: string;
  shopName: string;
  gst?: string;
  pan?: string;
  phone: string;
  city: string;
  state: string;
  district?: string;
  pincode?: string;
  address?: string;
  expectedVolume?: string;
  interestedProducts?: string;
  message?: string;
}

export function getTradePartnerWhatsAppUrl(payload: TradePartnerInquiryPayload): string {
  const cleanPhone = siteConfig.whatsapp.replace(/[^0-9]/g, "");
  let message = `*NEW B2B TRADE PARTNER INQUIRY — ${siteConfig.brandName}*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `*Role Requested:* ${payload.role.toUpperCase()}\n`;
  message += `*Firm/Shop Name:* ${payload.shopName || "N/A"}\n`;
  message += `*Proprietor Name:* ${payload.name || "N/A"}\n`;
  message += `*Contact Phone:* ${payload.phone || "N/A"}\n`;
  if (payload.gst) message += `*GST Number:* ${payload.gst}\n`;
  if (payload.pan) message += `*PAN Number:* ${payload.pan}\n`;
  message += `*Location:* ${payload.city ? `${payload.city}, ` : ""}${payload.district ? `${payload.district}, ` : ""}${payload.state || ""}\n`;
  if (payload.pincode) message += `*PIN Code:* ${payload.pincode}\n`;
  if (payload.address) message += `*Address:* ${payload.address}\n`;
  if (payload.expectedVolume) message += `*Expected Volume:* ${payload.expectedVolume}\n`;
  if (payload.interestedProducts) message += `*Product Categories:* ${payload.interestedProducts}\n`;
  if (payload.message) message += `*Notes:* ${payload.message}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `Please share the official price matrix and catalog for ${payload.role}.`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Creates a dealer inquiry WhatsApp URL
 */
export function getDealerEnquiryWhatsAppUrl(dealerDetails?: {
  businessName?: string;
  city?: string;
  role?: string;
}): string {
  const cleanPhone = siteConfig.whatsapp.replace(/[^0-9]/g, "");
  const roleText = dealerDetails?.role || "Dealer / Distributor";
  let message = `Hello ${siteConfig.brandName}, I would like to enquire about becoming a ${roleText} for LE LIMRA fans in our region.`;
  if (dealerDetails?.businessName) {
    message += `\nBusiness Name: ${dealerDetails.businessName}`;
  }
  if (dealerDetails?.city) {
    message += `\nLocation: ${dealerDetails.city}`;
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * General contact WhatsApp link
 */
export function getGeneralWhatsAppUrl(): string {
  const cleanPhone = siteConfig.whatsapp.replace(/[^0-9]/g, "");
  const message = `Hello ${siteConfig.brandName}, I would like to know more about your fans and catalog.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
