import { signIn } from "@/auth";
import { currentUser } from "@/lib/current-user";
import { db } from "@workspace/db/db";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
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
import { Separator } from "@workspace/ui/components/separator";

const Dashboard = async () => {
  const user = await currentUser();

  if (!user) {
    return await signIn();
  }

  // Fetch user balance
  const balance = await db.balance.findFirst({
    where: {
      userId: user.id,
    },
  });

  // Fetch recent transactions
  const recentTransactions = await db.onRampTransaction.findMany({
    where: { userId: user.id },
    orderBy: { startTime: "desc" },
    take: 5,
  });

  const totalBalance = (balance?.amount || 0) / 100;
  const lockedBalance = (balance?.locked || 0) / 100;
  const unlockedBalance = totalBalance - lockedBalance;

  return (
    <div className="h-full w-full flex flex-col justify-start items-start p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-gray-200">
              Welcome back, {user.name?.split(' ')[0] || 'User'}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Balance
              </CardTitle>
              <WalletIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black dark:text-gray-200">
                ₹{totalBalance.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Your total wallet balance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Locked Balance</CardTitle>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button asChild className="h-16 flex-col gap-2" variant="outline">
                <Link href="/transfer">
                  <PlusIcon className="w-5 h-5" />
                  Add Money
                </Link>
              </Button>
              <Button className="h-16 flex-col gap-2" variant="outline">
                <SendIcon className="w-5 h-5" />
                Send Money
              </Button>
              <Button className="h-16 flex-col gap-2" variant="outline">
                <CreditCardIcon className="w-5 h-5" />
                Pay Bills
              </Button>
              <Button asChild className="h-16 flex-col gap-2" variant="outline">
                <Link href="/transactions">
                  <HistoryIcon className="w-5 h-5" />
                  History
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/transactions">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentTransactions.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <HistoryIcon className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p>No transactions yet</p>
                  <p className="text-sm">Start by adding money to your wallet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <ArrowDownIcon className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {transaction.provider.toUpperCase()} Payment
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.startTime.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">
                          +₹{(transaction.amount / 100).toLocaleString()}
                        </p>
                        <p className={`text-xs px-2 py-1 rounded-full ${
                          transaction.status === "Success" 
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : transaction.status === "Processing"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        }`}>
                          {transaction.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Account Status</span>
                  <span className="text-sm px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Transactions</span>
                  <span className="font-medium">{recentTransactions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Transaction</span>
                  <span className="text-sm text-muted-foreground">
                    {recentTransactions.length > 0 
                      ? recentTransactions[0].startTime.toLocaleDateString()
                      : "No transactions"
                    }
                  </span>
                </div>
              </div>
              
              <Separator />
              
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-lg font-bold text-blue-600 mb-1">
                  ₹{unlockedBalance.toLocaleString()}
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-400">Available to Spend</p>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  );
};

export default Dashboard;