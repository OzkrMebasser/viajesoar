// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { useDestinationById } from "@/lib/hooks/useDestinations";
// import { useLocale } from "next-intl";

// export default function DestinationDetail() {
//   const { id } = useParams();
//   const locale = useLocale();
//   const { destination, loading, error } = useDestinationById(id as string, locale as string);

//   if (loading)
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white bg-slate-900">
//         {locale === "es" ? "Cargando destino..." : "Loading destination..."}
//       </div>
//     );

//   if (error || !destination)
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-400 bg-slate-900">
//         {locale === "es" ? "Error al cargar destino." : "Error loading destination."}
//       </div>
//     );

//   return (
//     <section className="min-h-screen bg-slate-900 text-white px-6 py-12 flex flex-col items-center">
//       <div className="max-w-4xl text-center">
//         <img
//           src={destination.image}
//           alt={destination.name}
//           className="w-full h-[400px] object-cover rounded-2xl shadow-lg mb-6"
//         />
//         <h1 className="text-4xl font-bold mb-3">{destination.name}</h1>
//         <p className="text-slate-300 text-lg mb-6">{destination.description}</p>
//         {/* <div className={`w-full h-1 bg-gradient-to-r ${destination.gradient} rounded-full mb-8`} /> */}
//         <button
//           onClick={() => window.history.back()}
//           className="bg-white text-slate-900 px-6 py-2 rounded-full font-semibold hover:bg-slate-100 transition"
//         >
//           {locale === "es" ? "Regresar" : "Go back"}
//         </button>
//       </div>
//     </section>
//   );
// }
