
import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { ContactSalesEmail } from "@/components/Emails/ContactSalesEmail";
import { ContactClientEmail } from "@/components/Emails/ContactClientEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("Datos recibidos:", data);  // 👈 verifica que llegan

    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { error: dbError } = await supabase
      .from("contact_messages")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject || null,
        message: data.message,
        locale: data.locale,
      });

    if (dbError) {
      console.error("Supabase error:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    console.log("Supabase OK ✅");

    const salesRes = await resend.emails.send({
      from: "VIAJESOAR Contacto <no-reply@viajesoar.com>",
      to: process.env.RESEND_TO!,
      subject: `Nuevo mensaje de contacto — ${data.name}`,
      html: ContactSalesEmail({ ...data }),
    });
    console.log("Sales email:", salesRes);  // 👈 verifica respuesta de Resend

    const clientRes = await resend.emails.send({
      from: "VIAJESOAR <no-reply@viajesoar.com>",
      to: data.email,
      subject: data.locale === "es"
        ? "Recibimos tu mensaje — ViajeSOAR"
        : "We received your message — ViajeSOAR",
      html: ContactClientEmail({ name: data.name, locale: data.locale }),
    });
    console.log("Client email:", clientRes);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error general:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}