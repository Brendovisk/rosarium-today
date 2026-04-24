import "./globals.css";

import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";

import { ThemeProvider } from "@/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "Rosarium Today",
  description: "Rosarium Today",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
