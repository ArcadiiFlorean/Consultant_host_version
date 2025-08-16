import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function SupportPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchServices();
  }, []);

  // Funcție pentru redirectionare la booking system
  const handleSelectPackage = (
    packageId,
    packageName,
    packagePrice,
    packageCurrency
  ) => {
    const bookingUrl = `/BookingWizard?service=${packageId}&name=${encodeURIComponent(
      packageName
    )}&price=${packagePrice}&currency=${packageCurrency}`;

    console.log("Redirecting to booking with:", {
      id: packageId,
      name: packageName,
      price: packagePrice,
      currency: packageCurrency,
      url: bookingUrl,
    });

    window.location.href = bookingUrl;
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("=== FETCHING SERVICES ===");
      console.log("API URL: /api/services.php");

      const response = await fetch("/api/services.php", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("=== RESPONSE DEBUG ===");
      console.log("Status:", response.status);
      console.log("Status Text:", response.statusText);
      console.log("Headers:", response.headers.get("content-type"));

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response body:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 200)}`);
      }

      const result = await response.json();
      console.log("=== PARSED JSON RESPONSE ===");
      console.log("Full result:", result);
      console.log("Success:", result.success);
      console.log("Data:", result.data);
      console.log("Data type:", typeof result.data);
      console.log("Data length:", Array.isArray(result.data) ? result.data.length : 'Not an array');

      if (result.success && result.data) {
        if (Array.isArray(result.data) && result.data.length > 0) {
          console.log("=== PROCESSING SERVICES ===");
          
          // Mapăm serviciile la formatul așteptat de componentă
          const adaptedServices = result.data.map((service, index) => {
            console.log(`Processing service ${index}:`, service);
            
            return {
              id: service.id,
              name: service.name,
              description: service.description,
              price: service.price.toString(),
              currency: service.currency || 'RON',
              popular: Boolean(service.popular),
              features: Array.isArray(service.features) ? service.features : 
                        (service.features ? [service.features] : getDefaultFeatures()),
              icon: service.icon || 'consultation',
              color: getColorFromIcon(service.icon || 'consultation'),
              stats: getStatsFromService(service),
            };
          });

          console.log("=== ADAPTED SERVICES ===");
          console.log("Adapted services:", adaptedServices);
          
          setPackages(adaptedServices);
        } else {
          console.log("No services found in data array");
          setPackages([]);
        }
      } else {
        console.log("API response indicates failure or no data");
        throw new Error(result.error || "Failed to load services");
      }

      setLoading(false);
      console.log("=== FETCH COMPLETED SUCCESSFULLY ===");
      
    } catch (error) {
      console.error("=== FETCH ERROR ===");
      console.error("Error details:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      
      setError(`Nu s-au putut încărca serviciile: ${error.message}`);
      setLoading(false);

      // Fallback la servicii statice doar pentru dezvoltare
      console.log("=== USING FALLBACK SERVICES ===");
      setPackages(getFallbackServices());
    }
  };

  // Funcții helper
  const getDefaultFeatures = () => [
    "Consultanță personalizată",
    "Suport profesional",
    "Ghiduri incluse"
  ];

  const getColorFromIcon = (icon) => {
    const colorMap = {
      consultation: "orange",
      premium: "red", 
      emergency: "amber",
      support: "blue",
      package: "green"
    };
    return colorMap[icon] || "orange";
  };

  const getStatsFromService = (service) => {
    if (service.duration) {
      if (service.duration >= 60) {
        const hours = Math.floor(service.duration / 60);
        const minutes = service.duration % 60;
        return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
      }
      return `${service.duration} min`;
    }
    return "Durată flexibilă";
  };

  const getFallbackServices = () => [
    {
      id: 1,
      name: "Consultație Inițială",
      description: "Prima întâlnire pentru evaluarea nevoilor tale și stabilirea unui plan personalizat.",
      price: "150",
      currency: "RON",
      popular: false,
      features: ["Evaluare completă", "Plan personalizat", "Ghid digital", "Suport 24h"],
      icon: "consultation",
      color: "orange",
      stats: "90 min",
    },
    {
      id: 2,
      name: "Pachet Complet",
      description: "Suport complet pentru întreaga ta călătorie de alăptare cu sesiuni multiple.",
      price: "450",
      currency: "RON",
      popular: true,
      features: ["5 sesiuni", "Monitorizare", "Plan nutrițional", "Comunitate", "Urgențe 24/7"],
      icon: "premium",
      color: "red",
      stats: "6 luni suport",
    }
  ];

  const getIcon = (iconType) => {
    const icons = {
      consultation: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      premium: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      emergency: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    };
    return icons[iconType] || icons.consultation;
  };

  const getColorClasses = (color) => {
    const colorClasses = {
      orange: {
        icon: "bg-orange-500",
        badge: "bg-orange-100 text-orange-700 border-orange-200",
        button: "bg-orange-500 hover:bg-orange-600",
        border: "border-orange-200",
      },
      red: {
        icon: "bg-red-500",
        badge: "bg-red-100 text-red-700 border-red-200", 
        button: "bg-red-500 hover:bg-red-600",
        border: "border-red-200",
      },
      amber: {
        icon: "bg-amber-500",
        badge: "bg-amber-100 text-amber-700 border-amber-200",
        button: "bg-amber-500 hover:bg-amber-600",
        border: "border-amber-200",
      },
      blue: {
        icon: "bg-blue-500",
        badge: "bg-blue-100 text-blue-700 border-blue-200",
        button: "bg-blue-500 hover:bg-blue-600", 
        border: "border-blue-200",
      },
      green: {
        icon: "bg-green-500",
        badge: "bg-green-100 text-green-700 border-green-200",
        button: "bg-green-500 hover:bg-green-600",
        border: "border-green-200",
      }
    };
    return colorClasses[color] || colorClasses.orange;
  };

  // Loading state
  if (loading) {
    return (
      <section className="min-h-screen bg-orange-50 py-12 sm:py-16 md:py-20 flex items-center justify-center px-4">
        <div className="text-center max-w-sm mx-auto">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-orange-500 rounded-xl flex items-center justify-center mb-4 sm:mb-6 mx-auto">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 border-b-2 border-white"></div>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-orange-800 mb-2">
            Se încarcă serviciile...
          </h3>
          <p className="text-sm sm:text-base text-orange-600">
            Pregătim ofertele speciale pentru tine
          </p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="min-h-screen bg-orange-50 py-12 sm:py-16 md:py-20 flex items-center justify-center px-4">
        <div className="max-w-md mx-auto w-full">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center border border-red-200">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
              Ups! Ceva nu a mers bine
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 break-words">
              {error}
            </p>
            <div className="space-y-3">
              <button
                onClick={fetchServices}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 text-sm sm:text-base"
              >
                Încearcă din nou
              </button>
              <p className="text-xs text-gray-500">
                Dacă problema persistă, verifică consolele browser-ului pentru detalii tehnice.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Main content
  return (
    <section
      id="SupportPackages"
      className="min-h-screen bg-orange-50 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16" data-aos="fade-up">
          <div className="inline-block bg-orange-100 text-orange-700 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-orange-200">
            Pachete de consultanță specializată
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-orange-900 mb-4 sm:mb-6 leading-tight px-2">
            Pachete de Suport pentru Alăptare
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4">
            Alege soluția perfectă pentru călătoria ta de alăptare. Fiecare
            pachet este creat cu grijă pentru a-ți oferi sprijinul de care ai
            nevoie.
          </p>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 text-gray-700 px-4">
            <div className="flex items-center bg-white rounded-xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm border border-orange-100 text-sm sm:text-base">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                <span className="text-white font-semibold text-xs sm:text-sm">✓</span>
              </div>
              <span className="font-medium">500+ mame ajutate</span>
            </div>
            <div className="flex items-center bg-white rounded-xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm border border-orange-100 text-sm sm:text-base">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                <span className="text-white font-semibold text-xs sm:text-sm">★</span>
              </div>
              <span className="font-medium">Consultant certificat IBCLC</span>
            </div>
            <div className="flex items-center bg-white rounded-xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm border border-orange-100 text-sm sm:text-base">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                <span className="text-white font-semibold text-xs sm:text-sm">♥</span>
              </div>
              <span className="font-medium">Suport 24/7</span>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        {packages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {packages.map((pkg, index) => {
              const colors = getColorClasses(pkg.color);
              return (
                <div
                  key={pkg.id}
                  data-aos="fade-up"
                  data-aos-delay={`${index * 100}`}
                  className={`relative ${pkg.popular ? "md:scale-105" : ""} w-full`}
                >
                  {/* Popular Badge */}
                  {pkg.popular && (
                    <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-red-500 text-white px-3 sm:px-6 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
                        ⭐ Cel mai popular
                      </div>
                    </div>
                  )}

                  {/* Card */}
                  <div className={`bg-white rounded-2xl shadow-lg border-2 ${pkg.popular ? colors.border : "border-gray-100"} overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1`}>
                    <div className="p-4 sm:p-6 md:p-8 flex flex-col flex-grow">
                      {/* Icon */}
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 ${colors.icon} rounded-xl flex items-center justify-center mb-4 sm:mb-6`}>
                        {getIcon(pkg.icon)}
                      </div>

                      {/* Stats Badge */}
                      <div className={`absolute top-4 sm:top-6 right-4 sm:right-6 ${colors.badge} px-2 sm:px-3 py-1 rounded-full text-xs font-medium border`}>
                        {pkg.stats}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                        {pkg.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed max-w-full break-words">
                        {pkg.description}
                      </p>

                      {/* Features */}
                      <div className="mb-6 sm:mb-8 flex-grow">
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-3 sm:mb-4 uppercase tracking-wide">
                          Include:
                        </h4>
                        <ul className="space-y-2 sm:space-y-3">
                          {pkg.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start text-xs sm:text-sm text-gray-600">
                              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0 mt-0.5">
                                <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Price */}
                      <div className="mb-4 sm:mb-6">
                        <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 text-center">
                          <div className="flex items-baseline justify-center mb-1 sm:mb-2">
                            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                              {pkg.price}
                            </span>
                            <span className="text-sm sm:text-base md:text-lg ml-1 sm:ml-2 text-orange-300 font-semibold">
                              {pkg.currency}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Button */}
                      <button
                        onClick={() =>
                          handleSelectPackage(
                            pkg.id,
                            pkg.name,
                            pkg.price,
                            pkg.currency
                          )
                        }
                        className={`w-full ${colors.button} text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl font-semibold transition-all duration-200 hover:transform hover:-translate-y-1 text-sm sm:text-base`}
                      >
                        {pkg.popular ? "Alege Popularul" : "Selectează Pachetul"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16" data-aos="fade-up">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📋</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nu sunt servicii disponibile momentan
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Ne pare rău, dar în acest moment nu avem servicii disponibile pentru rezervare. Te rugăm să revii mai târziu.
            </p>
            <button 
              onClick={fetchServices}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              Reîncarcă serviciile
            </button>
          </div>
        )}

        {/* Debug Info - doar pentru dezvoltare */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
            <h4 className="font-bold mb-2">Debug Info:</h4>
            <p>Servicii încărcate: {packages.length}</p>
            <p>În curs de încărcare: {loading ? 'Da' : 'Nu'}</p>
            <p>Eroare: {error || 'Nicio eroare'}</p>
            <details className="mt-2">
              <summary className="cursor-pointer font-medium">Datele serviciilor (click pentru a vedea)</summary>
              <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(packages, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </section>
  );
}

export default SupportPackages;