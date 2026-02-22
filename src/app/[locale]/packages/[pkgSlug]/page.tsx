import PackageInfoFull from "@/components/Packages/PackageInfoFull";
import PackagePage from "@/components/Packages/PackagePage";

export default async function Page({ 
  params 
}: { 
  params: Promise<{ pkgSlug: string }> 
}) {
  const { pkgSlug } = await params; //  Awaiting params
  

    return <PackageInfoFull slug={pkgSlug} locale="en" />;

}

