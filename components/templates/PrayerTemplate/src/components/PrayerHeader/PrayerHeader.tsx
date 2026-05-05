import {
  ChevronLeft,
  Heart,
  Image as ImageIcon,
  Moon,
  Music2,
  Settings,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Button } from "@/components/atoms/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/atoms/Tooltip";
import { cn } from "@/utils/classNames";

type PrayerHeaderProps = {
  mysteryShortName: string;
  decadeIndex: number;
  activeDecadeName: string;
  artworkEnabled: boolean;
  binauralEnabled: boolean;
  onDonate: () => void;
  onToggleTheme: () => void;
  onToggleBinaural: () => void;
  onToggleArtwork: () => void;
  onOpenSettings: () => void;
};

export function PrayerHeader({
  mysteryShortName,
  decadeIndex,
  activeDecadeName,
  artworkEnabled,
  binauralEnabled,
  onDonate,
  onToggleTheme,
  onToggleBinaural,
  onToggleArtwork,
  onOpenSettings,
}: PrayerHeaderProps) {
  const t = useTranslations("prayer");
  const tControls = useTranslations("controls");
  const tSettings = useTranslations("settings");

  return (
    <header
      className={cn(
        "sticky top-0 z-10 grid shrink-0 grid-cols-[1fr_auto] items-center gap-4 px-4 lg:grid-cols-[1fr_auto_1fr] lg:pl-10 lg:pr-4 min-h-[4.5rem] lg:min-h-[5.125rem]",
        artworkEnabled
          ? ""
          : "border-b border-line bg-ink/75 backdrop-blur-[0.875rem]"
      )}
    >
      <div className="min-w-0 justify-self-start">
        <Link
          href="/"
          className="mb-1 inline-flex items-center gap-1 font-ui text-sm text-muted transition-colors hover:text-bone"
        >
          <ChevronLeft size={16} />
          {t("back")}
        </Link>
      </div>

      <div className="hidden min-w-0 text-center lg:block">
        <div className="truncate font-display text-[1.125rem] font-medium text-bone">
          {mysteryShortName}
        </div>

        <div className="mt-1 truncate font-display text-sm italic text-muted">
          {decadeIndex >= 0
            ? t("decadeSubtitle", {
                n: decadeIndex + 1,
                name: activeDecadeName,
              })
            : activeDecadeName}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 justify-self-end sm:gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={onDonate}
              aria-label={t("donate")}
              className="text-muted"
            >
              <Heart size={18} />
            </Button>
          </TooltipTrigger>

          <TooltipContent>{t("donate")}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={onToggleTheme}
              aria-label={tControls("toggleTheme")}
              className="text-muted"
            >
              <Sun className="hidden dark:block" size={18} />
              <Moon className="dark:hidden" size={18} />
            </Button>
          </TooltipTrigger>

          <TooltipContent>{tControls("toggleTheme")}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={binauralEnabled ? "default" : "outline"}
              size="icon"
              onClick={onToggleBinaural}
              aria-label={tControls(
                binauralEnabled ? "disableBinaural" : "enableBinaural"
              )}
              className={binauralEnabled ? "" : "text-muted"}
            >
              <Music2 size={18} />
            </Button>
          </TooltipTrigger>

          <TooltipContent>
            {tControls(binauralEnabled ? "disableBinaural" : "enableBinaural")}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={artworkEnabled ? "default" : "outline"}
              size="icon"
              onClick={onToggleArtwork}
              aria-label={tControls(
                artworkEnabled ? "hideArtwork" : "showArtwork"
              )}
              className={artworkEnabled ? "" : "text-muted"}
            >
              <ImageIcon size={18} />
            </Button>
          </TooltipTrigger>

          <TooltipContent>
            {tControls(artworkEnabled ? "hideArtwork" : "showArtwork")}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={onOpenSettings}
              aria-label={tSettings("title")}
              className="text-muted"
            >
              <Settings size={18} />
            </Button>
          </TooltipTrigger>

          <TooltipContent>{tSettings("title")}</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
