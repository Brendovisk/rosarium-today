"use server";

import { cookies } from "next/headers";

import {
  type AppSettings,
  normalizeSettings,
  serializeSettingsCookie,
  SETTINGS_COOKIE_NAME,
} from "@/config/settings";

export async function saveSettingsCookie(settings: AppSettings) {
  const cookieStore = await cookies();
  const normalizedSettings = normalizeSettings(settings);

  cookieStore.set(SETTINGS_COOKIE_NAME, serializeSettingsCookie(normalizedSettings), {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
