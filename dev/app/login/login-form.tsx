"use client";

import { useId, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

/**
 * Magic-link request form (M2). Sends a one-time sign-in link via Supabase Auth;
 * the email link returns to /auth/callback, which exchanges it for a session and
 * claims any pending lookup. ANON key only (browser client).
 */
export function LoginForm({ next }: { next: string }) {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback/?next=${encodeURIComponent(next)}`,
      },
    });
    setStatus(error ? "error" : "sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-card border border-slate/15 bg-cloud p-5">
        <p className="font-display text-lg font-bold text-ink">Check your email</p>
        <p className="mt-2 text-sm text-slate">
          We sent a sign-in link to <span className="font-medium text-ink">{email}</span>. Open it on
          this device to continue. The link expires shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <label htmlFor={inputId} className="text-sm font-medium text-ink">
        Email address
      </label>
      <input
        id={inputId}
        type="email"
        required
        autoComplete="email"
        placeholder="you@company.com"
        value={email}
        disabled={status === "sending"}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-1.5 w-full rounded-btn border border-slate/25 bg-paper px-3 py-2.5 text-ink outline-none placeholder:text-slate/60 focus-visible:border-steel focus-visible:ring-2 focus-visible:ring-steel/40"
      />
      {status === "error" ? (
        <p className="mt-2 text-sm text-ink">We couldn&apos;t send the link. Check the address and try again.</p>
      ) : null}
      <button
        type="submit"
        disabled={status === "sending" || email.trim() === ""}
        className={cn(buttonVariants({ variant: "primary", size: "md" }), "mt-4 w-full disabled:opacity-70")}
      >
        {status === "sending" ? "Sending…" : "Email me a sign-in link"}
      </button>
    </form>
  );
}
