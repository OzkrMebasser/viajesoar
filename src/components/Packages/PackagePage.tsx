"use client";

import { usePackageBySlug } from "@/lib/hooks/usePackageBySlug";

interface PackagePageProps {
  slug: string;
  locale: "es" | "en";
}

export default function PackagePage({ slug, locale }: PackagePageProps) {
  const { pkg, loading, error } = usePackageBySlug(slug, locale);

  if (loading) return <p>Cargando paquete...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!pkg) return <p>Paquete no encontrado</p>;

  return (
    <div>
      <h1>{pkg.name}</h1>
      <p>{pkg.description}</p>
      <p>Duración: {pkg.duration}</p>
      <p>Precio desde: {pkg.price_from} {pkg.currency}</p>

      <h3>Ciudades visitadas:</h3>
      <ul>
        {(pkg.visited_cities ?? []).map((city) => (
          <li key={city.id}>{city.name}</li>
        ))}
      </ul>

      <h3>Países visitados:</h3>
      <ul>
        {(pkg.visited_countries ?? []).map((country) => (
          <li key={country.id}>{country.name}</li>
        ))}
      </ul>

      <h3>Imágenes:</h3>
      <div style={{ display: "flex", gap: "8px" }}>
        {(pkg.images ?? []).map((img) => (
          <img key={img} src={img} alt={pkg.name} width={200} />
        ))}
      </div>
    </div>
  );
}
