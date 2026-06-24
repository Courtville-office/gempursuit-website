"use client";

import { useState } from "react";

type State = "idle" | "loading" | "success" | "error";

const PARTNERSHIP_TYPES = [
  "Single episode sponsor",
  "Series sponsor",
  "Product placement",
  "Live event or pop-up",
  "Brand collaboration",
  "Something else",
];

export function SponsorshipForm() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [partnership, setPartnership] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<State>("idle");
  const [feedback, setFeedback] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setFeedback(null);
    try {
      const res = await fetch("/api/sponsorship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          company,
          email,
          phone,
          partnership,
          budget,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Something went wrong");
      setState("success");
      setFeedback(
        "Thanks. Matthew or one of the team will be in touch within a couple of days."
      );
      setName("");
      setCompany("");
      setEmail("");
      setPhone("");
      setPartnership("");
      setBudget("");
      setMessage("");
    } catch (err) {
      setState("error");
      setFeedback(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-gold/30 bg-maroon-deep px-4 py-3 text-cream focus:border-gold focus:outline-none";
  const labelClass =
    "mb-1 block text-xs uppercase tracking-widest text-gold/80";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="sp-name" className={labelClass}>
            Your name
          </label>
          <input
            id="sp-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="sp-company" className={labelClass}>
            Company or brand
          </label>
          <input
            id="sp-company"
            type="text"
            required
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="sp-email" className={labelClass}>
            Email
          </label>
          <input
            id="sp-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="sp-phone" className={labelClass}>
            Phone (optional)
          </label>
          <input
            id="sp-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="sp-type" className={labelClass}>
            Type of partnership
          </label>
          <select
            id="sp-type"
            value={partnership}
            onChange={(e) => setPartnership(e.target.value)}
            className={inputClass}
          >
            <option value="">Pick one</option>
            {PARTNERSHIP_TYPES.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sp-budget" className={labelClass}>
            Budget range (optional)
          </label>
          <input
            id="sp-budget"
            type="text"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. £500 to £2,000"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="sp-message" className={labelClass}>
          Tell us about the brand and what you have in mind
        </label>
        <textarea
          id="sp-message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={state === "loading"}
        className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {state === "loading" ? "Sending..." : "Send enquiry"}
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
