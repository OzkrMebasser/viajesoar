"use client";

import { useState } from "react";
import { MessageCircle, Mail, MessageCircleMore, Send, X } from "lucide-react";

interface ContactButtonConfig {
  id: string;
  icon: React.ReactNode;
  href: string;
}

export default function FloatingContactBot() {
  const [isOpen, setIsOpen] = useState(false);

  const contactButtons: ContactButtonConfig[] = [
    {
      id: "email",
      icon: <Mail size={20} />,

      href: "mailto:contacto@ejemplo.com",
    },
    {
      id: "messenger",
      icon: <MessageCircleMore size={20} />,

      href: "https://m.me/tu-pagina",
    },
    {
      id: "whatsapp",
      icon: <Send size={20} />,

      href: "https://wa.me/+5491234567890",
    },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleContactClick = (href: string) => {
    window.open(href, "_blank");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        {/* Botones de contacto */}
        {isOpen && (
          <div className="absolute bottom-14 right-0 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {contactButtons.map((btn, index) => (
              <button
                key={btn.id}
                onClick={() => handleContactClick(btn.href)}
                className={`bg-theme-tertiary text-[var(--accent)] hover:text-[var(--text-secondary)] border border-[var(--accent)] rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 w-12 h-12 flex items-center justify-center`}
                style={{
                  animation: `slideUp 0.3s ease-out ${index * 0.08}s both`,
                }}
                aria-label="Contacto"
              >
                {btn.icon}
              </button>
            ))}
          </div>
        )}

        {/* Botón principal */}
        <button
          onClick={toggleMenu}
          className={`${
            isOpen
              ? "bg-theme-accent text-theme-btn rotate-180 "
              : "hover:rotate-12 bg-theme-accent text-theme-btn hover:bg-[var(--bg-accent)]/20 hover:text-theme-btn"
          } rounded-full shadow-md transition-all duration-300 transform hover:scale-110 flex items-center justify-center w-12 h-12`}
          aria-label="Abrir menú de contacto"
        >
          {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
