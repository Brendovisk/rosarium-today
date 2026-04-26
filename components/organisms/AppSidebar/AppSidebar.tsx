"use client";

import { AnimatePresence, motion } from "framer-motion";
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

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/atoms/Tooltip";
import type { MysteryKey } from "@/config/rosary";
import { cn } from "@/utils/classNames";

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  todaysMystery: MysteryKey;
}

export function AppSidebar({
  collapsed,
  onToggle,
  todaysMystery,
}: AppSidebarProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();

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
    <div className="z-50 min-w-0  h-screen sticky bottom-0 top-0">
      <aside
        className={cn(
          "h-screen w-full min-w-0 border-r border-line flex flex-col overflow-hidden",
          "bg-[linear-gradient(180deg,rgba(198,161,91,0.04),transparent_40%),rgba(0,0,0,0.12)]",
          "transition-[padding] duration-300 ease-[cubic-bezier(.2,.7,.2,1)]",
          collapsed ? "px-2.5 py-8" : "px-7 pt-8 pb-6"
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={cn(
                "absolute top-8 w-8 h-8 rounded-full border border-line bg-ink-2 text-muted",
                "grid place-items-center z-50 transition-colors hover:text-gold hover:border-gold-dim",
                collapsed ? "right-0 translate-x-1/2" : "-right-3.5"
              )}
              onClick={onToggle}
              aria-label={collapsed ? t("expandMenu") : t("collapseMenu")}
            >
              {collapsed ? (
                <ChevronRight size={14} />
              ) : (
                <ChevronLeft size={14} />
              )}
            </button>
          </TooltipTrigger>

          <TooltipContent side="right">
            {collapsed ? t("expandMenu") : t("collapseMenu")}
          </TooltipContent>
        </Tooltip>

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {!collapsed ? (
            <AnimatePresence>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
                  },
                }}
                className="flex flex-col flex-1 gap-8 min-w-0 overflow-hidden"
              >
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="min-w-0 overflow-hidden whitespace-nowrap"
                >
                  <div className="overflow-hidden text-ellipsis font-display font-medium text-gold text-[2.125rem] leading-none tracking-[0.01em]">
                    {t("title")}
                  </div>

                  <div className="mt-1.5 overflow-hidden text-ellipsis whitespace-nowrap font-ui text-[0.625rem] uppercase tracking-[0.32em] text-muted-2">
                    Today · MMXXVI
                  </div>
                </motion.div>

                <motion.nav
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex flex-col gap-2.5"
                >
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap px-2.5 pb-2 pt-3 font-ui text-[0.625rem] font-bold uppercase tracking-[0.22em] text-muted-2">
                    {t("prayerSection")}
                  </div>

                  {navItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 overflow-hidden rounded-[0.875rem] px-3 py-2.5 font-ui text-sm text-muted transition-colors",
                        "hover:bg-white/3 hover:text-bone",
                        item.active && "bg-gold-soft text-bone"
                      )}
                    >
                      <span className="w-4.5 h-4.5 grid place-items-center text-gold shrink-0">
                        {item.icon}
                      </span>

                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </motion.nav>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="mt-auto max-w-full overflow-hidden border-t border-line pt-4 font-display text-base italic leading-normal text-muted"
                >
                  &ldquo;{t("footerQuote")}&rdquo;
                </motion.div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <>
              <div className="font-display font-medium text-[2.375rem] text-gold text-center leading-none">
                R
              </div>

              <nav className="flex flex-col items-center gap-2.5 mt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    title={item.label}
                    className={cn(
                      "w-10 flex justify-center items-center py-2.5 rounded-[0.875rem] text-muted transition-colors",
                      "hover:bg-white/3 hover:text-bone",
                      item.active && "bg-gold-soft text-bone"
                    )}
                  >
                    <span className="text-gold">{item.icon}</span>
                  </Link>
                ))}
              </nav>

              <CrossIcon className="text-muted/50 mt-auto mx-auto" size={24} />
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
