# LE LIMRA V2 — merged starter

Base: limra-main (Next.js). Selected additions: Gemini AI route, authenticated admin product editor, MySQL product overrides, business settings editor, freight estimate, mobile dock and scroll-to-top. Warranty page was not migrated.

## Setup
1. `npm install`
2. Copy `.env.example` to `.env.local`, set a strong ADMIN_PASSWORD and random ADMIN_SESSION_SECRET (32+ bytes), GEMINI_API_KEY and MySQL credentials.
3. Run `database/limra_v2.sql` against the configured MySQL database. Existing dealer/wholesale tables from the original project are still required.
4. `npm run dev`; visit `/admin`, `/en/freight`, `/en/products`.

## Important limitations before production
- Admin login is a simple single-password session; add rate limiting and individual admin accounts for multi-user production.
- The existing dealer enquiry endpoint still uses ADMIN_API_KEY; do not share it with untrusted users.
- Business settings are stored in MySQL for centralized administration; public pages currently use src/data/site.ts as their safe fallback configuration.
- Product overrides are used by the public product listing, product detail pages, homepage featured/hero sections, AI catalog context and sitemap.
- Product images are path-based, not uploaded. Put files in public/images and enter paths.
- Freight rates copied from the second project's reference data are indicative, not verified carrier quotations.
- Configure AI and database credentials before testing; AI returns 503 without GEMINI_API_KEY.
- Run npm run build and browser QA in your deployment environment.
