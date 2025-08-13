import React from "react";

function OutlineButton({ href, children }) {
  return (
    <a
      href={href}
      className="border border-[#b06b4c] text-[#b06b4c] font-medium px-6 py-3 rounded transition duration-300 ease-in-out hover:bg-[#f7b99b]/30 hover:text-[#b06b4c] shadow-sm hover:shadow-md"
    >
      {children}
    </a>
  );
}

export default OutlineButton;
