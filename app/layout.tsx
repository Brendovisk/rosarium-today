import "./globals.css";

import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";

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
    <html lang="en">
      <body className="antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
