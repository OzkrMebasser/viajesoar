"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useDestinationByName, useCountriesByRegion } from "@/lib/hooks/useDestinations";


export default function DestinationPage() {
  const locale = useLocale();
  const { name } = useParams(); // name viene de la URL
  const safeName = typeof name === "string" ? name : "";
  const { destination, loading, error } = useDestinationByName(safeName, locale);
  const { countries } = useCountriesByRegion(locale);
  // console.log("countries", countries);
  const countryList = countries.filter((country) => country.name === destination?.name);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!countries) return <div>No se encontró el destino</div>;

  return (
    <div className="p-8">
      {countryList.map((country) => (
        <div key={country.id}>
          <h1 className="text-4xl font-bold">{country.name}</h1>    
          <p>{country.description}</p>
          <img src={country.image} alt={country.name} className="mt-4 rounded" />
        </div>
      ))}
      {/* <h1 className="text-4xl font-bold">{destination.name}</h1>
      <p>{destination.description}</p>
      <img src={destination.image} alt={destination.name} className="mt-4 rounded" /> */}
    </div>
  );
}
