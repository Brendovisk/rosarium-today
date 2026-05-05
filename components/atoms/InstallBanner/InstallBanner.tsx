"use client";

import { Download, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/components/atoms/Button";

type BeforeInstallPromptEvent = Event & {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISSED_KEY = "pwa-install-dismissed";

export function InstallBanner() {
  const t = useTranslations("install");

  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (localStorage.getItem(DISMISSED_KEY)) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!deferredPrompt) return null;

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted" || outcome === "dismissed") {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "1");

    setDeferredPrompt(null);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gold-dim bg-ink-2/95 px-4 py-4 shadow-[0_-2rem_4rem_-1rem_rgba(0,0,0,0.6)] backdrop-blur-md lg:hidden">
      <div className="flex items-center gap-4 px-2 py-1">
        <div className="min-w-0 flex-1">
          <p className="text-base leading-snug text-bone">
            {t("before")} <em className="text-gold">Rosarium Today</em>{" "}
            {t("after")}
          </p>

          <p className="mt-4 font-ui text-xs text-muted">{t("subtitle")}</p>
        </div>

        <Button
          size="icon"
          variant="outline"
          onClick={handleDismiss}
          aria-label={t("dismiss")}
        >
          <X />
        </Button>
      </div>

      <Button className="mt-3 w-full font-ui" onClick={handleInstall}>
        {t("install")}
        <Download className="size-4" />
      </Button>
    </div>
  );
}
