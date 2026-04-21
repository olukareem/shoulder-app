"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { signupSchema, type SignupInput } from "@/lib/validation/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignupForm() {
  const [serverError, setServerError] = useState("");
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const supabase = createClient();

  async function onSubmit(values: SignupInput) {
    setServerError("");

    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { username: values.username },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setServerError(error.message);
      return;
    }

    // If email confirmation is enabled, Supabase returns user without session.
    // Show a "check your email" state instead of redirecting to a page
    // that requires auth.
    if (!data.session) {
      setPendingEmail(values.email);
      return;
    }

    router.push("/posts");
    router.refresh();
  }

  if (pendingEmail) {
    return (
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
        <p className="text-sm text-muted-foreground">
          We sent a confirmation link to{" "}
          <span className="font-medium text-foreground">{pendingEmail}</span>.
          Click it to finish signing up.
        </p>
        <p className="text-xs text-muted-foreground">
          Didn&apos;t get it? Check spam, or{" "}
          <Link
            href="/login"
            className="text-primary underline underline-offset-2"
          >
            sign in here
          </Link>{" "}
          once confirmed.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Join shoulder</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A space for help, advice and services.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Username"
          autoComplete="username"
          placeholder="alphanumeric only"
          error={errors.username?.message}
          {...register("username")}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />

        {serverError && <p className="text-sm text-red-500">{serverError}</p>}

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already a member?{" "}
        <Link href="/login" className="text-primary underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </div>
  );
}
