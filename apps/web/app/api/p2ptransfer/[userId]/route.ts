import { currentUser } from "@/lib/current-user";
import { db } from "@workspace/db/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const { email, amount } = await req.json();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    if (!email) {
      return new NextResponse("email not provided", { status: 400 });
    }
    if (!amount) {
      return new NextResponse("amount not provided", { status: 400 });
    }

    const reciever = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!reciever)
      return new NextResponse("Reciever Not Found", { status: 400 });

    const response = await db.$transaction([
      db.balance.update({
        where: {
          userId: user.id,
        },
        data: {
          amount: {
            decrement: amount * 100,
          },
        },
      }),
      db.balance.update({
        where: {
          userId: reciever.id,
        },
        data: {
          amount: {
            increment: amount * 100,
          },
        },
      }),
    ]);

    if (!response) {
      return new NextResponse("Transfer failed", { status: 400 });
    }

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.log("P2PTRANSFER_POST_ERROR", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
