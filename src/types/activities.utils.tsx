// src/types/activities.utils.tsx
// Utils compartidos para todos los componentes de actividades.
// Importa los tipos desde activities.ts para no duplicarlos.

import {
  FaMountain,
  FaHiking,
  FaLandmark,
  FaUtensils,
  FaCity,
  FaShip,
  FaTheaterMasks,
  FaUsers,
  FaUser,
  FaUserFriends,
} from "react-icons/fa";
import { MdOutlineExplore } from "react-icons/md";
import type { IconType } from "react-icons";
import type { Difficulty, ActivityMode } from "@/types/activities";

export type Locale = "es" | "en";
export type { Difficulty, ActivityMode };

/* ─── i18n helper ─────────────────────────────────────────────────────────── */
export const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

/* ─── Difficulty ──────────────────────────────────────────────────────────── */
export const DIFFICULTY_LABEL: Record<Difficulty, { es: string; en: string }> = {
  easy:     { es: "Fácil",    en: "Easy"     },
  moderate: { es: "Moderado", en: "Moderate" },
  hard:     { es: "Difícil",  en: "Hard"     },
};

export const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  easy:     "bg-green-500",
  moderate: "bg-amber-500",
  hard:     "bg-red-500",
};

/* ─── Category ────────────────────────────────────────────────────────────── */
export const CATEGORY_ICON: Record<string, IconType> = {
  naturaleza: FaMountain,
  nature:     FaMountain,

  trekking: FaHiking,

  cultura: FaLandmark,
  culture: FaLandmark,

  historia: FaLandmark,
  history:  FaLandmark,

  gastronomia: FaUtensils,
  gastronomy:  FaUtensils,

  aventura:  MdOutlineExplore,
  adventure: MdOutlineExplore,

  ciudad: FaCity,
  city:   FaCity,

  barco:  FaShip,
  boat:   FaShip,
  cruise: FaShip,

  espectaculo: FaTheaterMasks,
  show:        FaTheaterMasks,

  isla:   FaMountain,
  island: FaMountain,
};

export function CategoryIcon({
  category,
  className,
}: {
  category?: string | null;
  className?: string;
}) {
  const Icon = category ? CATEGORY_ICON[category] : null;
  if (!Icon) return <span className={className}>✦</span>;
  return <Icon className={className} />;
}

/* ─── Activity mode ───────────────────────────────────────────────────────── */
export const ACTIVITY_MODE_ICON: Record<ActivityMode, IconType> = {
  group:      FaUsers,
  private:    FaUser,
  semiPrivate: FaUserFriends,
  selfGuided: MdOutlineExplore,
};

export const ACTIVITY_MODE_LABEL: Record<ActivityMode, { es: string; en: string }> = {
  group:       { es: "Grupal",       en: "Group"       },
  private:     { es: "Privado",      en: "Private"     },
  semiPrivate: { es: "Semi-privado", en: "Semi-private" },
  selfGuided:  { es: "Auto-guiado",  en: "Self-guided" },
};