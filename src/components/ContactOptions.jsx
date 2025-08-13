import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import HeaderSocial from "./Header/HeaderSocial";

import {
  FaEnvelope,
  FaComments,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaWhatsapp,
  FaInstagram,
  FaClock,
  FaShieldAlt,
  FaHeart,
} from "react-icons/fa";

function ContactOptions() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // Funcție pentru deschiderea email-ului
  const handleEmailClick = (e) => {
    e.preventDefault();
    const email = "macociug@gmail.com";
    const subject = encodeURIComponent("Consultație alăptare");
    const body = encodeURIComponent(
      "Bună ziua, aș dori să programez o consultație..."
    );

    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

    // Încearcă să deschidă link-ul
    window.location.href = mailtoLink;

    // Fallback pentru mobile sau dacă nu funcționează
    setTimeout(() => {
      if (
        confirm(
          "Nu s-a deschis aplicația de email? Copiezi adresa în clipboard?"
        )
      ) {
        navigator.clipboard
          .writeText(email)
          .then(() => {
            alert("Adresa de email a fost copiată în clipboard!");
          })
          .catch(() => {
            prompt("Copiază această adresă de email:", email);
          });
      }
    }, 1000);
  };

  const contacts = [
    {
      icon: <FaEnvelope size={24} className="text-white" />,
      title: "Email Personal",
      text: "Pentru întrebări detaliate și programări oficiale",
      value: "macociug@gmail.com",
      link: "mailto:macociug@gmail.com",
      bgGradient: "from-blue-500 to-indigo-600",
      hoverGradient: "from-blue-600 to-indigo-700",
      response: "Răspuns în 24h",
      features: [
        "Consultații detaliate",
        "Programări oficiale",
        "Documente medicale",
      ],
    },
    {
      icon: <FaWhatsapp size={24} className="text-white" />,
      title: "WhatsApp Rapid",
      text: "Pentru întrebări urgente și sprijin imediat",
      value: "+373 68179176",
      link: "https://wa.me/37368179176",
      bgGradient: "from-green-500 to-emerald-600",
      hoverGradient: "from-green-600 to-emerald-700",
      response: "Răspuns în 2h",
      features: ["Suport urgent", "Mesaje rapide", "Partajare foto/video"],
    },
    {
      icon: <FaInstagram size={24} className="text-white" />,
      title: "Instagram DM",
      text: "Pentru întrebări casual și inspirație zilnică",
      value: "@marina.cociug",
      link: "https://www.instagram.com/marina.cociug/",
      bgGradient: "from-pink-500 to-rose-600",
      hoverGradient: "from-pink-600 to-rose-700",
      response: "Răspuns în 2h",
      features: ["Conținut inspirațional", "Tips zilnice", "Comunitate activă"],
    },
  ];

  return (
    <section
      id="ContactOptions"
      className="relative bg-gradient-to-br from-[#D39473] via-[#B8704A] to-[#A0633D] py-16 sm:py-20 lg:py-24 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-orange-300/10 rounded-full animate-float-delay"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-amber-300/5 rounded-full animate-float-slow"></div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16" data-aos="fade-up">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white font-medium mb-6 shadow-lg">
            <FaHeart className="w-4 h-4 mr-2 text-pink-200 animate-pulse" />
            Să rămânem conectate
          </div>

          {/* Main Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-2xl">
            Sprijinul e la un
            <span className="relative inline-block mx-2">
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                mesaj
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full animate-pulse"></div>
            </span>
            distanță
          </h2>

          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
            Scrie-mi dacă ai întrebări, ai nevoie de sprijin sau dorești să
            programezi o ședință—sunt aici pentru tine.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-white/80 text-sm">
            <div className="flex items-center">
              <FaClock className="w-4 h-4 mr-2 text-blue-300" />
              <span>Răspuns rapid garantat</span>
            </div>
            <div className="flex items-center">
              <FaShieldAlt className="w-4 h-4 mr-2 text-green-300" />
              <span>Confidențialitate 100%</span>
            </div>
            <div className="flex items-center">
              <FaHeart className="w-4 h-4 mr-2 text-pink-300" />
              <span>Suport cu empatie</span>
            </div>
          </div>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {contacts.map((item, index) => (
            <div
              key={index}
              data-aos="zoom-in-up"
              data-aos-delay={`${150 + index * 100}`}
              className="group relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/30 hover:border-white/50 transform hover:-translate-y-3"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-orange-50/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${item.bgGradient} group-hover:${item.hoverGradient} rounded-2xl shadow-xl mb-6 group-hover:scale-110 transition-all duration-300`}
                >
                  {item.icon}
                </div>

                {/* Response time badge */}
                <div className="absolute top-6 right-6 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                  {item.response}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors duration-300">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {item.text}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {item.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mr-3"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Contact Button */}
                <a
                  href={item.link}
                  onClick={
                    item.title === "Email Personal"
                      ? handleEmailClick
                      : undefined
                  }
                  target={item.title === "Email Personal" ? "_self" : "_blank"}
                  rel={
                    item.title === "Email Personal"
                      ? undefined
                      : "noopener noreferrer"
                  }
                  className={`group/btn block w-full text-center bg-gradient-to-r ${item.bgGradient} hover:${item.hoverGradient} text-white font-bold text-lg py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                >
                  <span className="flex items-center justify-center">
                    {item.value}
                    <svg
                      className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300"
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
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Action Mobile Buttons */}
        <div className="lg:hidden mb-12" data-aos="fade-up">
          <h3 className="text-xl font-bold text-white text-center mb-6">
            Acțiuni rapide
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="https://wa.me/37368179176"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <FaWhatsapp className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
              <span>WhatsApp rapid</span>
            </a>
            <button
              onClick={handleEmailClick}
              className="group flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <FaEnvelope className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
              <span>Trimite email</span>
            </button>
          </div>
        </div>

        {/* Social Media Section */}
        <div
          className="text-center mb-12"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 max-w-2xl mx-auto">
            {/* Background decoration */}
            <div className="absolute top-4 right-4 w-16 h-16 bg-white/5 rounded-full animate-pulse"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 bg-orange-300/10 rounded-full animate-bounce"></div>

            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-4">
                Urmărește-mă pe social media
              </h3>
              <p className="text-white/80 mb-6 text-lg">
                Conținut util și inspirațional despre alăptare zilnic
              </p>

              <div className="flex justify-center mb-6">
                <HeaderSocial />
              </div>

              {/* Social stats */}
              <div className="flex flex-wrap justify-center gap-6 text-white/70 text-sm">
                <div className="flex items-center">
                  <FaInstagram className="w-4 h-4 mr-2 text-pink-300" />
                  <span>10K+ urmăritori</span>
                </div>
                <div className="flex items-center">
                  <FaHeart className="w-4 h-4 mr-2 text-red-300" />
                  <span>Post zilnic</span>
                </div>
                <div className="flex items-center">
                  <FaComments className="w-4 h-4 mr-2 text-blue-300" />
                  <span>Comunitate activă</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
          data-aos="fade-up"
          data-aos-delay="500"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaClock className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-white font-semibold mb-2">Răspuns rapid</h4>
            <p className="text-white/80 text-sm">
              În maximum 24 de ore pentru toate întrebările
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShieldAlt className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-white font-semibold mb-2">Confidențialitate</h4>
            <p className="text-white/80 text-sm">
              Toate conversațiile sunt strict confidențiale
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHeart className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-white font-semibold mb-2">Suport cu empatie</h4>
            <p className="text-white/80 text-sm">
              Înțelegere și sprijin emoțional la fiecare pas
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactOptions;
