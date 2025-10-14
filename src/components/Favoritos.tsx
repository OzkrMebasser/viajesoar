// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { ArrowLeft, Heart as HeartIcon, MapPin, Star, DollarSign, Clock } from "lucide-react";

// export default function FavoritesPage() {
//   const router = useRouter();

//   // 🔹 Datos hardcodeados de favoritos
//   const [favoritesData, setFavoritesData] = useState([
//     {
//       id: "1",
//       destinations: {
//         id: "d1",
//         name: "Playa del Carmen",
//         country: "México",
//         description: "Hermosa playa con arena blanca y aguas cristalinas.",
//         image: "https://source.unsplash.com/400x300/?beach",
//         rating: 4.5,
//         reviews: 120,
//         duration: "3 días",
//         price: 250,
//         is_featured: true,
//       },
//     },
//     {
//       id: "2",
//       destinations: {
//         id: "d2",
//         name: "Paris",
//         country: "Francia",
//         description: "La ciudad del amor y la luz, famosa por su Torre Eiffel.",
//         image: "https://source.unsplash.com/400x300/?paris",
//         rating: 4.8,
//         reviews: 340,
//         duration: "5 días",
//         price: 1200,
//         is_featured: false,
//       },
//     },
//   ]);

//   // 🔹 Función para eliminar favorito
//   const removeFavorite = (id: string) => {
//     setFavoritesData(prev => prev.filter(fav => fav.destinations.id !== id));
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-4">
//         <div className="max-w-7xl mx-auto">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
//           >
//             <ArrowLeft className="w-5 h-5" />
//             <span className="text-sm">Volver</span>
//           </button>
//           <h1 className="text-5xl font-bold mb-2">Mis Favoritos</h1>
//           <p className="text-lg opacity-90">
//             {favoritesData.length} {favoritesData.length === 1 ? "destino guardado" : "destinos guardados"}
//           </p>
//         </div>
//       </div>

//       {/* Main */}
//       <div className="max-w-7xl mx-auto px-4 py-12">
//         {favoritesData.length === 0 ? (
//           <div className="text-center py-16">
//             <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <p className="text-2xl text-slate-600 mb-4">No tienes favoritos aún</p>
//             <p className="text-slate-500 mb-8">
//               Explora nuestros destinos y agrega los que más te gusten a favoritos
//             </p>
//             <button
//               onClick={() => router.push("/destinations")}
//               className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
//             >
//               Ver destinos
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {favoritesData.map((fav) => (
//               <div
//                 key={fav.id}
//                 className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
//               >
//                 <div className="relative h-56 overflow-hidden bg-slate-200">
//                   <img
//                     src={fav.destinations.image}
//                     alt={fav.destinations.name}
//                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                   />
//                   <button
//                     onClick={() => removeFavorite(fav.destinations.id)}
//                     className="absolute top-3 right-3 p-2 bg-white/80 rounded-full shadow hover:bg-white transition"
//                     title="Eliminar de favoritos"
//                   >
//                     <HeartIcon className="h-5 w-5 fill-red-500 text-red-500" />
//                   </button>
//                   {fav.destinations.is_featured && (
//                     <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
//                       Destacado
//                     </div>
//                   )}
//                 </div>

//                 <div className="p-6 space-y-3">
//                   <div>
//                     <h3 className="text-2xl font-bold text-slate-900">
//                       {fav.destinations.name}
//                     </h3>
//                     <div className="flex items-center gap-2 text-slate-600 mt-1">
//                       <MapPin className="h-4 w-4" />
//                       <span className="text-sm">{fav.destinations.country}</span>
//                     </div>
//                   </div>

//                   <p className="text-slate-600 text-sm line-clamp-2">
//                     {fav.destinations.description}
//                   </p>

//                   <div className="flex items-center gap-2">
//                     <div className="flex items-center gap-1">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           className={`h-4 w-4 ${
//                             i < Math.round(fav.destinations.rating)
//                               ? "fill-yellow-400 text-yellow-400"
//                               : "text-slate-300"
//                           }`}
//                         />
//                       ))}
//                     </div>
//                     <span className="text-sm font-medium text-slate-700">
//                       {fav.destinations.rating.toFixed(1)}
//                     </span>
//                     <span className="text-xs text-slate-500">
//                       ({fav.destinations.reviews} opiniones)
//                     </span>
//                   </div>

//                   <div className="flex gap-4 py-3 border-y border-slate-200 text-sm">
//                     <div className="flex items-center gap-1 text-slate-600">
//                       <Clock className="h-4 w-4" />
//                       {fav.destinations.duration}
//                     </div>
//                     <div className="flex items-center gap-1 font-bold text-blue-600">
//                       <DollarSign className="h-4 w-4" />
//                       ${fav.destinations.price.toFixed(2)}
//                     </div>
//                   </div>

//                   <div className="flex gap-2 pt-4">
//                     <button
//                       onClick={() => router.push(`/destinations/${fav.destinations.id}`)}
//                       className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 rounded-lg transition-all transform hover:scale-105"
//                     >
//                       Ver destino
//                     </button>
//                     <button
//                       onClick={() => removeFavorite(fav.destinations.id)}
//                       className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 font-semibold rounded-lg transition-colors"
//                     >
//                       Eliminar
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
