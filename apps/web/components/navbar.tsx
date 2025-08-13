"use client";

import { User } from "@prisma/client";
import { SignOut } from "./sign-out";
import { SignIn } from "./sign-in";
import { Button } from "@workspace/ui/components/button";
import { ModeToggle } from "./theme-toggle";

interface IsAuthenticatedProps {
  user: User | null;
}

export const Navbar = ({ user }: IsAuthenticatedProps) => {
  return (
    <div className="flex w-full px-11 ">
      <div className="flex flex-col ">
        <Button variant="ghost" className="font-semibold text-2xl">
          PayTM
        </Button>
      </div>
      <div className="ml-auto flex gap-x-4">
        <div>
          <ModeToggle />
        </div>
        {user ? <SignOut /> : <SignIn />}
      </div>
    </div>
  );
};
