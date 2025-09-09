
import { Coins, Wallet } from "lucide-react";

// TypeScript ile bakiye verisinin tipini tanımlayalım
type Balance = {
  currency: string;
  amount: number;
  icon: React.ElementType; // İkonu da tipin bir parçası yapalım
};

// Geçici bakiye verileri
const userBalances: Balance[] = [
  { currency: "$EGG", amount: 1250.75, icon: Coins },
  { currency: "ETH", amount: 0.08, icon: Wallet },
];

// Bakiye Görüntüleme Componenti
export default function BalanceDisplay() {
  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-background p-3">
      <p className="text-xs font-normal text-muted-foreground">Bakiyelerim</p>
      {userBalances.map((balance) => (
        <div key={balance.currency} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <balance.icon className="h-4 w-4 text-muted-foreground" />
            <span className="font-xs">{balance.currency}</span>
          </div>
          <span className="font-mono text-sm">
            {balance.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
          </span>
        </div>
      ))}
    </div>
  );
}

