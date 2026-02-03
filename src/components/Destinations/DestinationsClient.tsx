"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Search,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Heart as HeartIcon,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "@/lib/supabase";

import type { Destination } from "@/types/destinations";
import type { Locale } from "@/types/locale";
import { Paginator } from "@/components/ui/paginator";
import { useFavorites } from "@/lib/context/FavoritesProvider";

interface Props {
  destinations: Destination[];
  page: number;
  totalPages: number;
  locale: Locale;
}

export default function DestinationsClient({
  destinations,
  page,
  totalPages,
  locale,
}: Props) {
  /* =====================================================
     UI STATE (solo presentación / filtros client-side)
     ===================================================== */
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [user, setUser] = useState<any>(null);

  const { favorites, toggleFavorite } = useFavorites();

  /* =====================================================
     Traducciones locales (UI only)
     ===================================================== */
  const t = {
    es: {
      title: "Nuestros Destinos",
      search: "Buscar destinos...",
      noResults: "No se encontraron destinos",
      featured: "Destacado",
      highlights: "Destacados",
      reviews: "opiniones",
      bookNow: "Reservar ahora",
      loginToSave: "Inicia sesión para guardar favoritos 🩷",
    },
    en: {
      title: "Our Destinations",
      search: "Search destinations...",
      noResults: "No destinations found",
      featured: "Featured",
      highlights: "Highlights",
      reviews: "reviews",
      bookNow: "Book now",
      loginToSave: "Login to save favorites 🩷",
    },
  }[locale];

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  /* =====================================================
     Filtros derivados (no mutan data original)
     ===================================================== */
  const categories = useMemo(() => {
    const set = new Set(destinations.map((d) => d.category).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [destinations]);

  const countries = useMemo(() => {
    const set = new Set(destinations.map((d) => d.country).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [destinations]);

  const filtered = useMemo(() => {
    return destinations.filter((d) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q);

      const matchCategory =
        selectedCategory === "all" || d.category === selectedCategory;

      const matchCountry =
        selectedCountry === "all" || d.country === selectedCountry;

      return matchSearch && matchCategory && matchCountry;
    });
  }, [destinations, searchQuery, selectedCategory, selectedCountry]);

  /* =====================================================
     Render
     ===================================================== */
  return (
    <div className="space-y-10">
      <ToastContainer position="bottom-right" />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.search}
          className="w-full pl-12 pr-4 py-3 rounded-lg border"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-white border"
            }`}
          >
            {cat === "all" ? "All" : cat}
          </button>
        ))}

        {countries.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCountry(c)}
            className={`px-4 py-2 rounded-full ${
              selectedCountry === c
                ? "bg-green-600 text-white"
                : "bg-white border"
            }`}
          >
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-slate-500">{t.noResults}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dest) => (
            <div
              key={dest.id}
              className="bg-white rounded-xl shadow hover:shadow-xl overflow-hidden"
            >
              <div className="relative h-56">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover"
                />

                {/* Favorite */}
                {user ? (
                  <button
                    type="button"
                    title={favorites.has(dest.id) ? "Remove from favorites" : "Add to favorites"}
                    onClick={() => toggleFavorite(dest.id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full"
                  >
                    <HeartIcon
                      className={`h-5 w-5 ${
                        favorites.has(dest.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                ) : (
                  <button
                    onClick={() => toast.info(t.loginToSave)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full"
                    title={t.loginToSave}
                    aria-label={t.loginToSave}
                  >
                    <HeartIcon className="h-5 w-5 text-gray-300" />
                  </button>
                )}

                {dest.is_featured && (
                  <span className="absolute top-3 left-3 bg-amber-500 text-white px-3 py-1 rounded-full text-sm">
                    {t.featured}
                  </span>
                )}
              </div>

              <div className="p-5 space-y-3">
                <h3 className="text-xl font-bold">{dest.name}</h3>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="h-4 w-4" />
                  {dest.country}
                </div>

                <p className="text-sm text-slate-600 line-clamp-2">
                  {dest.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(dest.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm">
                    {dest.rating.toFixed(1)} ({dest.reviews} {t.reviews})
                  </span>
                </div>

                {/* Meta */}
                <div className="flex justify-between text-sm border-t pt-3">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {dest.duration}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-blue-600">
                    <DollarSign className="h-4 w-4" />
                    {dest.price}
                  </span>
                </div>

                {/* Highlights */}
                {dest.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {dest.highlights.slice(0, 3).map((h, i) => (
                      <span
                        key={i}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                )}

                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg">
                  {t.bookNow}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Paginator page={page} totalPages={totalPages} />
    </div>
  );
}
