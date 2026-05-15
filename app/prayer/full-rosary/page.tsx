import { FullRosaryTemplate } from "@/components/templates/FullRosaryTemplate";
import { getTodaysMystery } from "@/config/rosary";

export default function FullRosaryPage() {
  return <FullRosaryTemplate todaysMystery={getTodaysMystery()} />;
}
