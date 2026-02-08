import TravelSlideshow from "@/components/Home/HeroTravelSlides";
import CubeEffectSlider from "@/components/CubeEffectSlider";
import DestinationsSlideGSAP from "@/components/Home/DestinationsSlide/DestinationsSlideGSAP";
import PackagesSlideGSAP from "@/components/Packages/PackagesSlideGSAP";
import { getHeroDestinations } from "@/lib/data/destinations/heroSlide";
import type { Locale } from "@/types/locale"


export default async function Home(props: {
   params: Promise<{locale: Locale}>
}) {
 
  const params = await props.params;
 
  const data = await getHeroDestinations(params.locale)

  // console.log("Data home params", data)
  return (
    <div>
      <TravelSlideshow locale={params.locale} data={data} />
      <DestinationsSlideGSAP />
      <PackagesSlideGSAP />
      <CubeEffectSlider />
    </div>
  );
}
