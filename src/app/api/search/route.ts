// viajesoar-app/src/app/api/search/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// ─── Rate limiting ────────────────────────────────────────────────────────────

type RateLimitEntry = {
  count: number;
  windowStart: number;
};

const rateLimitMap = new Map<string, RateLimitEntry>();

const RATE_LIMIT = {
  maxRequests: 30,
  windowMs: 60_000,
};

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now - entry.windowStart > RATE_LIMIT.windowMs) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60_000);

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}
function checkRateLimit(ip: string) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT.windowMs) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return {
      allowed: true,
      remaining: RATE_LIMIT.maxRequests - 1,
      resetIn: RATE_LIMIT.windowMs,
    };
  }

  if (entry.count >= RATE_LIMIT.maxRequests) {
    const resetIn = RATE_LIMIT.windowMs - (now - entry.windowStart);
    return { allowed: false, remaining: 0, resetIn };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: RATE_LIMIT.maxRequests - entry.count,
    resetIn: RATE_LIMIT.windowMs - (now - entry.windowStart),
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────

type SearchResult = {
  id: string;
  title: string;
  description: string;
  category: "package" | "tour" | "destination" | "country";
  slug: string;
  image?: string | null;
  price?: number | null;
  currency?: string | null;
};

// ─── Sanitización ─────────────────────────────────────────────────────────────

function sanitizeQuery(input: string): string {
  return input
    .trim()
    .slice(0, 60)
    .replace(/[^\p{L}\p{N}\s-]/gu, "");
}

// ─── Normalización: minúsculas + sin acentos ──────────────────────────────────
function normalizeText(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// ─── Construye el filtro OR para una tabla, buscando con y sin acentos ────────
function buildOrFilter(
  sanitized: string,
  normalized: string,
  fields: string[],
): string {
  const patterns: string[] = [];
  const terms = new Set([sanitized, normalized]);

  for (const term of terms) {
    for (const field of fields) {
      patterns.push(`${field}.ilike.%${term}%`);
    }
  }

  return patterns.join(",");
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // 🛡️ Bot protection
  const userAgent = req.headers.get("user-agent") ?? "";
  if (!userAgent || userAgent.length < 10) {
    return NextResponse.json({ error: "Blocked" }, { status: 403 });
  }

  // 🛡️ Rate limit
  const ip = getClientIp(req);
  const { allowed, remaining, resetIn } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(resetIn / 1000)),
          "X-RateLimit-Limit": String(RATE_LIMIT.maxRequests),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const locale = (searchParams.get("locale") ?? "es") as "es" | "en";

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const sanitized = sanitizeQuery(q);

  if (!sanitized || sanitized.length < 2) {
    return NextResponse.json({ results: [] });
  }

  // ── Versión normalizada (sin acentos, minúsculas) del término sanitizado ──
  const normalized = normalizeText(sanitized);

  const safeTag = normalized.replace(/\s+/g, "-");

  const supabase = await createClient();

  const [pkgRes, actRes, cityRes, countryRes] = await Promise.allSettled([
    supabase
      .from("packages")
      .select(
        "id, slug, name, description, home_carousel_images, price_from, currency",
      )
      .eq("locale", locale)
      .eq("is_active", true)
      .or(buildOrFilter(sanitized, normalized, ["name", "description"]))
      .limit(5),

    supabase
      .from("destinations_activities")
      .select("id, slug, name, description, cover_image, price_from, currency")
      .eq("locale", locale)
      .eq("is_active", true)
      .or(
        buildOrFilter(sanitized, normalized, ["name", "description"]) +
          `,tags.cs.{${safeTag}}`,
      )
      .limit(5),

    supabase
      .from("destinations")
      .select("id, slug, name, description, cover_image")
      .eq("locale", locale)
      .eq("is_active", true)
      .or(buildOrFilter(sanitized, normalized, ["name", "description"]))
      .limit(4),

    supabase
      .from("destinations_countries")
      .select("id, slug, name, description, cover_image")
      .eq("locale", locale)
      .eq("is_active", true)
      .or(buildOrFilter(sanitized, normalized, ["name", "description"]))
      .limit(3),
  ]);

  const results: SearchResult[] = [];

  if (pkgRes.status === "fulfilled" && pkgRes.value.data) {
    for (const p of pkgRes.value.data) {
      results.push({
        id: p.id,
        title: p.name,
        description: p.description ?? "",
        category: "package",
        slug: p.slug,
        image: Array.isArray(p.home_carousel_images)
          ? (p.home_carousel_images[0] ?? null)
          : null,
        price: p.price_from,
        currency: p.currency,
      });
    }
  }

  if (actRes.status === "fulfilled" && actRes.value.data) {
    for (const a of actRes.value.data) {
      results.push({
        id: a.id,
        title: a.name,
        description: a.description ?? "",
        category: "tour",
        slug: a.slug,
        image: a.cover_image ?? null,
        price: a.price_from,
        currency: a.currency,
      });
    }
  }

  if (cityRes.status === "fulfilled" && cityRes.value.data) {
    for (const c of cityRes.value.data) {
      results.push({
        id: c.id,
        title: c.name,
        description: c.description ?? "",
        category: "destination",
        slug: c.slug,
        image: c.cover_image ?? null,
      });
    }
  }

  if (countryRes.status === "fulfilled" && countryRes.value.data) {
    for (const c of countryRes.value.data) {
      results.push({
        id: c.id,
        title: c.name,
        description: c.description ?? "",
        category: "country",
        slug: c.slug,
        image: c.cover_image ?? null,
      });
    }
  }

  return NextResponse.json(
    { results },
    {
      headers: {
        "X-RateLimit-Limit": String(RATE_LIMIT.maxRequests),
        "X-RateLimit-Remaining": String(remaining),
      },
    },
  );
}