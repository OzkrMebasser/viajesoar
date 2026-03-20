// SalesNotificationEmail.tsx
// Correo interno a ventas — ViajeSOAR

const purposeLabels: Record<string, { es: string; en: string }> = {
  vacaciones: { es: "Vacaciones", en: "Vacation" },
  luna_de_miel: { es: "Luna de miel", en: "Honeymoon" },
  aniversario: { es: "Aniversario", en: "Anniversary" },
  cumpleanos: { es: "Cumpleaños", en: "Birthday" },
  negocios: { es: "Viaje de negocios", en: "Business trip" },
  familia: { es: "Viaje en familia", en: "Family trip" },
  graduacion: { es: "Graduación", en: "Graduation trip" },
  otro: { es: "Otro", en: "Other" },
};

interface SalesNotificationEmailProps {
  package_name: string;
  internal_pkg_id?: string | null;
  full_name: string;
  email: string;
  phone?: string | null;
  whatsapp?: string | null;
  agency?: string | null;
  country?: string | null;
  state?: string | null;
  municipality?: string | null;
  travel_date?: string | null;
  adults: number;
  children: number;
  message?: string | null;
  newsletter: boolean;
  trip_purpose?: string | null;
  departure_date?: string | null;
  quote_number?: string | null;
  locale?: string | null;
}

const ICONS = {
  phone:
    "https://res.cloudinary.com/dtsenvmdq/image/upload/v1773879673/phone-icon_tamjtx.png",
  whatsapp:
    "https://res.cloudinary.com/dtsenvmdq/image/upload/v1773879949/whatsapp-logo_dk63wn.png",
  email:
    "https://res.cloudinary.com/dtsenvmdq/image/upload/v1773880895/email-icon_bqr8a6.png",
};

const BRAND_IMAGE =
  "https://lh7-rt.googleusercontent.com/formsz/AN7BsVDo63HmgYeJd0ANjVi0EB260YQtrCIJToZz5_Z32OTtY3MXW7DS1u-N9tBuisj_6oFmGcz0de59dYgJ4O9OX30U5Z5hf-pYR61MmUsU2EKfTm_bvFqHu3w8kGbjM2WCmIO4bqKxIs74iRduys4bvT9rOvQBYLa02TbLoA=fcrop64=1,00000000ffffffff?key=vm72eiP0uUpPQPN0ilaybg";

export function SalesNotificationEmail({
  package_name,
  internal_pkg_id,
  full_name,
  email,
  phone,
  whatsapp,
  country,
  state,
  municipality,
  travel_date,
  adults,
  children,
  message,
  newsletter,
  trip_purpose,
  departure_date,
  quote_number,
  locale,
}: SalesNotificationEmailProps) {
  const receivedAt = new Date().toLocaleString("es-MX", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const travelDateFormatted =
    (departure_date ?? travel_date)
      ? new Date(
          (departure_date ?? travel_date)! + "T00:00:00",
        ).toLocaleDateString("es-MX", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : null;

  const purposeLabel = trip_purpose
    ? (purposeLabels[trip_purpose]?.es ?? trip_purpose)
    : null;

  // ── Helpers ────────────────────────────────────────────────────────────────

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

  const badge = (text: string, bg: string, color: string) =>
    `<span style="background:${bg};color:${color};font-size:12px;font-family:'Oswald',Arial,sans-serif;padding:4px 12px;border-radius:4px;letter-spacing:1px;">${text}</span>`;

  const html = /* html */ `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&display=swap" rel="stylesheet"/>
  <title>Nueva Cotización — ViajeSOAR</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Oswald',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- ── Hero Header ──────────────────────────────────────────── -->
          <tr>
            <td style="padding:0;border-radius:12px 12px 0 0;overflow:hidden;border-bottom:3px solid #0891b2;">
              <img
                src="${BRAND_IMAGE}"
                alt="ViajeSOAR"
                width="600"
                style="display:block;width:100%;max-height:220px;object-fit:cover;border-radius:12px 12px 0 0;"
              />
              <div style="background-image:linear-gradient(to bottom,#ffffff,#f1f5f9,#ffffff);padding:24px 28px 28px;border-top:3px solid #0891b2;">

                <!-- Alerta interna -->
                <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:10px 16px;margin-bottom:16px;text-align:center;">
                  <span style="color:#c2410c;font-size:11px;font-family:'Oswald',Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;">🔔 Notificación interna · Equipo de ventas</span>
                </div>

                <h1 style="color:#1e293b;font-size:26px;font-weight:700;margin:0 0 6px;font-family:'Oswald',Arial,sans-serif;text-align:center;text-transform:uppercase;">
                  Nueva <span style="color:#0891b2;">Cotización</span> Recibida
                </h1>
                <p style="color:#475569;font-size:14px;margin:0;text-align:center;font-family:'Oswald',Arial,sans-serif;letter-spacing:1px;">
                  ${receivedAt}
                </p>

                <!-- Badges: pkg id + quote -->
                <table cellpadding="0" cellspacing="0" style="margin:14px auto 0;">
                  <tr>
                    ${
                      internal_pkg_id
                        ? `<td style="padding-right:8px;">${badge(internal_pkg_id, "#0891b2", "#ffffff")}</td>`
                        : ""
                    }
                    ${
                      quote_number
                        ? `<td>${badge(quote_number, "#0c4a6e", "#ffffff")}</td>`
                        : ""
                    }
                  </tr>
                </table>

              </div>
            </td>
          </tr>

          <!-- ── Package Banner ────────────────────────────────────────── -->
          <tr>
            <td style="background:#0891b2;padding:14px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="color:#ffffff;font-size:11px;font-family:'Oswald',Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;margin-bottom:3px;">Paquete solicitado</div>
                    <div style="color:#ffffff;font-size:18px;font-weight:700;font-family:'Oswald',Arial,sans-serif;text-transform:uppercase;">✈ ${package_name}</div>
                  </td>
                  ${
                    travelDateFormatted
                      ? `<td align="right" style="vertical-align:middle;">
                        <div style="color:#e0f7fa;font-size:11px;font-family:'Oswald',Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;margin-bottom:2px;">Salida</div>
                        <div style="color:#ffffff;font-size:14px;font-family:'Oswald',Arial,sans-serif;">${travelDateFormatted}</div>
                      </td>`
                      : ""
                  }
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── Body ─────────────────────────────────────────────────── -->
          <tr>
            <td style="background:#ffffff;padding:24px 28px 32px;">

              <!-- 01 Cliente -->
              ${sectionTitle("01", "Cliente")}
              <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:6px;overflow:hidden;border:1px solid #e2e8f0;margin-bottom:4px;">
                ${row("Nombre", full_name)}
                ${row("Email", email)}
                ${row("Teléfono", phone)}
                ${row("WhatsApp", whatsapp)}
                ${row("Motivo", purposeLabel)}
                ${row("Idioma", locale === "en" ? "Inglés" : "Español")}
              </table>

              <!-- 02 Origen -->
              ${sectionTitle("02", "Origen")}
              <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:6px;overflow:hidden;border:1px solid #e2e8f0;margin-bottom:4px;">
                ${row("País", country)}
                ${row("Estado", state)}
                ${row("Ciudad", municipality)}
              </table>

              <!-- 03 Viaje -->
              ${sectionTitle("03", "Viaje")}
              <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:6px;overflow:hidden;border:1px solid #e2e8f0;margin-bottom:4px;">
                ${row("Fecha de salida", travelDateFormatted)}
                ${row("Adultos", String(adults))}
                ${row("Menores", String(children))}
              </table>

              <!-- 04 Comentarios (condicional) -->
              ${
                message
                  ? `${sectionTitle("04", "Comentarios del cliente")}
                   <div style="background:#f0f9ff;border-left:4px solid #0891b2;border-radius:0 8px 8px 0;padding:14px 18px;color:#1e293b;font-size:14px;font-family:'Oswald',Arial,sans-serif;line-height:1.7;margin-bottom:4px;">${message}</div>`
                  : ""
              }

            </td>
          </tr>

          <!-- ── Contacto rápido ────────────────────────────────────────── -->
          <tr>
            <td style="background:#f0f9ff;padding:20px 28px;border-top:2px solid #bae6fd;text-align:center;">
              <div style="color:#0369a1;font-size:11px;font-family:'Oswald',Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;margin-bottom:10px;">
                Contactar al cliente
              </div>
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="padding:0 8px;">
                    <a href="mailto:${email}" style="display:inline-block;background:#0891b2;color:#ffffff;font-size:12px;font-family:'Oswald',Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;text-decoration:none;padding:9px 20px;border-radius:6px;">
                      <img src="${ICONS.email}" alt="Email" width="14" height="14" style="display:inline-block;vertical-align:middle;margin-right:6px;filter:brightness(0) invert(1);" />
                      <span style="vertical-align:middle;">Email</span>
                    </a>
                  </td>
                 ${
                   whatsapp || phone
                     ? `${
                         whatsapp
                           ? `<td style="padding:0 8px;">
          <a href="https://wa.me/${whatsapp.replace(/\D/g, "")}" style="display:inline-block;background:#16a34a;color:#ffffff;font-size:12px;font-family:'Oswald',Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;text-decoration:none;padding:9px 20px;border-radius:6px;">
            <img src="${ICONS.whatsapp}" alt="WhatsApp" width="14" height="14" style="display:inline-block;vertical-align:middle;margin-right:6px;filter:brightness(0) invert(1);" />
            <span style="vertical-align:middle;">WhatsApp</span>
          </a>
        </td>`
                           : ""
                       }
    ${
      phone
        ? `<td style="padding:0 8px;">
          <a href="tel:${phone.replace(/\s/g, "")}" style="display:inline-block;background:#0c4a6e;color:#ffffff;font-size:12px;font-family:'Oswald',Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;text-decoration:none;padding:9px 20px;border-radius:6px;">
            <img src="${ICONS.phone}" alt="Llamar" width="14" height="14" style="display:inline-block;vertical-align:middle;margin-right:6px;filter:brightness(0) invert(1);" />
            <span style="vertical-align:middle;">Llamar</span>
          </a>
        </td>`
        : ""
    }`
                     : ""
                 }
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── Footer ────────────────────────────────────────────────── -->
          <tr>
            <td style="background:#ffffff;border-radius:0 0 12px 12px;padding:20px 28px;border-top:1px solid #e2e8f0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle;">
                    <strong style="font-family:'Oswald',Arial,sans-serif;font-size:17px;letter-spacing:1px;">
                      <span style="color:#1e293b;">VIAJE</span><span style="color:#0891b2;">SOAR</span>
                    </strong>
                    <div style="color:#94a3b8;font-size:11px;font-family:'Oswald',Arial,sans-serif;letter-spacing:1px;margin-top:2px;">USO INTERNO · NO REENVIAR</div>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <span style="color:#64748b;font-size:12px;font-family:'Oswald',Arial,sans-serif;letter-spacing:1px;">
                      Newsletter:&nbsp;
                      <span style="color:${newsletter ? "#0891b2" : "#94a3b8"};font-weight:700;">
                        ${newsletter ? "✓ Sí" : "✗ No"}
                      </span>
                    </span>
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
