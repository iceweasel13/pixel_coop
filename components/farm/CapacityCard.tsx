// components/farm/CapacityCard.tsx
import { ThumbsUp, Warehouse } from "lucide-react";
import NineSlicePanel from "../ui/NineSlicePanel";

type Props = {
  spacesLeft: number;
  totalMhs: number;
};

export function CapacityCard({ spacesLeft, totalMhs }: Props) {
  return (
    <NineSlicePanel slice={24}>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-3">
          <Warehouse className="h-5 w-5 text-muted-foreground" />
          <p>
            <span className="font-bold text-primary">{spacesLeft}</span> Spaces LEFT
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ThumbsUp className="h-5 w-5 text-muted-foreground" />
          <p>
            <span className="font-bold text-primary">{totalMhs} MHS</span> Total Capacity
          </p>
        </div>
      </div>
    </NineSlicePanel>
  );
}
