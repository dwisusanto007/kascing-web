import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "id"],
  defaultLocale: "en",
  localePrefix: "always",
  // next-intl's middleware negotiates a locale from the Accept-Language
  // header by default when a visitor hits an unprefixed path. The spec
  // requires English as a hard default regardless of browser language —
  // this flag turns that negotiation off, so an unprefixed path always
  // redirects to defaultLocale ("en"), never to a browser-preferred locale.
  localeDetection: false,
});
