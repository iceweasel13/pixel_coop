// app/page.tsx
import { CapacityCard } from "@/components/farm/CapacityCard";
import { ClaimCard } from "@/components/farm/ClaimCard";
import { FarmGrid } from "@/components/farm/FarmGrid";
import { MiningStatsCard } from "@/components/farm/MiningStatsCard";
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
    { id: 1, status: 'occupied', chicken: { name: 'Normal Tavuk', imageUrl: '/chickens/1.png' } },
    { id: 2, status: 'occupied', chicken: { name: 'Hızlı Tavuk', imageUrl: '/chickens/1.png' } },
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
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Üst İstatistik Alanı */}
      <section>
        <h2 className="text-2xl font-bold">Stats</h2>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <MiningStatsCard 
            dailyMining={farmStats.dailyMining} 
            hashRate={farmStats.hashRate}
            blocksUntilHalvening={farmStats.blocksUntilHalvening}
          />
          <ClaimCard minedEgg={farmStats.minedEgg} />
          <CapacityCard spacesLeft={farmStats.spacesLeft} totalMhs={farmStats.totalMhs} />
        </div>
      </section>

      {/* Alt Çiftlik Alanı */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Your Coop</h2>
        {/* Burası ileride görsel bir kümes resmi ile değiştirilebilir */}
        <div className="rounded-lg border bg-card p-4">
            <FarmGrid plots={farmPlots} />
        </div>
      </section>
    </div>
  );
}