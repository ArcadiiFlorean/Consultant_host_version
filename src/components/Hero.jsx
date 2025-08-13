import React, { useEffect } from "react";
import PrimaryButton from "./Buttons/PrimaryButton";
import OutlineButton from "./Buttons/OutlineButton";
import HeroIgenerateimg from "/HeroIgenerateimg.png";
import AOS from "aos";
import "aos/dist/aos.css";

function Hero() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section
      id="page-0"
      className="relative bg-gradient-to-br from-[#fef6f2] via-[#fdf4ef] to-[#fcf1eb] overflow-hidden min-h-screen flex items-center"
    >
      {/* ANIMATED BACKGROUND ELEMENTS - În loc de imagine statică */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Cercuri animate decorative */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#b06b4c]/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-amber-200/20 rounded-full animate-bounce slow"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-rose-200/30 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-orange-200/20 rounded-full animate-bounce delay-500"></div>

        {/* Forme geometrice subtile */}
        <div className="absolute top-1/3 left-5 w-8 h-8 bg-amber-300/20 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-1/3 right-10 w-6 h-6 bg-rose-300/20 rotate-12 animate-pulse"></div>

        {/* Gradient overlay pentru depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-amber-50/20"></div>
      </div>

      {/* CONȚINUT */}
      <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-2 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16 gap-8 lg:gap-16 items-center w-full">
        {/* TEXT SECTION - Prima pe mobile pentru SEO */}
        <div
          className="order-2 lg:order-1 text-gray-800 w-full text-center lg:text-left"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {/* Badge pentru credibilitate */}
          <div
            className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm text-[#b06b4c] font-medium mb-6 shadow-lg"
            data-aos="fade-down"
            data-aos-delay="100"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Consultant certificat în alăptare
          </div>

          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#b06b4c] leading-tight mb-4 sm:mb-6"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Sprijin profesionist pentru{" "}
            <span className="relative inline-block">
              <span className="text-amber-900">mame</span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transform scale-x-0 animate-scale-x"></div>
            </span>{" "}
            dedicate
          </h1>

          <p
            className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            Susținere caldă pentru începutul tău.
          </p>

          <p
            className="text-base sm:text-lg text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            Îți ofer îndrumare sigură, îngrijire adaptată nevoilor tale și
            susținere emoțională pentru ca tu și bebelușul tău să treceți cu
            încredere prin fiecare etapă a alăptării.
          </p>

          {/* BUTOANE CU HOVER EFFECTS */}
          <div
            className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-8"
            data-aos="zoom-in-up"
            data-aos-delay="600"
          >
            <PrimaryButton
              href="BookingWizard"
              className="group w-full sm:w-auto text-base px-8 py-4 bg-gradient-to-r from-[#b06b4c] to-[#965a42] hover:from-[#965a42] hover:to-[#7d4a37] transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              <span className="flex items-center justify-center">
                Programează consultația
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </PrimaryButton>

    <OutlineButton
              href="/ebook"  // ← Schimbat din "Alăptare primul pas (Ebook)" în "/ebook"
              className="group w-full sm:w-auto text-base px-8 py-4 border-2 border-[#b06b4c] text-[#b06b4c] hover:bg-[#b06b4c] hover:text-white transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              <span className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Ebook gratuit
              </span>
            </OutlineButton>
          </div>

          {/* SOCIAL PROOF / TRUST INDICATORS */}
          <div
            className="flex flex-wrap justify-center lg:justify-start items-center gap-6 text-sm text-gray-600"
            data-aos="fade-up"
            data-aos-delay="700"
          >
            <div className="flex items-center">
              <div className="flex -space-x-2 mr-3">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-white"></div>
              </div>
              <span>500+ mame ajutate</span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-yellow-400 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>Rating 4.9/5</span>
            </div>
          </div>
        </div>

        {/* IMAGINE - A doua pe mobile */}
        <div
          className="order-1 lg:order-2 flex justify-center lg:justify-end relative w-full"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          {/* Decorative elements around image */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-rose-200 to-pink-200 rounded-full opacity-40 animate-bounce slow"></div>

            <img
              src={HeroIgenerateimg}
              alt="Consultant alăptare și bebeluș"
              className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
            />

            {/* Floating elements */}
            <div className="absolute top-1/4 -left-8 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg animate-float">
              <div className="flex items-center text-sm text-gray-700">
                <span className="text-green-500 mr-2">✓</span>
                Experiență 5+ ani
              </div>
            </div>

            <div className="absolute bottom-1/4 -right-8 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg animate-float-delay">
              <div className="flex items-center text-sm text-gray-700">
                <span className="text-blue-500 mr-2">📞</span>
                24/7 support
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SCROLL INDICATOR PENTRU MOBILE */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 lg:hidden"
        data-aos="fade-up"
        data-aos-delay="800"
      >
        <div className="flex flex-col items-center text-gray-500 animate-bounce">
          <span className="text-xs mb-2 opacity-70">Explorează mai mult</span>
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* GRADIENT OVERLAY PENTRU TRANZIȚIE */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent z-5"></div>
    </section>
  );
}

export default Hero;
