
import { getAllPosts, getAllPostSlugs } from "@/lib/data/blog/posts"; // ← agrega getAllPostSlugs

import BlogList from "@/components/Blog/BlogList";
import type { Locale } from "@/types/locale";

export const dynamic = "force-static";
export const revalidate = 3600;


export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map(({ locale, slug }) => ({ locale, slug }));
}

interface Props {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage(props: Props) {
  const { locale } = await props.params;
  const { page: pageParam } = await props.searchParams;

  const page = Number(pageParam) || 1;
  const data = await getAllPosts(locale, page);

  return (
    <main>
      <BlogList
        locale={locale}
        data={data.data}
        page={data.page}
        totalPages={data.totalPages}
        total={data.total}
      />
    </main>
  );
}