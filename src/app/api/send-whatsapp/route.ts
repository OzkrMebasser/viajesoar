// app/api/send-whatsapp/route.ts
import { NextResponse } from "next/server";

// Función para formatear número
function formatPhoneNumber(phone: string): string {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, "");
  
  // If it doesn't start with country code, assume Mexico (52)
  if (!cleaned.startsWith("52")) {
    return "52" + cleaned;
  }
  
  return cleaned;
}

export async function POST(req: Request) {
  try {
    const { phone, message } = await req.json();

    // Validation
    if (!phone || !message) {
      return NextResponse.json(
        { error: "Falta número o mensaje" },
        { status: 400 }
      );
    }

    if (!process.env.WHATSAPP_TOKEN || !process.env.PHONE_NUMBER_ID) {
      console.error("Variables de entorno no configuradas");
      return NextResponse.json(
        { error: "Configuración del servidor incompleta" },
        { status: 500 }
      );
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(phone);
    console.log("Número formateado:", formattedPhone);

    // Make request to WhatsApp API
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: formattedPhone,
          type: "text",
          text: {
            body: message,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("WhatsApp API error:", data);
      return NextResponse.json(data, { status: response.status });
    }

    console.log("Mensaje enviado exitosamente:", data);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("Error en send-whatsapp:", error);
    return NextResponse.json(
      { error: "Error al enviar mensaje", details: String(error) },
      { status: 500 }
    );
  }
}