import { getRequestConfig } from "next-intl/server";
import enMessages from "./en.json";

const LOCALES = ["en", "hi", "te", "mr", "ur"] as const;
type Locale = (typeof LOCALES)[number];

function getNestedMessage(source: Record<string, unknown>, path: string) {
  return path.split(".").reduce<unknown>((value, key) => {
    if (value && typeof value === "object" && key in value) {
      return (value as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);
}

function humanizeKey(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  const validLocale: Locale = LOCALES.includes(locale as Locale)
    ? (locale as Locale)
    : "en";

  const messages = (await import(`./${validLocale}.json`)).default;

  return {
    locale: validLocale,
    messages,

    // Keep a missing translation from taking down an otherwise valid page.
    // If the key exists in English, use that as the fallback for incomplete
    // locale files. Otherwise return a readable label instead of throwing.
    getMessageFallback({ namespace, key }: { namespace?: string; key: string }) {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      const englishValue = getNestedMessage(enMessages as Record<string, unknown>, fullKey);

      if (typeof englishValue === "string") {
        return englishValue;
      }

      return humanizeKey(key);
    },

    onError(error: { code?: string; message?: string }) {
      if (error.code !== "MISSING_MESSAGE") {
        console.error(error);
      }
    },
  };
});
