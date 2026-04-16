import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Locale } from "@/types/locale";
import type { BlogPost } from "@/types/blog";
import { staticClient } from "@/lib/supabase/static";

type StaticClient = ReturnType<typeof createSupabaseClient>;

const PAGE_SIZE = 9;

/* =====================================================
   TODOS LOS POSTS (PAGINADO)
   ===================================================== */
export async function getAllPosts(
  locale: Locale,
  page = 1,
  category?: string,
): Promise<{
  data: BlogPost[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}> {
  const supabase = await createClient();

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("blog_posts")
    .select("*", { count: "exact" })
    .eq("locale", locale)
    .eq("is_active", true)
    .order("published_at", { ascending: false })
    .range(from, to);

  if (category) {
    query = query.eq("category", category);
  }

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching blog posts:", error);
    return { data: [], page, pageSize: PAGE_SIZE, total: 0, totalPages: 0 };
  }

  return {
    data: data ?? [],
    page,
    pageSize: PAGE_SIZE,
    total: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
  };
}

/* =====================================================
   POST INDIVIDUAL POR SLUG
   ===================================================== */
export async function getPostBySlug(
  slug: string,
  locale: Locale,
): Promise<BlogPost | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("locale", locale)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    console.error("Error fetching blog post:", error);
    return null;
  }

  return data;
}

/* =====================================================
   POSTS DESTACADOS (para home o sidebar)
   ===================================================== */
export async function getFeaturedPosts(
  locale: Locale,
  limit = 3,
): Promise<BlogPost[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("locale", locale)
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured posts:", error);
    return [];
  }

  return data ?? [];
}

/* =====================================================
   POSTS RELACIONADOS (misma categoría, distinto slug)
   ===================================================== */
export async function getRelatedPosts(
  locale: Locale,
  category: string | null,
  currentSlug: string,
  limit = 3,
): Promise<BlogPost[]> {
  const supabase = await createClient();

  let query = supabase
    .from("blog_posts")
    .select("*")
    .eq("locale", locale)
    .eq("is_active", true)
    .neq("slug", currentSlug)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }

  return data ?? [];
}

/* =====================================================
   SLUGS PARA generateStaticParams (SSG)
   ===================================================== */

// Función dedicada para build time — NO usa createClient() de server

export async function getAllPostSlugs() {
  const result = await staticClient
    .from("blog_posts")
    .select("slug, locale")
    .eq("is_active", true);

  if (result.error || !result.data) return [];

  return result.data.map((p: { locale: string; slug: string }) => ({
    locale: p.locale,
    slug: p.slug,
  }));
}