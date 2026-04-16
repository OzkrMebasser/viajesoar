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

// ... Generate metadata based on locale
export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const { locale } = params;
  

  const title = locale === 'en' ? 'Welcome to VIAJESOAR' : 'Bienvenido a VIAJESOAR';
  const description = locale === 'en' 
    ? 'Discover amazing travel packages and tours around the world with VIAJESOAR.' 
    : 'Descubre increíbles paquetes de viaje y tours alrededor del mundo con VIAJESOAR.';

  return {
    title,
    description,
  };
}

export default async function Home(props: { params: Promise<{ locale: Locale }> }) {
  const params = await props.params;
  const packages = await getHomePackages(params.locale);
  
  const [heroData, regionsData, packagesData, toursData] = await Promise.all([
    getHeroDestinations(params.locale),
    getDestinationRegions(params.locale),
    getPackages(params.locale, 1),
    getHomeFeaturedTours(params.locale), 
  ]);

  return (
    <div>
      <HeroSlides locale={params.locale} data={heroData} />
      <RegionsHomeSlideGSAP locale={params.locale} regions={regionsData} />
      <PackagesSlideGSAP locale={params.locale} packages={packages} />
      <CubeEffectSlider tours={toursData} /> 
    </div>
  );
}