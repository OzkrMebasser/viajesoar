// import { div } from "framer-motion/client";

import Mock from "@/components/Mock";
import Preloader from "@/components/Preloader";
import TravelSlideshow from "@/components/TravelSlideshow";


export default function Home() {
  return (
    <div>
    
    <Preloader />
      <TravelSlideshow />
      <Mock />
    </div>
  );
}
