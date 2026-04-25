"use client";

import { Keyboard, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/atoms/Button";
import { Kbd } from "@/components/atoms/Kbd";
import { useIsMac } from "@/hooks/use-is-mac";

type ShortcutRow = {
  keys: string[];
  label: string;
};

type ShortcutGroup = {
  title: string;
  shortcuts: ShortcutRow[];
};

type ShortcutsModalProps = {
  open: boolean;
  onClose: () => void;
  showPrayerShortcuts?: boolean;
};

export function ShortcutsModal({ open, onClose, showPrayerShortcuts = false }: ShortcutsModalProps) {
  const t = useTranslations("shortcuts");
  const isMac = useIsMac();
  const mod = isMac ? "⌘" : "Ctrl";

  if (!open) return null;

  const groups: ShortcutGroup[] = [
    {
      title: t("groupGeneral"),
      shortcuts: [
        { keys: [mod, "."], label: t("openShortcuts") },
        { keys: [mod, ","], label: t("openSettings") },
        { keys: [mod, "/"], label: t("toggleLeftMenu") },
        { keys: ["Esc"], label: t("closePanel") },
      ],
    },
    ...(showPrayerShortcuts
      ? [
          {
            title: t("groupPrayer"),
            shortcuts: [
              { keys: ["Space"], label: t("playPause") },
              { keys: ["←"], label: t("prevStep") },
              { keys: ["→"], label: t("nextStep") },
              { keys: ["A"], label: t("toggleAutoplay") },
              { keys: [mod, "'"], label: t("togglePrayerStats") },
              { keys: ["Shift", ">"], label: t("increaseSpeed") },
              { keys: ["Shift", "<"], label: t("decreaseSpeed") },
            ],
          },
        ]
      : []),
  ];

  return (
    <div
      className="fixed inset-0 z-100 grid place-items-center bg-black/60 p-3 backdrop-blur-sm sm:p-5"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-[1.25rem] border border-line bg-ink-2 p-6 shadow-[0_2.5rem_5rem_-1.25rem_rgba(0,0,0,0.6)] sm:p-8"
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

        <div className="mb-7 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gold-soft grid place-items-center text-gold">
            <Keyboard size={22} />
          </div>

          <h2 className="font-display font-normal text-[1.625rem] m-0">
            {t("title")}
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          {groups.map((group) => (
            <div key={group.title}>
              <div className="font-ui text-[0.625rem] font-bold tracking-[0.2em] uppercase text-muted mb-3">
                {group.title}
              </div>

              <div className="flex flex-col gap-2.5">
                {group.shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.keys.join("+")}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="font-body text-sm text-muted">
                      {shortcut.label}
                    </span>

                    <div className="flex items-center gap-1 shrink-0">
                      {shortcut.keys.map((key) => (
                        <Kbd key={key}>{key}</Kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
