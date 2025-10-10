
import { useEffect, useState } from "react";
import { gsap } from "gsap";

interface UseFadeOutMapProps {
  selector: string;
  trigger: boolean;
  delay?: number;
  duration?: number;
}

export const useFadeOutMap = ({
  selector,
  trigger,
  delay = 2000,
  duration = 3,
}: UseFadeOutMapProps) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (trigger) {
      timeout = setTimeout(() => {
        gsap.to(selector, {
          opacity: 0,
          duration,
          ease: "power2.out",
          onComplete: () => setShow(false),
        });
      }, delay);
    }

    return () => clearTimeout(timeout);
  }, [trigger, selector, delay, duration]);

  return show;
};
