"use client";
import RegionDestination from "@/components/Region/RegionDestination";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import {
  useDestinationBySlug,
  useCountriesByRegion,
} from "@/lib/hooks/useDestinations";

export default function DestinationPage() {
  // const locale = useLocale() as "es" | "en";
  // const { regionSlug } = useParams<{ regionSlug: string }>();

  // const safeSlug = typeof regionSlug === "string" ? regionSlug : "";

  // const {
  //   destination: region,
  //   loading,
  //   error,
  // } = useDestinationBySlug(safeSlug, locale);

  // const { countries } = useCountriesByRegion(region?.id, locale);
  // // const regionDestinations = destinations.map((dest) => dest.name);
  // // console.log("countries", countries);

  // // const filteredCountries = countries.filter((country) => country.region_id === region?.id);

  // // console.log('filteredCountries', filteredCountries)

  // if (loading) return <div>Cargando...</div>;
  // if (error) return <div>Error: {error}</div>;
  // if (!region) return <div>No se encontró la región</div>;

  return (
    <div className=" bg-gradient-theme text-theme min-h-screen">
      <RegionDestination />
    </div>
  );
}
