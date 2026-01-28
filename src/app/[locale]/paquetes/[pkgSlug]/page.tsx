import PackagePage from "@/components/Packages/PackagePage";

export default async function Page({ 
  params 
}: { 
  params: Promise<{ pkgSlug: string }> 
}) {
  const { pkgSlug } = await params; // 👈 Await params
  
  return <PackagePage slug={pkgSlug} locale="es" />;
}

