import { currentUser } from "@/lib/current-user";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();

  if (!user) {
    return await signIn();
  }

  return redirect("/dashboard");
};
export default Page;
