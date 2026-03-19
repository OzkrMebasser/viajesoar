// ClientConfirmationEmail.tsx
// Confirmación al cliente — ViajeSOAR

const purposeLabels: Record<string, { es: string; en: string }> = {
  vacaciones:   { es: "Vacaciones",        en: "Vacation"      },
  luna_de_miel: { es: "Luna de miel",      en: "Honeymoon"     },
  aniversario:  { es: "Aniversario",       en: "Anniversary"   },
  cumpleanos:   { es: "Cumpleaños",        en: "Birthday"      },
  negocios:     { es: "Viaje de negocios", en: "Business trip" },
  familia:      { es: "Viaje en familia",  en: "Family trip"   },
  graduacion:   { es: "Graduación",        en: "Graduation trip"},
  otro:         { es: "Otro",              en: "Other"         },
};

interface ClientConfirmationEmailProps {
  first_name:       string;
  package_name:     string;
  internal_pkg_id?: string | null;
  travel_date?:     string | null;
  departure_date?:  string | null;
  adults:           number;
  children:         number;
  trip_purpose?:    string | null;
  locale?:          "es" | "en";
  quote_number?:    string | null;
}

// ─── Configura aquí tus URLs ───────────────────────────────────────────────
const CONTACT = {
  phone:     "tel:+526124029656",
  whatsapp:  "https://wa.me/5216121037422",
  messenger: "https://m.me/ViajeSoar",
  email:     "mailto:ventas.viajesoar@gmail.com",
};

const SOCIAL = {
  facebook:  "https://www.facebook.com/ViajeSoar",
  instagram: "https://www.instagram.com/viajesoar/",
  tiktok:    "https://www.tiktok.com/@viajesoar",
  x:         "https://x.com/viajesoar",
};

const BRAND_IMAGE =
  "https://lh7-rt.googleusercontent.com/formsz/AN7BsVDo63HmgYeJd0ANjVi0EB260YQtrCIJToZz5_Z32OTtY3MXW7DS1u-N9tBuisj_6oFmGcz0de59dYgJ4O9OX30U5Z5hf-pYR61MmUsU2EKfTm_bvFqHu3w8kGbjM2WCmIO4bqKxIs74iRduys4bvT9rOvQBYLa02TbLoA=fcrop64=1,00000000ffffffff?key=vm72eiP0uUpPQPN0ilaybg";

const SIGNATURE_IMAGE =
  "https://lh7-rt.googleusercontent.com/formsz/AN7BsVDo63HmgYeJd0ANjVi0EB260YQtrCIJToZz5_Z32OTtY3MXW7DS1u-N9tBuisj_6oFmGcz0de59dYgJ4O9OX30U5Z5hf-pYR61MmUsU2EKfTm_bvFqHu3w8kGbjM2WCmIO4bqKxIs74iRduys4bvT9rOvQBYLa02TbLoA=fcrop64=1,00000000ffffffff?key=vm72eiP0uUpPQPN0ilaybg";
// ──────────────────────────────────────────────────────────────────────────

const ICONS = {
  phone:     "https://res.cloudinary.com/dtsenvmdq/image/upload/v1773879673/phone-icon_tamjtx.png",
  whatsapp:  "https://res.cloudinary.com/dtsenvmdq/image/upload/v1773879949/whatsapp-logo_dk63wn.png",
  messenger: "https://res.cloudinary.com/dtsenvmdq/image/upload/v1773880487/messenger-logo_iexwln.png",
  email:     "https://res.cloudinary.com/dtsenvmdq/image/upload/v1773880895/email-icon_bqr8a6.png",
  facebook:  "https://res.cloudinary.com/dtsenvmdq/image/upload/v1773881171/facebook-logo_qrdcxf.png",
  instagram: "https://res.cloudinary.com/dtsenvmdq/image/upload/v1773881538/instagram-logo_mpn0jl.png",
  tiktok:    "https://res.cloudinary.com/dtsenvmdq/image/upload/v1773881835/tiktok-logo_od4ljp.png",
  x:         "https://res.cloudinary.com/dtsenvmdq/image/upload/v1773876237/x-twitter-logo_bye9l7.png",
};

export function ClientConfirmationEmail({
  first_name,
  package_name,
  internal_pkg_id,
  travel_date,
  departure_date,
  adults,
  children,
  trip_purpose,
  locale = "es",
  quote_number,
}: ClientConfirmationEmailProps) {
  const isEs = locale === "es";

  const travelDateFormatted =
    (departure_date ?? travel_date)
      ? new Date(
          (departure_date ?? travel_date)! + "T00:00:00",
        ).toLocaleDateString(isEs ? "es-MX" : "en-US", {
          day:   "numeric",
          month: "long",
          year:  "numeric",
        })
      : null;

  const purposeLabel = trip_purpose
    ? (purposeLabels[trip_purpose]?.[isEs ? "es" : "en"] ?? trip_purpose)
    : null;

  const whatsappMsg = isEs
    ? `Hola ViajeSOAR! 👋 Me interesa el paquete *${package_name}*${travelDateFormatted ? `, con salida el ${travelDateFormatted}` : ""}. Somos ${adults} adulto(s)${children > 0 ? ` y ${children} menor(es)` : ""}${purposeLabel ? `. Motivo: ${purposeLabel}` : ""}. ¿Me pueden dar más información?`
    : `Hi ViajeSOAR! 👋 I'm interested in the *${package_name}* package${travelDateFormatted ? `, departing on ${travelDateFormatted}` : ""}. We are ${adults} adult(s)${children > 0 ? ` and ${children} child(ren)` : ""}${purposeLabel ? `. Purpose: ${purposeLabel}` : ""}. Can you give me more information?`;

  const whatsappUrl = `https://wa.me/5216121037422?text=${encodeURIComponent(whatsappMsg)}`;

  const emailSubject = isEs
    ? `Cotización: ${package_name}${quote_number ? ` — ${quote_number}` : ""}`
    : `Quote: ${package_name}${quote_number ? ` — ${quote_number}` : ""}`;

  const emailBody = isEs
    ? `Hola equipo ViajeSOAR,\n\nMe interesa recibir más información sobre el paquete: ${package_name}${travelDateFormatted ? `\nFecha de salida: ${travelDateFormatted}` : ""}.\nPasajeros: ${adults} adulto(s)${children > 0 ? ` y ${children} menor(es)` : ""}${purposeLabel ? `\nMotivo: ${purposeLabel}` : ""}${quote_number ? `\nNo. cotización: ${quote_number}` : ""}.\n\nQuedo en espera de su respuesta.\nSaludos.`
    : `Hi ViajeSOAR team,\n\nI would like more information about the package: ${package_name}${travelDateFormatted ? `\nDeparture date: ${travelDateFormatted}` : ""}.\nPassengers: ${adults} adult(s)${children > 0 ? ` and ${children} child(ren)` : ""}${purposeLabel ? `\nPurpose: ${purposeLabel}` : ""}${quote_number ? `\nQuote ID: ${quote_number}` : ""}.\n\nLooking forward to your reply.\nBest regards.`;

  const emailUrl = `mailto:ventas.viajesoar@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const iconBtn = (href: string, icon: string, alt: string) =>
    `<td style="padding:0;text-align:center;width:72px;">
      <a href="${href}" target="_blank" style="display:inline-block;text-decoration:none;width:72px;">
        <table width="30" height="30" cellpadding="0" cellspacing="0" style="background:#0891b2;border-radius:50%;margin:0 auto 6px;">
          <tr>
            <td align="center" valign="middle" width="30" height="30">
              <img src="${icon}" alt="${alt}" width="14" height="14" style="display:block;filter:brightness(0) invert(1);" />
            </td>
          </tr>
        </table>
        <div style="color:#64748b;font-size:8px;font-family:'Oswald',Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;width:72px;text-align:center;">${alt}</div>
      </a>
    </td>`;

  const stepNum = (n: string) =>
    `<table width="28" height="28" cellpadding="0" cellspacing="0" style="background:#0891b2;border-radius:50%;margin:0;">
      <tr>
        <td align="center" valign="middle" width="28" height="28" style="color:#ffffff;font-size:14px;font-weight:700;font-family:'Oswald',Arial,sans-serif;">${n}</td>
      </tr>
    </table>`;

  const html = /* html */ `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&display=swap" rel="stylesheet"/>
  <title>${isEs ? "Recibimos tu solicitud" : "We received your request"} — ViajeSOAR</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Oswald',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Hero Header con imagen -->
          <tr>
            <td style="padding:0;border-radius:12px 12px 0 0;overflow:hidden;border-bottom:3px solid #0891b2;">
              <img
                src="${BRAND_IMAGE}"
                alt="ViajeSOAR"
                width="600"
                style="display:block;width:100%;max-height:500px;object-fit:cover;border-radius:12px 12px 0 0;"
              />
              <div style="background-image:linear-gradient(to bottom,#ffffff,#f1f5f9,#ffffff);padding:28px 10px 36px;border-top:3px solid #0891b2;">
                <h1 style="color:#1e293b;font-size:29px;font-weight:700;margin:0 0 4px;font-family:'Oswald',Arial,sans-serif;text-align:center;text-transform:uppercase;">
                  ${isEs
                    ? `¡Hola, <span style="color:#0891b2;">${first_name}!</span>`
                    : `Hi, <span style="color:#0891b2;">${first_name}!</span>`
                  }
                </h1>
                <p style="color:#343e4e;font-size:17px;margin:4px 0 0;line-height:1.6;text-align:center;font-family:'Oswald',Arial,sans-serif;">
                  ${isEs
                    ? "¡Hemos recibido tu solicitud! ✨<br/>Un especialista te contactará en breve,<br/>para crear tu experiencia <span style='color:#0891b2;font-weight:700;'>SOAR</span><span style='color:#1e293b;font-weight:700;text-transform:uppercase;'>prendente</span>."
                    : "We've received your request! ✨<br/>A specialist will reach out shortly,<br/>to create your <span style='color:#0891b2;font-weight:700;'>SOAR</span><span style='color:#1e293b;font-weight:700;text-transform:uppercase;'>prising</span> experience."
                  }
                </p>
                <p style="color:#343e4e;font-size:17px;margin:6px 0 0;line-height:1.6;text-align:center;font-family:'Oswald',Arial,sans-serif;">
                  ${isEs ? "Gracias por confiar en" : "Thank you for trusting"}
                  <strong style="font-family:'Oswald',Arial,sans-serif;font-size:19px;letter-spacing:1px;">
                    <span style="color:#1e293b;">VIAJE</span><span style="color:#0891b2;">SOAR</span>
                  </strong>
                </p>
              </div>
            </td>
          </tr>

          <!-- Package Card -->
          <tr>
            <td style="background:#ffffff;padding:28px 24px;">
              <div style="margin-bottom:40px;">

                <table cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
                  <tr>
                    <td style="width:2px;background:#0891b2;border-radius:2px;padding:0;" width="4">&nbsp;</td>
                    <td style="padding-left:10px;">
                      <div style="color:#0369a1;font-size:13px;font-family:'Oswald',Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;">
                        ${isEs ? "Tu paquete seleccionado" : "Your selected package"}
                      </div>
                    </td>
                  </tr>
                </table>

                <div style="color:#1e293b;text-transform:uppercase;font-size:21px;font-weight:700;font-family:'Oswald',Arial,sans-serif;margin-bottom:10px;">${package_name}</div>

                ${internal_pkg_id ? `
                <div style="margin-bottom:8px;">
                  <span style="color:#0369a1;font-size:14px;font-family:'Oswald',Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;">${isEs ? "ID del paquete" : "Package ID"}:</span>
                  <span style="background:#0891b2;color:#ffffff;font-size:14px;font-family:'Oswald',Arial,sans-serif;margin-left:6px;padding:4px 10px;border-radius:4px;">${internal_pkg_id}</span>
                </div>` : ""}

                ${quote_number ? `
                <div style="margin-bottom:4px;margin-top:10px">
                  <span style="color:#0369a1;font-size:14px;font-family:'Oswald',Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;">${isEs ? "No. cotización" : "Quote ID"}:</span>
                  <span style="background:#0c4a6e;color:#ffffff;font-size:14px;font-family:'Oswald',Arial,sans-serif;margin-left:6px;padding:4px 10px;border-radius:4px;">${quote_number}</span>
                </div>` : ""}

                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;border-top:2px solid #e6f4f7;padding-top:16px;">

                  ${travelDateFormatted ? `
                  <tr>
                    <td style="vertical-align:top;padding-bottom:10px;">
                      <div style="color:#0369a1;font-size:13px;font-family:'Oswald',Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">
                        ${isEs ? "Fecha de salida" : "Departure"}
                      </div>
                      <div style="color:#1e293b;font-size:14px;font-family:'Oswald',Arial,sans-serif;">
                        ${travelDateFormatted}
                      </div>
                    </td>
                  </tr>` : ""}

                  <tr>
                    <td style="vertical-align:top;padding-bottom:10px;">
                      <div style="color:#0369a1;font-size:13px;font-family:'Oswald',Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">
                        ${isEs ? "Pasajeros" : "Passengers"}
                      </div>
                      <div style="color:#1e293b;font-size:14px;font-family:'Oswald',Arial,sans-serif;">
                        ${adults} ${isEs ? "adulto(s)" : "adult(s)"}${children > 0 ? `, ${children} ${isEs ? "menor(es)" : "child(ren)"}` : ""}
                      </div>
                    </td>
                  </tr>

                  ${trip_purpose ? `
                  <tr>
                    <td style="vertical-align:top;">
                      <div style="color:#0369a1;font-size:13px;font-family:'Oswald',Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">
                        ${isEs ? "Motivo" : "Purpose"}
                      </div>
                      <div style="color:#1e293b;font-size:14px;font-family:'Oswald',Arial,sans-serif;">
                        ${purposeLabel}
                      </div>
                    </td>
                  </tr>` : ""}

                </table>
              </div>

              <!-- Next Steps -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;border-top:2px solid #e6f4f7;padding-top:16px;">
                <tr>
                  <td style="width:2px;background:#0891b2;border-radius:2px;padding:0;" width="4">&nbsp;</td>
                  <td style="padding-left:10px;">
                    <div style="color:#0369a1;font-size:13px;font-family:'Oswald',Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;">
                      ${isEs ? "¿Qué sigue?" : "What's next?"}
                    </div>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;margin-top:12px">
                <tr>
                  <td style="vertical-align:top;width:36px;">${stepNum("1")}</td>
                  <td style="vertical-align:top;padding-left:12px;">
                    <div style="color:#1e293b;font-size:16px;font-weight:600;margin-bottom:2px;font-family:'Oswald',Arial,sans-serif;">${isEs ? "Revisamos tu solicitud" : "We review your request"}</div>
                    <div style="color:#475569;font-size:15px;line-height:1.5;font-family:'Oswald',Arial,sans-serif;">${isEs ? "Nuestro equipo analizará los detalles de tu solicitud." : "Our team will analyze the details of your request."}</div>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                <tr>
                  <td style="vertical-align:top;width:36px;">${stepNum("2")}</td>
                  <td style="vertical-align:top;padding-left:12px;">
                    <div style="color:#1e293b;font-size:16px;font-weight:600;margin-bottom:2px;font-family:'Oswald',Arial,sans-serif;">${isEs ? "Te contactamos" : "We contact you"}</div>
                    <div style="color:#475569;font-size:15px;line-height:1.5;font-family:'Oswald',Arial,sans-serif;">${isEs ? "Un ejecutivo se pondrá en contacto contigo a la brevedad para darte tu cotización personalizada." : "An executive will contact you shortly to provide your personalized quote."}</div>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:top;width:36px;">${stepNum("3")}</td>
                  <td style="vertical-align:top;padding-left:12px;">
                    <div style="color:#1e293b;font-size:16px;font-weight:600;margin-bottom:2px;font-family:'Oswald',Arial,sans-serif;">${isEs ? "¡A viajar!" : "Time to travel!"}</div>
                    <div style="color:#475569;font-size:15px;line-height:1.5;font-family:'Oswald',Arial,sans-serif;">${isEs ? "Confirmamos tu reserva y preparamos todo para tu aventura." : "We confirm your booking and prepare everything for your adventure."}</div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Contacto -->
          <tr>
            <td style="background:#f0f9ff;padding:20px 36px;border-top:2px solid #bae6fd;text-align:center;">
              <div style="color:#0369a1;font-size:13px;font-family:'Oswald',Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;margin-bottom:16px;">
                ${isEs ? "Contáctanos" : "Contact us"}
              </div>
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  ${iconBtn(CONTACT.phone,     ICONS.phone,     isEs ? "Teléfono" : "Phone")}
                  ${iconBtn(whatsappUrl,       ICONS.whatsapp,  "WhatsApp")}
                  ${iconBtn(CONTACT.messenger, ICONS.messenger, "Messenger")}
                  ${iconBtn(emailUrl,          ICONS.email,     isEs ? "Correo" : "Email")}
                </tr>
              </table>
              <p style="color:#475569;font-size:13px;margin:0 0 20px;line-height:1.6;font-family:'Oswald',Arial,sans-serif; padding-top:30px">
                ${isEs
                  ? "Si tienes alguna duda, estaremos encantados de ayudarte a través de cualquiera de nuestros medios de contacto."
                  : "If you have any questions, we'll be happy to assist you through any of our contact channels."
                }
              </p>
            </td>
          </tr>

          <!-- Redes Sociales -->
          <tr>
            <td style="background:#f0f9ff;padding:16px 36px 24px;text-align:center;border-top:1px solid #bae6fd;">
              <div style="color:#0369a1;font-size:13px;font-family:'Oswald',Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;margin-bottom:16px;">
                ${isEs ? "Síguenos" : "Follow us"}
              </div>
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  ${iconBtn(SOCIAL.facebook,  ICONS.facebook,  "Facebook")}
                  ${iconBtn(SOCIAL.instagram, ICONS.instagram, "Instagram")}
                  ${iconBtn(SOCIAL.tiktok,    ICONS.tiktok,    "TikTok")}
                  ${iconBtn(SOCIAL.x,         ICONS.x,         "X")}
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer / Firma -->
          <tr>
            <td style="background:#ffffff;border-radius:0 0 12px 12px;padding:24px 36px;border-top:1px solid #e2e8f0;text-align:center;">

              <!-- Logo firma -->
              <img
                src="${SIGNATURE_IMAGE}"
                alt="ViajeSOAR"
                width="600"
                style="display:block;width:100%;max-height:240px;object-fit:cover;border-radius:12px;"
              />
              <p style="color:#0369a1;font-size:13px;font-family:'Oswald',Arial,sans-serif;margin:10px 0 20px;letter-spacing:2px;">VIAJESOAR.COM</p>

              <!-- Nota ecológica -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px 16px;text-align:left;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:28px;vertical-align:top;font-size:21px;padding-top:1px;">🌿</td>
                        <td style="padding-left:10px;vertical-align:top;">
                          <div style="color:#166534;font-size:14px;font-weight:700;font-family:'Oswald',Arial,sans-serif;letter-spacing:0.5px;margin-bottom:4px;">
                            ${isEs ? "Comprometidos con el planeta" : "Committed to the planet"}
                          </div>
                          <div style="color:#15803d;font-size:14px;font-family:'Oswald',Arial,sans-serif;line-height:1.6;">
                            ${isEs
                              ? "Este mensaje es 100% digital — sin papel, sin impresiones, sin impacto innecesario.Cada correo que enviamos es un pequeño paso hacia un planeta mejor. Gracias por ser parte del cambio. 🌍"
                              : "This message is 100% digital — no paper, no printing, no unnecessary impact.Every email we send is a small step toward a better planet.Thank you for being part of the change. 🌍"
                            }
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

  return html;
}