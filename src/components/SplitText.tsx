"use client";
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { SplitText as GSAPSplitText } from "gsap/SplitText";

gsap.registerPlugin(GSAPSplitText);

interface SimpleSplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words" | "lines";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  textAlign?: React.CSSProperties["textAlign"];
}

const SplitText: React.FC<SimpleSplitTextProps> = ({
  text,
  className = "",
  delay = 100,
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  tag = "p",
  textAlign = "center",
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedRef.current) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-50px" },
    );
    observer.observe(ref.current);
    return () => { observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (!ref.current || !text || !isVisible || animatedRef.current) return;
    const el = ref.current;
    const splitInstance = new GSAPSplitText(el, {
      type: "lines,words,chars",
      charsClass: "split-char",
      wordsClass: "split-word",
    });
    const targets =
      splitType === "chars"
        ? splitInstance.chars
        : splitType === "words"
          ? splitInstance.words
          : splitInstance.lines;
    gsap.fromTo(
      targets,
      { ...from },
      { ...to, duration, ease, stagger: delay / 1000 },
    );
    animatedRef.current = true;
    return () => { splitInstance.revert(); };
  }, [text, delay, duration, ease, isVisible, splitType]);

  const style: React.CSSProperties = {
    textAlign,
    wordWrap: "break-word",
    willChange: "transform, opacity",
  };

  const classes = `split-parent inline-block whitespace-normal ${className}`;

  const words = text.trim().split(" ");
  const n = words.length;

  // Reglas:
  // 1-3 palabras → solo última en accent
  // 4+ pares    → mitad blanca, mitad accent
  // 5+ nones    → ceil(n/2) blancas, floor(n/2) accent
const getAccentStart = (count: number): number => {
    if (count === 1) return 1;               // 1 palabra → toda blanca (sin accent)
    if (count <= 3) return count - 1;        // 2-3 palabras → solo última en accent
    if (count % 2 === 0) return count / 2;  // pares → mitad exacta
    return Math.ceil(count / 2);            // nones 5+ → mayoría blanca
  };

  
  const accentStart = getAccentStart(n);
  const whiteWords = words.slice(0, accentStart);
  const accentWords = words.slice(accentStart);

  const content = (
    <>
      {whiteWords.length > 0 && `${whiteWords.join(" ")} `}
      <span style={{ color: "var(--accent)" }}>{accentWords.join(" ")}</span>
    </>
  );

  switch (tag) {
    case "h1": return <h1 ref={ref} style={style} className={classes}>{content}</h1>;
    case "h2": return <h2 ref={ref} style={style} className={classes}>{content}</h2>;
    case "h3": return <h3 ref={ref} style={style} className={classes}>{content}</h3>;
    case "h4": return <h4 ref={ref} style={style} className={classes}>{content}</h4>;
    case "h5": return <h5 ref={ref} style={style} className={classes}>{content}</h5>;
    case "h6": return <h6 ref={ref} style={style} className={classes}>{content}</h6>;
    default:   return <p  ref={ref} style={style} className={classes}>{content}</p>;
  }
};

export default SplitText;