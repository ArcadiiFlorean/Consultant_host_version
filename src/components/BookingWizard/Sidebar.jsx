import React from "react";

function Sidebar({ step }) {
  const steps = [
    {
      number: 1,
      title: "Serviciu",
      description: "Alege serviciul dorit",
      icon: "🎯"
    },
    {
      number: 2,
      title: "Data și ora",
      description: "Programează consultația",
      icon: "📅"
    },
    {
      number: 3,
      title: "Informația ta",
      description: "Completează datele",
      icon: "👤"
    },
    {
      number: 4,
      title: "Plăți",
      description: "Finalizează rezervarea",
      icon: "💳"
    }
  ];

  const getStepStatus = (stepNumber) => {
    if (stepNumber < step) return "completed";
    if (stepNumber === step) return "current";
    return "upcoming";
  };

  const getStepClasses = (stepNumber) => {
    const status = getStepStatus(stepNumber);
    
    const baseClasses = "flex items-center p-3 sm:p-4 rounded-lg transition-all duration-200";
    
    switch (status) {
      case "completed":
        return `${baseClasses} bg-green-100 text-green-800 border-l-4 border-green-500`;
      case "current":
        return `${baseClasses} bg-blue-100 text-blue-800 border-l-4 border-blue-500 shadow-md`;
      case "upcoming":
        return `${baseClasses} bg-gray-50 text-gray-500`;
      default:
        return baseClasses;
    }
  };

  const getIconClasses = (stepNumber) => {
    const status = getStepStatus(stepNumber);
    
    switch (status) {
      case "completed":
        return "w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0";
      case "current":
        return "w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0";
      case "upcoming":
        return "w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0";
      default:
        return "w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0";
    }
  };

  return (
    <div className="w-full sm:w-64 lg:w-80 bg-[#4a584b] text-white p-4 sm:p-6 min-h-screen overflow-y-auto">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Rezervă o consultație</h2>
        <p className="text-green-200 text-sm sm:text-base">Urmează pașii pentru a programa consultația ta</p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {steps.map((stepItem) => (
          <div
            key={stepItem.number}
            className={getStepClasses(stepItem.number)}
          >
            <div className="flex items-center w-full">
              <div className={getIconClasses(stepItem.number)}>
                {getStepStatus(stepItem.number) === "completed" ? (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  stepItem.number
                )}
              </div>
              
              <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                <h3 className="font-semibold text-base sm:text-lg break-words">{stepItem.title}</h3>
                <p className="text-xs sm:text-sm opacity-80 break-words">{stepItem.description}</p>
              </div>
              
              <div className="text-lg sm:text-2xl ml-2 flex-shrink-0">
                {stepItem.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 sm:mt-12 p-3 sm:p-4 bg-[#3a4739] rounded-lg">
        <h3 className="font-semibold mb-2 text-sm sm:text-base">🔒 Sigur și securizat</h3>
        <p className="text-xs sm:text-sm text-green-200">
          Toate datele tale sunt protejate prin criptare SSL și plățile sunt procesate securizat prin Stripe.
        </p>
      </div>

      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-[#3a4739] rounded-lg">
        <h3 className="font-semibold mb-2 text-sm sm:text-base">📞 Ai nevoie de ajutor tehnic?</h3>
        <p className="text-xs sm:text-sm text-green-200 mb-2">
          Suntem aici pentru tine. Nu ezita să ne contactezi!
        </p>
        <div className="text-xs sm:text-sm space-y-1">
          <div className="flex items-start">
            <span className="mr-1">📧</span>
            <a 
              href="mailto:arcadiiflorean789@gmail.com" 
              className="underline text-green-200 hover:text-green-100 transition-colors break-all"
            >
              arcadiiflorean789@gmail.com
            </a>
          </div>
          <div className="flex items-center">
            <span className="mr-1">📱</span>
            <a 
              href="tel:+447454182152" 
              className="text-green-200 hover:text-green-100 transition-colors"
            >
              +44 745 4182152
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;