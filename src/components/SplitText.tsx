"use client";
import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';

gsap.registerPlugin(GSAPSplitText);

interface SimpleSplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words' | 'lines';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  textAlign?: React.CSSProperties['textAlign'];
}

const SplitText: React.FC<SimpleSplitTextProps> = ({
  text,
  className = '',
  delay = 100,
  duration = 0.6,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  tag = 'p',
  textAlign = 'center',
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const animatedRef = useRef(false);

  // Intersection Observer para detectar cuando es visible
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
      {
        threshold: 0.3, // Activa cuando el 30% es visible
        rootMargin: '-50px', // Offset para activar un poco antes
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Animación GSAP cuando se hace visible
  useEffect(() => {
    if (!ref.current || !text || !isVisible || animatedRef.current) return;

    const el = ref.current;
    const splitInstance = new GSAPSplitText(el, {
      type: splitType,
      charsClass: 'split-char',
      wordsClass: 'split-word',
      linesClass: 'split-line',
    });

    const targets = splitType === 'chars' ? splitInstance.chars : 
                    splitType === 'words' ? splitInstance.words : 
                    splitInstance.lines;

    // Animación
    gsap.fromTo(
      targets,
      { ...from },
      { 
        ...to, 
        duration, 
        ease, 
        stagger: delay / 1000,
      }
    );

    animatedRef.current = true;

    return () => {
      splitInstance.revert();
    };
  }, [text, delay, duration, ease, isVisible, splitType]);

  const style: React.CSSProperties = {
    textAlign,
    wordWrap: 'break-word',
    willChange: 'transform, opacity',
  };

  const classes = `split-parent inline-block whitespace-normal ${className}`;

  switch (tag) {
    case 'h1': return <h1 ref={ref} style={style} className={classes}>{text}</h1>;
    case 'h2': return <h2 ref={ref} style={style} className={classes}>{text}</h2>;
    case 'h3': return <h3 ref={ref} style={style} className={classes}>{text}</h3>;
    case 'h4': return <h4 ref={ref} style={style} className={classes}>{text}</h4>;
    case 'h5': return <h5 ref={ref} style={style} className={classes}>{text}</h5>;
    case 'h6': return <h6 ref={ref} style={style} className={classes}>{text}</h6>;
    default: return <p ref={ref} style={style} className={classes}>{text}</p>;
  }
};

export default SplitText;