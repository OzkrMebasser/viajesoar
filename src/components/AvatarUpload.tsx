"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string;
  onAvatarUpdate?: (newUrl: string) => void;
}

export default function AvatarUpload({
  userId,
  currentAvatarUrl,
  onAvatarUpdate,
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Crear preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile || !userId) return;

    setUploading(true);

    try {
      // Generar nombre único para el archivo
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Subir archivo al bucket
      const { error: uploadError } = await supabase.storage
        .from("avatars-bucket")
        .upload(filePath, avatarFile, {
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Obtener URL pública
      const { data } = supabase.storage
        .from("avatars-bucket")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      // Actualizar perfil en la base de datos
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", userId);

      if (updateError) {
        throw updateError;
      }

      // Callback para actualizar el estado padre
      if (onAvatarUpdate) {
        onAvatarUpdate(publicUrl);
      }

      alert("Avatar updated successfully!");

      // Limpiar estado
      setAvatarFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Error uploading avatar. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg">
      {/* Avatar actual */}
      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
        <img
          src={previewUrl || currentAvatarUrl || "/default-avatar.png"}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Input para seleccionar archivo */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        title="Select an avatar image"
        placeholder="Choose an image file"
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />

      {/* Botón para subir */}
      {avatarFile && (
        <button
          onClick={uploadAvatar}
          disabled={uploading}
          className={`px-4 py-2 rounded text-white font-semibold ${
            uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {uploading ? "Uploading..." : "Update Avatar"}
        </button>
      )}

      {/* Cancelar preview */}
      {previewUrl && (
        <button
          onClick={() => {
            setPreviewUrl(null);
            setAvatarFile(null);
          }}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
