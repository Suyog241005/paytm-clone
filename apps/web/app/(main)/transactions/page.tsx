import { signIn } from "@/auth";
import { currentUser } from "@/lib/current-user";
import { db } from "@workspace/db/db";

import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Separator } from "@workspace/ui/components/separator";

const TransactionsPage = async () => {
  const user = await currentUser();
  if (!user) return await signIn();

  const transactions = await db.onRampTransaction.findMany({
    where: { userId: user.id },
    orderBy: { startTime: "desc" },
  });

  return (
    <div className="h-full w-full flex flex-coll justify-center items-start">
      <div className="flex flex-col w-[100%]">
        <p className="text-black font-semibold text-xl dark:text-gray-200 m-7">
          Transactions
        </p>

        <ScrollArea className="h-[34rem] w-full rounded-md border p-6">
          {transactions.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              No Transactions
            </div>
          ) : (
            <div className="flex flex-col gap-y-4 ">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className=" rounded-xl dark:shadow-none flex flex-col gap-y-3"
                >
                  <div>
                    <div className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      {tx.provider.toUpperCase()} Payment
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
                    <div>
                      <p>
                        <span className="font-medium">Date:</span>{" "}
                        {tx.startTime.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-y-3.5">
                      <p>
                        <span className="text-lg px-3 py-1">₹{tx.amount / 100}</span>
                      </p>
                      <div
                        className={`px-3 py-1 rounded-full font-semibold ${
                          tx.status === "Success"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {tx.status}
                      </div>
                    </div>
                  </div>
                  <Separator className="border-2" />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default TransactionsPage;
