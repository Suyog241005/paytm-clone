import { auth } from "@/auth";
import { db } from "@workspace/db/db";

export const currentUser = async () => {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  const user = session.user;

  if (!user.email) {
    return null;
  }

  const currentUser = await db.user.findUnique({
    where: {
      email: user.email,
    },
  });


  return currentUser;
};
