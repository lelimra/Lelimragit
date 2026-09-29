export const siteConfig = {
  /**
   * =========================================================
   * BRAND
   * =========================================================
   */
  brandName: "LE LIMRA",
  companyName: "LIMRA INDUSTRY",

  /**
   * =========================================================
   * WEBSITE
   * =========================================================
   */
  siteUrl: "https://lelimra.com",

  /**
   * =========================================================
   * LOCATION
   * =========================================================
   */
  city: "Hyderabad",
  state: "Telangana",
  country: "India",

  address: {
    area: "Balanagar",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
  },

  /**
   * =========================================================
   * CONTACT
   * =========================================================
   */
  phone: "+91 89198 54467",
  whatsapp: "918919854467",

  /**
   * IMPORTANT:
   * Replace this with your actual official business email.
   */
  email: "YOUR_OFFICIAL_EMAIL",

  /**
   * =========================================================
   * BUSINESS INFORMATION
   * =========================================================
   */
  aboutText:
    "LE LIMRA by LIMRA INDUSTRY manufactures and supplies ceiling fans, table fans and pedestal fans for residential, commercial, retail, wholesale and business requirements.",

  description:
    "LE LIMRA by LIMRA INDUSTRY — ceiling fans, table fans and pedestal fans for homes, businesses, retailers, wholesalers and bulk buyers.",

  /**
   * =========================================================
   * SEO DEFAULTS
   * =========================================================
   */
  seo: {
    title:
      "LE LIMRA | Ceiling Fans, Table Fans & Pedestal Fans Manufacturer",

    description:
      "Explore LE LIMRA ceiling fans, table fans and pedestal fans for residential, commercial, retail, wholesale and bulk requirements.",

    keywords: [
      "ceiling fans",
      "table fans",
      "pedestal fans",
      "ceiling fan manufacturer",
      "fan manufacturer India",
      "ceiling fans Hyderabad",
      "table fans Hyderabad",
      "pedestal fans Hyderabad",
      "fan wholesale",
      "fan distributor",
      "fan dealer",
      "B2B fan supplier",
      "LE LIMRA",
      "LIMRA INDUSTRY",
    ],

    ogImage: "/images/seo/limra-og.jpg",
  },

  /**
   * =========================================================
   * SOCIAL / BRAND ASSETS
   * =========================================================
   */
  logo: "/images/brand/logo.png",
  favicon: "/favicon.ico",

  /**
   * =========================================================
   * BUSINESS HOURS
   * =========================================================
   */
  businessHours: {
    days: "Monday - Saturday",
    openingTime: "09:30",
    closingTime: "19:00",
  },

  /**
   * =========================================================
   * PRODUCT CATEGORIES
   * =========================================================
   */
  productCategories: [
    {
      name: "Ceiling Fans",
      slug: "ceiling-fan",
    },
    {
      name: "Table Fans",
      slug: "table-fan",
    },
    {
      name: "Pedestal Fans",
      slug: "pedestal-fan",
    },
  ],
} as const;