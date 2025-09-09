import { ChickenCard } from "@/components/shop/ChickenCard";
import { Chicken } from "@/types";

// Satılacak tavukların listesi (Geçici Veri)
const chickensForSale: Chicken[] = [
  { id: 1, name: "Normal Tavuk", imageUrl: "/chickens/1.png", productionRate: 0.1, price: 8 },
  { id: 2, name: "Hızlı Tavuk", imageUrl: "/chickens/1.png", productionRate: 0.2, price: 15 },
  { id: 3, name: "Süper Tavuk", imageUrl: "/chickens/1.png", productionRate: 0.5, price: 35 },
  { id: 4, name: "Altın Tavuk", imageUrl: "/chickens/1.png", productionRate: 1.2, price: 80 },
  { id: 5, name: "Robot Tavuk", imageUrl: "/chickens/1.png", productionRate: 2.5, price: 150 },
  { id: 6, name: "Ninja Tavuk", imageUrl: "/chickens/1.png", productionRate: 5.0, price: 320 },
  { id: 7, name: "Ejderha Tavuk", imageUrl: "/chickens/1.png", productionRate: 10, price: 700 },
  { id: 8, name: "Kozmik Tavuk", imageUrl: "/chickens/1.png", productionRate: 25, price: 1500 },
];


export default function ShopPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Marketplace</h1>
        <p className="text-muted-foreground mt-2">Yeni tavuklar alarak üretimini artır!</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {chickensForSale.map((chicken) => (
          <ChickenCard key={chicken.id} chicken={chicken} />
        ))}
      </div>
    </div>
  );
}