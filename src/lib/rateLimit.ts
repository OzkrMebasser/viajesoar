
// ─── Rate limiter en memoria compartido entre routes ─────────────────────────
// Nota: en entornos serverless con múltiples instancias el estado no se comparte
// entre pods. Para producción con alto tráfico considerar Redis (Upstash).

type RateLimitEntry = {
  count: number;
  windowStart: number;
};

const store = new Map<string, RateLimitEntry>();

// Limpieza automática cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now - entry.windowStart > 60_000 * 10) {
      store.delete(key);
    }
  }
}, 5 * 60_000);

export type RateLimitConfig = {
  maxRequests: number;
  windowMs: number;
};

export type RateLimitResult =
  | { allowed: true; remaining: number; resetIn: number }
  | { allowed: false; remaining: 0; resetIn: number };

export function checkRateLimit(
  key: string,
  config: RateLimitConfig,
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.windowStart > config.windowMs) {
    store.set(key, { count: 1, windowStart: now });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetIn: config.windowMs,
    };
  }

  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: config.windowMs - (now - entry.windowStart),
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetIn: config.windowMs - (now - entry.windowStart),
  };
}

export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (
    fwd?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export function isBotRequest(req: Request): boolean {
  const ua = req.headers.get("user-agent") ?? "";
  return !ua || ua.length < 10;
}