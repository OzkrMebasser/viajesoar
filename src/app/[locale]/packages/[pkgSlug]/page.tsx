import PackagePage from "@/components/Packages/PackagePage";

export default function Page({ params }: { params: { pkgSlug: string } }) {
  return <PackagePage slug={params.pkgSlug} locale="en" />;
}
