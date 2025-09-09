import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ReferralLink from "@/components/referral-link";

function maskAddress(addr: string) {
  if (!addr) return "";
  if (addr.length <= 10) return addr;
  const start = addr.slice(0, 5);
  const end = addr.slice(-5);
  const masked = "*".repeat(Math.max(0, addr.length - 10));
  return `${start}${masked}${end}`;
}

const addresses = [
  "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
  "0xA9b8C7d6E5f4A3b2C1d0E9f8A7b6C5d4E3f2A1b0",
  "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kz0f4yr",
  "0x12345abcdef67890abcdef12345abcdef67890ab",
  "0xDEADBEEFCAFEBABE000011112222333344445555",
  "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy",
];

export default function ReferencesPage() {
  const referralLink = "https://example.com/ref/ABC123";
  const totalReferrals = addresses.length;
  const totalEarnings = "0.44 $EGG";
  return (
    <div className="mt-20 px-4 flex justify-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center">References</h1>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 text-center flex flex-col items-center">
            <div className="text-sm text-muted-foreground px-2 min-h-[2.5rem] flex items-center justify-center">
              Total referral count
            </div>
            <div className="text-2xl font-semibold mt-1">{totalReferrals}</div>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 text-center flex flex-col items-center">
            <div className="text-sm text-muted-foreground px-2 min-h-[2.5rem] flex items-center justify-center">
              Total earnings from referrals
            </div>
            <div className="text-2xl font-semibold mt-1">{totalEarnings}</div>
          </div>
        </div>

        <h2 className="mt-8 text-base font-medium text-center">Your reference addresses</h2>

        <div className="mt-8 rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {addresses.map((addr) => (
                  <TableRow key={addr} title={addr}>
                    <TableCell className="font-mono text-sm truncate">
                      {maskAddress(addr)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <ReferralLink link={referralLink} />
      </div>
    </div>
  );
}
