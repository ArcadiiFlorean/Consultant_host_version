import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import HeaderSocials from "./Header/HeaderSocial";

function AboutMe() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section
      id="AboutMe"
      className="relative bg-gradient-to-br from-[#fff8f4] via-[#fef6f2] to-[#fdf4ef] overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-[#9f6032]/10 to-amber-200/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-orange-200/20 to-pink-200/20 rounded-full animate-float-delay"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-gradient-to-br from-amber-300/15 to-orange-300/15 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-rose-200/10 to-pink-300/10 rounded-full animate-float-slow"></div>
      </div>

      {/* Container principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-16" data-aos="fade-down">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm text-[#9f6032] font-medium mb-6 shadow-lg">
            <span className="w-2 h-2 bg-[#9f6032] rounded-full mr-2 animate-pulse"></span>
            Consultantul tău de încredere
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#9f6032] mb-4">
            Despre mine
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Descoperă povestea mea și cum pot să te ajut în călătoria ta de alăptare
          </p>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* IMAGE SECTION - Enhanced */}
          <div className="order-2 lg:order-1" data-aos="fade-right">
            <div className="relative group">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="/Hero_img_2.jpg"
                  alt="Consultant în alăptare"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>
              
              {/* Floating Stats Cards */}
              <div className="absolute -top-6 -right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl animate-float">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#9f6032]">500+</div>
                  <div className="text-xs text-gray-600">Familii ajutate</div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl animate-float-delay">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#9f6032]">5+</div>
                  <div className="text-xs text-gray-600">Ani experiență</div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-1/4 -left-4 w-8 h-8 bg-gradient-to-br from-[#9f6032] to-amber-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute bottom-1/4 -right-4 w-6 h-6 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full opacity-30 animate-bounce"></div>
            </div>
          </div>

          {/* CONTENT SECTION - Enhanced */}
          <div className="order-1 lg:order-2 space-y-8" data-aos="fade-left">
            
            {/* Story Cards */}
            <div className="space-y-6">
              
              {/* Card 1 */}
              <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-orange-100/50 hover:border-orange-200/50">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#9f6032] to-amber-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2 text-[#9f6032] group-hover:text-[#7d4a28] transition-colors duration-300">
                      Drumul meu către consultanța în alăptare
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Drumul meu către a deveni consultant în alăptare a început cu propria mea experiență de mamă. Alăptarea a fost mai dificilă decât mă așteptam, iar sprijinul pe care l-am primit a schimbat totul. Acel moment m-a inspirat să ajut și alte persoane să-și parcurgă această călătorie cu empatie, cunoștințe și sprijin practic la fiecare pas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-orange-100/50 hover:border-orange-200/50">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2 text-[#9f6032] group-hover:text-[#7d4a28] transition-colors duration-300">
                      Filosofia și abordarea mea
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Cred că fiecare călătorie în alăptare este unică. Abordarea mea se bazează pe îngrijire bazată pe dovezi, compasiune și pe întâlnirea familiilor exact acolo unde se află. Fie că te confrunți cu provocări sau cauți încredere, sunt aici să te susțin fără judecăți și să te ajut să iei decizii informate și sigure pentru tine și bebelușul tău.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-orange-100/50 hover:border-orange-200/50">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2 text-[#9f6032] group-hover:text-[#7d4a28] transition-colors duration-300">
                      Certificări și formare
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Sunt consultant internațional certificat în lactație (IBCLC), formată în cele mai noi științe despre alăptare și îngrijirea sugarilor. Experiența mea include ore de practică clinică, educație continuă și sprijin oferit familiilor diverse. Sunt dedicată învățării continue și oferirii unui sprijin competent și de încredere.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inspirational Quote */}
            <div className="relative bg-gradient-to-r from-[#9f6032]/10 via-amber-50 to-orange-50 rounded-xl p-6 border-l-4 border-[#9f6032]" data-aos="zoom-in">
              <div className="absolute top-4 left-6 text-3xl text-[#9f6032]/30">"</div>
              <p className="text-lg italic text-gray-700 pl-8 pr-4">
                Fiecare mamă merită să se simtă susținută și încurajată în călătoria ei de alăptare.
              </p>
              <div className="absolute bottom-4 right-6 text-3xl text-[#9f6032]/30 rotate-180">"</div>
            </div>

            {/* Social Media Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-orange-100/50" data-aos="fade-up">
              <h4 className="font-semibold text-[#9f6032] mb-4 text-center lg:text-left">
                Să rămânem conectate
              </h4>
              <div className="flex justify-center lg:justify-start">
                <HeaderSocials />
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
    
       
      </div>
    </section>
  );
}

export default AboutMe;