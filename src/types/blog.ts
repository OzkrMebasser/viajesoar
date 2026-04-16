import type { Locale } from "@/types/locale";

export interface BlogPost {
  id: string;
  locale: Locale;

  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  content_sections: { subtitle: string; body: string }[] | null;

  category: string | null;
  tags: string[] | null;

  cover_image: string | null;
  photos: string[] | null;

  author_name: string | null;
  author_avatar: string | null;
  author_bio: string | null;

  meta_title: string | null;
  meta_description: string | null;

  is_active: boolean;
  is_featured: boolean | null;

  published_at: string;
  created_at: string;
  updated_at: string | null;
}

// Categorías disponibles por locale
export const BLOG_CATEGORIES_ES = [
  "destinos",
  "guías",
  "tips",
  "cultura",
  "gastronomía",
  "aventura",
] as const;

export const BLOG_CATEGORIES_EN = [
  "destinations",
  "guides",
  "tips",
  "culture",
  "gastronomy",
  "adventure",
] as const;

export type BlogCategoryEs = (typeof BLOG_CATEGORIES_ES)[number];
export type BlogCategoryEn = (typeof BLOG_CATEGORIES_EN)[number];