import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import StepDateTime from "./steps/StepDateTime";
import StepUserInfo from "./steps/StepUserInfo";
import StepPayment from "./steps/StepPayment";
import StepServiceSelection from "./steps/StepServiceSelection";

function BookingWizard() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [formData, setFormData] = useState({
    serviceId: "",
    serviceName: "",
    servicePrice: 0,
    serviceDuration: 0,
    date: "",
    time: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    paymentMethod: "",
  });

  // Funcție pentru a prelua parametrii din URL
  const getURLParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      serviceId: urlParams.get("service"),
      serviceName: urlParams.get("name"),
      servicePrice: urlParams.get("price"),
      serviceCurrency: urlParams.get("currency"),
    };
  };

  // Preia serviciile disponibile la încărcarea componentei
  useEffect(() => {
    fetchServices();
  }, []);

  // Procesează parametrii URL după ce serviciile sunt încărcate
  useEffect(() => {
    if (services.length > 0) {
      const urlParams = getURLParams();

      // Dacă avem parametri în URL, preselectăm serviciul
      if (urlParams.serviceId && urlParams.serviceName) {
        // Verifică dacă este consultația gratuită
        if (urlParams.serviceId === "free") {
          setFormData((prev) => ({
            ...prev,
            serviceId: "free",
            serviceName: decodeURIComponent(urlParams.serviceName),
            servicePrice: 0,
            serviceDuration: 15, // 15 minute pentru consultația gratuită
          }));

          // Treci direct la pasul 2 (alegere dată)
          setStep(2);
        } else {
          // Caută serviciul în lista de servicii disponibile
          const selectedService = services.find(
            (service) =>
              service.id.toString() === urlParams.serviceId.toString()
          );

          if (selectedService) {
            setFormData((prev) => ({
              ...prev,
              serviceId: selectedService.id,
              serviceName: selectedService.name,
              servicePrice: parseFloat(selectedService.price),
              serviceDuration: parseInt(selectedService.duration || 60),
            }));

            // Treci direct la pasul 2 (alegere dată)
            setStep(2);
          } else {
            // Dacă serviciul nu este găsit, folosește datele din URL
            setFormData((prev) => ({
              ...prev,
              serviceId: urlParams.serviceId,
              serviceName: decodeURIComponent(urlParams.serviceName),
              servicePrice: parseFloat(urlParams.servicePrice || 0),
              serviceDuration: 60, // durată implicită
            }));

            // Treci direct la pasul 2
            setStep(2);
          }
        }
      }
    }
  }, [services]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://marina-cociug.com/api/services.php"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setServices(data.data);
        setError("");
      } else {
        setError(data.message || "Eroare la încărcarea serviciilor");
      }
    } catch (err) {
      console.error("Eroare la preluarea serviciilor:", err);
      setError("Nu s-au putut încărca serviciile disponibile");

      // În caz de eroare, verifică dacă avem parametri URL și îi folosește
      const urlParams = getURLParams();
      if (urlParams.serviceId && urlParams.serviceName) {
        // Adaugă serviciile de fallback
        const fallbackServices = [
          {
            id: 1,
            name: "Consultație Inițială",
            description:
              "Prima întâlnire pentru evaluarea nevoilor tale și stabilirea unui plan personalizat de alăptare.",
            price: "150",
            currency: "RON",
            duration: 90,
            popular: false,
            features: [
              "Evaluare completă",
              "Plan personalizat",
              "Ghid digital",
              "Suport 24h",
            ],
            icon: "consultation",
            gradient: "from-blue-500 to-indigo-600",
            stats: "90 min",
          },
          {
            id: 2,
            name: "Pachet Complet de Îngrijire",
            description:
              "Suport complet pentru întreaga ta călătorie de alăptare cu sesiuni multiple și monitorizare continuă.",
            price: "450",
            currency: "RON",
            duration: 360,
            popular: true,
            features: [
              "5 sesiuni incluse",
              "Monitorizare continuă",
              "Plan nutrițional",
              "Comunitate privată",
              "Urgențe 24/7",
            ],
            icon: "premium",
            gradient: "from-purple-500 to-pink-600",
            stats: "6 luni suport",
          },
          {
            id: 3,
            name: "Sesiune de Urgență",
            description:
              "Suport rapid pentru situații urgente de alăptare disponibil oricând.",
            price: "200",
            currency: "RON",
            duration: 60,
            popular: false,
            features: [
              "Răspuns rapid",
              "Consultație imediată",
              "Plan de acțiune",
              "Follow-up gratuit",
            ],
            icon: "emergency",
            gradient: "from-orange-500 to-red-500",
            stats: "< 2h răspuns",
          },
        ];

        setServices(fallbackServices);
        setError(""); // Resetează eroarea dacă avem fallback
      }
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep((prev) => prev + 1);
      setIsTransitioning(false);
    }, 150);
  };

  const prevStep = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep((prev) => prev - 1);
      setIsTransitioning(false);
    }, 150);
  };

  // Actualizează datele serviciului selectat
  const updateSelectedService = (service) => {
    setFormData((prev) => ({
      ...prev,
      serviceId: service.id,
      serviceName: service.name,
      servicePrice: parseFloat(service.price),
      serviceDuration: parseInt(service.duration || 60),
    }));
  };

  const getStepInfo = (stepNumber) => {
    const steps = [
      {
        title: "Selectare serviciu",
        icon: "🎯",
        color: "from-blue-500 to-indigo-600",
      },
      {
        title: "Alegere dată",
        icon: "📅",
        color: "from-green-500 to-emerald-600",
      },
      {
        title: "Informații personale",
        icon: "👤",
        color: "from-purple-500 to-pink-600",
      },
      { title: "Plată", icon: "💳", color: "from-orange-500 to-red-600" },
    ];
    return steps[stepNumber - 1];
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-400/10 rounded-full animate-float-delay"></div>
          <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-purple-400/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-pink-400/10 rounded-full animate-float-slow"></div>
        </div>

        <div className="relative z-10 text-center bg-white/90 backdrop-blur-sm p-8 sm:p-12 rounded-3xl shadow-2xl border border-white/30 max-w-md w-full">
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-2xl flex items-center justify-center mb-6 mx-auto transform animate-pulse">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
            </div>
            {/* Floating dots */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Pregătim totul pentru tine...
          </h3>
          <p className="text-gray-600 mb-6">
            Se încarcă serviciile disponibile și sloturile de timp
          </p>

          {/* Loading progress */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full animate-pulse"
              style={{ width: "75%" }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">Aproape gata...</p>
        </div>
      </div>
    );
  }

  if (error && services.length === 0) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-red-400/5 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-orange-400/5 rounded-full animate-float-delay"></div>
        </div>

        <div className="relative z-10 text-center bg-white/95 backdrop-blur-sm p-8 sm:p-12 rounded-3xl shadow-2xl border border-red-100 max-w-lg w-full">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="absolute top-4 right-4 w-16 h-16 bg-red-100 rounded-full opacity-50 animate-pulse"></div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Oops! Ceva nu a mers bine
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>

          <div className="space-y-4">
            <button
              onClick={fetchServices}
              className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <span className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Încearcă din nou
              </span>
            </button>

            <p className="text-sm text-gray-500">
              Dacă problema persistă, te rugăm să ne contactezi direct
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/5 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-400/5 rounded-full animate-float-delay"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-purple-400/5 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-pink-400/5 rounded-full animate-float-slow"></div>
      </div>

      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:block relative z-10">
        <Sidebar step={step} />
      </div>

      {/* Enhanced Mobile Progress Bar */}
      <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-gray-200/50 px-4 py-4 sticky top-0 z-20 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-r ${
                getStepInfo(step).color
              } flex items-center justify-center shadow-lg mr-3`}
            >
              <span className="text-lg">{getStepInfo(step).icon}</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">
                Pasul {step} din 4
              </h3>
              <p className="text-xs text-gray-600">{getStepInfo(step).title}</p>
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  stepNum <= step
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${(step / 4) * 100}%` }}
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Start</span>
            <span className="text-green-600 font-medium">
              {Math.round((step / 4) * 100)}% complet
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content with Transitions */}
      <div className="flex-1 min-h-0 relative z-10">
        <div
          className={`transition-all duration-300 ${
            isTransitioning ? "opacity-50 scale-95" : "opacity-100 scale-100"
          }`}
        >
          {step === 1 && (
            <StepServiceSelection
              services={services}
              formData={formData}
              setFormData={setFormData}
              updateSelectedService={updateSelectedService}
              nextStep={nextStep}
            />
          )}
          {step === 2 && (
            <StepDateTime
              formData={formData}
              setFormData={setFormData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {step === 3 && (
            <StepUserInfo
              formData={formData}
              setFormData={setFormData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {step === 4 && (
            <StepPayment
              formData={formData}
              setFormData={setFormData}
              prevStep={prevStep}
            />
          )}
        </div>

        {/* Transition overlay */}
        {isTransitioning && (
          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-xl">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Help Button */}
      <div className="fixed bottom-6 right-6 z-30 lg:hidden">
        <button className="group w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center transform hover:scale-110">
          <svg
            className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default BookingWizard;
