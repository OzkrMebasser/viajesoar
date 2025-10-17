import TravelDestinations from "@/components/Home/DestinationsSlide/DestinationsSlide";
import TravelSlideshow from "@/components/Home/HeroTravelSlides";
import CubeEffectSlider from "@/components/CubeEffectSlider";

export default function Home() {
  return (
    <div>
      {/* <AirplaneSoarPreloader /> */}
      <TravelSlideshow />
      <TravelDestinations />
      <CubeEffectSlider />
    </div>
  );
}
