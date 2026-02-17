import TravelSlideshow from "@/components/Home/Hero/HeroSlides";
import CubeEffectSlider from "@/components/CubeEffectSlider";
// import DestinationsSlideGSAP from "@/components/Home/DestinationsSlide/DestinationsSlideGSAP";
// import PackagesSlideGSAP from "@/components/Packages/PackagesSlideGSAP";
import { getHeroDestinations } from "@/lib/data/destinations/heroSlide";
import { getDestinationRegions } from "@/lib/data/destinations";
import type { Locale } from "@/types/locale";
import DestinationsSlideGSAP from "@/components/Home/RegionsSlide/RegionsHomeSlideGSAP";
import PackagesSlideLocomotive from "@/components/Packages/PackagesSlideLocomotive";
import HeroTravelSlides from "@/components/Home/Hero/HeroSlides";
import Hero from "@/components/Home/Hero/Hero";
import PackagesSlideGSAP from "@/components/Packages/PackagesSlideGSAP";
import CircularSlideshow from "@/components/CircularSlideshow";
import ButtonArrow from "@/components/ui/ButtonArrow";

export default async function Home(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;

  const data = await getHeroDestinations(params.locale);
const images = [
  { src: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/1fcd7259138189.5a168738899cc.jpg" },
  { src: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/04de5959138189.5a168738850c3.jpg" },
  { src: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/d00a5e59138189.5a16873887bdd.jpg" },
  { src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/c9a2a063821461.5ac1239819171.jpg" },
  { src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/dad4f463821461.5ac1076d90b2c.jpg" },
];
  // console.log("Data home params", data)
  return (
    <div>
      <Hero locale={params.locale} data={data}/>
      {/* <HeroTravelSlides locale={params.locale} data={data} /> */}
      <DestinationsSlideGSAP />
      <PackagesSlideGSAP />
      <CubeEffectSlider />
      <ButtonArrow title="hola" />
      {/* <CircularSlideshow images={images} autoplayInterval={3000} /> */}
      
    </div>
  );
}
