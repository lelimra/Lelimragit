import { createNavigation } from "next-intl/navigation";

export const locales = [
    "en",
    "hi",
    "te",
    "mr",
    "ur",
] as const;

export const { Link, redirect, usePathname, useRouter } =
    createNavigation({
        locales,
    });