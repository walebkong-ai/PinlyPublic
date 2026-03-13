"use client";

import { useEffect, useState } from "react";
import { getProviders, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";

export function SignInForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadProviders() {
      const providers = await getProviders();

      if (!ignore) {
        setGoogleEnabled(Boolean(providers?.google));
      }
    }

    void loadProviders();

    return () => {
      ignore = true;
    };
  }, []);

  async function onSubmit(formData: FormData) {
    setLoading(true);

    const result = await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirect: false
    });

    setLoading(false);

    if (result?.error) {
      toast.error("That email and password combination did not work.");
      return;
    }

    router.push("/map");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <form action={onSubmit} className="space-y-4">
        <Input name="email" type="email" placeholder="Email" required />
        <Input name="password" type="password" placeholder="Password" required />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      {googleEnabled && (
        <>
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.12em] text-[var(--foreground)]/45">
            <span className="h-px flex-1 bg-[var(--foreground)]/12" />
            or
            <span className="h-px flex-1 bg-[var(--foreground)]/12" />
          </div>
          <GoogleAuthButton mode="signin" />
        </>
      )}
    </div>
  );
}
