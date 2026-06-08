"use client";
import { useState } from "react";
import { CreditCard, Banknote, Copy, CheckCheck, Wifi } from "lucide-react";
import type { Locale } from "@/types/locale";
import SplitText from "@/components/SplitText";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import { IoAirplane } from "react-icons/io5";
import { BsLightningFill } from "react-icons/bs";
import { FaUniversity, FaMagic } from "react-icons/fa";
import { RiShieldCheckFill } from "react-icons/ri";

const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

interface Props {
  locale: Locale;
}

const HERO_IMAGE =
  "https://images.pexels.com/photos/3944405/pexels-photo-3944405.jpeg";

const bankAccounts = [
  {
    bank: "BBVA",
    currency: "MXN",
    account: "2604947053",
    clabe: "012045026049470534",
    name: "Oscar Antonio Moreno Martinez",
  },
  //   {
  //     bank: "Banamex",
  //     currency: "MXN",
  //     account: "25604189639",
  //     clabe: "044180256041896398",
  //   },
];

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="ml-2 p-1 rounded-sm text-[var(--accent)]/60 hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all duration-200"
      aria-label="Copiar"
    >
      {copied ? (
        <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

export default function PaymentPage({ locale }: Props) {
  return (
    <section className="min-h-screen bg-gradient-theme">
      {/* ── HERO OVERLAY ── */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center px-4 sm:px-6 pb-0 lg:pb-8 text-white">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="text-[var(--accent)] w-4 h-4" />
          <span className="text-[var(--accent)] text-[11px] tracking-[0.3em] uppercase font-semibold">
            {t(locale, "Métodos de Pago", "Payment Methods")}
          </span>
        </div>
        <SplitText
          text={t(locale, "Formas de Pago", "How to Pay")}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 uppercase"
          delay={25}
          duration={0.5}
          splitType="chars"
          from={{ opacity: 0, y: 20 }}
          to={{ opacity: 1, y: 0 }}
          textAlign="left"
        />
        <p className="text-white/70 mt-2 max-w-md text-xs sm:text-sm [text-shadow:2px_2px_3px_#000000]">
          {t(
            locale,
            "Opciones seguras y flexibles para que tu viaje comience sin preocupaciones.",
            "Safe and flexible options so your trip starts worry-free.",
          )}
        </p>
      </div>

      {/* ── HERO BAND ── */}
      <div className="relative h-[100dvh] flex flex-col justify-end overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_IMAGE}
            alt="payment hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-20 pt-10" />
      </div>

      <ScrollIndicator targetId="payment-content" />

      {/* ── CONTENT ── */}
      <div
        className="max-w-4xl mx-auto px-4 sm:px-6 py-8 bg-gradient-theme"
        id="payment-content"
      >
        {/* Section header */}
        <div className="mb-10 pt-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-[var(--accent)]" />
            <h2 className="text-2xl font-bold uppercase tracking-widest text-theme-tittles">
              {t(locale, "Métodos disponibles", "Available Methods")}
            </h2>
          </div>
          <p className="text-[var(--accent)] text-xs tracking-widest uppercase ml-7">
            {t(
              locale,
              "Elige la opción que más te convenga",
              "Choose the option that works best for you",
            )}
          </p>
        </div>

        <div className="flex flex-col gap-10 mb-16">
          {/* ── 1. DEPÓSITOS Y TRANSFERENCIAS ── */}
          <div>
            <div className="flex items-center gap-3 mb-4 uppercase text-sm font-bold tracking-wider">
              <Banknote className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
              <span className="text-[var(--accent)]">
                {t(
                  locale,
                  "Depósitos y Transferencias",
                  "Deposits & Transfers",
                )}
              </span>
              <div className="flex-1 h-px bg-[var(--accent)]/40" />
            </div>

            <p className="text-[var(--text)]/70 text-sm mb-5 leading-relaxed">
              {t(
                locale,
                "Realiza tu pago mediante depósito o transferencia bancaria. Una vez realizada, comparte el comprobante con tu asesor de viajes.",
                "Make your payment via bank deposit or transfer. Once completed, share the receipt with your travel advisor.",
              )}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bankAccounts.map((acc, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-[var(--border)]/40 rounded-sm p-5 hover:border-[var(--accent)]/30 transition-all duration-300"
                >
                  <p className="text-[var(--accent)] text-[10px] uppercase tracking-[0.25em] font-semibold mb-3">
                    VIAJESOAR — {acc.bank}
                  </p>
                  <div className="flex flex-col gap-2.5">
                    <div>
                      <p className="text-[var(--text)]/40 text-[10px] uppercase tracking-wider mb-0.5">
                        {t(locale, "Moneda", "Currency")}
                      </p>
                      <p className="text-theme-tittles text-sm font-semibold">
                        {acc.currency}
                      </p>
                    </div>
                    <div className="border-t border-[var(--border)]/20 pt-2.5">
                      <p className="text-[var(--text)]/40 text-[10px] uppercase tracking-wider mb-0.5">
                        {t(locale, "Número de cuenta", "Account number")}
                      </p>
                      <div className="flex items-center">
                        <span className="text-theme-tittles text-sm font-mono font-semibold tracking-wider">
                          {acc.account}
                        </span>
                        <CopyButton value={acc.account} />
                      </div>
                    </div>
                    <div className="border-t border-[var(--border)]/20 pt-2.5">
                      <p className="text-[var(--text)]/40 text-[10px] uppercase tracking-wider mb-0.5">
                        CLABE
                      </p>
                      <div className="flex items-center">
                        <span className="text-theme-tittles text-sm font-mono font-semibold tracking-wider">
                          {acc.clabe}
                        </span>
                        <CopyButton value={acc.clabe} />
                      </div>
                    </div>
                    <div className="border-t border-[var(--border)]/20 pt-2.5">
                      <p className="text-[var(--text)]/40 text-[10px] uppercase tracking-wider mb-0.5">
                        Nombre
                      </p>
                      <span className="text-theme-tittles text-sm font-mono font-semibold tracking-wider">
                        {acc.name}
                      </span>
                      <CopyButton value={acc.name} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-[var(--accent)]/10 border-l-2 border-[var(--accent)]/40 px-4 py-3 rounded-sm">
              <p className="text-[var(--accent)] text-[10px] tracking-[0.2em] uppercase font-semibold mb-1">
                ✦ {t(locale, "Importante", "Important")}
              </p>
              <p className="text-[var(--text)]/80 text-sm mb-2">
                {t(
                  locale,
                  "Una vez realizada la transferencia o depósito, por favor comparte con tu asesor de viajes una captura o foto del comprobante de pago.",
                  "Once the transfer or deposit is made, please share a screenshot or photo of the payment receipt with your travel advisor.",
                )}
              </p>
              <p className="text-[var(--text)]/80 text-sm">
                {t(
                  locale,
                  "Si necesita factura, solicítela a su asesor de viajes al momento de realizar su pago y comparta sus datos fiscales. Las facturas únicamente pueden emitirse dentro del mismo mes en que se recibe el pago.",
                  "If you need an invoice, please request it from your travel advisor at the time of payment and provide your tax information. Invoices can only be issued within the same month in which the payment is received.",
                )}
              </p>
            </div>
          </div>

          {/* ── 2. TARJETA VÍA ONLINE ── */}
          <div>
            <div className="flex items-center gap-3 mb-4 uppercase text-sm font-bold tracking-wider">
              <Wifi className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
              <span className="text-[var(--accent)]">
                {t(locale, "Tarjeta vía Online", "Online Card Payment")}
              </span>
              <div className="flex-1 h-px bg-[var(--accent)]/40" />
            </div>

            <div className="bg-white/5 border border-[var(--border)]/40 rounded-sm p-5 hover:border-[var(--accent)]/30 transition-all duration-300">
              <p className="text-[var(--text)]/80 text-sm leading-relaxed mb-5">
                {t(
                  locale,
                  "Aceptamos tarjetas de crédito y débito VISA o MasterCard.",
                  "We accept VISA or MasterCard credit and debit cards.",
                )}
              </p>

              {/* Ventajas */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
                {[
                  {
                    icon: BsLightningFill,
                    label: t(locale, "Rápido", "Fast"),
                    desc: t(
                      locale,
                      "Transacción en minutos",
                      "Transaction in minutes",
                    ),
                  },
                  {
                    icon: FaMagic,
                    label: t(locale, "Sencillo", "Simple"),
                    desc: t(
                      locale,
                      "Sin copias ni escáner",
                      "No copies or scanning",
                    ),
                  },
                  {
                    icon: RiShieldCheckFill,
                    label: t(locale, "Seguro", "Secure"),
                    desc: t(
                      locale,
                      "Solo tú y tu banco ven tus datos",
                      "Only you and your bank see your data",
                    ),
                  },
                  {
                    icon: FaUniversity,
                    label: t(locale, "Directo", "Direct"),
                    desc: t(
                      locale,
                      "Cargo vía institución bancaria",
                      "Charge via banking institution",
                    ),
                  },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-4 group hover:scale-105 transition-all duration-300"
                    >
                      <div className="p-3 rounded-lg bg-[var(--accent)]/10 group-hover:bg-[var(--accent)]/20 transition-colors flex-shrink-0">
                        <Icon className="w-6 h-6 accent" />
                      </div>
                      <div>
                        <p className="text-[var(--accent)] text-[10px] uppercase tracking-widest font-semibold mb-1">
                          {item.label}
                        </p>
                        <p className="text-[var(--text)]/60 text-[10px] leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pasos */}
              <p className="text-[var(--text)]/40 text-[10px] uppercase tracking-widest mb-3">
                {t(locale, "Pasos a seguir", "Steps to follow")}
              </p>
              <ol className="flex flex-col gap-3">
                {[
                  t(
                    locale,
                    "Solicita el link de pago a tu asesor.",
                    "Request the payment link from your advisor.",
                  ),
                  t(
                    locale,
                    "Accede al link y verás el total a pagar.",
                    "Open the link and you'll see the total amount.",
                  ),
                  t(
                    locale,
                    "Ingresa los datos de tu tarjeta: número, vencimiento y código de seguridad. Es indispensable que el titular de la tarjeta realice el cargo.",
                    "Enter your card details: number, expiration date, and security code. The cardholder must be the one making the charge.",
                  ),
                  t(
                    locale,
                    "¡Listo! El banco verificará y realizará el cargo. Recibirás un comprobante de pago.",
                    "Done! The bank will verify and process the charge. You'll receive a payment receipt.",
                  ),
                ].map((step, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="min-w-[22px] h-[22px] rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-[11px] font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-[var(--text)]/80">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* ── 3. MESES SIN INTERESES (COMENTADO — FUTURO) ── */}
          {/*
          <div>
            <div className="flex items-center gap-3 mb-4 uppercase text-sm font-bold tracking-wider">
              <span className="text-[var(--accent)]">
                {t(locale, "Meses sin intereses / Meses diferidos", "Installment Plans")}
              </span>
              <div className="flex-1 h-px bg-[var(--accent)]/40" />
            </div>

            <div className="bg-white/5 border border-[var(--border)]/40 rounded-sm p-5">
              <p className="text-[var(--text)]/70 text-sm mb-4 leading-relaxed">
                {t(
                  locale,
                  "Si deseas pagar a meses diferidos, las comisiones por banco son las siguientes. Se necesita la tarjeta físicamente para realizar el cargo. Información sujeta a cambios por parte de la institución bancaria.",
                  "If you'd like to pay in installments, the fees per bank are as follows. The physical card is required to process the charge. Information subject to change by the banking institution.",
                )}
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--accent)]/20">
                      <th className="text-left py-2 px-3 text-[var(--accent)] uppercase tracking-wider font-semibold">
                        {t(locale, "Banco", "Bank")}
                      </th>
                      {["1 Exhibición", "3 Meses", "6 Meses", "9 Meses", "12 Meses", "18 Meses"].map((h) => (
                        <th key={h} className="text-center py-2 px-3 text-[var(--accent)] uppercase tracking-wider font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Santander", "0%", "4%", "7%", "10%", "14%", "18%"],
                      ["Scotiabank", "0%", "4%", "7%", "10%", "14%", "N/A"],
                      ["HSBC",       "0%", "4%", "7%", "10%", "14%", "N/A"],
                      ["Banorte",    "0%", "4%", "7%", "10%", "14%", "N/A"],
                      ["AMEX",       "0%", "4%", "7%", "10%", "13%", "N/A"],
                    ].map(([bank, ...fees], i) => (
                      <tr
                        key={i}
                        className="border-b border-[var(--border)]/20 last:border-0 hover:bg-[var(--accent)]/5 transition-colors"
                      >
                        <td className="py-2.5 px-3 text-theme-tittles font-semibold">{bank}</td>
                        {fees.map((fee, j) => (
                          <td key={j} className={`text-center py-2.5 px-3 ${fee === "0%" ? "text-emerald-400" : fee === "N/A" ? "text-[var(--text)]/30" : "text-[var(--text)]/70"}`}>
                            {fee}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          */}
        </div>
      </div>
    </section>
  );
}
