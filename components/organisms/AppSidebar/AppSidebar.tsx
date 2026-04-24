"use client";

import {
  ChevronLeft,
  ChevronRight,
  CrossIcon,
  Heart,
  Home,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { getTodaysMystery } from "@/config/rosary";
import { cn } from "@/lib/classNames";

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const todaysMystery = getTodaysMystery();

  const isHome = pathname === "/" || pathname === "";
  const isPray = pathname.includes("/prayer/");

  const navItems = [
    {
      id: "home",
      label: t("home"),
      icon: <Home size={18} />,
      href: "/",
      active: isHome,
    },
    {
      id: "pray",
      label: t("pray"),
      icon: <Heart size={18} />,
      href: `/prayer/${todaysMystery}`,
      active: isPray,
    },
  ];

  return (
    <div className="relative z-50">
      <aside
        className={cn(
          "sticky top-0 h-screen border-r border-line flex flex-col gap-8",
          "bg-[linear-gradient(180deg,rgba(198,161,91,0.04),transparent_40%),rgba(0,0,0,0.12)]",
          "transition-[padding,width] duration-300 ease-[cubic-bezier(.2,.7,.2,1)]",
          collapsed ? "px-[10px] py-8 w-16" : "px-7 py-8 w-60"
        )}
      >
        <button
          className={cn(
            "absolute top-8 w-8 h-8 rounded-full border border-line bg-ink-2 text-muted",
            "grid place-items-center z-50 transition-colors hover:text-gold hover:border-gold-dim",
            collapsed ? "right-0 translate-x-1/2" : "right-[-14px]"
          )}
          onClick={onToggle}
          aria-label={collapsed ? "Expand menu" : "Collapse menu"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {!collapsed ? (
          <>
            <div className="text-nowrap">
              <div className="font-display font-medium text-gold text-[34px] leading-none tracking-[0.01em]">
                {t("title")}
              </div>

              <div className="font-ui text-[10px] tracking-[0.32em] uppercase text-muted-2 mt-1.5">
                Today · MMXXVI
              </div>
            </div>

            <nav className="flex flex-col gap-0.5">
              <div className="font-ui text-[10px] font-bold tracking-[0.22em] uppercase text-muted-2 px-2.5 pt-3 pb-2">
                {t("prayerSection")}
              </div>

              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 rounded-[0.875rem] py-2.5 font-ui text-sm text-muted transition-colors",
                    "hover:bg-white/[0.03] hover:text-bone",
                    item.active && "bg-gold-soft text-bone"
                  )}
                >
                  <span className="w-[18px] h-[18px] grid place-items-center text-gold shrink-0">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto font-display italic text-base text-muted-2 leading-[1.5] pt-5 border-t border-line min-w-[11.4375rem]">
              &ldquo;{t("footerQuote")}&rdquo;
            </div>
          </>
        ) : (
          <>
            <div className="font-display font-medium text-[2.375rem] text-gold text-center leading-none">
              R
            </div>

            <nav className="flex flex-col items-center gap-0.5 mt-6">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  title={item.label}
                  className={cn(
                    "w-10 flex justify-center items-center py-2.5 rounded-[0.875rem] text-muted transition-colors",
                    "hover:bg-white/[0.03] hover:text-bone",
                    item.active && "bg-gold-soft text-bone"
                  )}
                >
                  <span className="text-gold">{item.icon}</span>
                </Link>
              ))}
            </nav>

            {/* cross */}
            <CrossIcon className="text-muted/50 mt-auto mx-auto" size={24} />
          </>
        )}
      </aside>
    </div>
  );
}
