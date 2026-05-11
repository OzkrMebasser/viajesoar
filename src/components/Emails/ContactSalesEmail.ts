// src/components/Emails/ContactSalesEmail.ts

const BRAND_IMAGE =
  "https://lh7-rt.googleusercontent.com/formsz/AN7BsVDo63HmgYeJd0ANjVi0EB260YQtrCIJToZz5_Z32OTtY3MXW7DS1u-N9tBuisj_6oFmGcz0de59dYgJ4O9OX30U5Z5hf-pYR61MmUsU2EKfTm_bvFqHu3w8kGbjM2WCmIO4bqKxIs74iRduys4bvT9rOvQBYLa02TbLoA=fcrop64=1,00000000ffffffff?key=vm72eiP0uUpPQPN0ilaybg";

const ICONS = {
  phone:    "https://res.cloudinary.com/dtsenvmdq/image/upload/v1773879673/phone-icon_tamjtx.png",
  whatsapp: "https://res.cloudinary.com/dtsenvmdq/image/upload/v1773879949/whatsapp-logo_dk63wn.png",
  email:    "https://res.cloudinary.com/dtsenvmdq/image/upload/v1773880895/email-icon_bqr8a6.png",
};

interface ContactSalesEmailProps {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  locale: string;
}

const sectionTitle = (num: string, label: string) =>
  `<table cellpadding="0" cellspacing="0" style="margin-bottom:12px;margin-top:20px;">
    <tr>
      <td style="width:4px;background:#0891b2;border-radius:2px;padding:0;" width="4">&nbsp;</td>
      <td style="padding-left:10px;">
        <span style="color:#0369a1;font-size:11px;font-family:'Oswald',Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;">${num} — ${label}</span>
      </td>
    </tr>
  </table>`;

const row = (label: string, value: string | null | undefined) =>
  value
    ? `<tr>
        <td style="padding:9px 14px;background:#f1f5f9;color:#0369a1;font-size:11px;font-family:'Oswald',Arial,sans-serif;text-transform:uppercase;letter-spacing:1.5px;width:130px;border-bottom:1px solid #e2e8f0;vertical-align:top;">${label}</td>
        <td style="padding:9px 14px;background:#ffffff;color:#1e293b;font-size:14px;font-family:'Oswald',Arial,sans-serif;border-bottom:1px solid #e2e8f0;vertical-align:top;">${value}</td>
      </tr>`
    : "";

export function ContactSalesEmail({
  name, email, phone, subject, message, locale,
}: ContactSalesEmailProps) {
  const receivedAt = new Date().toLocaleString("es-MX", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const html = /* html */ `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&display=swap" rel="stylesheet"/>
  <title>Nuevo mensaje de contacto — ViajeSOAR</title>
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
                style="display:block;width:100%;max-height:220px;object-fit:cover;border-radius:12px 12px 0 0;" />
              <div style="background-image:linear-gradient(to bottom,#ffffff,#f1f5f9,#ffffff);padding:24px 28px 28px;border-top:3px solid #0891b2;">

                <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:10px 16px;margin-bottom:16px;text-align:center;">
                  <span style="color:#c2410c;font-size:11px;font-family:'Oswald',Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;">
                    🔔 Notificación interna · Equipo de ventas
                  </span>
                </div>

                <h1 style="color:#1e293b;font-size:26px;font-weight:700;margin:0 0 6px;font-family:'Oswald',Arial,sans-serif;text-align:center;text-transform:uppercase;">
                  Nuevo <span style="color:#0891b2;">Mensaje</span> de Contacto
                </h1>
                <p style="color:#475569;font-size:14px;margin:0;text-align:center;font-family:'Oswald',Arial,sans-serif;letter-spacing:1px;">
                  ${receivedAt}
                </p>

              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:24px 28px 32px;">

              ${sectionTitle("01", "Cliente")}
              <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:6px;overflow:hidden;border:1px solid #e2e8f0;margin-bottom:4px;">
                ${row("Nombre", name)}
                ${row("Email", email)}
                ${row("Teléfono", phone)}
                ${row("Asunto", subject)}
                ${row("Idioma", locale === "en" ? "Inglés" : "Español")}
              </table>

              ${sectionTitle("02", "Mensaje")}
              <div style="background:#f0f9ff;border-left:4px solid #0891b2;border-radius:0 8px 8px 0;padding:14px 18px;color:#1e293b;font-size:14px;font-family:'Oswald',Arial,sans-serif;line-height:1.7;">
                ${message}
              </div>

            </td>
          </tr>

          <!-- Contacto rápido -->
          <tr>
            <td style="background:#f0f9ff;padding:20px 28px;border-top:2px solid #bae6fd;text-align:center;">
              <div style="color:#0369a1;font-size:11px;font-family:'Oswald',Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;margin-bottom:10px;">
                Contactar al cliente
              </div>
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="padding:0 8px;">
                    <a href="mailto:${email}"
                      style="display:inline-block;background:#0891b2;color:#ffffff;font-size:12px;font-family:'Oswald',Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;text-decoration:none;padding:9px 20px;border-radius:6px;">
                      <img src="${ICONS.email}" alt="Email" width="14" height="14"
                        style="display:inline-block;vertical-align:middle;margin-right:6px;filter:brightness(0) invert(1);" />
                      <span style="vertical-align:middle;">Email</span>
                    </a>
                  </td>
                  ${phone ? `
                  <td style="padding:0 8px;">
                    <a href="https://wa.me/${phone.replace(/\D/g, "")}"
                      style="display:inline-block;background:#16a34a;color:#ffffff;font-size:12px;font-family:'Oswald',Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;text-decoration:none;padding:9px 20px;border-radius:6px;">
                      <img src="${ICONS.whatsapp}" alt="WhatsApp" width="14" height="14"
                        style="display:inline-block;vertical-align:middle;margin-right:6px;filter:brightness(0) invert(1);" />
                      <span style="vertical-align:middle;">WhatsApp</span>
                    </a>
                  </td>
                  <td style="padding:0 8px;">
                    <a href="tel:${phone.replace(/\s/g, "")}"
                      style="display:inline-block;background:#0c4a6e;color:#ffffff;font-size:12px;font-family:'Oswald',Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;text-decoration:none;padding:9px 20px;border-radius:6px;">
                      <img src="${ICONS.phone}" alt="Llamar" width="14" height="14"
                        style="display:inline-block;vertical-align:middle;margin-right:6px;filter:brightness(0) invert(1);" />
                      <span style="vertical-align:middle;">Llamar</span>
                    </a>
                  </td>` : ""}
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#ffffff;border-radius:0 0 12px 12px;padding:20px 28px;border-top:1px solid #e2e8f0;">
              <strong style="font-family:'Oswald',Arial,sans-serif;font-size:17px;letter-spacing:1px;">
                <span style="color:#1e293b;">VIAJE</span><span style="color:#0891b2;">SOAR</span>
              </strong>
              <div style="color:#94a3b8;font-size:11px;font-family:'Oswald',Arial,sans-serif;letter-spacing:1px;margin-top:2px;">
                USO INTERNO · NO REENVIAR
              </div>
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