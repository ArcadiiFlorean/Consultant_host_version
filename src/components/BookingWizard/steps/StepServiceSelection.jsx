import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function StepServiceSelection({ services, formData, updateSelectedService, nextStep }) {
  const [selectedServiceId, setSelectedServiceId] = useState(formData.serviceId || "");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  const handleServiceSelect = (service) => {
    setSelectedServiceId(service.id.toString());
    updateSelectedService(service);
  };

  const handleContinue = async () => {
    if (!selectedServiceId) {
      // Enhanced error feedback instead of alert
      const errorMsg = document.createElement('div');
      errorMsg.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
      errorMsg.textContent = 'Te rugăm să selectezi un serviciu pentru a continua';
      document.body.appendChild(errorMsg);
      
      setTimeout(() => {
        document.body.removeChild(errorMsg);
      }, 3000);
      return;
    }
    
    setIsProcessing(true);
    // Simulate processing time for better UX
    setTimeout(() => {
      nextStep();
      setIsProcessing(false);
    }, 800);
  };

  const formatPrice = (price, currency = "GBP") => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const formatDuration = (minutes) => {
    if (minutes === 0) return "Plan personalizat";
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours}h`;
    return `${hours}h ${remainingMinutes}min`;
  };

  const getServiceIcon = (index) => {
    const icons = ["🎯", "💎", "⚡", "🌟", "🔥", "💝"];
    return icons[index % icons.length];
  };

  const getServiceGradient = (index) => {
    const gradients = [
      "from-blue-500 to-indigo-600",
      "from-purple-500 to-pink-600", 
      "from-green-500 to-emerald-600",
      "from-orange-500 to-red-600",
      "from-teal-500 to-cyan-600",
      "from-rose-500 to-pink-600"
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-400/10 rounded-full animate-float-delay"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-purple-400/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-pink-400/10 rounded-full animate-float-slow"></div>
      </div>

      <div className="max-w-4xl w-full relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-white/30">
          
          {/* Enhanced Header */}
          <div className="text-center mb-8 sm:mb-12" data-aos="fade-down">
            {/* Step Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-sm font-medium mb-6 shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              Pasul 1 din 4 - Selectare serviciu
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Selectează serviciul
              <span className="relative inline-block mx-2">
                <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                  perfect
                </span>
                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
              </span>
              pentru tine
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Alege din serviciile noastre specializate cel care se potrivește cel mai bine nevoilor tale și ale bebelușului tău.
            </p>
          </div>

          {/* Enhanced Services Grid */}
          <div className="space-y-6">
            {services.map((service, index) => (
              <div
                key={service.id}
                data-aos="zoom-in-up"
                data-aos-delay={index * 100}
                className={`group relative border-2 rounded-2xl p-6 sm:p-8 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                  selectedServiceId === service.id.toString()
                    ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-xl scale-[1.02]"
                    : "border-gray-200 hover:border-blue-300 hover:shadow-lg bg-white"
                }`}
                onClick={() => handleServiceSelect(service)}
              >
                {/* Selection Glow Effect */}
                {selectedServiceId === service.id.toString() && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-600/10 rounded-2xl animate-pulse"></div>
                )}

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 mb-6 lg:mb-0">
                    {/* Enhanced Header */}
                    <div className="flex items-start mb-4">
                      <div className="flex items-center mr-4">
                        <input
                          type="radio"
                          name="service"
                          value={service.id}
                          checked={selectedServiceId === service.id.toString()}
                          onChange={() => handleServiceSelect(service)}
                          className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 flex-shrink-0"
                        />
                        
                        {/* Service Icon */}
                        <div className={`ml-4 w-12 h-12 bg-gradient-to-r ${getServiceGradient(index)} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <span className="text-2xl">{getServiceIcon(index)}</span>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                          {service.name}
                        </h3>
                        
                        {/* Service Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {formatDuration(service.duration)}
                          </span>
                          {service.currency && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Plată securizată
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                   <p className="text-gray-600 leading-relaxed mb-4 group-hover:text-gray-700 transition-colors duration-300 line-clamp-3 max-w-full">
  {service.description}
</p>

                    {/* Service Features */}
                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-500">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Consultant certificat</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>Confidențial 100%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Price Section */}
                  <div className="flex justify-between items-center lg:block lg:text-center lg:ml-8">
                    <div className="lg:mb-4">
                      <div className={`text-3xl sm:text-4xl font-bold transition-colors duration-300 ${
                        selectedServiceId === service.id.toString() 
                          ? 'text-blue-600' 
                          : 'text-gray-700 group-hover:text-blue-600'
                      }`}>
                        {formatPrice(service.price, service.currency || "GBP")}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">per sesiune</p>
                    </div>
                    
                    {selectedServiceId === service.id.toString() && (
                      <div className="lg:mt-4" data-aos="zoom-in">
                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-bold shadow-lg animate-pulse">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Selectat
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Indicator */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          {/* Enhanced Empty State */}
          {services.length === 0 && (
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
              <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300">
                Contactează-ne direct
              </button>
            </div>
          )}

          {/* Enhanced Footer */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 gap-6 sm:gap-0">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center sm:justify-start order-2 sm:order-1">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div className="w-12 h-1 bg-gray-300 rounded-full">
                  <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 font-bold text-sm">2</span>
                </div>
                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 font-bold text-sm">3</span>
                </div>
                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 font-bold text-sm">4</span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Continue Button */}
            <button
              onClick={handleContinue}
              disabled={!selectedServiceId || isProcessing}
              className={`group w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform shadow-xl order-1 sm:order-2 ${
                selectedServiceId && !isProcessing
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white hover:shadow-2xl hover:-translate-y-1"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <span className="flex items-center justify-center">
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Se procesează...
                  </>
                ) : selectedServiceId ? (
                  <>
                    Continuă cu programarea
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                ) : (
                  "Selectează un serviciu pentru a continua"
                )}
              </span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Plată 100% securizată</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>500+ mame ajutate</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Suport 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepServiceSelection;