import { SalesNotificationEmail } from "@/components/Emails/SalesNotificationEmail";
import { ClientConfirmationEmail } from "@/components/Emails/ClientConfirmationEmail";

export default function EmailPreviewPage() {
  const salesHtml = SalesNotificationEmail({
    package_name: "Tour por Europa",
    internal_pkg_id: "EUR-001",
    full_name: "Juan Pérez",
    email: "juan@ejemplo.com",
    phone: "+52 555 123 4567",
    agency: null,
    country: "México",
    state: "CDMX",
    municipality: "Benito Juárez",
    travel_date: "2025-06-15",
    departure_date: null,
    adults: 2,
    children: 1,
    message: "Me gustaría saber si hay disponibilidad para esa fecha.",
    newsletter: true,
    trip_purpose: "vacaciones",
    quote_number: "CVS031726-01",
    locale: "es",
  });

  const clientHtml = ClientConfirmationEmail({
    first_name: "Juan",
    package_name: "Tour por Europa",
    internal_pkg_id: "EUR-001",
    travel_date: "2025-06-15",
    departure_date: null,
    adults: 2,
    children: 1,
    trip_purpose: "vacaciones",
    locale: "es",
    quote_number: "CVS031726-01",
  });

  return (
    <div>
      <h2 style={{ fontFamily: "sans-serif", padding: "16px", background: "#14b8a6", color: "#0f172a" }}>
        📧 Ventas (interno)
      </h2>
      <iframe srcDoc={salesHtml} style={{ width: "100%", height: "700px", border: "none" }} />

      <h2 style={{ fontFamily: "sans-serif", padding: "16px", background: "#0f172a", color: "#14b8a6" }}>
        📧 Confirmación al cliente
      </h2>
      <iframe srcDoc={clientHtml} style={{ width: "100%", height: "700px", border: "none" }} />
    </div>
  );
}