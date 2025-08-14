"use server";

import { signIn } from "@/auth";
import { currentUser } from "../current-user";
import { db } from "@workspace/db/db";

interface Createp2pOnRampProps {
  email: string;
  amount: number;
}
export const Createp2pOnRamp = async ({
  email,
  amount,
}: Createp2pOnRampProps) => {
  const user = await currentUser();
  if (!user) {
    return await signIn();
  }

  const senderId = user.id;

  const reciever = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!reciever) return null;

  const onRampTransaction = await db.p2pOnRampTransaction.create({
    data: {
      senderId,
      recieverId: reciever.id,
      status: "Processing",
      amount: amount * 100,
      provider: email,
    },
  });
  return onRampTransaction;
};
