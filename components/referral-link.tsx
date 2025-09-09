"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ReferralLink({ link }: { link: string }) {
  const [copied, setCopied] = React.useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // no-op
    }
  };

  return (
    <div className="mt-8 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-4">
        <p className="text-center text-sm text-muted-foreground">
          Invite users with your referral link
        </p>
        <div className="mt-3 flex gap-2 items-center justify-center">
          <Input value={link} readOnly className="font-mono max-w-xl" />
          <Button onClick={onCopy} size="sm">
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>
    </div>
  );
}
