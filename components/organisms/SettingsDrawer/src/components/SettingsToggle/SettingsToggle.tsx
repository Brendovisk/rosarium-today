import { cn } from "@/utils/classNames";

type SettingsToggleProps = {
  enabled: boolean;
  onToggle: () => void;
  label: string;
  sub: string;
};

export function SettingsToggle({
  enabled,
  onToggle,
  label,
  sub,
}: SettingsToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "w-full flex items-center justify-between rounded-[0.875rem] border p-[1rem_1.125rem] transition-all",
        enabled
          ? "border-gold bg-gold-soft"
          : "border-line bg-transparent hover:border-line-2"
      )}
    >
      <div className="text-left">
        <div className="font-display text-[0.9375rem] text-bone leading-none">
          {label}
        </div>

        <div className="font-ui text-[0.625rem] tracking-[0.14em] uppercase text-muted-2 mt-1">
          {sub}
        </div>
      </div>

      <div
        className={cn(
          "w-10 h-6 rounded-full relative transition-colors shrink-0",
          enabled ? "bg-gold" : "bg-line-2"
        )}
      >
        <div
          className={cn(
            "absolute top-1 w-4 h-4 rounded-full bg-ink transition-transform",
            enabled ? "translate-x-5" : "translate-x-1"
          )}
        />
      </div>
    </button>
  );
}
