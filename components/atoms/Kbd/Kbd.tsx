import { cn } from "@/utils/classNames";

type KbdProps = {
  children: React.ReactNode;
  className?: string;
};

export function Kbd({ children, className }: KbdProps) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center rounded-[0.3125rem]",
        "border border-line-2 bg-ink-3",
        "px-1.5 py-px font-ui text-[0.6875rem] font-medium text-muted",
        "shadow-[0_1px_0_0_rgba(255,255,255,0.06)]",
        className
      )}
    >
      {children}
    </kbd>
  );
}
