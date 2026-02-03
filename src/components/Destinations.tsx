"use client";
import { useState, useMemo, useEffect } from "react";
import { Search, Star, MapPin, Clock, DollarSign, Heart as HeartIcon } from "lucide-react";
// import { useDestinations } from "@/lib/hooks/useDestinations";
// import { useLocale } from "next-intl";
import { useFavorites } from "@/lib/context/FavoritesProvider";
import { supabase } from "@/lib/supabase";
import type { Destination } from "@/types/destinations";
import type { Locale } from "@/types/locale";
import { Paginator } from "@/components/ui/paginator";

import FavoritesPage from "./FavoritesPage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // 👈 Estilos del toast

// ==============================
// Componente principal
// ==============================
// type Locale = "en" | "es";


interface Props {
  destinations: Destination[];
  page: number;
  totalPages: number;
  locale: Locale;
  total: number;
}


const Destinations = ({
  destinations: data,
  page,
  totalPages,
  locale,
  total
}: Props) => {
  // const [lang, setLang] = useState<"es" | "en">("es");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);


  // console.log(total)
  // const locale = useLocale() as Locale;
  // const {  loading, error } = useDestinations(locale);

  // ==============================
  // 👇 Usuario y favoritos
  // ==============================
  const [user, setUser] = useState<any>(null);
  const { favorites, toggleFavorite } = useFavorites();
  console.log("Favorites", favorites)

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

  // ==============================
  // Categorías dinámicas
  // ==============================
  const dynamicCategories = useMemo(() => {
    const cats = Array.from(new Set(data.map((d) => d.category).filter(Boolean)));
    return [
      { id: "all", label: locale === "es" ? "Todos" : "All" },
      ...cats.map((cat) => ({ id: cat, label: cat })),
    ];
  }, [data, locale]);

  const dynamicCountries = useMemo(() => {
    const countries = Array.from(new Set(data.map((d) => d.country).filter(Boolean)));
    return [
      { id: "all", label: locale === "es" ? "Todos los países" : "All countries" },
      ...countries.map((c) => ({ id: c, label: c })),
    ];
  }, [data, locale]);

  // ==============================
  // Filtrado
  // ==============================
  const filteredDestinations = useMemo(() => {
    return data.filter((dest) => {
      const matchesSearch =
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || dest.category === selectedCategory;
      const matchesCountry = selectedCountry === "all" || dest.country === selectedCountry;
      const matchesPrice = dest.price >= priceRange[0] && dest.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesCountry && matchesPrice;
    });
  }, [data, searchQuery, selectedCategory, selectedCountry, priceRange]);

  // ==============================
  // Traducciones
  // ==============================
  const translations = {
    es: {
      title: "Nuestros Destinos",
      subtitle: "Descubre los mejores lugares para viajar",
      searchPlaceholder: "Buscar destinos...",
      filters: "Filtros",
      priceRange: "Rango de precio",
      from: "Desde",
      to: "Hasta",
      duration: "Duración",
      rating: "Valoración",
      reviews: "opiniones",
      highlights: "Destacados",
      bookNow: "Reservar ahora",
      noResults: "No se encontraron destinos",
      featured: "Destacado",
      loading: "Cargando destinos...",
      error: "Error al cargar los destinos",
      loginToSave: "Inicia sesión para guardar favoritos 🩷",
    },
    en: {
      title: "Our Destinations",
      subtitle: "Discover the best places to travel",
      searchPlaceholder: "Search destinations...",
      filters: "Filters",
      priceRange: "Price range",
      from: "From",
      to: "To",
      duration: "Duration",
      rating: "Rating",
      reviews: "reviews",
      highlights: "Highlights",
      bookNow: "Book now",
      noResults: "No destinations found",
      featured: "Featured",
      loading: "Loading destinations...",
      error: "Error loading destinations",
      loginToSave: "Login to save favorites 🩷",
    },
  };
  const t = translations[locale] || translations.es;

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-theme flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="spinner  rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent)] mx-auto mb-4"></div>
  //         <p className="text-theme">{t.loading}</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
  //       <div className="text-center">
  //         <p className="text-red-600 text-lg font-semibold">{t.error}</p>
  //         <p className="text-slate-600 mt-2">{error}</p>
  //       </div>
  //     </div>
  //   );
  // }

  // ==============================
  // Render
  // ==============================
  return (
    <div className="min-h-screen ">
      <ToastContainer position="bottom-right"   progressClassName="!bg-[var(--accent)]"
 /> {/* 👈 Toast abajo derecha */}
      
      {/* Header */}
      <div className=" bg-gradient-theme text-theme py-16 px-4">
        <div className="max-w-7xl mx-auto pt-8">
          <h1 className="text-5xl font-bold mb-2">{t.title}</h1>
          <p className="text-lg opacity-90">{t.subtitle}</p>
          <p className="text-sm opacity-75 mt-2">
            {total} {locale === "es" ? "destinos disponibles" : "destinations available"}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto px-6 lg:px-12 py-12 bg-gradient-theme-tertiary">
        {/* Search & Filters */}
        <div className="mb-8 space-y-4 ">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            />
          </div>

          {/* Category & Country Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex flex-wrap gap-2">
              {dynamicCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full transition ${
                    selectedCategory === cat.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-blue-600"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {dynamicCountries.map((country) => (
                <button
                  key={country.id}
                  onClick={() => setSelectedCountry(country.id)}
                  className={`px-4 py-2 rounded-full transition ${
                    selectedCountry === country.id
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-green-600"
                  }`}
                >
                  {country.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        {filteredDestinations.length > 0 && (
          <p className="text-sm text-slate-600 mb-6">
            {locale === "es"
              ? `Mostrando ${filteredDestinations.length} de ${data.length} destinos, de la pagina ${page}`
              : `Showing ${filteredDestinations.length} of ${data.length} destinations, from page ${page}`}
          </p>
        )}

        {/* Destinations Grid */}
        {filteredDestinations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-slate-600">{t.noResults}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((destination) => (
              <div
                key={destination.id}
                className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-slate-200">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* ❤️ FAVORITE BUTTON */}
                  {user ? (
                    <button
                      onClick={() => toggleFavorite(String(destination.id))}
                      className="absolute top-3 right-3 p-2 bg-white/80 rounded-full shadow hover:bg-white transition"
                      aria-label={
                        favorites.has(String(destination.id))
                          ? locale === "es"
                            ? "Quitar de favoritos"
                            : "Remove from favorites"
                          : locale === "es"
                          ? "Agregar a favoritos"
                          : "Add to favorites"
                      }
                    >
                      <HeartIcon
                        className={`h-5 w-5 ${
                          favorites.has(String(destination.id))
                            ? "fill-red-500 text-red-500"
                            : "text-gray-500"
                        }`}
                      />
                    </button>
                  ) : (
                    <button
                      onClick={() => toast.info(t.loginToSave)} // 👈 Mostrar toast
                      className="absolute top-3 right-3 p-2 bg-white/60 rounded-full hover:bg-white/80 transition"
                      title={t.loginToSave}
                    >
                      <HeartIcon className="h-5 w-5 text-gray-300" />
                    </button>
                  )}

                  {destination.is_featured && (
                    <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      {t.featured}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{destination.name}</h3>
                    <div className="flex items-center gap-2 text-slate-600 mt-1">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{destination.country}</span>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm line-clamp-2">{destination.description}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(destination.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-slate-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {destination.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-500">
                      ({destination.reviews} {t.reviews})
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex gap-4 py-3 border-y border-slate-200 text-sm">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Clock className="h-4 w-4" />
                      {destination.duration}
                    </div>
                    <div className="flex items-center gap-1 font-bold text-blue-600">
                      <DollarSign className="h-4 w-4" />
                      ${destination.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Highlights */}
                  {destination.highlights && destination.highlights.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-700 uppercase">{t.highlights}</p>
                      <div className="flex flex-wrap gap-1">
                        {destination.highlights.slice(0, 3).map((highlight, idx) => (
                          <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 rounded-lg transition-all transform hover:scale-105">
                    {t.bookNow}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
  {/* Pagination */}
      <Paginator page={page} totalPages={totalPages} />
    </div>
  );
};

export default Destinations;
