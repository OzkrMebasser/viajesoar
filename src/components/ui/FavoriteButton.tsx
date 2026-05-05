"use client";
import { Heart } from "lucide-react";
import { useFavorites, type EntityType } from "@/lib/context/FavoritesProvider";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  entityId: string;
  entityType: EntityType;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "floating" | "outline" | "ghost";
  locale?: "es" | "en";
}

const sizes = {
  sm: { button: "p-1.5", icon: "h-3.5 w-3.5" },
  md: { button: "p-2",   icon: "h-5 w-5"     },
  lg: { button: "p-3",   icon: "h-6 w-6"     },
};

const variants = {
  floating: "bg-white/80 backdrop-blur-sm shadow-md hover:bg-white",
  outline:  "border border-slate-200 bg-white hover:bg-slate-50",
  ghost:    "bg-transparent hover:bg-white/10",
};

export default function FavoriteButton({
  entityId,
  entityType,
  className,
  size = "md",
  variant = "floating",
  locale = "es",
}: FavoriteButtonProps) {
  const { userId, isFavorite, toggleFavorite, loading } = useFavorites();

  const active = isFavorite(entityType, entityId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!userId) {
      toast.info(
        locale === "es"
          ? "Inicia sesión para guardar favoritos 🩷"
          : "Login to save favorites 🩷",
        { toastId: "login-to-save" }
      );
      return;
    }

    toggleFavorite(entityType, entityId);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      title={
        !userId
          ? locale === "es" ? "Inicia sesión para guardar" : "Login to save"
          : active
          ? locale === "es" ? "Quitar de favoritos" : "Remove from favorites"
          : locale === "es" ? "Agregar a favoritos" : "Add to favorites"
      }
      className={cn(
        "rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-90",
        variants[variant],
        sizes[size].button,
        className,
      )}
    >
      <Heart
        className={cn(
          sizes[size].icon,
          "transition-all duration-200",
          active && userId
            ? "fill-red-500 text-red-500 scale-110"
            : !userId
            ? "text-slate-300"
            : "text-slate-400 hover:text-red-400",
        )}
      />
    </button>
  );
}