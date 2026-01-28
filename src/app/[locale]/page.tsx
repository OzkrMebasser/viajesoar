import TravelDestinations from "@/components/Home/DestinationsSlide/DestinationsSlide";
import TravelSlideshow from "@/components/Home/HeroTravelSlides";
import CubeEffectSlider from "@/components/CubeEffectSlider";
import DestinationsSlideGSAP from "@/components/Home/DestinationsSlide/DestinationsSlideGSAP";
import WorldMapLoader from "@/components/WorldMapLoader";

export default function Home() {
  return (
    <div>
      {/* <AirplaneSoarPreloader /> */}
      <TravelSlideshow />
      <DestinationsSlideGSAP />

      <CubeEffectSlider />
    
    </div>
  );
}
