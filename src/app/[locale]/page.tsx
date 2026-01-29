import TravelDestinations from "@/components/Home/DestinationsSlide/DestinationsSlide";
import TravelSlideshow from "@/components/Home/HeroTravelSlides";
import CubeEffectSlider from "@/components/CubeEffectSlider";
import DestinationsSlideGSAP from "@/components/Home/DestinationsSlide/DestinationsSlideGSAP";

import PackagesSlideGSAP from "@/components/Packages/PackagesSlideGSAP";

export default function Home() {
  return (
    <div>

      <TravelSlideshow />
      
      <DestinationsSlideGSAP />
      <CubeEffectSlider />
      
      <PackagesSlideGSAP />
    
    </div>
  );
}
