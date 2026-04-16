

import { notFound } from "next/navigation";
import BlogArticle from "@/components/Blog/BlogArticle";
import { getPostBySlug, getAllPostSlugs, getRelatedPosts } from "@/lib/data/blog/posts";
import type { Locale } from "@/types/locale";
import type { Metadata } from "next";

// SSG — prerenderiza todos los slugs en build time
export const dynamic = "force-static";
export const revalidate = false;

interface Props {
  params: Promise<{ locale: Locale; slug: string }>;
}

/* ── generateStaticParams ──────────────────────────────
   Next.js llama esto en build time para saber
   qué rutas prerenderizar.
   ─────────────────────────────────────────────────── */
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map(({ locale, slug }) => ({ locale, slug }));
}

/* ── generateMetadata ── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug, locale);

  if (!post) return { title: "Not found" };

  return {
    title: post.meta_title ?? post.title,
    description: post.meta_description ?? post.excerpt ?? undefined,
    openGraph: {
      title: post.meta_title ?? post.title,
      description: post.meta_description ?? post.excerpt ?? undefined,
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}

/* ── Page ── */
export default async function BlogArticlePage({ params }: Props) {
  const { locale, slug } = await params;

  const [post, relatedPosts] = await Promise.all([
    getPostBySlug(slug, locale),
    // Se cargan relacionados en paralelo; si post es null no importa, redirigimos
    getPostBySlug(slug, locale).then((p) =>
      p ? getRelatedPosts(locale, p.category, slug, 3) : [],
    ),
  ]);

  if (!post) notFound();

  return (
    <main>
      <BlogArticle locale={locale} post={post} relatedPosts={relatedPosts} />
    </main>
  );
}