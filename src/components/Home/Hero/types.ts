import type { RefObject } from "react";



// ✅ DESPUÉS (correcto)
export type TextRefs = {
  place: RefObject<HTMLDivElement | null>;
  country: RefObject<HTMLDivElement | null>;
  title1: RefObject<HTMLDivElement | null>;
  title2: RefObject<HTMLDivElement | null>;
  desc: RefObject<HTMLDivElement | null>;
  cta: RefObject<HTMLDivElement | null>;
};

export type ResponsiveValues = {
  offsetTop: number;
  offsetLeft: number;
  cardWidth: number;
  cardHeight: number;
  gap: number;
  numberSize: number;
  yOffset1: number;
  yOffset2: number;
  yOffset3: number;
  progressWidth: number;
  cardContentOffset: number;
  coverXOffset: number;
  navOffset: number;
  paginationOffset: number;
  detailsXOffset: number;
  cardContentFinalY: number;
  isSmallMobile: boolean;
  isMobile: boolean;
};