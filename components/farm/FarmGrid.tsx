// components/farm/FarmGrid.tsx
"use client";
import { FarmPlot } from "@/types";
import { Lock, Plus, Warehouse } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  plots: FarmPlot[];
};

export function FarmGrid({ plots }: Props) {
  return (
    <div
      className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 p-4"
      style={{
        backgroundImage: "url('/e.png')",
        backgroundSize: "cover",       // istersen 'repeat' yap
        backgroundRepeat: "repeat", // dokuysa 'repeat' yap
        backgroundPosition: "center",
      }}
    >
      {plots.map((plot) => (
        <div
          key={plot.id}
          className="aspect-square"
          style={{
            backgroundImage: "url('/d.png')",
            backgroundSize: "90% 90%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          {plot.status === "locked" && (
            <div className="flex h-full w-full flex-col items-center justify-center rounded-lg text-center">
              <Lock className="h-8 w-8 text-muted-foreground" />
              <button className="mt-2 text-sm font-semibold text-primary hover:underline">
                Upgrade
              </button>
            </div>
          )}

          {plot.status === "empty" && (
            <Link
              href="/shop"
              className="group flex h-full w-full flex-col items-center justify-center rounded-lg"
            >
              <Plus className="h-8 w-8 text-muted-foreground transition-transform group-hover:scale-125" />
              <p className="mt-2 text-sm font-semibold text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                Buy
              </p>
            </Link>
          )}

          {plot.status === "occupied" && plot.chicken && (
  <div className="flex h-full w-full items-center justify-center rounded-lg bg-green-500/10 p-2 cursor-pointer">
    <Image
      src={plot.chicken.imageUrl}
      alt={plot.chicken.name}
      width={500} // büyük bir değer, sınır max-w ile olacak
      height={500}
      className="object-contain max-w-[60%] max-h-[60%]"
    />
  </div>
)}
        </div>
      ))}
    </div>
  );
}

