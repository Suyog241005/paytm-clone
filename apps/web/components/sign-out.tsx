"use client";
import { Button } from "@workspace/ui/components/button";
import { signOut } from "next-auth/react";

export function SignOut() {
  return (
    <Button
      className="cursor-pointer"
      onClick={() => signOut()}
    >
      Sign Out
    </Button>
  );
}
