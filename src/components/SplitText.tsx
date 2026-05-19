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
  tag?: "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
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
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const animatedRef = useRef(false);

  // Detecta si el texto contiene <br/>
  const hasBreaks = /<br\s*\/?>/i.test(text);

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
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!ref.current || !text || !isVisible || animatedRef.current) return;
    const el = ref.current;

    const splitInstance = new GSAPSplitText(el, {
      type: hasBreaks ? "lines,words" : "lines,words,chars",
      charsClass: "split-char",
      wordsClass: "split-word",
    });

    // Si hay <br/>, forzamos animación sobre words para respetar el DOM
    const targets =
      splitType === "chars" && !hasBreaks
        ? splitInstance.chars
        : splitType === "words" || hasBreaks
          ? splitInstance.words
          : splitInstance.lines;

    gsap.fromTo(
      targets,
      { ...from },
      { ...to, duration, ease, stagger: delay / 1000 },
    );

    animatedRef.current = true;

    return () => {
      splitInstance.revert();
    };
  }, [text, delay, duration, ease, isVisible, splitType, hasBreaks]);

  const style: React.CSSProperties = {
    textAlign,
    wordWrap: "break-word",
    willChange: "transform, opacity",
  };

  const classes = `split-parent inline-block whitespace-normal ${className}`;

  // ── Lógica de accent ──────────────────────────────────────────────────────
  const getAccentStart = (count: number): number => {
    if (count === 1) return 1;
    if (count <= 3) return count - 1;
    if (count % 2 === 0) return count / 2;
    return Math.ceil(count / 2);
  };

  const renderSegment = (seg: string) => {
    const words = seg.trim().split(" ");
    const n = words.length;
    const accentStart = getAccentStart(n);
    const whiteWords = words.slice(0, accentStart);
    const accentWords = words.slice(accentStart);

    return (
      <>
        {whiteWords.length > 0 && `${whiteWords.join(" ")} `}
        {accentWords.length > 0 && (
          <span style={{ color: "var(--accent)" }}>{accentWords.join(" ")}</span>
        )}
      </>
    );
  };

  // Parte el texto por <br/> y renderiza cada segmento
  const segments = text.split(/<br\s*\/?>/i);

 const content = (
  <>
    {segments.map((seg, i) => {
      const isLast = i === segments.length - 1;

      // Con br: último segmento todo accent, el resto todo blanco
      if (hasBreaks) {
        return (
          <React.Fragment key={i}>
            {isLast
              ? <span style={{ color: "var(--accent)" }}>{seg.trim()}</span>
              : seg.trim()
            }
            {!isLast && <br />}
          </React.Fragment>
        );
      }

      // Sin br: lógica original por palabras
      return (
        <React.Fragment key={i}>
          {renderSegment(seg)}
        </React.Fragment>
      );
    })}
  </>
);
  // ── Render por tag ────────────────────────────────────────────────────────
  const sharedProps = {
    ref: ref as React.RefObject<any>,
    style,
    className: classes,
  };

  switch (tag) {
    case "h2": return <h2 {...sharedProps}>{content}</h2>;
    case "h3": return <h3 {...sharedProps}>{content}</h3>;
    case "h4": return <h4 {...sharedProps}>{content}</h4>;
    case "h5": return <h5 {...sharedProps}>{content}</h5>;
    case "h6": return <h6 {...sharedProps}>{content}</h6>;
    case "span": return <span {...sharedProps}>{content}</span>;
    default:   return <p {...sharedProps}>{content}</p>;
  }
};

export default SplitText;