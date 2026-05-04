"use server";

import { cookies } from "next/headers";

import {
  type AppSettings,
  serializeSettingsCookie,
  SETTINGS_COOKIE_NAME,
} from "@/config/settings";

export async function saveSettingsCookie(settings: AppSettings) {
  const cookieStore = await cookies();

  cookieStore.set(SETTINGS_COOKIE_NAME, serializeSettingsCookie(settings), {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
