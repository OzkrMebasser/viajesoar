"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User, LogOut, ChevronDown } from "lucide-react";

export default function UserMenu({ isMobile = false }) {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    };

    getUser();

    // Escuchar cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const firstName = user?.user_metadata?.name;
    await supabase.auth.signOut();
    setIsOpen(false);
    
    if (firstName) {
      alert(`Adiós ${obtenerPrimerNombre(firstName)}`);
    }
    
    window.location.reload();
  };

  if (!user) return null;

  const firstName = user.user_metadata?.name || "Usuario";

  function obtenerPrimerNombre(fullName) {
    return fullName ? fullName.trim().split(' ')[0] : "Usuario";
  }

  // Estilos diferentes para mobile y desktop
  const buttonStyles = isMobile 
    ? "flex items-center gap-2 p-3 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-300 w-full justify-center"
    : "flex items-center gap-2 p-2 rounded-full hover:bg-white/80 transition-all duration-300 text-white/90 hover:text-white group";

  const menuZIndex = isMobile ? "z-50" : "z-50";

  return (
    <div className="relative cursor-pointer w-full">
      {/* Botón principal del menú */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={buttonStyles}
      >
        <User className={`w-5 h-5 ${isMobile ? 'text-blue-600' : 'text-blue-700'}`} />
        {!isMobile && (
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        )}
        {isMobile && <span className="text-sm font-medium">Perfil</span>}
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <>
          {/* Overlay para cerrar el menú */}
          <div 
            className={`fixed inset-0 ${menuZIndex}`}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Contenido del menú */}
          <div className={`absolute ${isMobile ? 'top-full left-0 right-0' : 'top-full right-0'} mt-2 ${isMobile ? 'w-full' : 'w-64'} bg-white rounded-lg shadow-xl border border-gray-200 ${menuZIndex} overflow-hidden`}>
            {/* Header del menú */}
            <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">
                Hola, {obtenerPrimerNombre(firstName)}
              </p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            
            {/* Opciones del menú */}
            <div className="py-2">
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3">
                {user.user_metadata?.avatar_url && (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt={obtenerPrimerNombre(firstName)}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
                  />
                )}
                Mi perfil
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-3"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}