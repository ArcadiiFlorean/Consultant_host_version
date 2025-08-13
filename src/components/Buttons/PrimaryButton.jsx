import React from "react";

function PrimaryButton({ href, children }) {
  return (
    <a
      href={href}
      className="bg-[#f7b99b] hover:bg-[#b06b4c] text-gray-800 hover:text-white font-medium px-6 py-3 rounded border border-[#f7b99b] transition duration-300 ease-in-out shadow-sm hover:shadow-md"
    >
      {children}
    </a>
  );
}

export default PrimaryButton;
