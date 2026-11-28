"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await login(email, password);
      toast.success("Logged in successfully");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(217,84,30,0.06),transparent_35%)]" />

      <Card className="relative w-full max-w-sm border-[#111111]/10 bg-[#FAF7F2] shadow-2xl shadow-[#111111]/8">
        <CardHeader className="items-center text-center">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#111111] text-[#F3EEE3] font-black text-lg shadow-xs">
              M
            </div>
            <span className="text-lg font-semibold tracking-tight text-[#111111]">Melq</span>
          </div>
          <CardTitle className="text-[#111111]">Welcome back</CardTitle>
          <CardDescription className="text-[#6B6358]">Sign in to your account</CardDescription>
        </CardHeader>

        <CardContent>
          <SocialAuthButtons actionText="Continue with" />

          {/* Divider */}
          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#111111]/10" />
            <span className="text-xs text-[#6B6358]">or</span>
            <div className="h-px flex-1 bg-[#111111]/10" />
          </div>

          {/* Email / Password form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-[#111111]">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-[#111111]/15 bg-[#F3EEE3]/60 text-[#111111] placeholder:text-[#6B6358]/60 focus-visible:ring-[#D9541E]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-[#111111]">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-[#111111]/15 bg-[#F3EEE3]/60 text-[#111111] placeholder:text-[#6B6358]/60 focus-visible:ring-[#D9541E]"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full bg-[#D9541E] text-white shadow-md shadow-[#D9541E]/20 hover:bg-[#C24716]"
            >
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6B6358]">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-[#D9541E] underline-offset-4 hover:underline"
            >
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
