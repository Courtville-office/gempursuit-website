"use client";

import { useState } from "react";

type State = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<State>("idle");
  const [feedback, setFeedback] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setFeedback(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Something went wrong");
      setState("success");
      setFeedback("Thanks. We'll be in touch shortly.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setState("error");
      setFeedback(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-1 block text-xs uppercase tracking-widest text-gold/80"
          >
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gold/40 bg-maroon-deep/60 px-4 py-3 text-cream focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="mb-1 block text-xs uppercase tracking-widest text-gold/80"
          >
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gold/40 bg-maroon-deep/60 px-4 py-3 text-cream focus:border-gold focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="contact-subject"
          className="mb-1 block text-xs uppercase tracking-widest text-gold/80"
        >
          Subject
        </label>
        <input
          id="contact-subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-xl border border-gold/40 bg-maroon-deep/60 px-4 py-3 text-cream focus:border-gold focus:outline-none"
        />
      </div>
      <div>
        <label
          htmlFor="contact-message"
          className="mb-1 block text-xs uppercase tracking-widest text-gold/80"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-xl border border-gold/40 bg-maroon-deep/60 px-4 py-3 text-cream focus:border-gold focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={state === "loading"}
        className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {state === "loading" ? "Sending..." : "Send message"}
      </button>
      {feedback && (
        <p
          role="status"
          className={`text-sm ${
            state === "success" ? "text-gold" : "text-ember"
          }`}
        >
          {feedback}
        </p>
      )}
    </form>
  );
}
