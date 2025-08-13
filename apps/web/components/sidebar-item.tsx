"use client"
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export const SidebarItem = ({ href, title, icon }: { href: string; title: string; icon: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname()
    const selected = pathname === href

    return <div className={`flex ${selected ? "text-black dark:text-gray-300 text-lg transition" : "text-gray-400 hover:text-gray-500"} cursor-pointer  p-2 pl-8`} onClick={() => {
        router.push(href);
    }}>
        <div className="pr-2">
            {icon}
        </div>
        <div className={`font-bold ${selected ? "text-black dark:text-gray-300 text-lg transition" : "text-gray-400 hover:text-gray-500"}`}>
            {title}
        </div>
    </div>
}