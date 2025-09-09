// components/farm/ClaimCard.tsx
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";

type Props = {
  minedEgg: number;
};

export function ClaimCard({ minedEgg }: Props) {
  return (
    <div className="flex flex-col justify-between rounded-lg border bg-card p-4">
      <div>
        <p className="text-muted-foreground">You have mined</p>
        <p className="text-3xl font-bold text-primary">{formatNumber(minedEgg)} $EGG</p>
      </div>
      <Button className="mt-4 w-full">CLAIM MINED $EGG</Button>
    </div>
  );
}