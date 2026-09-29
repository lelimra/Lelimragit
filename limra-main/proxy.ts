import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["en", "hi", "te", "mr", "ur"],
  defaultLocale: "en",
  localePrefix: "always",
});

export function proxy(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/",
    "/(en|hi|te|ur)/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};