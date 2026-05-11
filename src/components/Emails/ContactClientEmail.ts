// src/components/Emails/ContactClientEmail.ts

const BRAND_IMAGE =
  "https://lh7-rt.googleusercontent.com/formsz/AN7BsVDo63HmgYeJd0ANjVi0EB260YQtrCIJToZz5_Z32OTtY3MXW7DS1u-N9tBuisj_6oFmGcz0de59dYgJ4O9OX30U5Z5hf-pYR61MmUsU2EKfTm_bvFqHu3w8kGbjM2WCmIO4bqKxIs74iRduys4bvT9rOvQBYLa02TbLoA=fcrop64=1,00000000ffffffff?key=vm72eiP0uUpPQPN0ilaybg";

const CONTACT = {
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

interface ContactClientEmailProps {
  name: string;
  locale: "es" | "en";
}

export function ContactClientEmail({ name, locale }: ContactClientEmailProps) {
  const isEs = locale === "es";

  const html = /* html */ `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&display=swap" rel="stylesheet"/>
  <title>${isEs ? "Recibimos tu mensaje" : "We received your message"} — ViajeSOAR</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Oswald',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Hero -->
          <tr>
            <td style="border-radius:12px 12px 0 0;overflow:hidden;border-bottom:3px solid #0891b2;">
              <img src="${BRAND_IMAGE}" alt="ViajeSOAR" width="600"
                style="display:block;width:100%;max-height:500px;object-fit:cover;border-radius:12px 12px 0 0;" />
              <div style="background-image:linear-gradient(to bottom,#ffffff,#f1f5f9,#ffffff);padding:28px 10px 36px;border-top:3px solid #0891b2;">
                <h1 style="color:#1e293b;font-size:29px;font-weight:700;margin:0 0 4px;font-family:'Oswald',Arial,sans-serif;text-align:center;text-transform:uppercase;">
                  ${isEs
                    ? `¡Hola, <span style="color:#0891b2;">${name}!</span>`
                    : `Hi, <span style="color:#0891b2;">${name}!</span>`}
                </h1>
                <p style="color:#343e4e;font-size:17px;margin:4px 0 0;line-height:1.6;text-align:center;font-family:'Oswald',Arial,sans-serif;">
                  ${isEs
                    ? "¡Recibimos tu mensaje! ✨<br/>Un especialista te contactará en breve,<br/>para ayudarte a planear tu experiencia <span style='color:#0891b2;font-weight:700;'>SOAR</span><span style='color:#1e293b;font-weight:700;'>prendente</span>."
                    : "We received your message! ✨<br/>A specialist will reach out shortly,<br/>to help you plan your <span style='color:#0891b2;font-weight:700;'>SOAR</span><span style='color:#1e293b;font-weight:700;'>prising</span> experience."}
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

          <!-- Next Steps -->
          <tr>
            <td style="background:#ffffff;padding:28px 24px;">

              <table cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td style="width:4px;background:#0891b2;border-radius:2px;padding:0;" width="4">&nbsp;</td>
                  <td style="padding-left:10px;">
                    <div style="color:#0369a1;font-size:13px;font-family:'Oswald',Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;">
                      ${isEs ? "¿Qué sigue?" : "What's next?"}
                    </div>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                <tr>
                  <td style="vertical-align:top;width:36px;">${stepNum("1")}</td>
                  <td style="vertical-align:top;padding-left:12px;">
                    <div style="color:#1e293b;font-size:16px;font-weight:600;margin-bottom:2px;font-family:'Oswald',Arial,sans-serif;">
                      ${isEs ? "Revisamos tu mensaje" : "We review your message"}
                    </div>
                    <div style="color:#475569;font-size:15px;line-height:1.5;font-family:'Oswald',Arial,sans-serif;">
                      ${isEs ? "Nuestro equipo leerá tu mensaje y analizará cómo podemos ayudarte." : "Our team will read your message and figure out the best way to help you."}
                    </div>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                <tr>
                  <td style="vertical-align:top;width:36px;">${stepNum("2")}</td>
                  <td style="vertical-align:top;padding-left:12px;">
                    <div style="color:#1e293b;font-size:16px;font-weight:600;margin-bottom:2px;font-family:'Oswald',Arial,sans-serif;">
                      ${isEs ? "Te contactamos" : "We contact you"}
                    </div>
                    <div style="color:#475569;font-size:15px;line-height:1.5;font-family:'Oswald',Arial,sans-serif;">
                      ${isEs ? "Un asesor se pondrá en contacto contigo en menos de 24 horas." : "An advisor will reach out to you within 24 hours."}
                    </div>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:top;width:36px;">${stepNum("3")}</td>
                  <td style="vertical-align:top;padding-left:12px;">
                    <div style="color:#1e293b;font-size:16px;font-weight:600;margin-bottom:2px;font-family:'Oswald',Arial,sans-serif;">
                      ${isEs ? "¡Planificamos tu viaje!" : "We plan your trip!"}
                    </div>
                    <div style="color:#475569;font-size:15px;line-height:1.5;font-family:'Oswald',Arial,sans-serif;">
                      ${isEs ? "Juntos crearemos la experiencia de viaje perfecta para ti." : "Together we'll create the perfect travel experience for you."}
                    </div>
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
                  ${iconBtn(CONTACT.whatsapp,  ICONS.whatsapp,  "WhatsApp")}
                  ${iconBtn(CONTACT.messenger, ICONS.messenger, "Messenger")}
                  ${iconBtn(CONTACT.email,     ICONS.email,     isEs ? "Correo" : "Email")}
                </tr>
              </table>
              <p style="color:#475569;font-size:13px;margin:20px 0 0;line-height:1.6;font-family:'Oswald',Arial,sans-serif;">
                ${isEs
                  ? "Si tienes alguna duda adicional, estaremos encantados de ayudarte."
                  : "If you have any additional questions, we'll be happy to help."}
              </p>
            </td>
          </tr>

          <!-- Redes -->
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

          <!-- Footer -->
          <tr>
            <td style="background:#ffffff;border-radius:0 0 12px 12px;padding:24px 36px;border-top:1px solid #e2e8f0;text-align:center;">
              <img src="${BRAND_IMAGE}" alt="ViajeSOAR" width="600"
                style="display:block;width:100%;max-height:240px;object-fit:cover;border-radius:12px;" />
              <p style="color:#0369a1;font-size:13px;font-family:'Oswald',Arial,sans-serif;margin:10px 0 20px;letter-spacing:2px;">VIAJESOAR.COM</p>

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
                              ? "Este mensaje es 100% digital — sin papel, sin impresiones, sin impacto innecesario. Gracias por ser parte del cambio. 🌍"
                              : "This message is 100% digital — no paper, no printing, no unnecessary impact. Thank you for being part of the change. 🌍"}
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