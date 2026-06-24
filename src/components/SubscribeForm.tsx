"use client";

import { useState } from "react";

type State = "idle" | "loading" | "success" | "error";

export function SubscribeForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Something went wrong");
      setState("success");
      setMessage(data.message ?? "You're on the list. Welcome.");
      setEmail("");
      setName("");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={onSubmit} className={compact ? "space-y-3" : "space-y-4"}>
      {!compact && (
        <div>
          <label htmlFor="sub-name" className="sr-only">
            Your name
          </label>
          <input
            id="sub-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full rounded-full border border-gold/40 bg-maroon-deep/60 px-5 py-3 text-cream placeholder:text-cream/50 focus:border-gold focus:outline-none"
          />
        </div>
      )}
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="sub-email" className="sr-only">
          Email address
        </label>
        <input
          id="sub-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 rounded-full border border-gold/40 bg-maroon-deep/60 px-5 py-3 text-cream placeholder:text-cream/50 focus:border-gold focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {state === "loading" ? "Joining..." : "Join the list"}
        </button>
      </div>
      {message && (
        <p
          role="status"
          className={`text-sm ${
            state === "success" ? "text-gold" : "text-ember"
          }`}
        >
          {message}
        </p>
      )}
      <p className="text-xs text-cream/60">
        We'll email you when a new episode drops. No spam, unsubscribe anytime.
      </p>
    </form>
  );
}
