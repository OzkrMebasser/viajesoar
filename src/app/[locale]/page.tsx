import TravelDestinations from "@/components/Home/DestinationsSlide/DestinationsSlide";
import Mock from "@/components/Mock";
import TravelSlideshow from "@/components/Home/HeroTravelSlides";

export default function Home() {
  return (
    <div>
      {/* <AirplaneSoarPreloader /> */}
      <TravelSlideshow />
      <TravelDestinations />
      <Mock />
    </div>
  );
}
