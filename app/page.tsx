import { HomeTemplate } from "@/components/templates/HomeTemplate";
import { getTodaysMystery } from "@/config/rosary";

export default function HomePage() {
  const todaysMystery = getTodaysMystery();

  return <HomeTemplate todaysMystery={todaysMystery} />;
}
