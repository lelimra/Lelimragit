"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics/events";

type ProductViewTrackerProps = {
  productId: string;
};

export default function ProductViewTracker({
  productId,
}: ProductViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;

    tracked.current = true;

    trackEvent("product_view", {
      productId,
    });
  }, [productId]);

  return null;
}