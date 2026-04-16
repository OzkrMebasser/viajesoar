"use client";

import { useState } from "react";
import type { Locale } from "@/types/locale";
import type { BlogPost } from "@/types/blog";
import CardsSlideShow from "@/components/CardsSlideShow";
import ImageGalleryModal from "@/components/ui/Modals/ImageGalleryModal";
import SplitText from "@/components/SplitText";
import ButtonAccent from "@/components/ui/ButtonAccent";
import ButtonArrow from "@/components/ui/ButtonArrow";
import CardParticlesCanvas from "@/components/ui/Particles/CardParticlesCanvas";
import { useRouter } from "next/navigation";
import {
  FaBookOpen,
  FaCalendarAlt,
  FaUser,
  FaTag,
  FaImages,
  FaShare,
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
} from "react-icons/fa";
import { RiArrowGoBackFill } from "react-icons/ri";
import { MdTravelExplore } from "react-icons/md";

interface Props {
  locale: Locale;
  post: BlogPost;
  relatedPosts?: BlogPost[];
}

const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

function formatDate(dateStr: string, locale: Locale) {
  return new Date(dateStr).toLocaleDateString(
    locale === "es" ? "es-MX" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );
}

/* ── Newsletter CTA ── */
// function NewsletterCTA({ locale }: { locale: Locale }) {
//   const [email, setEmail] = useState("");
//   const [sent, setSent] = useState(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!email.trim()) return;
//     // TODO: conectar con tu servicio de email (Resend, Mailchimp, etc.)
//     setSent(true);
//   };

//   return (
//     <div className="my-10 bg-white/5 border border-[var(--accent)]/30 rounded-sm p-6 sm:p-8 text-center relative overflow-hidden">
//       {/* Decorative bg */}
//       <div className="absolute inset-0 opacity-30 pointer-events-none">
//         <CardParticlesCanvas />
//       </div>

//       <div className="relative z-10">
//         <MdTravelExplore className="text-[var(--accent)] text-4xl mx-auto mb-3" />

//         <h3 className="text-theme-tittles font-bold text-xl uppercase tracking-widest mb-2">
//           {t(
//             locale,
//             "¿Te inspiramos a viajar?",
//             "Did we inspire you to travel?",
//           )}
//         </h3>
//         <p className="text-[var(--text)]/60 text-sm mb-6 max-w-md mx-auto">
//           {t(
//             locale,
//             "Suscríbete y recibe artículos, guías y ofertas exclusivas de viaje directo en tu correo.",
//             "Subscribe and receive articles, guides and exclusive travel deals straight to your inbox.",
//           )}
//         </p>

//         {sent ? (
//           <p className="text-[var(--accent)] text-sm font-semibold tracking-widest uppercase">
//             {t(
//               locale,
//               "¡Gracias! Te tendremos en cuenta. ✈️",
//               "Thank you! We'll be in touch. ✈️",
//             )}
//           </p>
//         ) : (
//           <form
//             onSubmit={handleSubmit}
//             className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto"
//           >
//             <input
//               type="email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder={t(
//                 locale,
//                 "tu@correo.com",
//                 "your@email.com",
//               )}
//               className="flex-1 text-[var(--accent)] border border-[var(--accent)]/50 focus:border-[var(--accent)] rounded-sm px-4 py-2.5 text-sm outline-none transition-colors duration-200 bg-transparent placeholder:text-[var(--text)]/30"
//             />
//             <button
//               type="submit"
//               className="px-5 py-2.5 bg-[var(--accent)] text-black text-xs font-bold uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity whitespace-nowrap"
//             >
//               {t(locale, "Suscribirme", "Subscribe")}
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }

/* ── Related Post Card ── */
function RelatedCard({
  post,
  locale,
}: {
  post: BlogPost;
  locale: Locale;
}) {
  const href = `/${locale}/blog/${post.slug}`;
  return (
    <article className="glass-card border border-white/10 rounded-sm overflow-hidden hover:border-[var(--accent)]/30 transition-all duration-300 flex flex-col relative">
      <div className="absolute inset-0 opacity-60 pointer-events-none">
        <CardParticlesCanvas />
      </div>

      {post.cover_image && (
        <div className="relative h-40 overflow-hidden flex-shrink-0">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {post.category && (
            <div className="absolute top-2 left-2">
              <span className="text-[var(--accent)] text-[9px] tracking-[0.25em] uppercase font-semibold border border-white/30 px-2 py-0.5 rounded-sm bg-black/40 backdrop-blur-sm">
                {post.category}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">
        <p className="text-[var(--text)]/40 text-[9px] uppercase tracking-wider mb-2 flex items-center gap-1">
          <FaCalendarAlt className="text-[var(--accent)]" />
          {formatDate(post.published_at, locale)}
        </p>
        <h4 className="text-[var(--accent)] font-bold text-sm uppercase leading-tight mb-3 line-clamp-2">
          {post.title}
        </h4>
        <div className="mt-auto">
          <ButtonArrow
            href={href}
            title={t(locale, "Leer", "Read")}
          />
        </div>
      </div>
    </article>
  );
}

/* ════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════ */
export default function BlogArticle({ locale, post, relatedPosts }: Props) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const router = useRouter();

  const galleryImages = [
    post.cover_image,
    ...(post.photos ?? []),
  ].filter(Boolean) as string[];

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = encodeURIComponent(post.title);

  return (
    <div className="min-h-screen bg-gradient-theme">
      {/* Gallery modal */}
      <ImageGalleryModal
        headless
        images={galleryImages}
        title={post.title}
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
      />

      {/* ── HERO ── */}
      <section className="relative h-[70vh] sm:h-[60vh] lg:h-[80vh] flex flex-col justify-end overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          {galleryImages.length > 0 ? (
            <CardsSlideShow
              images={galleryImages}
              interval={6000}
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-white/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 h-80 lg:h-full pb-16 lg:pt-28">
          {/* Eyebrow: category */}
          {post.category && (
            <div className="flex items-center gap-2 mb-4">
              <FaBookOpen className="text-[var(--accent)] w-4 h-4" />
              <span className="text-[var(--accent)] text-[11px] tracking-[0.3em] uppercase font-semibold">
                {post.category}
              </span>
            </div>
          )}

          <SplitText
            text={post.title}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 uppercase"
            delay={25}
            duration={0.5}
            splitType="chars"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            textAlign="left"
          />

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-white/60 text-xs">
            <span className="flex items-center gap-1.5">
              <FaCalendarAlt className="text-[var(--accent)]" />
              {formatDate(post.published_at, locale)}
            </span>
            {post.author_name && (
              <span className="flex items-center gap-1.5">
                <FaUser className="text-[var(--accent)]" />
                {post.author_name}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Section header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[var(--accent)] to-[var(--accent)]/40" />
            <h2 className="text-2xl font-bold uppercase tracking-widest text-theme-tittles">
              {t(locale, "Artículo", "Article")}
            </h2>
          </div>
          <p className="text-[var(--accent)] text-xs tracking-widest uppercase ml-7">
            {t(
              locale,
              `Publicado el ${formatDate(post.published_at, locale)}`,
              `Published on ${formatDate(post.published_at, locale)}`,
            )}
          </p>
        </div>

        {/* Main content */}
        {post.content && (
          <div className="mb-6 bg-white/5 border border-[var(--border)]/40 rounded-sm p-5 sm:p-7 hover:border-[var(--accent)]/20 transition-colors">
            <p className="text-[var(--text)]/80 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {post.content}
            </p>
          </div>
        )}

        {/* Content sections */}
        {(post.content_sections?.length ?? 0) > 0 &&
          post.content_sections!.map((section, i) => (
            <div
              key={i}
              className="mb-6 bg-white/5 border border-[var(--border)]/40 rounded-sm p-5 sm:p-7 hover:border-[var(--accent)]/20 transition-colors"
            >
              {section.subtitle && (
                <h3 className="text-theme-tittles font-bold text-sm sm:text-base uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 rounded-full bg-[var(--accent)] inline-block flex-shrink-0" />
                  {section.subtitle}
                </h3>
              )}
              <p className="text-[var(--text)]/80 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {section.body}
              </p>
            </div>
          ))}

        {/* Tags */}
        {(post.tags?.length ?? 0) > 0 && (
          <div className="mb-6 flex flex-wrap gap-2 items-center">
            <FaTag className="text-[var(--accent)] text-sm flex-shrink-0" />
            {post.tags!.map((tag, i) => (
              <span
                key={i}
                className="text-[var(--text)]/60 text-[10px] uppercase tracking-wide border border-white/10 rounded-sm px-2 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Author card */}
        {post.author_name && (
          <div className="mb-6 bg-white/5 border border-[var(--border)]/40 rounded-sm p-5 hover:border-[var(--accent)]/20 transition-colors flex gap-4 items-center">
            {post.author_avatar ? (
              <img
                src={post.author_avatar}
                alt={post.author_name}
                className="w-12 h-12 rounded-full object-cover border border-[var(--accent)]/30 flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[var(--accent)]/20 flex items-center justify-center flex-shrink-0">
                <FaUser className="text-[var(--accent)] text-lg" />
              </div>
            )}
            <div>
              <p className="text-[var(--accent)] text-xs uppercase tracking-widest mb-0.5">
                {t(locale, "Escrito por", "Written by")}
              </p>
              <p className="text-theme-tittles font-bold text-sm uppercase">
                {post.author_name}
              </p>
              {post.author_bio && (
                <p className="text-[var(--text)]/60 text-xs mt-1 leading-relaxed">
                  {post.author_bio}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Share */}
        <div className="mb-6 flex flex-wrap gap-3 items-center">
          <span className="text-[var(--text)]/40 text-xs uppercase tracking-widest">
            {t(locale, "Compartir:", "Share:")}
          </span>
          <a
            href={`https://wa.me/?text=${shareTitle}%20${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[var(--text)]/50 hover:text-green-400 transition-colors text-sm"
          >
            <FaWhatsapp /> WhatsApp
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[var(--text)]/50 hover:text-blue-400 transition-colors text-sm"
          >
            <FaFacebook /> Facebook
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[var(--text)]/50 hover:text-sky-400 transition-colors text-sm"
          >
            <FaTwitter /> Twitter
          </a>
        </div>

        {/* ── NEWSLETTER CTA ── */}
        {/* <NewsletterCTA locale={locale} /> */}

        {/* Gallery + Back buttons */}
        <div className="flex flex-wrap gap-4 justify-center mt-6">
          {galleryImages.length > 1 && (
            <ButtonAccent
              onClick={() => setGalleryOpen(true)}
              className=""
              title={t(
                locale,
                `Ver galería (${galleryImages.length} fotos)`,
                `View gallery (${galleryImages.length} photos)`,
              )}
              icon={FaImages}
            />
          )}
          <ButtonAccent
            onClick={() => router.back()}
            className="animate-pulse"
            title={t(locale, "Regresar al Blog", "Back to Blog")}
            icon={RiArrowGoBackFill}
          />
        </div>

        <div className="border-t border-white/10 opacity-45 mt-10" />
      </div>

      {/* ── RELATED POSTS ── */}
      {relatedPosts && relatedPosts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[var(--accent)] to-[var(--accent)]/40" />
              <h2 className="text-xl font-bold uppercase tracking-widest text-theme-tittles">
                {t(locale, "Artículos relacionados", "Related articles")}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((rp) => (
              <RelatedCard key={rp.id} post={rp} locale={locale} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}