import { signIn } from "@/auth";
import { SendMoney } from "@/components/transfer/send-money";
import { currentUser } from "@/lib/current-user";

const P2pTransferPage = async () => {
  const user = await currentUser();
  if (!user) await signIn();
  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="h-1/2 w-1/2 -ml-64 -mt-28">
        <SendMoney userId={user!.id} />
      </div>
    </div>
  );
};

export default P2pTransferPage;
