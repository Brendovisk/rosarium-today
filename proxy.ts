import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { SUPPORTED_LOCALES } from "@/config/locales";
import {
  getLocalizedPath,
  MYSTERY_SLUGS,
  PRAYER_SEGMENT,
  PRIVACY_SEGMENT,
  TERMS_SEGMENT,
} from "@/config/routes";
import { parseSettingsCookie, SETTINGS_COOKIE_NAME } from "@/config/settings";

// Localized (non-en) path → canonical en path
const LOCALIZED_TO_CANONICAL = new Map<string, string>();
// Canonical en paths that may need locale redirect
const CANONICAL_PATHS = new Set<string>();

for (const locale of SUPPORTED_LOCALES) {
  for (const [key, slug] of Object.entries(MYSTERY_SLUGS[locale])) {
    const canonical = `/prayer/${key}`;
    CANONICAL_PATHS.add(canonical);
    if (locale !== "en") {
      LOCALIZED_TO_CANONICAL.set(
        `/${PRAYER_SEGMENT[locale]}/${slug}`,
        canonical
      );
    }
  }
}

for (const locale of SUPPORTED_LOCALES) {
  if (locale !== "en") {
    LOCALIZED_TO_CANONICAL.set(`/${PRIVACY_SEGMENT[locale]}`, "/privacy");
    LOCALIZED_TO_CANONICAL.set(`/${TERMS_SEGMENT[locale]}`, "/terms");
  }
}
CANONICAL_PATHS.add("/privacy");
CANONICAL_PATHS.add("/terms");

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Localized URL → rewrite to canonical internally (preserves query params)
  const canonical = LOCALIZED_TO_CANONICAL.get(pathname);
  if (canonical) {
    const url = request.nextUrl.clone();
    url.pathname = canonical;
    return NextResponse.rewrite(url);
  }

  // Canonical URL + non-en locale → redirect to localized URL
  if (CANONICAL_PATHS.has(pathname)) {
    const locale = parseSettingsCookie(
      request.cookies.get(SETTINGS_COOKIE_NAME)?.value
    ).uiLanguage;
    if (locale !== "en") {
      const localized = getLocalizedPath(pathname, locale);
      if (localized !== pathname) {
        const url = request.nextUrl.clone();
        url.pathname = localized;
        return NextResponse.redirect(url);
      }
    }
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sw.js|.*\\..*).*)" ],
};
