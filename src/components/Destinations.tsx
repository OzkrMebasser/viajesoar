"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useDestinations } from "@/lib/hooks/useDestinations";
// import Preloader from "@/components/Airplane/Preloader";

import {
  MapPin,
  Calendar,
  Users,
  Star,
  Plane,
  Heart,
  Search,
} from "lucide-react";

interface Destination {
  id: number;
  name: string;
  country: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  duration: string;
  highlights: string[];
  description: string;
  category: "beach" | "city" | "nature" | "culture" | "adventure";
}

interface FilterState {
  category: string;
  priceRange: string;
  searchTerm: string;
}

const Destinations: React.FC = () => {
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    priceRange: "all",
    searchTerm: "",
  });

    const t = useTranslations("Navigation");


  const { destinations: supabaseDestinations, loading, error } = useDestinations();

    // Manejo de carga
  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
  //       <Preloader isLoading={loading} />
  //     </div>
  //   );
  // }

  // Manejo de errores
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Error al cargar destinos: {error}</div>
      </div>
    );
  }

  // const destinations: Destination[] = [
  //   {
  //     id: 1,
  //     name: "Bali",
  //     country: "Indonesia",
  //     image:
  //       "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop",
  //     price: 1200,
  //     rating: 4.8,
  //     reviews: 2847,
  //     duration: "7 días",
  //     highlights: [
  //       "Templos sagrados",
  //       "Playas paradisíacas",
  //       "Cultura balinesa",
  //       "Spa y wellness",
  //     ],
  //     description:
  //       "Descubre la magia de Bali, donde la espiritualidad se encuentra con paisajes tropicales.",
  //     category: "culture",
  //   },
  //   {
  //     id: 2,
  //     name: "París",
  //     country: "Francia",
  //     image:
  //       "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop",
  //     price: 1800,
  //     rating: 4.9,
  //     reviews: 4521,
  //     duration: "6 días",
  //     highlights: [
  //       "Torre Eiffel",
  //       "Louvre",
  //       "Champs-Élysées",
  //       "Gastronomía francesa",
  //     ],
  //     description:
  //       "La ciudad del amor te espera con su arte, cultura y romance incomparables.",
  //     category: "city",
  //   },
  //   {
  //     id: 3,
  //     name: "Santorini",
  //     country: "Grecia",
  //     image:
  //       "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop",
  //     price: 1500,
  //     rating: 4.7,
  //     reviews: 1893,
  //     duration: "5 días",
  //     highlights: [
  //       "Puestas de sol",
  //       "Arquitectura cicládica",
  //       "Vinos locales",
  //       "Playas volcánicas",
  //     ],
  //     description:
  //       "Vive la magia del Egeo en esta joya griega con vistas espectaculares.",
  //     category: "beach",
  //   },
  //   {
  //     id: 4,
  //     name: "Tokio",
  //     country: "Japón",
  //     image:
  //       "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
  //     price: 2200,
  //     rating: 4.6,
  //     reviews: 3214,
  //     duration: "8 días",
  //     highlights: [
  //       "Templos tradicionales",
  //       "Tecnología",
  //       "Sushi auténtico",
  //       "Cultura pop",
  //     ],
  //     description:
  //       "Sumérgete en el contraste perfecto entre tradición y modernidad.",
  //     category: "city",
  //   },
  //   {
  //     id: 5,
  //     name: "Maldivas",
  //     country: "Maldivas",
  //     image:
  //       "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
  //     price: 3500,
  //     rating: 4.9,
  //     reviews: 1567,
  //     duration: "7 días",
  //     highlights: [
  //       "Bungalows sobre agua",
  //       "Aguas cristalinas",
  //       "Snorkel",
  //       "Lujo tropical",
  //     ],
  //     description:
  //       "El paraíso tropical definitivo para una experiencia de lujo inolvidable.",
  //     category: "beach",
  //   },
  //   {
  //     id: 6,
  //     name: "Nueva York",
  //     country: "Estados Unidos",
  //     image:
  //       "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop",
  //     price: 1900,
  //     rating: 4.5,
  //     reviews: 5672,
  //     duration: "6 días",
  //     highlights: [
  //       "Times Square",
  //       "Central Park",
  //       "Broadway",
  //       "Estatua de la Libertad",
  //     ],
  //     description:
  //       "La ciudad que nunca duerme te ofrece experiencias urbanas incomparables.",
  //     category: "city",
  //   },
  //   {
  //     id: 7,
  //     name: "Machu Picchu",
  //     country: "Perú",
  //     image:
  //       "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400&h=300&fit=crop",
  //     price: 1100,
  //     rating: 4.8,
  //     reviews: 2134,
  //     duration: "5 días",
  //     highlights: [
  //       "Ciudadela inca",
  //       "Trekking",
  //       "Historia ancestral",
  //       "Paisajes andinos",
  //     ],
  //     description:
  //       "Descubre una de las maravillas del mundo en los Andes peruanos.",
  //     category: "adventure",
  //   },
  //   {
  //     id: 8,
  //     name: "Dubái",
  //     country: "Emiratos Árabes Unidos",
  //     image:
  //       "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop",
  //     price: 2000,
  //     rating: 4.6,
  //     reviews: 2876,
  //     duration: "6 días",
  //     highlights: ["Burj Khalifa", "Mall gigantes", "Desierto", "Lujo árabe"],
  //     description:
  //       "Experimenta el lujo y la innovación en el corazón del desierto.",
  //     category: "city",
  //   },
  //   {
  //     id: 9,
  //     name: "Islandia",
  //     country: "Islandia",
  //     image:
  //       "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=400&h=300&fit=crop",
  //     price: 2400,
  //     rating: 4.7,
  //     reviews: 1456,
  //     duration: "8 días",
  //     highlights: ["Aurora boreal", "Géiseres", "Glaciares", "Aguas termales"],
  //     description:
  //       "Tierra de fuego y hielo que ofrece paisajes únicos en el mundo.",
  //     category: "nature",
  //   },
  //   {
  //     id: 10,
  //     name: "Tailandia",
  //     country: "Tailandia",
  //     image:
  //       "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
  //     price: 1300,
  //     rating: 4.6,
  //     reviews: 3421,
  //     duration: "10 días",
  //     highlights: [
  //       "Playas tropicales",
  //       "Templos budistas",
  //       "Street food",
  //       "Masajes thai",
  //     ],
  //     description:
  //       "Descubre la sonrisa de Asia en este destino exótico y acogedor.",
  //     category: "culture",
  //   },
  // ];

  const toggleFavorite = (id: number): void => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const filteredDestinations = supabaseDestinations.filter((dest) => {
    const matchesCategory =
      filters.category === "all" || dest.category === filters.category;
    const matchesPrice =
      filters.priceRange === "all" ||
      (filters.priceRange === "budget" && dest.price < 1500) ||
      (filters.priceRange === "mid" &&
        dest.price >= 1500 &&
        dest.price < 2500) ||
      (filters.priceRange === "luxury" && dest.price >= 2500);
    const matchesSearch =
      dest.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      dest.country.toLowerCase().includes(filters.searchTerm.toLowerCase());

    return matchesCategory && matchesPrice && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-bold">{t("discoverWorld")}</h2>
          <p className="text-xl opacity-90">
            Los destinos más populares de 2025 te esperan
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar destino..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.searchTerm}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    searchTerm: e.target.value,
                  }))
                }
              />
            </div>

            {/* Category Filter */}
            <label htmlFor="category-select" className="sr-only">
              Categoría
            </label>
            <select
              id="category-select"
              aria-label="Categoría"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, category: e.target.value }))
              }
            >
              <option value="all">Todas las categorías</option>
              <option value="beach">Playa</option>
              <option value="city">Ciudad</option>
              <option value="nature">Naturaleza</option>
              <option value="culture">Cultura</option>
              <option value="adventure">Aventura</option>
            </select>

            {/* Price Filter */}
            <label htmlFor="price-select" className="sr-only">
              Rango de precio
            </label>
            <select
              id="price-select"
              aria-label="Rango de precio"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.priceRange}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, priceRange: e.target.value }))
              }
            >
              <option value="all">Todos los precios</option>
              <option value="budget">Económico (&lt; $1,500)</option>
              <option value="mid">Medio ($1,500 - $2,500)</option>
              <option value="luxury">Lujo (&gt; $2,500)</option>
            </select>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDestinations.map((destination) => (
            <div
              key={destination.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => toggleFavorite(destination.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                  title={favorites.includes(destination.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                  aria-label={favorites.includes(destination.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.includes(destination.id)
                        ? "text-red-500 fill-current"
                        : "text-gray-600"
                    }`}
                  />
                </button>
                <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-1 rounded text-sm">
                  {destination.duration}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {destination.name}
                    </h3>
                    <p className="text-gray-600 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {destination.country}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium ml-1">
                        {destination.rating}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      ({destination.reviews} reseñas)
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {destination.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {destination.highlights
                    .slice(0, 2)
                    .map((highlight, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {highlight}
                      </span>
                    ))}
                  {destination.highlights.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{destination.highlights.length - 2} más
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-green-600">
                      ${destination.price.toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">USD</span>
                  </div>
                  <button
                    onClick={() => setSelectedDestination(destination)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No se encontraron destinos con los filtros seleccionados.
            </p>
          </div>
        )}
      </section>

      {/* Modal */}
      {selectedDestination && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedDestination.image}
                alt={selectedDestination.name}
                className="w-full h-64 object-cover rounded-t-xl"
              />
              <button
                onClick={() => setSelectedDestination(null)}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedDestination.name}
                  </h2>
                  <p className="text-gray-600 flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {selectedDestination.country}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-medium ml-1">
                      {selectedDestination.rating}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    ({selectedDestination.reviews} reseñas)
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-4">
                {selectedDestination.description}
              </p>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Highlights del destino:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDestination.highlights.map((highlight, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>{selectedDestination.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-2" />
                    <span>2 personas</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-green-600">
                    ${selectedDestination.price.toLocaleString()}
                  </span>
                  <span className="text-gray-500 ml-1">USD</span>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Reservar ahora
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                  Contactar agente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Destinations;
