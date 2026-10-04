/**
 * Fixed-window, in-memory rate limiter.
 * Good enough for a single instance and for local development. On serverless
 * platforms each instance has its own memory, so for production traffic swap
 * this for a shared store (e.g. Upstash Redis / Vercel KV) behind the same
 * interface. See README → Contact form.
 */

type Bucket = { count: number; resetAt: number };

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const buckets = new Map<string, Bucket>();

  return {
    check(key: string, now = Date.now()): { allowed: boolean; retryAfterSeconds: number } {
      // Opportunistic cleanup keeps memory bounded.
      if (buckets.size > 5000) {
        for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
      }
      const bucket = buckets.get(key);
      if (!bucket || bucket.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, retryAfterSeconds: 0 };
      }
      if (bucket.count >= limit) {
        return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
      }
      bucket.count += 1;
      return { allowed: true, retryAfterSeconds: 0 };
    },
  };
}
