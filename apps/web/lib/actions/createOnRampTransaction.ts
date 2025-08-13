"use server";

import { signIn } from "@/auth";
import { currentUser } from "../current-user";
import { db } from "@workspace/db/db";

interface createOnRampTransactionProps {
  provider: string;
  amount: number;
  token: string;
}
export const createOnRampTransaction = async ({
  provider,
  amount,
  token,
}: createOnRampTransactionProps) => {
  const user = await currentUser();
  if (!user) {
    return signIn();
  }

  const onRampTransaction = await db.onRampTransaction.create({
    data:{
      status:"Processing",
      userId:user.id,
      provider,
      amount:amount*100,
      startTime: new Date(),
      token
    }
  })

  return onRampTransaction.id
};
