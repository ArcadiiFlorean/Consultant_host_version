import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaHome,
  FaUser,
  FaHeart,
  FaHandsHelping,
  FaTags,
  FaQuestionCircle,
  FaStar,
  FaPhone,
  FaCalendarAlt,
} from "react-icons/fa";

function HeaderNavbar({ menuOpen, setMenuOpen }) {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const navItems = [
    { href: "#page-0", label: "Acasă", icon: FaHome },
    { href: "#AboutMe", label: "Despre mine", icon: FaUser },
    
    { href: "#Help", label: "Cum ajut", icon: FaHandsHelping },
    { href: "#SupportPackages", label: "Servicii", icon: FaTags },
    { href: "#FAQSection", label: "Întrebări", icon: FaQuestionCircle },
    { href: "#Testimonials", label: "Recenzii", icon: FaStar },
  ];

  const contactItem = {
    href: "#ContactOptions",
    label: "Contact",
    icon: FaPhone,
  };

  // Smooth scroll function
  const handleSmoothScroll = (href) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
    if (setMenuOpen) {
      setMenuOpen(false);
    }
  };

  // Dacă suntem în mobile menu, renderizăm doar itemii pentru mobile
  if (menuOpen) {
    return (
      <div className="space-y-1">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleSmoothScroll(item.href);
              }}
              className="
                flex items-center gap-3 
                px-4 py-3 rounded-lg
                text-gray-700 hover:text-[#cb8645]
                hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50
                transition-all duration-300
                group
              "
            >
              <div
                className="
                w-8 h-8 rounded-lg
                bg-gradient-to-br from-orange-100 to-pink-100
                flex items-center justify-center
                group-hover:from-orange-200 group-hover:to-pink-200
                transition-all duration-300
                group-hover:scale-110
              "
              >
                <IconComponent className="text-sm text-[#cb8645]" />
              </div>
              <span className="font-medium text-base">{item.label}</span>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <svg
                  className="w-4 h-4 text-[#cb8645]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </a>
          );
        })}

        {/* Contact item */}
        <a
          href={contactItem.href}
          onClick={(e) => {
            e.preventDefault();
            handleSmoothScroll(contactItem.href);
          }}
          className="
            flex items-center gap-3 
            px-4 py-3 rounded-lg
            border-2 border-[#cb8645] 
            text-[#cb8645] font-semibold
            hover:bg-[#cb8645] hover:text-white
            transition-all duration-300
            group mt-2
          "
        >
          <div
            className="
            w-8 h-8 rounded-lg
            bg-[#cb8645] bg-opacity-10
            flex items-center justify-center
            group-hover:bg-white group-hover:bg-opacity-20
            transition-all duration-300
          "
          >
            <FaPhone className="text-sm" />
          </div>
          <span className="font-semibold text-base">{contactItem.label}</span>
          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </a>

        {/* CTA Button pentru mobile */}
        <Link
          to="/BookingWizard"
          onClick={() => setMenuOpen && setMenuOpen(false)}
          className="
            flex items-center gap-3 
            px-4 py-4 rounded-lg
            bg-gradient-to-r from-orange-400 to-pink-400
            hover:from-orange-500 hover:to-pink-500
            text-white font-bold
            shadow-md hover:shadow-lg
            transition-all duration-300
            transform hover:scale-[1.02]
            mt-3 mb-2
            group
          "
        >
          <div
            className="
            w-8 h-8 rounded-lg
            bg-white bg-opacity-20
            flex items-center justify-center
            group-hover:bg-opacity-30
            transition-all duration-300
            group-hover:scale-110
          "
          >
            <FaCalendarAlt className="text-sm" />
          </div>
          <div className="flex-1">
            <span className="font-bold text-base block">
              Programează consultația
            </span>
            <span className="text-xs opacity-90">
              Disponibil online & offline
            </span>
          </div>
          <div className="opacity-80 group-hover:opacity-100 transition-opacity">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </Link>
      </div>
    );
  }

  // Desktop/Tablet Navigation
  return (
    <nav className="flex gap-4 lg:gap-6 items-center justify-center">
      {navItems.slice(0, 5).map((item) => (
        <a
          key={item.href}
          href={item.href}
          onClick={(e) => {
            e.preventDefault();
            handleSmoothScroll(item.href);
          }}
          className="
            text-sm lg:text-base font-medium 
            text-gray-700 hover:text-[#cb8645] 
            transition-all duration-300
            relative group
            px-2 py-1 rounded-md
            hover:bg-orange-50
            whitespace-nowrap
          "
        >
          {item.label}
          {/* Underline effect */}
          <span
            className="
            absolute bottom-0 left-0 w-0 h-0.5 
            bg-gradient-to-r from-orange-400 to-pink-400
            transition-all duration-300 
            group-hover:w-full
          "
          ></span>
        </a>
      ))}

      {/* Contact button */}
      <a
        href={contactItem.href}
        onClick={(e) => {
          e.preventDefault();
          handleSmoothScroll(contactItem.href);
        }}
        className="
          px-3 lg:px-4 py-2 rounded-lg 
          border-2 border-[#cb8645] text-[#cb8645] 
          font-semibold text-sm lg:text-base
          hover:bg-[#cb8645] hover:text-white
          transition-all duration-300
          transform hover:scale-105
          whitespace-nowrap
        "
      >
        {contactItem.label}
      </a>
    </nav>
  );
}

export default HeaderNavbar;
