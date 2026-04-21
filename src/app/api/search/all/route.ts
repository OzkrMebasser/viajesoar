// src/app/api/search/all/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { SearchResult, SearchLocale } from "@/types/search";
import { isValidLocale } from "@/types/search";
import { checkRateLimit, getClientIp, isBotRequest } from "@/lib/rateLimit";

export const runtime = "nodejs";

// ─── Constantes ───────────────────────────────────────────────────────────────

const RESULTS_LIMIT = 100;
const CACHE_TTL = 300; // 5 min

// Rate limit más permisivo que /search porque hay Cache-Control:
// en práctica el CDN absorbe la mayoría. Esto protege cache misses.
const RATE_LIMIT = { maxRequests: 10, windowMs: 60_000 };

// ─── Helpers de mapeo ─────────────────────────────────────────────────────────

function mapPackage(p: {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  home_carousel_images: unknown;
  price_from: number | null;
  currency: string | null;
}): SearchResult {
  return {
    id: p.id,
    title: p.name,
    description: p.description ?? "",
    category: "package",
    slug: p.slug,
    image: Array.isArray(p.home_carousel_images)
      ? (p.home_carousel_images[0] as string) ?? null
      : null,
    price: p.price_from,
    currency: p.currency,
  };
}

function mapTour(a: {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  cover_image: string | null;
  price_from: number | null;
  currency: string | null;
}): SearchResult {
  return {
    id: a.id,
    title: a.name,
    description: a.description ?? "",
    category: "tour",
    slug: a.slug,
    image: a.cover_image ?? null,
    price: a.price_from,
    currency: a.currency,
  };
}

function mapPlace(
  c: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    cover_image: string | null;
  },
  category: "destination" | "country",
): SearchResult {
  return {
    id: c.id,
    title: c.name,
    description: c.description ?? "",
    category,
    slug: c.slug,
    image: c.cover_image ?? null,
  };
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // 🛡️ Bot protection
  if (isBotRequest(req)) {
    return NextResponse.json({ error: "Blocked" }, { status: 403 });
  }

  // 🛡️ Rate limit — clave distinta a /search para no mezclar contadores
  const ip = getClientIp(req);
  const rl = checkRateLimit(`search-all:${ip}`, RATE_LIMIT);

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

  // 🌐 Locale
  const rawLocale = req.nextUrl.searchParams.get("locale") ?? "es";
  if (!isValidLocale(rawLocale)) {
    return NextResponse.json(
      { error: `Invalid locale "${rawLocale}". Must be: es | en` },
      { status: 400 },
    );
  }
  const locale: SearchLocale = rawLocale;

  const supabase = await createClient();

  const [pkgRes, actRes, cityRes, countryRes] = await Promise.allSettled([
    supabase
      .from("packages")
      .select("id, slug, name, description, home_carousel_images, price_from, currency")
      .eq("locale", locale)
      .eq("is_active", true)
      .limit(RESULTS_LIMIT),

    supabase
      .from("destinations_activities")
      .select("id, slug, name, description, cover_image, price_from, currency")
      .eq("locale", locale)
      .eq("is_active", true)
      .limit(RESULTS_LIMIT),

    supabase
      .from("destinations")
      .select("id, slug, name, description, cover_image")
      .eq("locale", locale)
      .eq("is_active", true)
      .limit(RESULTS_LIMIT),

    supabase
      .from("destinations_countries")
      .select("id, slug, name, description, cover_image")
      .eq("locale", locale)
      .eq("is_active", true)
      .limit(RESULTS_LIMIT),
  ]);

  const results: SearchResult[] = [
    ...(pkgRes.status === "fulfilled" ? (pkgRes.value.data ?? []).map(mapPackage) : []),
    ...(actRes.status === "fulfilled" ? (actRes.value.data ?? []).map(mapTour) : []),
    ...(cityRes.status === "fulfilled"
      ? (cityRes.value.data ?? []).map((c) => mapPlace(c, "destination"))
      : []),
    ...(countryRes.status === "fulfilled"
      ? (countryRes.value.data ?? []).map((c) => mapPlace(c, "country"))
      : []),
  ];

  return NextResponse.json(
    { results },
    {
      headers: {
        "Cache-Control": `public, max-age=${CACHE_TTL}`,
        "X-RateLimit-Limit": String(RATE_LIMIT.maxRequests),
        "X-RateLimit-Remaining": String(rl.remaining),
      },
    },
  );
}