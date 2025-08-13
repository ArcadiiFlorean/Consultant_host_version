import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaHeart,
  FaStar,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-[#8B4513] via-[#A0522D] to-[#CD853F] text-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
        <div className="absolute top-32 right-16 w-12 h-12 bg-white rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-8 h-8 bg-white rounded-full"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 py-12 sm:py-16 px-3 sm:px-4 tablet:px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Top section */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 sm:gap-10 lg:gap-6 mb-8 sm:mb-12">
            
            {/* Logo & Brand - enhanced */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
              <div className="relative">
                <div className="bg-white p-3 sm:p-4 rounded-full shadow-lg">
                  <FaHeart className="text-[#D2691E] text-xl sm:text-2xl" />
                </div>
                <div className="absolute -top-1 -right-1 bg-[#FFD700] p-1 rounded-full">
                  <FaStar className="text-[#8B4513] text-xs" />
                </div>
              </div>
              <div>
                <span className="text-white text-xl sm:text-2xl font-bold tracking-wide block">
                  MARINA COCIUG
                </span>
                <span className="text-orange-200 text-sm sm:text-base font-medium">
                  Consultant Lactație IBCLC
                </span>
              </div>
            </div>

            {/* Contact info pentru mobile */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:hidden">
              <a 
                href="mailto:macociug@mail.com" 
                className="flex items-center gap-2 text-orange-200 hover:text-white transition-colors"
              >
                <FaEnvelope className="text-sm" />
                <span className="text-sm">macociug@mail.com</span>
              </a>
              <a 
                href="tel:+37368179176" 
                className="flex items-center gap-2 text-orange-200 hover:text-white transition-colors"
              >
                <FaPhone className="text-sm" />
                <span className="text-sm">+373 68179176</span>
              </a>
            </div>

            {/* Rețele Social Media - enhanced */}
            <div className="flex gap-3 sm:gap-4">
              {[
                { icon: FaFacebookF, href: "#", color: "hover:bg-blue-600" },
                { icon: FaInstagram, href: "https://www.instagram.com/marina.cociug/", color: "hover:bg-pink-600" },
                { icon: FaTwitter, href: "#", color: "hover:bg-blue-400" },
                { icon: FaLinkedinIn, href: "#", color: "hover:bg-blue-800" },
                { icon: FaYoutube, href: "#", color: "hover:bg-red-600" }
              ].map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      w-10 h-10 sm:w-12 sm:h-12 
                      bg-white bg-opacity-20 backdrop-blur-sm
                      rounded-full flex items-center justify-center
                      text-white hover:text-white
                      transition-all duration-300
                      transform hover:scale-110 hover:-translate-y-1
                      ${social.color}
                    `}
                  >
                    <IconComponent className="text-sm sm:text-base" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Links - improved layout */}
          <div className="border-t border-orange-200 border-opacity-30 pt-6 sm:pt-8 mb-6 sm:mb-8">
            <nav className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap lg:justify-center gap-3 sm:gap-4 lg:gap-6 text-sm sm:text-base">
              {[
                { href: "#page-0", text: "Acasă" },
                { href: "#AboutMe", text: "Despre mine" },
                { href: "#SupportFeatures", text: "De ce eu?" },
                { href: "#Help", text: "Cum ajut" },
                { href: "#SupportPackages", text: "Servicii" },
                { href: "#FAQSection", text: "Întrebări" },
                { href: "#Testimonials", text: "Recenzii" },
                { href: "#ContactOptions", text: "Contact" },
                { href: "#booking", text: "Programare" }
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="
                    text-orange-100 hover:text-white 
                    transition-colors duration-300
                    hover:underline decoration-2 underline-offset-4
                    text-center lg:text-left
                    py-1
                  "
                >
                  {link.text}
                </a>
              ))}
            </nav>
          </div>

          {/* Bottom section with enhanced info */}
          <div className="border-t border-orange-200 border-opacity-30 pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
              
              {/* Copyright */}
              <div className="text-center sm:text-left">
                <p className="text-orange-200 text-xs sm:text-sm">
                  © 2025 Marina Cociug — Toate drepturile rezervate.
                </p>
                <p className="text-orange-300 text-xs mt-1">
                  Consultant Lactație Certificat IBCLC
                </p>
              </div>

              {/* Quick contact pentru desktop */}
              <div className="hidden lg:flex flex-col gap-1 text-right">
                <a 
                  href="mailto:macociug@mail.com" 
                  className="text-orange-200 hover:text-white transition-colors text-sm"
                >
                  macociug@mail.com
                </a>
                <a 
                  href="tel:+37368179176" 
                  className="text-orange-200 hover:text-white transition-colors text-sm"
                >
                  +373 68179176
                </a>
              </div>

              {/* Trust badge */}
              <div className="flex items-center gap-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2">
                <FaStar className="text-yellow-400 text-sm" />
                <span className="text-orange-100 text-xs sm:text-sm font-medium">
                  Certificat IBCLC
                </span>
              </div>
            </div>
          </div>

          {/* Extra bottom message */}
          <div className="text-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-orange-200 border-opacity-20">
            <p className="text-orange-200 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
              Fiecare călătorie în alăptare este unică și prețioasă. Sunt aici să te susțin cu empatie, 
              cunoștințe și îngrijire personalizată. ❤️
            </p>
          </div>
        </div>
      </div>

      {/* Gradient overlay pentru depth */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#654321] to-transparent opacity-50"></div>
    </footer>
  );
}

export default Footer;