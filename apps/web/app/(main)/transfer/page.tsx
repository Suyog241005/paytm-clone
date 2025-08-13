import { signIn } from "@/auth";
import { AddMoney } from "@/components/transfer/add-money";
import { Balance } from "@/components/transfer/balance";
import { currentUser } from "@/lib/current-user";
import { db } from "@workspace/db/db";

const Transfer = async () => {
  const user = await currentUser();

  if (!user) {
    return await signIn();
  }
  const balance = await db.balance.findFirst({
    where: {
      userId: user.id,
    },
  });


  const totalBalance = (balance!.amount)!/100;
  const lockedBalance = (balance!.locked)!/100;

  const unlockedBalance = totalBalance - lockedBalance;



  return (
    <div className="h-full w-full flex justify-center items-center gap-x-4">
      <div className="flex flex-col w-1/2">
        {/* <p className="text-black font-semibold text-xl dark:text-gray-200">
          Transfer
        </p> */}
        <AddMoney userId={user.id} />
      </div>
      <div className=" w-1/3 flex flex-col gap-y-3">
        <Balance
          totalBalance={totalBalance}
          unlockedBalance={unlockedBalance}
          lockedBalance={lockedBalance}
        />
      </div>
    </div>
  );
};

export default Transfer;
