// import { div } from "framer-motion/client";

import AirplaneSoarPreloader from "@/components/Airplane/AirplaneSoarPreloader";
import Mock from "@/components/Mock";
import TravelSlideshow from "@/components/TravelSlideshow";

export default function Home() {
  return (
    <div>
      <AirplaneSoarPreloader />
      <TravelSlideshow />
      <Mock />
    </div>
  );
}
