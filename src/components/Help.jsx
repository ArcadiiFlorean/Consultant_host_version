import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const helpItems = [
  {
    title: "Sprijin pentru atașare și poziționare",
    desc: "Îți este dificil să atașezi corect bebelușul? Te ajut să găsești poziții confortabile și eficiente pentru alăptare, reducând durerea și îmbunătățind hrănirea.",
    image: "/help_img_01.jpg",
    icon: "🤱",
    color: "from-pink-400 to-rose-400",
    stats: "95% succes"
  },
  {
    title: "Îngrijorări legate de cantitatea de lapte",
    desc: "Ai lapte prea puțin sau prea mult? Te ajut să înțelegi semnalele corpului tău și să echilibrezi producția de lapte într-un mod sănătos.",
    image: "/help_img_02.jpg",
    icon: "🍼",
    color: "from-blue-400 to-indigo-400",
    stats: "90% îmbunătățire"
  },
  {
    title: "Ghidare pentru pompare și hrănirea cu biberonul",
    desc: "Vrei să introduci biberonul sau te întorci la muncă? Îți ofer sfaturi despre pompare, păstrarea laptelui și menținerea producției.",
    image: "/help_img_03.jpg",
    icon: "⚡",
    color: "from-green-400 to-emerald-400",
    stats: "Suport 24/7"
  },
  {
    title: "Educație prenatală pentru alăptare",
    desc: "Pregătește-te din timp! Sesiuni personalizate te ajută să știi la ce să te aștepți și cum să începi alăptarea cu încredere, chiar din primele zile.",
    image: "/help_img_05.webp",
    icon: "📚",
    color: "from-purple-400 to-pink-400",
    stats: "Pregătire completă"
  },
  {
    title: "Soluții pentru alăptare dureroasă",
    desc: "Durerea nu este normală. Fie că ai ragade, angorjare sau alte probleme, îți ofer soluții blânde și eficiente pentru ameliorare rapidă.",
    image: "/help_img_05.jpg",
    icon: "💊",
    color: "from-orange-400 to-red-400",
    stats: "Relief rapid"
  },
  {
    title: "Sprijin pentru înțărcare și tranziție",
    desc: "Când ești gata să oprești alăptarea, te ghidez printr-un proces blând și respectuos – total sau parțial, în ritmul tău.",
    image: "/help_img_06.jpg",
    icon: "🌱",
    color: "from-teal-400 to-cyan-400",
    stats: "Proces blând"
  },
];

function Help() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section id="Help" className="relative bg-gradient-to-br from-white via-orange-50/30 to-pink-50/30 py-20 sm:py-24 lg:py-32 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-[#b06b4c]/5 to-orange-200/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-pink-200/10 to-rose-200/10 rounded-full animate-float-delay"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-gradient-to-br from-orange-300/10 to-amber-300/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-blue-200/5 to-indigo-200/5 rounded-full animate-float-slow"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16" data-aos="fade-up">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm text-[#b06b4c] font-medium mb-6 shadow-lg">
            <span className="w-2 h-2 bg-[#b06b4c] rounded-full mr-2 animate-pulse"></span>
            Servicii specializate de consultanță
          </div>
          
          {/* Main Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#b06b4c] mb-6 leading-tight">
            Moduri în care te pot{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                ajuta
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full animate-pulse"></div>
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Fie că ești la început de drum sau întâmpini dificultăți, sunt aici
            să-ți ofer sprijin, înțelegere și soluții personalizate.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mr-2">
                <span className="text-white font-bold text-xs">✓</span>
              </div>
              <span>500+ mame ajutate</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center mr-2">
                <span className="text-white font-bold text-xs">★</span>
              </div>
              <span>Rezultate garantate</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-2">
                <span className="text-white font-bold text-xs">♥</span>
              </div>
              <span>Suport personalizat</span>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {helpItems.map((item, index) => (
            <div
              key={index}
              data-aos="zoom-in-up"
              data-aos-delay={`${150 + index * 100}`}
              className="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 border border-white/50 hover:border-orange-200/50 transform hover:-translate-y-2"
            >
              {/* Image with overlay */}
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                
                {/* Floating icon */}
                <div className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl">{item.icon}</span>
                </div>
                
                {/* Stats badge */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-700">
                  {item.stats}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 relative z-10">
                <h3 className="text-xl font-bold text-[#b06b4c] mb-3 group-hover:text-[#965a42] transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4 group-hover:text-gray-800 transition-colors duration-300">
                  {item.desc}
                </p>
                

              </div>

              {/* Hover effect decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-orange-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center" data-aos="fade-up" data-aos-delay="600">
          <div className="relative bg-gradient-to-r from-[#b06b4c] to-[#d39473] rounded-3xl p-8 shadow-2xl overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-pink-400/10"></div>
            <div className="absolute top-4 right-4 w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/5 rounded-full animate-bounce"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Ești gata să începi?
              </h3>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg">
                Descoperă pachetele noastre personalizate și alege soluția perfectă pentru nevoile tale și ale bebelușului tău.
              </p>
              
              {/* Multiple CTA buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="#SupportPackages"
                  className="group inline-flex items-center justify-center bg-white text-[#b06b4c] font-bold text-lg px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                  <span>Vezi prețurile și pachetele</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                
                <a
                  href="BookingWizard"
                  className="group inline-flex items-center justify-center border-2 border-white text-white font-semibold text-lg px-8 py-4 rounded-full hover:bg-white hover:text-[#b06b4c] transition-all duration-300 transform hover:-translate-y-1"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Programează consultația</span>
                </a>
              </div>
              
              {/* Trust indicators */}
              <div className="mt-6 flex flex-wrap justify-center items-center gap-6 text-white/80 text-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Consultație gratuită
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  100% confidențial
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Răspuns rapid
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Help;