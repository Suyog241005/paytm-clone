import { signIn } from "@/auth";
import { currentUser } from "@/lib/current-user";
import { db } from "@workspace/db/db";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CreditCardIcon,
  WalletIcon,
  PlusIcon,
  SendIcon,
  HistoryIcon,
} from "lucide-react";
import Link from "next/link";

const Dashboard = async () => {
  const user = await currentUser();

  if (!user) {
    return await signIn();
  }

  const balance = await db.balance.findFirst({
    where: { userId: user.id },
  });

  const totalBalance = (balance?.amount || 0) / 100;
  const lockedBalance = (balance?.locked || 0) / 100;
  const unlockedBalance = totalBalance - lockedBalance;

  return (
    <div className="h-full w-full px-6 py-8 bg-background text-foreground">
      <div className="max-w-7xl mx-auto flex flex-col space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user.name?.split(" ")[0] || "User"}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your money today.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/transfer">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Money
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/transactions">
                <HistoryIcon className="w-4 h-4 mr-2" />
                View All
              </Link>
            </Button>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Balance
              </CardTitle>
              <WalletIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{totalBalance.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Your total wallet balance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Available Balance
              </CardTitle>
              <ArrowUpIcon className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ₹{unlockedBalance.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ready to spend
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Locked Balance
              </CardTitle>
              <ArrowDownIcon className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                ₹{lockedBalance.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                In pending transactions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Button asChild className="h-20 flex-col gap-2" variant="outline">
                <Link href="/transfer">
                  <PlusIcon className="w-5 h-5" />
                  Add Money
                </Link>
              </Button>
              <Button className="h-20 flex-col gap-2" variant="outline">
                <SendIcon className="w-5 h-5" />
                Send Money
              </Button>
              <Button asChild className="h-20 flex-col gap-2" variant="outline">
                <Link href="/transactions">
                  <HistoryIcon className="w-5 h-5" />
                  History
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
