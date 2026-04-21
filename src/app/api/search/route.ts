// src/app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { SearchResult, SearchLocale } from "@/types/search";
import { isValidLocale } from "@/types/search";
import { checkRateLimit, getClientIp, isBotRequest } from "@/lib/rateLimit";

export const runtime = "nodejs";

// ─── Constantes ───────────────────────────────────────────────────────────────

const RATE_LIMIT = { maxRequests: 30, windowMs: 60_000 };

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
  if (isBotRequest(req)) {
    return NextResponse.json({ error: "Blocked" }, { status: 403 });
  }

  // 🛡️ Rate limit
  const ip = getClientIp(req);
  const rl = checkRateLimit(`search:${ip}`, RATE_LIMIT);

  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(rl.resetIn / 1000)),
          "X-RateLimit-Limit": String(RATE_LIMIT.maxRequests),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  // 🌐 Params
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const rawLocale = searchParams.get("locale") ?? "es";

  if (!isValidLocale(rawLocale)) {
    return NextResponse.json(
      { error: `Invalid locale "${rawLocale}". Must be: es | en` },
      { status: 400 },
    );
  }
  const locale: SearchLocale = rawLocale;

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const sanitized = sanitizeQuery(q);
  if (!sanitized || sanitized.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const normalized = normalizeText(sanitized);
  const safeTag = normalized.replace(/\s+/g, "-");

  const supabase = await createClient();

  const [pkgRes, actRes, cityRes, countryRes] = await Promise.allSettled([
    supabase
      .from("packages")
      .select("id, slug, name, description, home_carousel_images, price_from, currency")
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

  const results: SearchResult[] = [
    ...(pkgRes.status === "fulfilled"
      ? (pkgRes.value.data ?? []).map((p) => ({
          id: p.id,
          title: p.name,
          description: p.description ?? "",
          category: "package" as const,
          slug: p.slug,
          image: Array.isArray(p.home_carousel_images)
            ? (p.home_carousel_images[0] as string) ?? null
            : null,
          price: p.price_from,
          currency: p.currency,
        }))
      : []),
    ...(actRes.status === "fulfilled"
      ? (actRes.value.data ?? []).map((a) => ({
          id: a.id,
          title: a.name,
          description: a.description ?? "",
          category: "tour" as const,
          slug: a.slug,
          image: a.cover_image ?? null,
          price: a.price_from,
          currency: a.currency,
        }))
      : []),
    ...(cityRes.status === "fulfilled"
      ? (cityRes.value.data ?? []).map((c) => ({
          id: c.id,
          title: c.name,
          description: c.description ?? "",
          category: "destination" as const,
          slug: c.slug,
          image: c.cover_image ?? null,
        }))
      : []),
    ...(countryRes.status === "fulfilled"
      ? (countryRes.value.data ?? []).map((c) => ({
          id: c.id,
          title: c.name,
          description: c.description ?? "",
          category: "country" as const,
          slug: c.slug,
          image: c.cover_image ?? null,
        }))
      : []),
  ];

  return NextResponse.json(
    { results },
    {
      headers: {
        "X-RateLimit-Limit": String(RATE_LIMIT.maxRequests),
        "X-RateLimit-Remaining": String(rl.remaining),
      },
    },
  );
}