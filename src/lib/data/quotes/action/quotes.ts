"use server";

import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitQuote(data: Record<string, unknown>) {
  const supabase = await createClient();

  const { error } = await supabase.from("quotes").insert(data);
  if (error) throw new Error(error.message);

  // Correo interno a ventas
  await resend.emails.send({
    // from: "onboarding@resend.dev",
    from: "ViajeSOAR Cotizaciones <no-reply@viajesoar.com>",
    to: process.env.RESEND_TO!,
    subject: `Nueva cotización — ${data.internal_pkg_id} ${data.package_name}`,
    html: `
      <h2>Nueva solicitud de cotización</h2>
      <h3>Paquete</h3>
      <p><strong>${data.package_name}</strong> (${data.internal_pkg_id})</p>
      <h3>Cliente</h3>
      <p><strong>Nombre:</strong> ${data.full_name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Teléfono:</strong> ${data.phone ?? "—"}</p>
      <p><strong>Agencia:</strong> ${data.agency ?? "—"}</p>
      <h3>Origen</h3>
      <p><strong>País:</strong> ${data.country ?? "—"}</p>
      <p><strong>Estado:</strong> ${data.state ?? "—"}</p>
      <p><strong>Ciudad:</strong> ${data.municipality ?? "—"}</p>
      <h3>Viaje</h3>
      <p><strong>Fecha de salida:</strong> ${data.travel_date ?? "—"}</p>
      <p><strong>Adultos:</strong> ${data.adults}</p>
      <p><strong>Menores:</strong> ${data.children}</p>
      <h3>Comentarios</h3>
      <p>${data.message ?? "Sin comentarios"}</p>
      <hr/>
      <p style="color:#999;font-size:12px">
        Newsletter: ${data.newsletter ? "Sí" : "No"} · 
        Recibido: ${new Date().toLocaleString("es-MX")}
      </p>
    `,
  });

  // Confirmación al cliente
  if (data.email) {
    await resend.emails.send({
      from: "ViajeSOAR <no-reply@viajesoar.com>",
      // from: "onboarding@resend.dev",
      to: data.email as string,
      subject: `Recibimos tu solicitud — ${data.package_name}`,
      html: `
        <h2>¡Hola ${data.first_name}!</h2>
        <p>Recibimos tu solicitud para <strong>${data.package_name}</strong>.</p>
        <p>Uno de nuestros ejecutivos se pondrá en contacto contigo a la brevedad.</p>
        <br/>
        <p>Saludos,<br/>El equipo de ViajeSOAR</p>
      `,
    });
  }

  return { success: true };
}

// "use server";

// import { createClient } from "@/lib/supabase/server";
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function submitQuote(data: Record<string, unknown>) {
//   const supabase = await createClient();

//   const { error } = await supabase.from("quotes").insert(data);
//   if (error) throw new Error(error.message);

//   // Log para ver si la key está llegando
//   console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY ? "✓ existe" : "✗ undefined");
//   console.log("RESEND_TO:", process.env.RESEND_TO ?? "✗ undefined");

//   const { data: emailData, error: emailError } = await resend.emails.send({
//     from: "onboarding@resend.dev",
//     to: "ventas.viajesoar@gmail.com", // ← pon tu gmail directo aquí
//     subject: `Test — ${data.package_name}`,
//     html: `<p>Prueba de cotización para ${data.full_name}</p>`,
//   });

//   console.log("Resend response:", emailData);
//   console.log("Resend error:", emailError);

//   return { success: true };
// }


// "use server";

// import { createClient } from "@/lib/supabase/server";

// export async function submitQuote(data: Record<string, unknown>) {
//   const supabase = await createClient();

//   const { error } = await supabase.from("quotes").insert(data);

//   if (error) throw new Error(error.message);
//   return { success: true };
// }