"use client";
import React, { useEffect, useRef, useState } from "react";

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: React.CSSProperties;
  to?: React.CSSProperties;
  threshold?: number;
  rootMargin?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  textAlign?: React.CSSProperties["textAlign"];
  onLetterAnimationComplete?: () => void;
}

const DEFAULT_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const SplitTextVanilla: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 100,
  duration = 0.6,
  ease = DEFAULT_EASE,
  splitType = "chars",
  from = { opacity: 0, transform: "translateY(40px)" },
  to = { opacity: 1, transform: "translateY(0px)" },
  threshold = 0.1,
  rootMargin = "-100px",
  tag = "p",
  textAlign = "center",
  onLetterAnimationComplete,
}) => {
  // 🔥 Wrapper fijo = typing perfecto
  const wrapperRef = useRef<HTMLSpanElement | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const animationCompletedRef = useRef(false);

  useEffect(() => {
    if (document.fonts.status === "loaded") {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => setFontsLoaded(true));
    }
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || !fontsLoaded || !text) return;

    const target = wrapper.firstElementChild as HTMLElement | null;
    if (!target) return;

    target.innerHTML = "";
    animationCompletedRef.current = false;

    const units: HTMLSpanElement[] = [];

    // ---------- SPLIT ----------
    if (splitType.includes("lines")) {
      text.split("\n").forEach(line => {
        const span = document.createElement("span");
        span.textContent = line;
        span.style.display = "block";
        units.push(span);
        target.appendChild(span);
      });
    } else if (splitType.includes("words")) {
      text.split(" ").forEach(word => {
        const span = document.createElement("span");
        span.textContent = `${word} `;
        span.style.display = "inline-block";
        units.push(span);
        target.appendChild(span);
      });
    } else {
      [...text].forEach(char => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.display = "inline-block";
        units.push(span);
        target.appendChild(span);
      });
    }

    // ---------- INITIAL STATE ----------
    units.forEach((unit, i) => {
      Object.assign(unit.style, {
        ...from,
        transitionProperty: "opacity, transform",
        transitionDuration: `${duration}s`,
        transitionTimingFunction: ease,
        transitionDelay: `${(delay * i) / 1000}s`,
        willChange: "opacity, transform",
      });
    });

    // ---------- OBSERVER ----------
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            units.forEach(unit => Object.assign(unit.style, to));

            if (!animationCompletedRef.current) {
              animationCompletedRef.current = true;
              setTimeout(
                () => onLetterAnimationComplete?.(),
                units.length * delay
              );
            }
          } else {
            units.forEach(unit => Object.assign(unit.style, from));
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
      target.textContent = text;
    };
  }, [
    text,
    delay,
    duration,
    ease,
    splitType,
    threshold,
    rootMargin,
    fontsLoaded,
    from,
    to,
    onLetterAnimationComplete,
  ]);

  const Tag = tag;

  return (
    <span
      ref={wrapperRef}
      className={`split-wrapper inline-block ${className}`}
      style={{ textAlign }}
    >
      <Tag
        className="split-parent inline-block whitespace-normal"
        style={{
          textAlign,
          wordWrap: "break-word",
          willChange: "opacity, transform",
        }}
      >
        {text}
      </Tag>
    </span>
  );
};

export default SplitTextVanilla;
