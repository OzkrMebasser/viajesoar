import TravelDestinations from "@/components/Home/DestinationsSlide/DestinationsSlide";
import TravelSlideshow from "@/components/Home/HeroTravelSlides";
import CubeEffectSlider from "@/components/CubeEffectSlider";
import WorldMapLoader from "@/components/WorldMapLoader";

export default function Home() {
  return (
    <div>
      {/* <AirplaneSoarPreloader /> */}
      <TravelSlideshow />
      <TravelDestinations />
      <CubeEffectSlider />
      <WorldMapLoader />
    </div>
  );
}
