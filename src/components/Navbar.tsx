"use client"
import React, { useState, useEffect } from 'react';
import { Globe, Search, User, Menu, X } from 'lucide-react';
import { supabase } from "@/lib/supabase";
import { useRouter } from 'next/navigation';
import UserMenu from './UserMenu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Home');
  const [user, setUser] = useState(null);
  const router = useRouter();

  const navItems = [
    'Home',
    'Holidays', 
    'Destinations',
    'Flights',
    'Offers',
    'Contact'
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Función para manejar el clic del usuario no logueado
  const handleLoginRedirect = () => {
    router.push('/login');
  };

  // useEffect para manejar la autenticación
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
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

  return (
    <>
      <nav 
        className={`fixed left-0 top-0 right-0 z-50 transition-all duration-500 ease-in-out  ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-lg shadow-lg border-b border-gray-100' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-9">
          <div className="flex items-center justify-between py-4 lg:py-5">
            
            {/* Logo */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <Globe className={`w-6 h-6 transition-all duration-300 group-hover:rotate-12 ${
                  isScrolled ? 'text-blue-600' : 'text-white'
                }`} />
                <div className="absolute inset-0 bg-blue-400 blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
              </div>
              <span className={`text-lg font-bold tracking-wider transition-colors duration-300 ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>
                VIAJE<strong className='text-blue-600'>SOAR</strong>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveItem(item)}
                  className={`cursor-pointer relative text-sm font-medium tracking-wide uppercase transition-all duration-300 hover:scale-105 ${
                    isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {item}
                  {activeItem === item && (
                    <div className="absolute -bottom-2 left-0 right-0">
                      <div className="h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transform scale-x-100 transition-transform duration-300" />
                      <div className="h-1 bg-gradient-to-r from-blue-400 to-cyan-300 blur-sm rounded-full opacity-60 -mt-0.5" />
                    </div>
                  )}
                  {activeItem !== item && (
                    <div className="absolute -bottom-2 left-0 right-0">
                      <div className="h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                    </div>
                  )}
                </button>
              ))}
              
              {/* Action Icons */}
              <div className="flex items-center gap-4 ml-6 cursor-pointer">
                <button className={`p-2 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-12 ${
                  isScrolled 
                    ? 'hover:bg-blue-50 text-gray-700 hover:text-blue-600' 
                    : 'hover:bg-white/10 text-white/90 hover:text-white'
                }`}>
                  <Search className="w-5 h-5" />
                </button>
                
                {/* Renderizado condicional del usuario - Desktop */}
                <div className="relative cursor-pointer">
                  {user ? (
                    <UserMenu isMobile={false} />
                  ) : (
                    <button 
                      onClick={handleLoginRedirect}
                      className={`cursor-pointer p-2 rounded-full transition-all duration-300 hover:scale-110 hover:bg-white/50 ${
                        isScrolled 
                          ? 'hover:bg-blue-50 text-gray-700 hover:text-blue-600' 
                          : 'hover:bg-white/10 text-white/90 hover:text-white'
                      }`}
                    >
                      <User className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-all duration-300 ${
                isScrolled 
                  ? 'hover:bg-gray-100 text-gray-700' 
                  : 'hover:bg-white/10 text-white'
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 z-40 transition-all duration-500 ${
        isMobileMenuOpen 
          ? 'opacity-100 pointer-events-auto' 
          : 'opacity-0 pointer-events-none'
      }`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
             onClick={() => setIsMobileMenuOpen(false)} />
        
        <div className={`absolute top-0 right-0 h-full w-80 bg-white transform transition-transform duration-500 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-6 pt-20">
            <div className="space-y-6">
              {navItems.map((item, index) => (
                <button
                  key={item}
                  onClick={() => {
                    setActiveItem(item);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left text-lg font-medium transition-all duration-300 transform hover:translate-x-2 ${
                    activeItem === item 
                      ? 'text-blue-600 font-semibold' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: isMobileMenuOpen ? 'slideInRight 0.6s ease-out forwards' : 'none'
                  }}
                >
                  {item}
                </button>
              ))}
              
              <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                <button className="p-3 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-300">
                  <Search className="w-5 h-5" />
                </button>
                
                {/* Renderizado condicional en mobile - CORREGIDO */}
                <div className="flex-1">
                  {user ? (
                    <UserMenu isMobile={true} />
                  ) : (
                    <button 
                      onClick={() => {
                        handleLoginRedirect();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 p-3 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-300"
                    >
                      <User className="w-5 h-5" />
                      <span className="text-sm font-medium">Iniciar Sesión</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;