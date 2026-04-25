import { notFound } from "next/navigation";

import { PrayerTemplate } from "@/components/templates/PrayerTemplate";
import { getTodaysMystery, isMysteryKey } from "@/config/rosary";

type PrayerPageProps = {
  params: Promise<{ mystery: string }>;
  searchParams: Promise<{ silent?: string }>;
};

export default async function PrayerPage({
  params,
  searchParams,
}: PrayerPageProps) {
  const [{ mystery }, { silent }] = await Promise.all([params, searchParams]);

  if (!isMysteryKey(mystery)) {
    notFound();
  }

  return (
    <PrayerTemplate
      key={mystery}
      mysteryKey={mystery}
      todaysMystery={getTodaysMystery()}
      isSilent={silent === "1"}
    />
  );
}
