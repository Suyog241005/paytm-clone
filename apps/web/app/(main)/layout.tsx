import { Navbar } from "@/components/navbar";
import { SidebarItem } from "../../components/sidebar-item";
import { currentUser } from "@/lib/current-user";
import { signIn } from "@/auth";
import { HistoryIcon, HomeIcon, Plus, Send } from "lucide-react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) {
    return await signIn();
  }
  return (
    <div className="flex flex-col h-full w-full">
      <div className="border-b border-slate-300 h-20 flex items-center justify-center">
        <Navbar user={user} />
      </div>
      <div className="flex h-full w-full">
        <div className="w-[20%] border-r border-slate-300 h-full pt-28 ">
          <div className="">
            <SidebarItem href={"/dashboard"} icon={<HomeIcon />} title="Home" />
            <SidebarItem href={"/transfer"} icon={<Plus />} title="Add-Money" />
            <SidebarItem
              href={"/transactions"}
              icon={<HistoryIcon />}
              title="Transactions"
            />
            <SidebarItem
              href={"/p2ptransfer"}
              icon={<Send />}
              title="P2P_Transfer"
            />
          </div>
        </div>
        <div className="h-full w-[80%]">{children}</div>
      </div>
    </div>
  );
}
