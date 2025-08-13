import React, { useState, useEffect } from "react";
import HeaderNavbar from "./HeaderNavbar";
import HeaderSocial from "./HeaderSocial";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detectează scroll pentru a schimba styling-ul header-ului
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Previne scroll-ul când meniul e deschis pe mobile
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  return (
    <header className={`
      sticky top-0 z-50 
      transition-all duration-300 ease-in-out
      ${isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-[#fef6f2] shadow-sm'
      }
    `}>
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 tablet:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          
          {/* Logo section */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <img
              src="Header_Logo.jpg"
              alt="Marina Cociug - Consultant Lactație"
              className={`
                rounded-full border-2 border-white shadow-md
                transition-all duration-300
                ${isScrolled 
                  ? 'w-12 h-12' 
                  : 'w-16 h-16'
                }
              `}
            />
            <div className="hidden sm:block">
              <h1 className={`
                text-gray-800 font-bold leading-tight
                transition-all duration-300
                ${isScrolled ? 'text-lg' : 'text-xl'}
              `}>
                Marina Cociug
              </h1>
              <p className={`
                text-amber-700 font-medium leading-tight
                transition-all duration-300
                ${isScrolled ? 'text-sm' : 'text-base'}
              `}>
                Consultant Lactație
              </p>
            </div>
          </div>

          {/* Center navigation - doar pe desktop */}
          <div className="hidden lg:block flex-1 mx-8">
            <HeaderNavbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4">
            
            {/* Social media - doar pe tablet+ */}
            <div className="hidden tablet:block">
              <HeaderSocial />
            </div>

            {/* Contact info pentru desktop */}
            <div className="hidden xl:flex flex-col items-end text-right">
              <span className="text-xs text-gray-600 font-medium">Contactează-mă</span>
              <span className="text-xs text-amber-700">24/7 disponibil</span>
            </div>

            {/* CTA Button */}
            <a
              href="/BookingWizard"
              className="
                hidden sm:inline-flex items-center gap-2
                bg-gradient-to-r from-orange-400 to-pink-400 
                hover:from-orange-500 hover:to-pink-500
                text-white font-semibold
                px-4 py-2 rounded-full
                transition-all duration-300
                transform hover:scale-105
                shadow-md hover:shadow-lg
                text-sm
              "
            >
              <span>📅</span>
              <span className="hidden lg:inline">Programează-te</span>
              <span className="lg:hidden">Program</span>
            </a>

            {/* Mobile menu button */}
            <button
              className="
                lg:hidden p-2 rounded-lg
                text-amber-800 hover:bg-orange-50
                transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-orange-300
              "
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
            >
              <svg
                className="w-6 h-6 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ transform: menuOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
              >
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay - complet separat */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-black bg-opacity-50 z-40">
          <div className="bg-white shadow-2xl border-t-4 border-orange-400">
            {/* Mobile menu content */}
            <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-pink-50 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-bold">M</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Marina Cociug</p>
                    <p className="text-sm text-amber-700">Consultant Lactație IBCLC</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <HeaderNavbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

            {/* Mobile social section */}
            <div className="px-4 py-4 bg-gray-50 border-t">
              <p className="text-sm font-medium text-gray-700 mb-3">Urmărește-mă</p>
              <HeaderSocial />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;