import { Check } from "lucide-react";

import { Button } from "@/components/atoms/Button";
import type { SupportedLocale } from "@/config/locales";
import { LOCALE_OPTIONS } from "@/config/locales";
import { cn } from "@/utils/classNames";

type LanguageSelectorProps = {
  value: SupportedLocale;
  onChange: (locale: SupportedLocale) => void;
};

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {LOCALE_OPTIONS.map(({ value: locale, label }) => {
        const active = value === locale;

        return (
          <Button
            key={locale}
            variant="outline"
            onClick={() => onChange(locale)}
            className={cn(
              "rounded-[0.625rem] flex justify-between font-display",
              active
                ? "border-gold bg-gold-soft"
                : "border-line bg-transparent hover:border-line-2"
            )}
          >
            <span>{label}</span>

            {active && (
              <span className="text-gold text-[1.125rem]">
                <Check />
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
}
