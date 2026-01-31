"use client";


import Link from "next/link";
import type { Locale } from "@/types/locale";
import type { Package } from "@/types/packages";
import { Paginator } from "@/components/ui/paginator";

interface Props {
  locale: Locale;
  packages: Package[];
  page: number;
  totalPages: number;
}

export default function PackageList({
  locale,
  packages,
  page,
  totalPages,
}: Props) {
  if (!packages.length) {
    return <p>No hay paquetes disponibles</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <Link
            key={pkg.id}
            href={`/${locale === "es" ? "paquetes" : "packages"}/${pkg.slug}`}
          >
            <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
              {pkg.images?.[0] && (
                <img
                  src={pkg.images[0]}
                  alt={pkg.name}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">{pkg.name}</h2>

                <p className="text-gray-700">
                  Desde {pkg.price_from} {pkg.currency}
                </p>

                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                  {pkg.description}
                </p>

                {pkg.visited_cities.length > 0 && (
                  <p className="text-sm mt-2">
                    Ciudades:{" "}
                    {pkg.visited_cities.map(c => c.name).join(", ")}
                  </p>
                )}

                {pkg.visited_countries.length > 0 && (
                  <p className="text-sm">
                    Países:{" "}
                    {pkg.visited_countries.map(c => c.name).join(", ")}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Paginator page={page} totalPages={totalPages} />
      </div>
    </>
  );
}

// "use client";
// import Link from "next/link";
// import { usePackages } from "@/lib/hooks/usePackages";
// import { getPackages } from "@/lib/data/packages";
// import TravelPackages from "./TravelPackages";

// interface PackageListProps {
//   locale: "es" | "en";
// }

// export default function PackageList({ locale }: PackageListProps) {
//   const { packages, loading, error } = usePackages(locale);

//   const allPackages = getPackages(locale);
//   console.log("all pkgs", allPackages)

//   if (loading) return <p>Cargando paquetes...</p>;
//   if (error) return <p>Error: {error}</p>;
//   if (!packages.length) return <p>No hay paquetes disponibles</p>;

//   return (
//     <>
//        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//       {packages.map((pkg) => (
//         <Link
//           key={pkg.id}
//           href={`/${locale === "es" ? "paquetes" : "packages"}/${pkg.slug}`}
//           passHref
//         >
//           <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer">
//             {pkg.images?.[0] && (
//               <img
//                 src={pkg.images[0]}
//                 alt={pkg.name}
//                 className="w-full h-48 object-cover"
//               />
//             )}
//             <div className="p-4">
//               <h2 className="text-lg font-semibold mb-2">{pkg.name}</h2>
//               <p className="text-gray-700">
//                 Desde {pkg.price_from} {pkg.currency}
//               </p>
//               <p className="text-sm text-gray-500 mt-1 line-clamp-2">
//                 {pkg.description}
//               </p>

//               {/* Ciudades */}
//               {pkg.visited_cities?.length ? (
//                 <p className="text-sm mt-2">
//                   Ciudades: {pkg.visited_cities.map(c => c.name).join(", ")}
//                 </p>
//               ) : null}

//               {/* Países */}
//               {pkg.visited_countries?.length ? (
//                 <p className="text-sm mt-1">
//                   Países: {pkg.visited_countries.map(c => c.name).join(", ")}
//                 </p>
//               ) : null}
//             </div>
//           </div>
//         </Link>
//       ))}

//     </div>

//       <TravelPackages />
//       <div>

//     </div>
//     </>

//   );
// }
