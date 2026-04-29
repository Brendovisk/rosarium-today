import "./globals.css";

import type { Metadata } from "next";
import {
  Cinzel,
  Cormorant_Garamond,
  Inter,
  Source_Serif_4,
} from "next/font/google";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import type { CSSProperties, ReactNode } from "react";

import { InstallBanner } from "@/components/atoms/InstallBanner";
import { ServiceWorkerRegistration } from "@/components/atoms/ServiceWorkerRegistration";
import { getAccentVars } from "@/config/accents";
import { parseSettingsCookie, SETTINGS_COOKIE_NAME } from "@/config/settings";
import { SettingsProvider } from "@/providers/SettingsProvider";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-source-serif",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rosarium Today",
  description:
    "A quiet place to pray the Holy Rosary — word-by-word audio, three languages, no ads.",
  appleWebApp: {
    capable: true,
    title: "Rosarium",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <LayoutContent>{children}</LayoutContent>;
}

async function LayoutContent({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();

  const settings = parseSettingsCookie(
    cookieStore.get(SETTINGS_COOKIE_NAME)?.value
  );

  const accentVars = getAccentVars(settings.accent, settings.theme);

  const themeClassName =
    settings.theme === "dark" ? "dark theme-dark" : "light theme-light";

  return (
    <html
      lang={settings.uiLanguage}
      suppressHydrationWarning
      className={`${cormorant.variable} ${sourceSerif.variable} ${cinzel.variable} ${inter.variable} ${themeClassName}`}
      style={
        {
          "--gold": accentVars.gold,
          "--gold-dim": accentVars.dim,
          "--gold-soft": accentVars.soft,
          colorScheme: settings.theme,
        } as CSSProperties
      }
    >
      <body className="antialiased">
        <SettingsProvider initialSettings={settings}>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </SettingsProvider>

        <ServiceWorkerRegistration />

        <InstallBanner />
      </body>
    </html>
  );
}
