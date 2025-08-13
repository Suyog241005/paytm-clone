"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

interface BalanceProps {
  unlockedBalance: number;
  lockedBalance: number;
  totalBalance: number;
}
export const Balance = ({
  unlockedBalance,
  lockedBalance,
  totalBalance,
}: BalanceProps) => {
  return (
    <Card className="h-1/2">
      <CardHeader>
        <CardTitle>Balance</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2">
        <div className="flex">
          <div className="">Unlocked Balance</div>
          <div className="ml-auto">{unlockedBalance} INR</div>
        </div>
        <hr />
        <div className="flex">
          <div>Total Locked Balance</div>
          <div className="ml-auto">{lockedBalance} INR</div>
        </div>
        <hr />
        <div className="flex">
          <div>Total Balance</div>
          <div className="ml-auto">{totalBalance} INR</div>
        </div>
        <hr />
      </CardContent>
    </Card>
  );
};
