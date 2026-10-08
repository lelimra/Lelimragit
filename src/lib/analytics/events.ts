export type AnalyticsEventName =
  | "product_view"
  | "product_image_view"
  | "product_search"
  | "category_view"
  | "enquiry_started"
  | "enquiry_submitted"
  | "contact_submitted"
  | "whatsapp_click"
  | "catalogue_download"
  | "external_link_click";

type TrackEventOptions = {
  path?: string;
    productId?: string | null;

  eventData?: Record<string, unknown> | null;
};

export async function trackEvent(
  event: AnalyticsEventName,
  options: TrackEventOptions = {}
) {
  try {
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      keepalive: true,
      body: JSON.stringify({
        event,
        path:
          options.path ||
          window.location.pathname +
            window.location.search,
        productId: options.productId ?? null,
        eventData: options.eventData ?? null,
      }),
    });
  } catch (error) {
    console.error(
      "Analytics event failed:",
      error
    );
  }
}