import { getHeroDestinations } from "@/lib/data/destinations/heroSlide";
import { getDestinationRegions } from "@/lib/data/destinations/regions";
import { getHomePackages, getPackages } from "@/lib/data/packages/packages";
import { getHomeFeaturedTours } from "@/lib/data/destinations/activities"; // ← IMPORTAR
import type { Locale } from "@/types/locale";
import type { Metadata } from "next"; 
import HeroSlides from "@/components/Home/Hero/HeroSlides";
import RegionsHomeSlideGSAP from "@/components/Home/RegionsSlide/RegionsHomeSlideGSAP";
import PackagesSlideGSAP from "@/components/Packages/PackagesSlideGSAP";
import CubeEffectSlider from "@/components/CubeEffectSlider";

// ... generateMetadata igual ...

export default async function Home(props: { params: Promise<{ locale: Locale }> }) {
  const params = await props.params;
  const packages = await getHomePackages(params.locale);
  
  const [heroData, regionsData, packagesData, toursData] = await Promise.all([
    getHeroDestinations(params.locale),
    getDestinationRegions(params.locale),
    getPackages(params.locale, 1),
    getHomeFeaturedTours(params.locale), // ← AGREGAR AL PROMISE.ALL
  ]);

  return (
    <div>
      <HeroSlides locale={params.locale} data={heroData} />
      <RegionsHomeSlideGSAP locale={params.locale} regions={regionsData} />
      <PackagesSlideGSAP locale={params.locale} packages={packages} />
      <CubeEffectSlider tours={toursData} /> {/* ← PASAR LA PROP */}
    </div>
  );
}