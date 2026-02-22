import PackageInfoFull from "@/components/Packages/PackageInfoFull";

export default async function Page({ 
  params 
}: { 
  params: Promise<{ pkgSlug: string }> 
}) {
  const { pkgSlug } = await params; // 👈 Await params
  
  return <PackageInfoFull slug={pkgSlug} locale="es" />;
}

