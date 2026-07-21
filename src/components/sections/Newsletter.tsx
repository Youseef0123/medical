"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubscribed(true);
  }

  return (
    <section id="contact" className="bg-accent-900 px-5 py-18 text-white sm:px-8">
      <div className="mx-auto max-w-[700px] text-center">
        <h2 className="mb-3 text-[28px] font-semibold tracking-tight uppercase">
          Stay informed
        </h2>
        <p className="mb-7 text-[15px] leading-relaxed text-white/85">
          Subscribe for product updates, clinical notes and company news —
          no more than once a month.
        </p>

        {subscribed ? (
          <p className="text-[15px] font-semibold">
            Thanks — you&apos;re subscribed.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-[440px] flex-wrap justify-center gap-3"
          >
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-w-[200px] flex-1 border border-divider bg-white px-2.5 py-1.5 text-sm text-ink"
            />
            <Button
              type="submit"
              variant="primary"
              className="border-white bg-white text-accent-900 hover:bg-white/90"
            >
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
