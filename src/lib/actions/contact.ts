
"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { ContactSalesEmail } from "@/components/Emails/ContactSalesEmail";
import { ContactClientEmail } from "@/components/Emails/ContactClientEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitContact(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  locale: string;
}) {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { error } = await supabase
    .from("contact_messages")
    .insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject || null,
      message: data.message,
      locale: data.locale,
    });

  if (error) throw new Error(error.message);

  // Email interno a ventas
  await resend.emails.send({
    from: "VIAJESOAR Contacto <no-reply@viajesoar.com>",
    to: process.env.RESEND_TO!,
    subject: `Nuevo mensaje de contacto — ${data.name}`,
    html: ContactSalesEmail({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject || null,
      message: data.message,
      locale: data.locale,
    }),
  });

  // Confirmación al cliente
  await resend.emails.send({
    from: "VIAJESOAR <no-reply@viajesoar.com>",
    to: data.email,
    subject:
      data.locale === "es"
        ? "Recibimos tu mensaje — ViajeSOAR"
        : "We received your message — ViajeSOAR",
    html: ContactClientEmail({
      name: data.name,
      locale: data.locale as "es" | "en",
    }),
  });

  return { success: true };
}