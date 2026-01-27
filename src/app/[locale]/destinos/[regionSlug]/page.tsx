"use client";
import RegionDestination from "@/components/Region/RegionDestination";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useDestinationBySlug , useCountriesByRegion} from "@/lib/hooks/useDestinations";

export default function DestinationPage() {
  const locale = useLocale() as "es" | "en";
  const { regionSlug } = useParams<{ regionSlug: string }>();

  const safeSlug = typeof regionSlug === "string" ? regionSlug : "";

  const {
    destination: region,
    loading,
    error,
  } = useDestinationBySlug(safeSlug, locale);

  // const { countries } = useCountriesByRegion(region?.id, locale);


  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  // if (!region) return <div>No se encontró la región</div>;

  return (
    <div className="p-8  min-h-screen">
      {/* <h1 className="text-4xl font-bold text-white">{region.name}</h1>
      <p className="mt-4 text-white/90">{region.description}</p>

      {region.image && (
        <img
          src={region.image}
          alt={region.name}
          className="mt-6 rounded-xl max-w-xl"
        />
      )}
      <div>
        <h2 className="text-2xl font-semibold text-white mt-8">Países en esta región:</h2>
        <ul className="mt-4 list-disc list-inside text-white/90">
          {countries.map((country) => ( 
            <li key={country.id}>{country.name}</li>
          ))}
        </ul> 
      </div> */}
      <RegionDestination />
    </div>
  );
}
