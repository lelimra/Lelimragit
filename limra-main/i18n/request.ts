import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  const validLocale =
    locale && ["en", "hi", "te", "mr","ur"].includes(locale)
      ? locale
      : "en";

  return {
    locale: validLocale,
    messages: (await import(`./${validLocale}.json`)).default,
  };
});