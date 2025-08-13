import React from "react";
import { Link } from "react-router-dom";

function HeaderCompact() {
  return (
    <header className="sticky top-0 z-50 bg-[#fef6f2] shadow-sm pt-4">
      <div className="max-w-[1440px] mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/Header_Logo.jpg"
            alt="Logo Marina LactaCare"
            className="w-16 h-16 rounded-full border-2 border-white shadow"
          />
        </Link>

        {/* Navigație simplă */}
        <nav className="flex gap-6 text-base font-medium text-gray-700">
          <Link
            to="/"
            className="hover:text-[#cb8645] transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            to="/contact"
            className="hover:text-[#cb8645] transition-colors duration-200"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default HeaderCompact;
