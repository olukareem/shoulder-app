import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/SignupForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <SignupForm />
    </main>
  );
}
