// components/farm/MiningStatsCard.tsx
import { Gauge, Zap, Hourglass } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import NineSlicePanel from "../ui/NineSlicePanel";

type Props = {
  dailyMining: number;
  hashRate: number;
  blocksUntilHalvening: number;
};

export function MiningStatsCard({ dailyMining, hashRate, blocksUntilHalvening }: Props) {
  return (
    <NineSlicePanel slice={24}>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-3">
          <Gauge className="h-5 w-5 text-muted-foreground" />
          <p>You are mining <span className="font-bold text-primary">{formatNumber(dailyMining)} $EGG</span> a day</p>
        </div>
        <div className="flex items-center gap-3">
          <Zap className="h-5 w-5 text-muted-foreground" />
          <p>Your hash rate is <span className="font-bold text-primary">{hashRate} GH/s</span></p>
        </div>
        <div className="flex items-center gap-3">
          <Hourglass className="h-5 w-5 text-muted-foreground" />
          <p><span className="font-bold text-primary">{formatNumber(blocksUntilHalvening)}</span> until next halvening</p>
        </div>
      </div>
    </NineSlicePanel>
  );
}