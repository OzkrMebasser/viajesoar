
// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";

// export interface RegionHome {
//   id: string;
//   locale: string;
//   name: string;
//   icon: string;
//   images: string[]; // Array de imágenes
//   gradient: string;
//   description: string;
//   order_index: number;
//   is_active: boolean;
//   created_at: string;
//   slug: string;
// }

// export function useRegionsHome(locale: string) {
//   const [regions, setRegions] = useState<RegionHome[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchRegions() {
//       try {
//         setLoading(true);
//         setError(null);
        
//         console.log(`🔍 Fetching regions for locale: "${locale}"`);
        
//         const { data, error: fetchError } = await supabase
//           .from("regions_home")
//           .select("*")
//           .eq("locale", locale)
//           .eq("is_active", true)
//           .order("order_index", { ascending: true });

//         console.log("📊 Raw data from Supabase:", data);
//         console.log("❌ Error from Supabase:", fetchError);

//         if (fetchError) {
//           console.error("💥 Supabase error:", fetchError);
//           throw fetchError;
//         }

//         if (!data || data.length === 0) {
//           console.warn(`⚠️ No regions found for locale: "${locale}"`);
//           setRegions([]);
//           return;
//         }

//         // 🔥 PARSEAR images si es string (por si acaso)
//         const parsedData = data.map((region) => {
//           let parsedImages = region.images;
          
//           // Si images es string, parsearlo
//           if (typeof region.images === 'string') {
//             console.log(`🔄 Parsing images for region: ${region.name}`);
//             try {
//               parsedImages = JSON.parse(region.images);
//             } catch (parseError) {
//               console.error(`❌ Error parsing images for ${region.name}:`, parseError);
//               parsedImages = [];
//             }
//           }
          
//           // Validar que sea array
//           if (!Array.isArray(parsedImages)) {
//             console.warn(`⚠️ images is not an array for ${region.name}, converting to array`);
//             parsedImages = [parsedImages].filter(Boolean);
//           }

//           return {
//             ...region,
//             images: parsedImages,
//           };
//         });

//         console.log("✅ Parsed regions:", parsedData);
//         setRegions(parsedData);
        
//       } catch (err) {
//         console.error("💥 Error fetching regions:", err);
//         const errorMessage = err instanceof Error ? err.message : "Error loading regions";
//         setError(errorMessage);
//         setRegions([]);
//       } finally {
//         setLoading(false);
//       }
//     }

//     // Solo fetch si hay locale
//     if (locale) {
//       fetchRegions();
//     } else {
//       console.warn("⚠️ No locale provided to useRegionsHome");
//       setLoading(false);
//     }
//   }, [locale]);

//   return { regions, loading, error };
// }