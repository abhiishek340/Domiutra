"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[70svh] items-center pt-32 pb-24">
      <div className="container-site max-w-3xl">
        <p className="label-mono text-amber-300">Something went wrong</p>
        <h1 className="mt-6 text-h1 font-semibold">We hit an unexpected error.</h1>
        <p className="mt-6 max-w-lg text-lead text-fg-muted">
          It’s on our side, not yours. Try again, or head back to the home page.
          {error.digest && <span className="mt-3 block font-mono text-xs text-fg-subtle">Reference: {error.digest}</span>}
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <Button size="lg" onClick={reset}>Try again</Button>
          <ButtonLink href="/" variant="ghost" size="lg" arrow>Back to home</ButtonLink>
        </div>
      </div>
    </section>
  );
}
