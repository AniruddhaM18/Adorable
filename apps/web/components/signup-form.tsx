"use client";

import Image from "next/image";
import logo from "../public/adlogo.png"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { NEXT_PUBLIC_BACKEND_URL } from "@/config"

const backendUrl = NEXT_PUBLIC_BACKEND_URL;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form
      onSubmit={async (e) => {
        e.preventDefault();

        const form = e.currentTarget;
        const email = (form.email as HTMLInputElement).value;
        const password = (form.password as HTMLInputElement).value;

        const res = await fetch(`${backendUrl}/auth/signup`,
          {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({email, password}),
            credentials: "include",
          }
        );
        const data = await res.json();
        console.log("Signup Response :", data)
      }}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-12 items-center justify-center rounded-md">
                <Image
                src={logo}
                alt="logo"
                height={200}
                width={200}
                 />
              </div>
              <span className="sr-only">Adorable</span>
            </a>
            <h1 className="text-xl font-bold text-neutral-100">Welcome to Adorable</h1>
            <FieldDescription className="text-neutral-300">
              Already have an account? <a href="#">Sign in</a>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel className="text-neutral-200" htmlFor="email">Email</FieldLabel>
            <Input
              className="text-neutral-300 border-neutral-500"
              id="email"
              type="email"
              placeholder="yourname@mail.com"
              required
            />
          </Field>
          <Field>
          <Field className="text-neutral-200">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input className="border-neutral-500"
              id="password"
              type="password"
              required
            />
          </Field>
          <Button className="bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-400 text-neutral-800 transition-all duration-200 ease-in-out active:scale-95" type="submit">Create Account</Button>
          </Field>
          <FieldSeparator>Or</FieldSeparator>
          <Field className="grid gap-4 sm:grid">

            <Button
             className="bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-400 text-neutral-800 transition-all duration-200 ease-in-out active:scale-95"
             variant="outline" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
