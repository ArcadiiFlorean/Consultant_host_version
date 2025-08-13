import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaQuoteRight,
  FaComments,
  FaEnvelope,
  FaCheckCircle,
  FaHeart,
  FaStar,
} from "react-icons/fa";

function SupportFeatures() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const features = [
    {
      icon: <FaQuoteRight size={24} className="text-white" />,
      title: "Ghidare blândă și profesionistă",
      desc: "Primești sprijin personalizat, oferit cu grijă și înțelegere, pentru fiecare etapă a alăptării.",
      gradient: "from-orange-400 to-red-400",
    },
    {
      icon: <FaComments size={24} className="text-white" />,
      title: "Sfaturi actualizate și de încredere",
      desc: "Te simți în siguranță cu recomandări bazate pe cele mai noi cercetări, explicate clar și accesibil.",
      gradient: "from-blue-400 to-indigo-400",
    },
    {
      icon: <FaEnvelope size={24} className="text-white" />,
      title: "Sprijin adaptat stilului tău",
      desc: "Alege ședințe față în față sau online—flexibilitate în funcție de viața și confortul tău.",
      gradient: "from-green-400 to-emerald-400",
    },
    {
      icon: <FaCheckCircle size={24} className="text-white" />,
      title: "Sprijin constant, pe termen lung",
      desc: "Rămânem în legătură prin monitorizări regulate și încurajare—ca să știi că ești ascultată.",
      gradient: "from-purple-400 to-pink-400",
    },
    {
      icon: <FaHeart size={24} className="text-white" />,
      title: "Primim fiecare familie cu căldură",
      desc: "Indiferent de stilul de parenting sau obiectivele tale, călătoria ta este respectată aici.",
      gradient: "from-rose-400 to-pink-400",
    },
    {
      icon: <FaStar size={24} className="text-white" />,
      title: "Consultanță online, oriunde te afli",
      desc: "Primești sprijinul de care ai nevoie direct din confortul casei tale, fără deplasări sau stres.",
      gradient: "from-amber-400 to-orange-400",
    },
  ];

  return (
    <section 
      id="SupportFeatures" 
      className="relative bg-gradient-to-br from-[#D39473] via-[#C8845E] to-[#B67449] py-16 sm:py-20 lg:py-24 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full animate-float-delay"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-orange-300/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-white/5 rounded-full animate-float-slow"></div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Header Section */}
        <div className="mb-16" data-aos="fade-down">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white font-medium mb-6 shadow-lg">
            <FaHeart className="w-4 h-4 mr-2 text-pink-200 animate-pulse" />
            Suport specializat pentru mame
          </div>
          
          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight max-w-4xl mx-auto mb-6 drop-shadow-2xl">
            De ce să ceri ajutorul unui 
            <span className="relative inline-block mx-2">
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                specialist
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full animate-pulse"></div>
            </span>
            în alăptare?
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-white/90 mb-4">
            Hrănește. Împuternicește. Începe cu încredere.
          </p>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-white/80 text-sm">
            <div className="flex items-center">
              <div className="flex -space-x-1 mr-2">
                {[1,2,3,4,5].map((star) => (
                  <FaStar key={star} className="w-4 h-4 text-yellow-300" />
                ))}
              </div>
              <span>500+ mame ajutate</span>
            </div>
            <div className="flex items-center">
              <FaCheckCircle className="w-4 h-4 mr-2 text-green-300" />
              <span>Consultant certificat IBCLC</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {features.map((item, index) => (
            <div
              key={index}
              data-aos="zoom-in"
              data-aos-delay={`${150 + index * 100}`}
              className="group relative bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 hover:border-white/40 transform hover:-translate-y-2"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-orange-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-[#b06b4c] mb-3 group-hover:text-[#965a42] transition-colors duration-300">
                  {item.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                  {item.desc}
                </p>
                
                {/* Hover indicator */}
                <div className="absolute bottom-4 right-4 w-2 h-2 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="relative" data-aos="fade-up" data-aos-delay="600">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl -m-8"></div>
          
          <div className="relative z-10 py-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ești gata să începi călătoria?
            </h3>
            
            <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg">
              Programează o consultație gratuită și să discutăm despre cum te pot ajuta să-ți trăiești experiența de alăptare cu încredere.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="#booking"
                className="group inline-flex items-center justify-center bg-white text-[#D39473] font-bold text-lg px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                <span>Programează consultația gratuită</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              
              <a
                href="#contact"
                className="group inline-flex items-center justify-center border-2 border-white text-white font-semibold text-lg px-8 py-4 rounded-full hover:bg-white hover:text-[#D39473] transition-all duration-300 transform hover:-translate-y-1"
              >
                <FaEnvelope className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span>Contactează-mă</span>
              </a>
            </div>
            
            {/* Additional trust elements */}
            <div className="mt-8 flex flex-wrap justify-center items-center gap-8 text-white/70 text-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Consultație gratuită de 15 min
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                100% confidențial
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Suport cu empatie
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SupportFeatures;