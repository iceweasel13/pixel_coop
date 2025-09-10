// components/farm/ClaimCard.tsx
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";
import NineSlicePanel from "../ui/NineSlicePanel";

type Props = {
  minedEgg: number;
};

export function ClaimCard({ minedEgg }: Props) {
  return (
    <NineSlicePanel slice={24}>
      <div className="flex flex-col justify-between p-4">
        <div>
          <p className="text-muted-foreground">You have mined</p>
          <p className="text-3xl font-bold text-primary">{formatNumber(minedEgg)} $EGG</p>
        </div>
        <Button className="mt-4 w-full">CLAIM MINED $EGG</Button>
      </div>
    </NineSlicePanel>
  );
}