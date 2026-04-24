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
      className="fixed inset-0 bg-black/60 grid place-items-center z-[100] p-5 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-[560px] max-w-full max-h-[90vh] overflow-y-auto bg-ink-2 border border-line rounded-[20px] p-[38px_44px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] relative"
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

          <div className="font-ui text-[10px] font-bold tracking-[0.26em] uppercase text-gold mb-1.5">
            {t("eyebrow")}
          </div>

          <h2 className="font-display font-normal text-[32px] m-0 mb-3 leading-[1.2]">
            {t("title")} <em className="italic">{t("titleEmphasis")}</em>
          </h2>

          <p className="font-body text-[15px] text-muted leading-[1.6] m-0">
            {t("body")}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="p-[18px_20px] rounded-[14px] border border-gold-dim bg-gold-soft">
            <div className="flex justify-between items-center mb-2">
              <div className="font-ui text-[10px] font-bold tracking-[0.2em] uppercase text-gold">
                Pix · Brasil
              </div>

              <div className="font-display italic text-[13px] text-muted">
                {t("pixType")}
              </div>
            </div>

            <div className="flex items-center gap-3 justify-between">
              <code className="font-ui text-[15px] text-bone tracking-[0.02em]">
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
              "p-[16px_20px] rounded-[14px] border border-line bg-ink-3 flex items-center justify-between no-underline hover:border-gold-dim transition-colors"
            )}
          >
            <div>
              <div className="font-display text-[19px] text-bone">Ko-fi</div>
              <div className="font-ui text-[12px] text-muted">{KOFI_URL}</div>
            </div>

            <span className="text-gold font-ui text-[11px] font-bold tracking-[0.2em] uppercase flex items-center gap-1">
              {t("openLink")} <ExternalLink size={12} />
            </span>
          </a>

          <a
            href={`https://${BMC_URL}`}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "p-[16px_20px] rounded-[14px] border border-line bg-ink-3 flex items-center justify-between no-underline hover:border-gold-dim transition-colors"
            )}
          >
            <div>
              <div className="font-display text-[19px] text-bone">
                Buy Me a Coffee
              </div>
              <div className="font-ui text-[12px] text-muted">{BMC_URL}</div>
            </div>

            <span className="text-gold font-ui text-[11px] font-bold tracking-[0.2em] uppercase flex items-center gap-1">
              {t("openLink")} <ExternalLink size={12} />
            </span>
          </a>
        </div>

        <div className="mt-6 pt-5 border-t border-line font-display italic text-[13px] text-muted-2 text-center">
          {t("footerNote")}
        </div>
      </div>
    </div>
  );
}
