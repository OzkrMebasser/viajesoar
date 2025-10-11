"use client";
import { useState, useMemo } from "react";
import { Search, Star, MapPin, Clock, DollarSign, Filter } from "lucide-react";
import { useDestinations } from "@/lib/hooks/useDestinations";
import { useLocale } from "next-intl";

// lang type
type Locale = "en" | "es";

const Destinations = () => {
  const [lang, setLang] = useState<"es" | "en">("es");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);

  const locale = useLocale() as Locale;
  const { destinations: data, loading, error } = useDestinations(locale);

  // Categorías dinámicas
  const dynamicCategories = useMemo(() => {
    const cats = Array.from(new Set(data.map((d) => d.category).filter(Boolean)));
    return [{ id: "all", label: locale === "es" ? "Todos" : "All" }, ...cats.map((cat) => ({ id: cat, label: cat }))];
  }, [data, locale]);

  // Países dinámicos
  const dynamicCountries = useMemo(() => {
    const countries = Array.from(new Set(data.map((d) => d.country).filter(Boolean)));
    return [{ id: "all", label: locale === "es" ? "Todos los países" : "All countries" }, ...countries.map((c) => ({ id: c, label: c }))];
  }, [data, locale]);

  // Filtrado
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
    },
  };

  const t = translations[locale] || translations.es;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold">{t.error}</p>
          <p className="text-slate-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-2">{t.title}</h1>
          <p className="text-lg opacity-90">{t.subtitle}</p>
          <p className="text-sm opacity-75 mt-2">
            {data.length} {locale === "es" ? "destinos disponibles" : "destinations available"}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Filters Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
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

          {/* Filter Toggle and Category Pills */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
              <Filter className="h-4 w-4" />
              {t.filters}
            </button> */}

            {/* Category Buttons */}
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

            {/* Country Buttons */}
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

          {/* Advanced Filters */}
          {/* {showFilters && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 animate-in">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t.priceRange}
                </label>
                <div className="flex gap-4">
                  <div>
                    <label className="text-xs text-slate-500">{t.from}</label>
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([parseInt(e.target.value), priceRange[1]])
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">{t.to}</label>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded mt-1"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowFilters(false)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {locale === "es" ? "Cerrar filtros" : "Close filters"}
              </button>
            </div>
          )} */}
        </div>

        {/* Results Count */}
        {filteredDestinations.length > 0 && (
          <p className="text-sm text-slate-600 mb-6">
            {locale === "es"
              ? `Mostrando ${filteredDestinations.length} de ${data.length} destinos`
              : `Showing ${filteredDestinations.length} of ${data.length} destinations`}
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
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden bg-slate-200">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {destination.is_featured && (
                    <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      {t.featured}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {destination.name}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-600 mt-1">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{destination.country}</span>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm line-clamp-2">
                    {destination.description}
                  </p>

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
                      <p className="text-xs font-semibold text-slate-700 uppercase">
                        {t.highlights}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {destination.highlights.slice(0, 3).map((highlight, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Button */}
                  <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 rounded-lg transition-all transform hover:scale-105">
                    {t.bookNow}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinations;
