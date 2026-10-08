export type GeoLocation = {
  country: string | null;
  countryCode: string | null;
  region: string | null;
  city: string | null;
};

export async function getGeoLocation(
  ip: string | null
): Promise<GeoLocation> {
  const emptyResult: GeoLocation = {
    country: null,
    countryCode: null,
    region: null,
    city: null,
  };

  if (!ip) {
    return emptyResult;
  }

  // Ignore local/private addresses.
  if (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("172.16.") ||
    ip.startsWith("172.17.") ||
    ip.startsWith("172.18.") ||
    ip.startsWith("172.19.") ||
    ip.startsWith("172.20.") ||
    ip.startsWith("172.21.") ||
    ip.startsWith("172.22.") ||
    ip.startsWith("172.23.") ||
    ip.startsWith("172.24.") ||
    ip.startsWith("172.25.") ||
    ip.startsWith("172.26.") ||
    ip.startsWith("172.27.") ||
    ip.startsWith("172.28.") ||
    ip.startsWith("172.29.") ||
    ip.startsWith("172.30.") ||
    ip.startsWith("172.31.")
  ) {
    return emptyResult;
  }

  try {
    const response = await fetch(
      `https://ipapi.co/${encodeURIComponent(ip)}/json/`,
      {
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return emptyResult;
    }

    const data = (await response.json()) as {
      country_name?: string;
      country_code?: string;
      region?: string;
      city?: string;
      error?: boolean;
    };

    if (data.error) {
      return emptyResult;
    }

    return {
      country: data.country_name || null,
      countryCode: data.country_code || null,
      region: data.region || null,
      city: data.city || null,
    };
  } catch (error) {
    console.error(
      "IP geolocation failed:",
      error
    );

    return emptyResult;
  }
}