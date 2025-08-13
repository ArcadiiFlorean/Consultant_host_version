import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function FAQSection() {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "Cum îmi dau seama dacă bebelușul este sătul?",
      answer:
        "Urmărește creșterea în greutate, scutece ude frecvent și un bebeluș liniștit după alăptare. Fiecare copil e diferit—ascultă-ți instinctul și cere ajutor dacă ai nevoie.",
    },
    {
      question: "Ce fac dacă alăptarea e dureroasă?",
      answer:
        "O ușoară sensibilitate e normală la început, dar durerea constantă nu este. Încearcă să ajustezi atașarea sau poziția copilului. Dacă durerea persistă, un consultant în alăptare te poate ajuta.",
    },
    {
      question: "Cum pot stimula producția de lapte?",
      answer:
        "Alăptează des, petrece timp piele-pe-piele și hidratează-te suficient. Dacă te îngrijorează ceva, nu ești singură—sprijinul personalizat te poate ajuta să găsești ce funcționează pentru tine.",
    },
    {
      question: "Este normal ca bebelușul să ceară des sân?",
      answer:
        "Absolut! Nou-născuții cer sân la fiecare 1–3 ore, mai ales în perioadele de creștere accelerată. Acest lucru ajută la formarea rezervei de lapte și oferă confort și hrană bebelușului.",
    },
  ];

  return (
    <section id="FAQSection" className="bg-[#D39473] py-12 sm:py-16 tablet:py-20 lg:py-24 px-3 sm:px-4 tablet:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section - optimizat pentru mobile */}
        <div className="text-center lg:text-left mb-8 sm:mb-10 tablet:mb-12" data-aos="fade-down">
          <p className="text-xs sm:text-sm text-white uppercase tracking-wide mb-2 opacity-90">
            Ghidare blândă pentru mămici
          </p>
          <h2 className="
            text-2xl sm:text-3xl tablet:text-4xl lg:text-5xl 
            font-bold text-white 
            mb-3 sm:mb-4 tablet:mb-6
            leading-tight
            px-2 sm:px-0
          ">
            Întrebări frecvente despre alăptare
          </h2>
          <p className="
            text-white/90 
            text-sm sm:text-base tablet:text-lg
            mb-6 sm:mb-8 tablet:mb-10
            leading-relaxed
            max-w-3xl mx-auto lg:mx-0
            px-2 sm:px-0
          ">
            Descoperă răspunsuri grijulii și profesioniste la cele mai des întâlnite întrebări despre alăptare. Nu ești singură—hai să facem ca această călătorie să fie mai calmă și susținută.
          </p>
        </div>

        {/* Content Grid - responsive layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 tablet:gap-12 items-start">
          
          {/* FAQ Items - optimizate pentru mobile */}
          <div className="order-2 lg:order-1">
            <div className="space-y-3 sm:space-y-4 tablet:space-y-6">
              {faqs.map((item, index) => {
                const isExpanded = expandedFAQ === index;
                
                return (
                  <div
                    key={index}
                    className="
                      bg-white bg-opacity-10 backdrop-blur-sm
                      rounded-lg sm:rounded-xl 
                      p-3 sm:p-4 tablet:p-5
                      border border-white border-opacity-20
                      transition-all duration-300
                      hover:bg-opacity-15
                    "
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="
                        w-full text-left flex justify-between items-start gap-3
                        focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded
                      "
                    >
                      <h3 className="
                        text-sm sm:text-base tablet:text-lg 
                        font-semibold text-white 
                        leading-snug
                        flex-1
                      ">
                        {item.question}
                      </h3>
                      
                      {/* Toggle Icon */}
                      <div className="
                        flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7
                        bg-white bg-opacity-20 rounded-full
                        flex items-center justify-center
                        transition-transform duration-300
                        ml-2
                      " style={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}>
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    
                    {/* Answer - cu animație smooth */}
                    <div className={`
                      overflow-hidden transition-all duration-300 ease-in-out
                      ${isExpanded ? 'max-h-96 opacity-100 mt-3 sm:mt-4' : 'max-h-0 opacity-0 mt-0'}
                    `}>
                      <div className="
                        border-t border-white border-opacity-20 
                        pt-3 sm:pt-4
                      ">
                        <p className="
                          text-white/90 
                          text-xs sm:text-sm tablet:text-base
                          leading-relaxed
                        ">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Section pentru mobile */}
            <div className="
              mt-6 sm:mt-8 tablet:mt-10
              bg-white bg-opacity-10 backdrop-blur-sm
              rounded-lg sm:rounded-xl 
              p-4 sm:p-5 tablet:p-6
              border border-white border-opacity-20
              text-center
            " data-aos="fade-up" data-aos-delay="500">
              <h3 className="text-white font-semibold text-base sm:text-lg mb-2 sm:mb-3">
                Ai alte întrebări?
              </h3>
              <p className="text-white/90 text-xs sm:text-sm mb-3 sm:mb-4">
                Programează o consultație personalizată pentru răspunsuri adaptate situației tale
              </p>
              <a
                href="BookingWizard"
                className="
                  inline-block bg-white text-[#D39473] 
                  font-semibold text-sm sm:text-base
                  px-4 sm:px-6 py-2 sm:py-3
                  rounded-full
                  shadow-md hover:shadow-lg
                  transition-all duration-300
                  transform hover:scale-105
                "
              >
                Programează consultația
              </a>
            </div>
          </div>

          {/* IMAGE - optimizată pentru mobile */}
          <div className="
            order-1 lg:order-2 
            flex justify-center lg:justify-end
            mb-4 sm:mb-6 lg:mb-0
          " data-aos="fade-left" data-aos-delay="200">
            <div className="relative">
              <img
                src="/Hero_img-COPY.png"
                alt="Întrebări frecvente despre alăptare"
                className="
                  w-full max-w-[280px] sm:max-w-[350px] tablet:max-w-md lg:max-w-lg 
                  rounded-lg sm:rounded-xl 
                  shadow-lg sm:shadow-2xl
                  transition-transform duration-300
                  hover:scale-105
                "
              />
              
              {/* Decorative elements pentru mobile */}
              <div className="
                absolute -top-2 -right-2 sm:-top-3 sm:-right-3
                w-4 h-4 sm:w-6 sm:h-6
                bg-white bg-opacity-30 rounded-full
                animate-pulse
                sm:hidden
              "></div>
              <div className="
                absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3
                w-3 h-3 sm:w-4 sm:h-4
                bg-white bg-opacity-20 rounded-full
                animate-bounce
                sm:hidden
              "></div>
            </div>
          </div>
        </div>

        {/* Stats pentru mobile */}
        <div className="
          mt-8 sm:mt-10 tablet:mt-12
          grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6
          lg:hidden
        " data-aos="fade-up" data-aos-delay="600">
          {[
            { number: "500+", text: "Mame ajutate" },
            { number: "98%", text: "Satisfacție" },
            { number: "24/7", text: "Suport" },
            { number: "5★", text: "Rating mediu" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-lg sm:text-xl font-bold text-white mb-1">
                {stat.number}
              </div>
              <div className="text-xs sm:text-sm text-white/80">
                {stat.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;