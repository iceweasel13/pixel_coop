// app/page.tsx
import { CapacityCard } from "@/components/farm/CapacityCard";
import { ClaimCard } from "@/components/farm/ClaimCard";
import { FarmGrid } from "@/components/farm/FarmGrid";
import { MiningStatsCard } from "@/components/farm/MiningStatsCard";
import WoodenPanel from "@/components/ui/WoodenPanel";
import { FarmPlot, FarmStats } from "@/types";


// AKILLI KONTRAT BAĞLANANA KADAR GEÇİCİ VERİLER
const farmStats: FarmStats = {
  dailyMining: 2500,
  hashRate: 100,
  blocksUntilHalvening: 1_000_000,
  minedEgg: 124.56,
  spacesLeft: 3,
  totalMhs: 27,
};

const farmPlots: FarmPlot[] = [
  { id: 1, status: 'occupied', chicken: { name: 'Normal Tavuk', imageUrl: '/chickens/2.png' } },
  { id: 2, status: 'occupied', chicken: { name: 'Hızlı Tavuk', imageUrl: '/chickens/2.png' } },
  { id: 3, status: 'occupied', chicken: { name: 'Süper Tavuk', imageUrl: '/chickens/1.png' } },
  { id: 4, status: 'empty' },
  { id: 5, status: 'empty' },
  { id: 6, status: 'empty' },
  { id: 7, status: 'locked' },
  { id: 8, status: 'locked' },
  { id: 9, status: 'locked' },
  { id: 10, status: 'locked' },
  { id: 11, status: 'locked' },
  { id: 12, status: 'locked' },
];

export default function FarmPage() {
  return (
    <div className="w-full">
      {/* Üst İstatistik Alanı */}
      <div
        className="w-full bg-repeat-x bg-left py-8 sm:py-12 lg:py-16"
        style={{
          backgroundImage: "url(/sky.png)",
          backgroundSize: "auto 100%",
        }}
      >
        <section className="p-4 sm:p-6 lg:p-8">
          <h2 className="text-2xl font-bold">Stats</h2>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <MiningStatsCard
              dailyMining={farmStats.dailyMining}
              hashRate={farmStats.hashRate}
              blocksUntilHalvening={farmStats.blocksUntilHalvening}
            />
            <ClaimCard minedEgg={farmStats.minedEgg} />
            <CapacityCard
              spacesLeft={farmStats.spacesLeft}
              totalMhs={farmStats.totalMhs}
            />
          </div>
        </section>
      </div>

      {/* Alt Çiftlik Alanı */}
      <div
        className="w-full bg-repeat-x bg-left py-2 sm:py-3 lg:py-4"
        style={{
          backgroundImage: "url(/cc.png)",
          backgroundSize: "auto",
          backgroundRepeat: "repeat",
          backgroundPosition: "left",
        }}
      >
        <section className="mt-2 p-4 sm:p-6 lg:p-8">
          <h2 className="text-2xl font-bold mb-4">Your Coop</h2>
          <WoodenPanel slice={24}>
              <FarmGrid plots={farmPlots} />
          </WoodenPanel>
        </section>
      </div >
    </div >
  );
}
