"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User, LogOut, ChevronDown, Camera, X, IndentDecrease } from "lucide-react";
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Interfaz para el perfil del usuario
interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  phone: string | null;
}

// Definir la interfaz para las props
interface UserMenuProps {
  isMobile?: boolean;
}

export default function UserMenu({ isMobile = false }: UserMenuProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  
  // Estados para la subida de avatar
  const [uploading, setUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Función para obtener el perfil del usuario
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error in fetchUserProfile:', err);
      return null;
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          setUser(data.user);
          
          const userProfile = await fetchUserProfile(data.user.id);
          setProfile(userProfile);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Error getting user:', error);
      }
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        try {
          if (session?.user) {
            setUser(session.user);
            const userProfile = await fetchUserProfile(session.user.id);
            setProfile(userProfile);
          } else {
            setUser(null);
            setProfile(null);
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      const firstName = profile?.full_name || user?.user_metadata?.full_name;
      await supabase.auth.signOut();
      setIsOpen(false);
      setShowAvatarUpload(false);

      if (firstName) {
        alert(`Adiós ${obtenerPrimerNombre(firstName)}`);
      }

      window.location.reload();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile || !user?.id) return;

    setUploading(true);

    try {
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars-bucket")
        .upload(filePath, avatarFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("avatars-bucket")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
      alert("Avatar updated successfully!");
      setAvatarFile(null);
      setPreviewUrl(null);
      setShowAvatarUpload(false);

    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Error uploading avatar. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const cancelAvatarUpload = () => {
    setPreviewUrl(null);
    setAvatarFile(null);
    setShowAvatarUpload(false);
  };

  function obtenerPrimerNombre(fullName: string): string {
    return fullName ? fullName.trim().split(" ")[0] : "Usuario";
  }

  if (!user) return null;

  const displayName = profile?.full_name || user.user_metadata?.full_name || "Usuario";
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;
  const email = profile?.email || user.email;

  return (
    <div className="relative cursor-pointer">
      {/* Botón principal del menú */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 p-2 rounded-full transition-all duration-300 group ${
          isMobile 
            ? 'hover:bg-blue-100 text-blue-600' 
            : 'hover:bg-white/80 text-white/90 hover:text-white'
        }`}
      >
        {/* Avatar o icono placeholder */}
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 bg-gray-200 flex items-center justify-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={obtenerPrimerNombre(displayName)}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-gray-400" />
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">
                Hola, {obtenerPrimerNombre(displayName)}
              </p>
              <p className="text-xs text-gray-500">{email}</p>
            </div>

            {!showAvatarUpload ? (
              <div className="py-2">
                <div className="px-4 py-3 flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={obtenerPrimerNombre(displayName)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <button
                      onClick={() => setShowAvatarUpload(true)}
                      className="absolute -bottom-1 -right-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5 shadow-lg transition-colors"
                      title="Cambiar avatar"
                    >
                      <Camera className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Mi perfil</p>
                    <p className="text-xs text-gray-500">Gestiona tu cuenta</p>
                  </div>
                </div>

                <hr className="border-gray-200 mx-2" />

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-3"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-900">Cambiar Avatar</h3>
                  <button
                    onClick={cancelAvatarUpload}
                    className="text-gray-400 hover:text-gray-600"
                    title="Cerrar panel de cambio de avatar"
                  >
                    <IndentDecrease className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300">
                    <img
                      src={previewUrl || avatarUrl || "https://images.pexels.com/photos/9951800/pexels-photo-9951800.jpeg"}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    placeholder="Selecciona una imagen para tu avatar"
                    title="Selecciona una imagen para tu avatar"
                    className="block w-full text-xs text-gray-500
                      file:mr-2 file:py-1.5 file:px-3
                      file:rounded-full file:border-0
                      file:text-xs file:font-medium
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100 cursor-pointer"
                  />

                  <div className="flex gap-2 w-full">
                    {avatarFile && (
                      <button
                        onClick={uploadAvatar}
                        disabled={uploading}
                        className={`flex-1 py-2 px-3 rounded-md text-xs font-medium text-white transition-colors ${
                          uploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                        }`}
                      >
                        {uploading ? "Subiendo..." : "Guardar"}
                      </button>
                    )}
                    
                    <button
                      onClick={cancelAvatarUpload}
                      className="flex-1 py-2 px-3 rounded-md text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      Cancelar
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
