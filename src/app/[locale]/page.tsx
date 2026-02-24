import { getHeroDestinations } from "@/lib/data/destinations/heroSlide";
import { getDestinationRegions } from "@/lib/data/destinations/regions";
import { getHomePackages, getPackages } from "@/lib/data/packages/packages";
import type { Locale } from "@/types/locale";
import type { Metadata } from "next"; 
import HeroSlides from "@/components/Home/Hero/HeroSlides";
import RegionsHomeSlideGSAP from "@/components/Home/RegionsSlide/RegionsHomeSlideGSAP";
import PackagesSlideGSAP from "@/components/Packages/PackagesSlideGSAP";
import CubeEffectSlider from "@/components/CubeEffectSlider";




export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const params = await props.params;
  
  // Aquí podrías incluso traer datos de tu base de datos para el SEO
  const isEn = params.locale === 'en';

  return {
    title: isEn ? "ViajeSoar - Elevate Your Travel Experience" : "ViajeSoar - Eleva tu experiencia de viaje",
    description: isEn 
      ? "Discover the best destinations with ViajeSoar. From Baja California to the world." 
      : "Descubre los mejores destinos con ViajeSoar. Desde Baja California hasta el mundo.",
    openGraph: {
      images: ['/images/og-image.jpg'], // Imagen que se ve al compartir en WhatsApp/Face
    },
  };
}

export default async function Home(props: { params: Promise<{ locale: Locale }> }) {
  const params = await props.params;
const packages = await getHomePackages(params.locale);
  
  const [heroData, regionsData, packagesData] = await Promise.all([
    getHeroDestinations(params.locale),
    getDestinationRegions(params.locale),
    getPackages(params.locale, 1),
  ]);

  return (
    <div>
      <HeroSlides locale={params.locale} data={heroData} />
      <RegionsHomeSlideGSAP locale={params.locale} regions={regionsData} />
      <PackagesSlideGSAP locale={params.locale} packages={packages} />
      <CubeEffectSlider />
    </div>
  );
}