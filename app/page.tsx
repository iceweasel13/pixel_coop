// app/page.tsx
import { CapacityCard } from "@/components/farm/CapacityCard";
import { ClaimCard } from "@/components/farm/ClaimCard";
import { FarmGrid } from "@/components/farm/FarmGrid";
import { MiningStatsCard } from "@/components/farm/MiningStatsCard";
import TiledMap from "@/components/tiled/TiledMap";
import WoodenPanel from "@/components/ui/WoodenPanel";
import { FarmPlot, FarmStats } from "@/types";

export default function FarmPage() {
  return (
    <div className="w-full min-h-screen overflow-hidden">
      <TiledMap
        src="/maps/level1.json"
        mode="manual"
        viewportPercent={200}
        basis="width"
        alignY="top"
      />
    </div>
  );
}