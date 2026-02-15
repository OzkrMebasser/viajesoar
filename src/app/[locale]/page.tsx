import TravelSlideshow from "@/components/Home/Hero/HeroSlides";
import CubeEffectSlider from "@/components/CubeEffectSlider";
// import DestinationsSlideGSAP from "@/components/Home/DestinationsSlide/DestinationsSlideGSAP";
// import PackagesSlideGSAP from "@/components/Packages/PackagesSlideGSAP";
import { getHeroDestinations } from "@/lib/data/destinations/heroSlide";
import { getDestinationRegions } from "@/lib/data/destinations";
import type { Locale } from "@/types/locale";
import DestinationsSlideHome from "@/components/Home/DestinationsSlide/DestinationsSlideHome";
import DestinationsSlideGSAP from "@/components/Home/DestinationsSlide/DestinationsSlideGSAP";
import PackagesSlideLocomotive from "@/components/Packages/PackagesSlideLocomotive";
import HeroTravelSlides from "@/components/Home/Hero/HeroSlides";
import Hero from "@/components/Home/Hero/Hero";
import PackagesSlideGSAP from "@/components/Packages/PackagesSlideGSAP";

export default async function Home(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;

  const data = await getHeroDestinations(params.locale);

  // console.log("Data home params", data)
  return (
    <div>
      <Hero locale={params.locale} data={data}/>
      {/* <HeroTravelSlides locale={params.locale} data={data} /> */}
      <DestinationsSlideGSAP />
      <PackagesSlideGSAP />
      <CubeEffectSlider />
    </div>
  );
}
