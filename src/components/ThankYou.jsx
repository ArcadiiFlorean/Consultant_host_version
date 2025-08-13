import React from "react";
function ThankYou() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff8f4]">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold text-[#cb8645] mb-4">Mulțumim pentru programare!</h1>
        <p className="text-lg">Am primit detaliile tale și te vom contacta cât mai curând.</p>
        <a href="/" className="inline-block mt-6 text-white bg-[#cb8645] px-6 py-2 rounded hover:bg-[#a96c37]">
          Înapoi la pagina principală
        </a>
      </div>
    </div>
  );
}
export default ThankYou;
