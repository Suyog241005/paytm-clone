"use client"
import { Button } from "@workspace/ui/components/button"
import { signIn } from "next-auth/react"
 
export function SignIn() {
  return <Button className="cursor-pointer" onClick={() => signIn()}>Sign In</Button>
}