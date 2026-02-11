import TravelSlideshow from "@/components/Home/Hero/HeroTravelSlides";
import CubeEffectSlider from "@/components/CubeEffectSlider";
import DestinationsSlideGSAP from "@/components/Home/DestinationsSlide/DestinationsSlideGSAP";
import PackagesSlideGSAP from "@/components/Packages/PackagesSlideGSAP";
import { getHeroDestinations } from "@/lib/data/destinations/heroSlide";
import { getDestinationRegions } from "@/lib/data/destinations";
import type { Locale } from "@/types/locale";
import DestinationsSlideLocomotive from "@/components/Home/DestinationsSlide/DestinationsSlideLocomotive";
import PackagesSlideLocomotive from "@/components/Packages/PackagesSlideLocomotive";

export default async function Home(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;

  const data = await getHeroDestinations(params.locale);

  // console.log("Data home params", data)
  return (
    <div>
      <TravelSlideshow locale={params.locale} data={data} />
      <DestinationsSlideLocomotive />
      <PackagesSlideLocomotive />
      <CubeEffectSlider />
    </div>
  );
}
