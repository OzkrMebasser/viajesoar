/**
 * Constantes de animación
 */
export const ANIMATION_CONSTANTS = {
  EASE: "sine.inOut",
  START_DELAY: 0.6,
  COVER_DELAY: 0.5,
  LOOP_TIMEOUT: 500,
  STEP_TIMEOUT: 2100,
  INDICATOR_DURATION: 5,
  INDICATOR_EXIT_DURATION: 1.2,
  INDICATOR_EXIT_DELAY: 0.3,
} as const;

/**
 * Breakpoints responsivos
 */
export const BREAKPOINTS = {
  SMALL_MOBILE: 415,
  MOBILE: 768,
} as const;

/**
 * Delays de animación para elementos activos
 */
export const ACTIVE_ANIMATION_DELAYS = {
  PLACE: 0.1,
  COUNTRY: 0.15,
  TITLE1: 0.15,
  TITLE2: 0.3,
  DESC: 0.35,
  CTA: 0.4,
  DETAILS: 0.4,
} as const;