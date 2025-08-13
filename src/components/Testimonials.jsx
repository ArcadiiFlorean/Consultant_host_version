import React, { useState, useEffect } from 'react';


const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  // Funcție pentru deschiderea modal-ului
  const openModal = (testimonial) => {
    setSelectedTestimonial(testimonial);
    document.body.style.overflow = 'hidden'; // Previne scroll-ul în background
  };

  // Funcție pentru închiderea modal-ului
  const closeModal = () => {
    setSelectedTestimonial(null);
    document.body.style.overflow = 'unset'; // Restabilește scroll-ul
  };

  // Închide modal-ul cu Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    
    if (selectedTestimonial) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [selectedTestimonial]);

  // Testimoniale statice din baza ta de date (temporar până rezolvăm API-ul)
  const fallbackTestimonials = [
    {
      id: 1,
      name: "Cristina Ionescu",
      text: "Prezența calmă a Marinei a fost exact ce aveam nevoie. M-a ascultat cu empatie, mi-a oferit ghidare blândă și m-a ajutat să capăt încredere în mine ca mamă la început de drum.",
      rating: 5,
      role: "Mamă pentru prima dată"
    },
    {
      id: 2,
      name: "Laura Popescu", 
      text: "Sprijinul oferit de Marina a fost mai mult decât profesionist — a fost uman. Recomand cu tot sufletul serviciile ei oricărei mămici care trece prin dificultăți cu alăptarea.",
      rating: 5,
      role: "Mamă din Chișinău"
    },
    {
      id: 3,
      name: "Irina Dobre",
      text: "Fără Marina aș fi renunțat la alăptare. Mi-a oferit informații clare și mi-a dat curajul să continui. Mulțumesc din suflet!",
      rating: 5,
      role: "Mamă singură"
    }
  ];

  // Funcție pentru a încărca testimonialele din baza de date
  const loadTestimonials = async () => {
    try {
      setLoading(true);
      
      // Căile pentru server PHP (nu React dev server)
const apiPaths = [
  'https://marina-cociug.com/api/simple_testimonials.php',
  'https://marina-cociug.com/api/testimonials.php'
];
      
      let data = null;
      let successPath = null;
      
      // Încearcă fiecare cale
      for (const path of apiPaths) {
        try {
          console.log(`🔍 Testez API path: ${path}`);
          const response = await fetch(path);
          
          if (!response.ok) {
            console.log(`❌ ${path}: HTTP ${response.status}`);
            continue;
          }
          
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            const textContent = await response.text();
            console.log(`❌ ${path}: Nu returnează JSON. Content:`, textContent.substring(0, 100));
            continue;
          }
          
          data = await response.json();
          successPath = path;
          console.log(`✅ API găsit la: ${path}`);
          break;
        } catch (err) {
          console.log(`❌ ${path} eșuat:`, err.message);
          continue;
        }
      }
      
      if (data && data.success && data.data && data.data.length > 0) {
        setTestimonials(data.data);
        setError(null);
        console.log(`🎉 SUCCESS: Încărcate ${data.data.length} testimoniale din baza de date via ${successPath}`);
      } else if (data) {
        console.log('⚠️ API răspunde dar fără date:', data);
        setTestimonials(fallbackTestimonials);
        setError('API fără date valide');
      } else {
        console.log('❌ Niciun API funcțional găsit, folosesc testimonialele salvate');
        setTestimonials(fallbackTestimonials);
        setError(null); // Nu afișa eroare, doar folosește fallback
      }
    } catch (err) {
      console.error('💥 Eroare generală:', err);
      setError(null); // Nu afișa eroare, doar folosește fallback
      setTestimonials(fallbackTestimonials);
    } finally {
      setLoading(false);
    }
  };

  // Încarcă testimonialele la mount
  useEffect(() => {
    loadTestimonials();
    
    // Reîncarcă testimonialele la fiecare 30 de secunde pentru actualizări live
    const interval = setInterval(loadTestimonials, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const StarRating = ({ rating }) => {
    return (
      <div className="flex space-x-1 justify-center sm:justify-start">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 sm:w-5 sm:h-5 ${i < rating ? 'text-amber-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section id='Testimonials' className="py-12 sm:py-16 tablet:py-20 lg:py-24 px-3 sm:px-4 tablet:px-6 bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="max-w-6xl mx-auto">
        
        {/* Header optimizat pentru mobile */}
        <div className="text-center mb-8 sm:mb-10 tablet:mb-12">
          <h2 className="
            text-2xl sm:text-3xl tablet:text-4xl lg:text-5xl 
            font-bold text-amber-900 
            mb-3 sm:mb-4 
            leading-tight
            px-2 sm:px-0
          ">
            Ce spun mamele despre mine
          </h2>
          <p className="
            text-base sm:text-lg tablet:text-xl 
            text-amber-700 
            max-w-2xl mx-auto
            leading-relaxed
            px-2 sm:px-0
          ">
            Mărturiile mamelor cu care am lucrat și care au avut parte de o experiență frumoasă în alăptare
          </p>
          
          {/* Loading state optimizat pentru mobile */}
          {loading && (
            <div className="mt-4">
              <div className="inline-flex items-center text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-amber-600 mr-2"></div>
                <span className="text-xs sm:text-sm">Se încarcă testimonialele...</span>
              </div>
            </div>
          )}
          
          {/* Error state îmbunătățit */}
          {error && (
            <div className="mt-4 text-xs sm:text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg inline-block border border-amber-200">
              <div className="flex items-center gap-2">
                <span>ℹ️</span>
                <span>Conectare API în curs - Afișez testimonialele salvate</span>
              </div>
            </div>
          )}
        </div>

        {!loading && (
          <>
            {/* Grid optimizat pentru mobile */}
            <div className="
              grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
              gap-4 sm:gap-6 tablet:gap-8
              px-2 sm:px-0
            ">
              {testimonials.map((testimonial) => {
                const shouldTruncate = testimonial.text.length > 120; // Redus pentru mobile
                const displayText = shouldTruncate 
                  ? testimonial.text.substring(0, 120) + '...'
                  : testimonial.text;

                return (
                  <div
                    key={testimonial.id}
                    className={`
                      bg-white rounded-xl sm:rounded-2xl 
                      p-4 sm:p-5 tablet:p-6 
                      shadow-md hover:shadow-lg sm:shadow-lg sm:hover:shadow-xl 
                      transition-all duration-300 
                      border border-orange-100 
                      transform hover:-translate-y-1 sm:hover:-translate-y-2
                      ${shouldTruncate ? 'cursor-pointer hover:border-orange-300' : ''}
                      min-h-[280px] sm:min-h-[320px]
                    `}
                    onClick={shouldTruncate ? () => openModal(testimonial) : undefined}
                  >
                    {/* Rating */}
                    <div className="mb-3 sm:mb-4 flex justify-center sm:justify-start">
                      <StarRating rating={testimonial.rating} />
                    </div>
                    
                    {/* Text testimonial */}
                    <blockquote className="
                      text-gray-700 
                      mb-4 sm:mb-5 
                      italic leading-relaxed
                      text-sm sm:text-base
                      text-center sm:text-left
                      flex-1
                    ">
                      "{displayText}"
                      {shouldTruncate && (
                        <span className="
                          ml-2 text-amber-600 font-medium 
                          text-xs sm:text-sm 
                          hover:text-amber-700 transition-colors
                          inline-block mt-1 sm:mt-0
                        ">
                          Citește mai mult →
                        </span>
                      )}
                    </blockquote>
                    
                    {/* Author info */}
                    <div className="flex items-center justify-center sm:justify-start mt-auto">
                      <div className="
                        w-10 h-10 sm:w-12 sm:h-12 
                        bg-gradient-to-br from-orange-200 to-pink-200 
                        rounded-full flex items-center justify-center 
                        mr-3 sm:mr-4
                        flex-shrink-0
                      ">
                        <span className="text-amber-800 font-semibold text-sm sm:text-lg">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="text-center sm:text-left">
                        <h4 className="
                          font-semibold text-amber-900
                          text-sm sm:text-base
                          leading-tight
                        ">
                          {testimonial.name}
                        </h4>
                        <p className="
                          text-xs sm:text-sm text-amber-600
                          opacity-80
                        ">
                          {testimonial.role || 'Mamă mulțumită'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stats section optimizată pentru mobile */}
            <div className="
              text-center 
              mt-8 sm:mt-10 tablet:mt-12
              px-2 sm:px-0
            ">
              <div className="
                inline-flex items-center 
                bg-white rounded-full 
                px-4 sm:px-6 py-2 sm:py-3 
                shadow-md border border-orange-100
                text-xs sm:text-base
              ">
                <span className="text-amber-800 font-medium mr-2">
                  Peste {testimonials.length * 10}+ mame mulțumite
                </span>
                <div className="flex -space-x-1 sm:-space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="
                        w-6 h-6 sm:w-8 sm:h-8 
                        bg-gradient-to-br from-orange-200 to-pink-200 
                        rounded-full border-2 border-white 
                        flex items-center justify-center
                      "
                    >
                      <span className="text-xs text-amber-800 font-medium">♥</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal optimizat pentru mobile */}
      {selectedTestimonial && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4"
          onClick={closeModal}
        >
          <div 
            className="
              bg-white 
              rounded-2xl sm:rounded-3xl 
              max-w-lg sm:max-w-2xl w-full 
              max-h-[90vh] overflow-y-auto 
              shadow-2xl transform transition-all duration-300 scale-100
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header modal optimizat pentru mobile */}
            <div className="
              sticky top-0 
              bg-gradient-to-r from-orange-400 to-pink-400 
              text-white 
              p-4 sm:p-6 
              rounded-t-2xl sm:rounded-t-3xl
            ">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1 min-w-0">
                  <div className="
                    w-12 h-12 sm:w-16 sm:h-16 
                    bg-white bg-opacity-20 rounded-full 
                    flex items-center justify-center 
                    mr-3 sm:mr-4
                    flex-shrink-0
                  ">
                    <span className="text-white font-bold text-lg sm:text-xl">
                      {selectedTestimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="
                      text-lg sm:text-2xl font-bold 
                      leading-tight truncate
                    ">
                      {selectedTestimonial.name}
                    </h3>
                    <p className="text-orange-100 text-sm sm:text-base truncate">
                      {selectedTestimonial.role || 'Mamă mulțumită'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="
                    w-8 h-8 sm:w-10 sm:h-10 
                    bg-white bg-opacity-20 rounded-full 
                    flex items-center justify-center 
                    hover:bg-opacity-30 transition-all duration-200
                    flex-shrink-0 ml-2
                  "
                >
                  <span className="text-white text-lg sm:text-xl font-bold">×</span>
                </button>
              </div>
            </div>

            {/* Conținut modal optimizat pentru mobile */}
            <div className="p-4 sm:p-6 tablet:p-8">
              {/* Rating */}
              <div className="mb-4 sm:mb-6 flex justify-center">
                <StarRating rating={selectedTestimonial.rating} />
              </div>

              {/* Testimonial complet */}
              <blockquote className="
                text-gray-700 
                text-base sm:text-lg 
                leading-relaxed italic text-center 
                mb-6 sm:mb-8 
                relative
                px-2 sm:px-4
              ">
                <span className="
                  text-4xl sm:text-6xl text-orange-200 
                  absolute -top-2 sm:-top-4 -left-1 sm:-left-2
                ">"</span>
                <span className="relative z-10">{selectedTestimonial.text}</span>
                <span className="
                  text-4xl sm:text-6xl text-orange-200 
                  absolute -bottom-4 sm:-bottom-8 -right-1 sm:-right-2
                ">"</span>
              </blockquote>

              {/* Footer cu acțiuni */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <button
                  onClick={closeModal}
                  className="
                    bg-gradient-to-r from-orange-400 to-pink-400 
                    text-white 
                    px-6 sm:px-8 py-3 
                    rounded-full font-semibold 
                    hover:from-orange-500 hover:to-pink-500 
                    transition-all duration-300 
                    transform hover:scale-105 
                    shadow-lg
                    text-sm sm:text-base
                  "
                >
                  Închide
                </button>
                <a
                  href="#booking"
                  onClick={closeModal}
                  className="
                    bg-white text-orange-500 border-2 border-orange-400
                    px-6 sm:px-8 py-3 
                    rounded-full font-semibold 
                    hover:bg-orange-50
                    transition-all duration-300 
                    transform hover:scale-105 
                    text-center
                    text-sm sm:text-base
                  "
                >
                  Programează consultația
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonials;