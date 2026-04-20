// src/app/api/search/all/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = (searchParams.get("locale") ?? "es") as "es" | "en";

  const supabase = await createClient();

  const [pkgRes, actRes, cityRes, countryRes] = await Promise.allSettled([
    supabase
      .from("packages")
      .select("id, slug, name, description, home_carousel_images, price_from, currency")
      .eq("locale", locale)
      .eq("is_active", true)
      .limit(100),

    supabase
      .from("destinations_activities")
      .select("id, slug, name, description, cover_image, price_from, currency")
      .eq("locale", locale)
      .eq("is_active", true)
      .limit(100),

    supabase
      .from("destinations")
      .select("id, slug, name, description, cover_image")
      .eq("locale", locale)
      .eq("is_active", true)
      .limit(100),

    supabase
      .from("destinations_countries")
      .select("id, slug, name, description, cover_image")
      .eq("locale", locale)
      .eq("is_active", true)
      .limit(100),
  ]);

  const results: any[] = [];

  if (pkgRes.status === "fulfilled" && pkgRes.value.data) {
    for (const p of pkgRes.value.data) {
      results.push({
        id: p.id, title: p.name, description: p.description ?? "",
        category: "package", slug: p.slug,
        image: Array.isArray(p.home_carousel_images) ? (p.home_carousel_images[0] ?? null) : null,
        price: p.price_from, currency: p.currency,
      });
    }
  }
  if (actRes.status === "fulfilled" && actRes.value.data) {
    for (const a of actRes.value.data) {
      results.push({
        id: a.id, title: a.name, description: a.description ?? "",
        category: "tour", slug: a.slug, image: a.cover_image ?? null,
        price: a.price_from, currency: a.currency,
      });
    }
  }
  if (cityRes.status === "fulfilled" && cityRes.value.data) {
    for (const c of cityRes.value.data) {
      results.push({
        id: c.id, title: c.name, description: c.description ?? "",
        category: "destination", slug: c.slug, image: c.cover_image ?? null,
      });
    }
  }
  if (countryRes.status === "fulfilled" && countryRes.value.data) {
    for (const c of countryRes.value.data) {
      results.push({
        id: c.id, title: c.name, description: c.description ?? "",
        category: "country", slug: c.slug, image: c.cover_image ?? null,
      });
    }
  }

  return NextResponse.json({ results }, {
    headers: { "Cache-Control": "public, max-age=300" }, // cache 5 min
  });
}