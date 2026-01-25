"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useDestinationByName } from "@/lib/hooks/useDestinations";

export default function DestinationPage() {
  const locale = useLocale();
  const { name } = useParams(); // name viene de la URL
  const safeName = typeof name === "string" ? name : "";
  const { destination, loading, error } = useDestinationByName(safeName, locale);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!destination) return <div>No se encontró el destino</div>;

  return (
    <div className="p-8 bg-amber-700">
      <h1 className="text-4xl font-bold">{destination.name}</h1>
      <p>{destination.description}</p>
      <img src={destination.image} alt={destination.name} className="mt-4 rounded" />
    </div>
  );
}
