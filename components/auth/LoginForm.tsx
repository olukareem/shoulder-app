"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, magicLinkSchema, type LoginInput, type MagicLinkInput } from "@/lib/validation/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Tab = "password" | "magic";

export function LoginForm() {
  const [tab, setTab] = useState<Tab>("password");
  const [serverError, setServerError] = useState("");
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent">(
    "idle",
  );
  const [magicSent, setMagicSent] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/posts";

  const passwordForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const magicForm = useForm<MagicLinkInput>({
    resolver: zodResolver(magicLinkSchema),
  });

  const supabase = createClient();

  async function onPasswordSubmit(values: LoginInput) {
    setServerError("");
    setUnconfirmedEmail(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      // Supabase returns "Email not confirmed" when the user hasn't clicked
      // the verification link yet. Offer to resend instead of leaking the
      // raw error.
      if (/email not confirmed/i.test(error.message)) {
        setUnconfirmedEmail(values.email);
        return;
      }
      setServerError(error.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  async function resendConfirmation() {
    if (!unconfirmedEmail) return;
    setResendStatus("sending");
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: unconfirmedEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setServerError(error.message);
      setResendStatus("idle");
      return;
    }
    setResendStatus("sent");
  }

  async function onMagicSubmit(values: MagicLinkInput) {
    setServerError("");
    const { error } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setServerError(error.message);
      return;
    }
    setMagicSent(true);
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Sign in</h1>

      {/* Tab toggle */}
      <div className="flex rounded-lg border border-border p-1">
        {(["password", "magic"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === t
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "password" ? "Password" : "Magic link"}
          </button>
        ))}
      </div>

      {tab === "password" && !unconfirmedEmail && (
        <form
          onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
          className="space-y-4"
        >
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            error={passwordForm.formState.errors.email?.message}
            {...passwordForm.register("email")}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            error={passwordForm.formState.errors.password?.message}
            {...passwordForm.register("password")}
          />
          {serverError && <p className="text-sm text-red-500">{serverError}</p>}
          <Button
            type="submit"
            className="w-full"
            loading={passwordForm.formState.isSubmitting}
          >
            Sign in
          </Button>
        </form>
      )}

      {tab === "password" && unconfirmedEmail && (
        <div className="space-y-4 rounded-lg bg-muted p-4">
          <p className="text-sm text-foreground">
            Your email{" "}
            <span className="font-medium">{unconfirmedEmail}</span> hasn&apos;t
            been confirmed yet. Check your inbox for the confirmation link.
          </p>
          {resendStatus === "sent" ? (
            <p className="text-sm text-muted-foreground">
              New link sent. Check your email.
            </p>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={resendConfirmation}
              loading={resendStatus === "sending"}
            >
              Resend confirmation email
            </Button>
          )}
          <button
            type="button"
            onClick={() => {
              setUnconfirmedEmail(null);
              setResendStatus("idle");
              setServerError("");
            }}
            className="block text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Back to sign in
          </button>
        </div>
      )}

      {tab === "magic" && !magicSent && (
        <form
          onSubmit={magicForm.handleSubmit(onMagicSubmit)}
          className="space-y-4"
        >
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            error={magicForm.formState.errors.email?.message}
            {...magicForm.register("email")}
          />
          {serverError && <p className="text-sm text-red-500">{serverError}</p>}
          <Button
            type="submit"
            className="w-full"
            loading={magicForm.formState.isSubmitting}
          >
            Send magic link
          </Button>
        </form>
      )}

      {tab === "magic" && magicSent && (
        <p className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          Check your email for a sign-in link. You can close this tab.
        </p>
      )}

      <p className="text-center text-sm text-muted-foreground">
        No account?{" "}
        <Link href="/signup" className="text-primary underline underline-offset-2">
          Sign up
        </Link>
      </p>
    </div>
  );
}
