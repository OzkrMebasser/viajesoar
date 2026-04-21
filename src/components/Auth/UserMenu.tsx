"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  User,
  LogOut,
  ChevronDown,
  Camera,
  X,
  Heart as HeartIcon,
  Star,
  ArrowLeft,
} from "lucide-react";
import { useFavorites } from "@/lib/context/FavoritesProvider";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useLocale } from "next-intl";
import type { Locale } from "@/types/locale";

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  phone: string | null;
}

interface UserMenuProps {
  isMobile?: boolean;
}

// ── traducciones ──────────────────────────────────────────────
const translations = {
  es: {
    hello: "Hola",
    myProfile: "Mi perfil",
    manageAccount: "Gestiona tu cuenta",
    myFavorites: "Mis favoritos",
    logout: "Cerrar sesión",
    changeAvatar: "Cambiar avatar",
    cancel: "Cancelar",
    save: "Guardar",
    uploading: "Subiendo...",
    noFavorites: "No tienes favoritos aún",
    seeAll: "Ver todos",
    goodbye: "Adiós",
    avatarSuccess: "¡Avatar actualizado!",
    avatarError: "Error al subir el avatar. Intenta de nuevo.",
    back: "Volver",
    favorites: "favoritos",
    noFileSelected: "Ningún archivo seleccionado",
  },
  en: {
    hello: "Hello",
    myProfile: "My profile",
    manageAccount: "Manage your account",
    myFavorites: "My favorites",
    logout: "Sign out",
    changeAvatar: "Change avatar",
    cancel: "Cancel",
    save: "Save",
    uploading: "Uploading...",
    noFavorites: "No favorites yet",
    seeAll: "See all",
    goodbye: "Goodbye",
    avatarSuccess: "Avatar updated!",
    avatarError: "Error uploading avatar. Please try again.",
    back: "Back",
    favorites: "favorites",
    noFileSelected: "No file selected",
  },
} as const;

export default function UserMenu({ isMobile = false }: UserMenuProps) {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = translations[locale];

  const { favoritesData, removeFavorite } = useFavorites();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"menu" | "favorites" | "avatar">("menu");

  const [uploading, setUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) return null;
    return data;
  };

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
        setProfile(await fetchUserProfile(data.user.id));
      }
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        if (session?.user) {
          setUser(session.user);
          setProfile(await fetchUserProfile(session.user.id));
        } else {
          setUser(null);
          setProfile(null);
        }
      },
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  const firstWord = (name: string) => name?.trim().split(" ")[0] ?? "Usuario";

  // ── reset completo del dropdown ───────────────────────────
  const resetDropdown = () => {
    setIsOpen(false);
    setView("menu");
    setAvatarFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleLogout = async () => {
    const name = profile?.full_name || user?.user_metadata?.full_name;
    await supabase.auth.signOut();
    resetDropdown();
    if (name) alert(`${t.goodbye} ${firstWord(name)}`);
    window.location.reload();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadAvatar = async () => {
    if (!avatarFile || !user?.id) return;
    setUploading(true);
    try {
      const ext = avatarFile.name.split(".").pop();
      const path = `avatars/${user.id}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("avatars-bucket")
        .upload(path, avatarFile, { upsert: true });
      if (upErr) throw upErr;

      const { data } = supabase.storage
        .from("avatars-bucket")
        .getPublicUrl(path);
      const { error: updErr } = await supabase
        .from("profiles")
        .update({ avatar_url: data.publicUrl })
        .eq("id", user.id);
      if (updErr) throw updErr;

      setProfile((p) => (p ? { ...p, avatar_url: data.publicUrl } : null));
      alert(t.avatarSuccess);
      resetDropdown();
    } catch {
      alert(t.avatarError);
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  const displayName =
    profile?.full_name || user.user_metadata?.full_name || "Usuario";
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;
  const email = profile?.email || user.email;

  // ── estilos compartidos usando tus CSS vars ───────────────

  const headerStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  };

  return (
    <div className="relative cursor-pointer">
      {/* ── Trigger button ── */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setView("menu");
        }}
        className={`flex items-center gap-2 p-2 rounded-full transition-all duration-300 ${
          isMobile ? "" : "hover:bg-var(--accent)/10"
        }`}
      >
        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={firstWord(displayName)}
              className="w-full h-full object-cover p-0"
            />
          ) : (
            <User className="w-4 h-4 text-accent" />
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          style={{ color: "var(--accent)" }}
        />
      </button>

      {/* ── Dropdown ── */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={resetDropdown} />
          <div className="absolute top-full right-0 mt-2 w-72 rounded-xl overflow-hidden z-50 bg-gradient-theme backdrop-blur-[14px] border border-(--accent) shadow-lg">

            {/* Header siempre visible */}
            <div className="px-4 py-3" style={headerStyle}>
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--accent)" }}
              >
                {t.hello}, {firstWord(displayName)}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--text)", opacity: 0.5 }}
              >
                {email}
              </p>
            </div>

            {/* ── Vista: menú principal ── */}
            {view === "menu" && (
              <div className="py-2">
                {/* Avatar + perfil */}
                <div className="px-4 py-3 flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid var(--accent)",
                      }}
                    >
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={firstWord(displayName)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User
                          className="w-5 h-5"
                          style={{ color: "var(--accent)" }}
                        />
                      )}
                    </div>
                    <button
                      onClick={() => setView("avatar")}
                      className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center transition-opacity hover:opacity-90"
                      style={{ background: "var(--accent)" }}
                      title={t.changeAvatar}
                    >
                      <Camera
                        className="w-2.5 h-2.5"
                        style={{ color: "#000" }}
                      />
                    </button>
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text)" }}
                    >
                      {t.myProfile}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--text)", opacity: 0.45 }}
                    >
                      {t.manageAccount}
                    </p>
                  </div>
                </div>

                <div className="h-[.5px] bg-[var(--accent)]/40 mx-3" />

                <button
                  className="w-full px-4 py-[10px] text-left text-[13px] text-[var(--accent)] bg-transparent border-none flex items-center gap-[10px] cursor-pointer transition-colors duration-200 hover:bg-white/10"
                  onClick={() => setView("favorites")}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <HeartIcon
                    className="w-4 h-4"
                    style={{ color: "var(--accent)" }}
                  />
                  {t.myFavorites} ({favoritesData.length})
                </button>

                <div className="h-[.5px] bg-[var(--accent)]/40 mx-3" />

                <button
                  className="w-full px-4 py-[10px] text-left text-[13px] text-red-500 bg-transparent border-none flex items-center gap-[10px] cursor-pointer transition-colors duration-200 hover:bg-white/10"
                  onClick={handleLogout}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(239,68,68,0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <LogOut className="w-4 h-4" />
                  {t.logout}
                </button>
              </div>
            )}

            {/* ── Vista: favoritos ── */}
            {view === "favorites" && (
              <div className="p-4 max-h-96 overflow-y-auto">
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => setView("menu")}
                    style={{ color: "var(--accent)", opacity: 0.6 }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: "var(--accent)" }}
                  >
                    {t.myFavorites} ({favoritesData.length})
                  </h3>
                </div>

                {favoritesData.length === 0 ? (
                  <p
                    className="text-sm text-center py-8"
                    style={{ color: "var(--text)", opacity: 0.4 }}
                  >
                    {t.noFavorites}
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {favoritesData.map((fav) => (
                      <div
                        key={fav.id}
                        className="flex gap-3 p-2 rounded-lg"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={fav.destinations?.image}
                            alt={fav.destinations?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-medium truncate"
                            style={{ color: "var(--text)" }}
                          >
                            {fav.destinations?.name}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span
                              className="text-xs"
                              style={{ color: "var(--text)", opacity: 0.6 }}
                            >
                              {fav.destinations?.rating}
                            </span>
                          </div>
                          <p
                            className="text-sm font-semibold mt-0.5"
                            style={{ color: "var(--accent)" }}
                          >
                            ${fav.destinations?.price}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFavorite(fav.destination_id)}
                          title="Eliminar"
                        >
                          <HeartIcon className="w-4 h-4 fill-red-500 text-red-500" />
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={() => {
                        resetDropdown();
                        router.push(
                          `/${locale}/${locale === "es" ? "favoritos" : "favorites"}`,
                        );
                      }}
                      className="w-full py-2 rounded-lg text-sm font-semibold tracking-wide uppercase transition-all duration-200"
                      style={{ background: "var(--accent)", color: "#000" }}
                    >
                      {t.seeAll}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── Vista: avatar ── */}
            {view === "avatar" && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => setView("menu")}
                    style={{ color: "var(--accent)", opacity: 0.6 }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: "var(--accent)" }}
                  >
                    {t.changeAvatar}
                  </h3>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div
                    className="w-20 h-20 rounded-full overflow-hidden"
                    style={{ border: "2px solid var(--accent)" }}
                  >
                    <img
                      src={
                        previewUrl ||
                        avatarUrl ||
                        "https://images.pexels.com/photos/9951800/pexels-photo-9951800.jpeg"
                      }
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <label className="w-full cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="flex items-center gap-3 w-full px-3 py-2 rounded-lg
                      border border-[var(--accent)]/40 bg-white/5 hover:bg-white/10
                      transition-colors duration-200">
                      <span className="px-3 py-1 rounded-md text-xs font-semibold uppercase
                        tracking-wide bg-[var(--accent)] text-black shrink-0">
                        {t.changeAvatar}
                      </span>
                      <span className="text-xs text-[var(--text)] opacity-50 truncate">
                        {avatarFile ? avatarFile.name : t.noFileSelected}
                      </span>
                    </div>
                  </label>

                  <div className="flex gap-2 w-full">
                    {avatarFile && (
                      <button
                        onClick={uploadAvatar}
                        disabled={uploading}
                        className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all"
                        style={{
                          background: uploading
                            ? "rgba(255,255,255,0.1)"
                            : "var(--accent)",
                          color: uploading ? "var(--text)" : "#000",
                          cursor: uploading ? "not-allowed" : "pointer",
                        }}
                      >
                        {uploading ? t.uploading : t.save}
                      </button>
                    )}
                    <button
                      onClick={resetDropdown}
                      className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wide"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        color: "var(--text)",
                        border: "1px solid rgba(255,255,255,0.12)",
                      }}
                    >
                      {t.cancel}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}