"use client";

import { ExternalLink, Heart, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/classNames";

const PIX_KEY = "";
const KOFI_URL = "";
const BMC_URL = "";

type DonateModalProps = {
  open: boolean;
  onClose: () => void;
};

export function DonateModal({ open, onClose }: DonateModalProps) {
  const t = useTranslations("donate");
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard?.writeText(PIX_KEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 grid place-items-center bg-black/60 p-3 backdrop-blur-sm sm:p-5"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-140 overflow-y-auto rounded-[1.25rem] border border-line bg-ink-2 p-6 shadow-[0_2.5rem_5rem_-1.25rem_rgba(0,0,0,0.6)] sm:p-[2.375rem_2.75rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          onClick={onClose}
          variant="outline"
          size="icon"
          className="absolute top-5 right-5"
        >
          <X size={16} />
        </Button>

        <div className="text-center mb-7">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold-soft grid place-items-center text-gold">
            <Heart size={28} />
          </div>

          <div className="font-ui text-[0.625rem] font-bold tracking-[0.26em] uppercase text-gold mb-1.5">
            {t("eyebrow")}
          </div>

          <h2 className="font-display font-normal text-[2rem] m-0 mb-3 leading-[1.2]">
            {t("title")} <em className="italic">{t("titleEmphasis")}</em>
          </h2>

          <p className="font-body text-[0.9375rem] text-muted leading-[1.6] m-0">
            {t("body")}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="p-[1.125rem_1.25rem] rounded-[0.875rem] border border-gold-dim bg-gold-soft">
            <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="font-ui text-[0.625rem] font-bold tracking-[0.2em] uppercase text-gold">
                Pix · Brasil
              </div>

              <div className="font-display italic  text-muted">
                {t("pixType")}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <code className="break-all font-ui text-[0.9375rem] tracking-[0.02em] text-bone">
                {PIX_KEY}
              </code>

              <Button onClick={handleCopy} size="lg">
                {copied ? t("copied") : t("copy")}
              </Button>
            </div>
          </div>

          <a
            href={`https://${KOFI_URL}`}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "flex flex-col gap-3 rounded-[0.875rem] border border-line bg-ink-3 p-[1rem_1.25rem] no-underline transition-colors hover:border-gold-dim sm:flex-row sm:items-center sm:justify-between"
            )}
          >
            <div>
              <div className="font-display text-[1.1875rem] text-bone">
                Ko-fi
              </div>
              <div className="break-all font-ui text-[0.75rem] text-muted">
                {KOFI_URL}
              </div>
            </div>

            <span className="text-gold font-ui text-[0.6875rem] font-bold tracking-[0.2em] uppercase flex items-center gap-1">
              {t("openLink")} <ExternalLink size={12} />
            </span>
          </a>

          <a
            href={`https://${BMC_URL}`}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "flex flex-col gap-3 rounded-[0.875rem] border border-line bg-ink-3 p-[1rem_1.25rem] no-underline transition-colors hover:border-gold-dim sm:flex-row sm:items-center sm:justify-between"
            )}
          >
            <div>
              <div className="font-display text-[1.1875rem] text-bone">
                Buy Me a Coffee
              </div>
              <div className="break-all font-ui text-[0.75rem] text-muted">
                {BMC_URL}
              </div>
            </div>

            <span className="text-gold font-ui text-[0.6875rem] font-bold tracking-[0.2em] uppercase flex items-center gap-1">
              {t("openLink")} <ExternalLink size={12} />
            </span>
          </a>
        </div>

        <div className="mt-6 pt-5 border-t border-line font-display italic text-lg text-muted-2 text-center">
          {t("footerNote")}
        </div>
      </div>
    </div>
  );
}
