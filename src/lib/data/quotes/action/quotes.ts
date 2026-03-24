"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { SalesNotificationEmail } from "@/components/Emails/SalesNotificationEmail";
import { ClientConfirmationEmail } from "@/components/Emails/ClientConfirmationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitQuote(data: Record<string, unknown>) {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  const { locale, ...insertData } = data;

  const { data: inserted, error } = await supabase
    .from("quotes")
    .insert(insertData)
    .select("quote_number")
    .single();

  if (error) throw new Error(error.message);

  const quoteNumber = inserted?.quote_number ?? null;

  // Correo interno a ventas
  await resend.emails.send({
    from: "VIAJESOAR Cotizaciones <no-reply@viajesoar.com>",
    to: process.env.RESEND_TO!,
    subject: `Nueva cotización — ${quoteNumber ?? ""} ${data.package_name}, ${data.internal_pkg_id}`,
    html: SalesNotificationEmail({
      package_name: data.package_name as string,
      internal_pkg_id: data.internal_pkg_id as string | null,
      full_name: data.full_name as string,
      email: data.email as string,
      phone: data.phone as string | null,
      agency: data.agency as string | null,
      country: data.country as string | null,
      state: data.state as string | null,
      municipality: data.municipality as string | null,
      travel_date: data.travel_date as string | null,
      departure_date: data.departure_date as string | null,
      adults: data.adults as number,
      children: data.children as number,
      message: data.message as string | null,
      newsletter: data.newsletter as boolean,
      trip_purpose: data.trip_purpose as string | null,
      quote_number: quoteNumber,
      locale: locale as string,
      whatsapp: data.whatsapp as string | null,
    }),
  });

  // Confirmación al cliente
  if (data.email) {
    await resend.emails.send({
      from: "VIAJESOAR <no-reply@viajesoar.com>",
      to: data.email as string,
      subject:
        locale === "es"
          ? `Recibimos tu solicitud — ${quoteNumber ?? ""} ${data.package_name}`
          : `We received your request — ${quoteNumber ?? ""} ${data.package_name}`,
      html: ClientConfirmationEmail({
        first_name: data.first_name as string,
        package_name: data.package_name as string,
        internal_pkg_id: data.internal_pkg_id as string | null,
        travel_date: data.travel_date as string | null,
        departure_date: data.departure_date as string | null,
        adults: data.adults as number,
        children: data.children as number,
        trip_purpose: data.trip_purpose as string | null,
        locale: (locale as "es" | "en") ?? "es",
        quote_number: quoteNumber,
      }),
    });
  }

  return { success: true };
}
