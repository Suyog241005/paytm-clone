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
  TrendingUpIcon,
  PlusIcon,
  SendIcon,
  HistoryIcon,
  EyeIcon,
  EyeOffIcon
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

  // Mock data for additional dashboard metrics
  const monthlySpending = 12450;
  const monthlyIncome = 25600;
  const savingsGoal = 50000;
  const currentSavings = 32000;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user.name?.split(' ')[0] || 'User'}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
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
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">
                Total Balance
              </CardTitle>
              <WalletIcon className="h-4 w-4 text-blue-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalBalance.toLocaleString()}</div>
              <p className="text-xs text-blue-200 mt-1">
                +2.5% from last month
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button asChild className="h-20 flex-col gap-2" variant="outline">
                <Link href="/transfer">
                  <PlusIcon className="w-6 h-6" />
                  Add Money
                </Link>
              </Button>
              <Button className="h-20 flex-col gap-2" variant="outline">
                <SendIcon className="w-6 h-6" />
                Send Money
              </Button>
              <Button className="h-20 flex-col gap-2" variant="outline">
                <CreditCardIcon className="w-6 h-6" />
                Pay Bills
              </Button>
              <Button asChild className="h-20 flex-col gap-2" variant="outline">
                <Link href="/transactions">
                  <HistoryIcon className="w-6 h-6" />
                  History
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <div className="text-center py-8 text-muted-foreground">
                  <HistoryIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No transactions yet</p>
                  <p className="text-sm">Start by adding money to your wallet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <ArrowDownIcon className="w-5 h-5 text-blue-600" />
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

          {/* Monthly Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Income</span>
                  </div>
                  <span className="font-medium text-green-600">
                    ₹{monthlyIncome.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">Spending</span>
                  </div>
                  <span className="font-medium text-red-600">
                    ₹{monthlySpending.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Savings Goal</span>
                  <span className="text-sm text-muted-foreground">
                    ₹{currentSavings.toLocaleString()} / ₹{savingsGoal.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentSavings / savingsGoal) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((currentSavings / savingsGoal) * 100)}% of goal achieved
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUpIcon className="w-5 h-5" />
              Financial Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  ₹{(monthlyIncome - monthlySpending).toLocaleString()}
                </div>
                <p className="text-sm text-green-700 dark:text-green-400">Net Savings This Month</p>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  ₹{Math.round(monthlySpending / 30).toLocaleString()}
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-400">Average Daily Spending</p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {Math.round((currentSavings / monthlyIncome) * 100)}%
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-400">Savings Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;