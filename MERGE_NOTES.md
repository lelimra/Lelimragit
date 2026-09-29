# LE LIMRA V2 merge notes

- Base: `limra-main` (Next.js).
- Added: Gemini AI assistant, authenticated admin dashboard, product editing, freight estimator, business settings storage, mobile bottom navigation and scroll-to-top.
- Warranty page was intentionally not added. Existing product warranty information remains where the product data/site already displays it.
- Admin dashboard is available at `/admin` and is excluded from locale middleware.
- Product overrides are stored in `product_overrides`; business settings are stored in `business_settings`.
