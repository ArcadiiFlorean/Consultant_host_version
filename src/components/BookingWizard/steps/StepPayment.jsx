import React from "react";
import CheckoutForm from "./CheckoutForm";
import { CreditCard, Calendar, Clock, User, Shield, ArrowLeft, CheckCircle } from "lucide-react";

function StepPayment({ formData, setFormData, prevStep }) {
  // Format date for display
  const formatDateDisplay = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ro-RO', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-3 sm:p-6 flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 sm:p-6 lg:p-8 text-white">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
            Finalizează plata
          </h2>
          <p className="text-center text-purple-100 text-base sm:text-lg">
            Ultimul pas pentru confirmarea rezervării tale
          </p>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Booking Summary */}
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                    <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                    Rezumatul rezervării
                  </h3>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {/* Service */}
                  <div className="flex items-start p-3 sm:p-4 bg-white/60 rounded-lg sm:rounded-xl border border-purple-100">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                      <span className="text-white font-bold text-xs sm:text-sm">S</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Serviciu selectat</p>
                      <p className="font-semibold text-gray-800 text-base sm:text-lg break-words">
                        {formData.serviceName}
                      </p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    <div className="flex items-start p-3 sm:p-4 bg-white/60 rounded-lg sm:rounded-xl border border-purple-100">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Data</p>
                        <p className="font-semibold text-gray-800 text-sm sm:text-base break-words">
                          {formatDateDisplay(formData.date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start p-3 sm:p-4 bg-white/60 rounded-lg sm:rounded-xl border border-purple-100">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Ora</p>
                        <p className="font-semibold text-gray-800 text-sm sm:text-base">
                          {formData.hour}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Client Info */}
                  <div className="flex items-start p-3 sm:p-4 bg-white/60 rounded-lg sm:rounded-xl border border-purple-100">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Client</p>
                      <p className="font-semibold text-gray-800 text-base sm:text-lg break-words">
                        {formData.firstName} {formData.lastName}
                      </p>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1 space-y-1 sm:space-y-0">
                        <p className="break-all">{formData.email}</p>
                        <p className="sm:inline sm:ml-2">{formData.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg sm:rounded-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs sm:text-sm text-green-600 mb-1">Total de plată</p>
                      <p className="text-2xl sm:text-3xl font-bold text-green-700">
                        {formData.servicePrice} £
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm sm:text-base">£</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mt-0.5 mr-2 sm:mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1 text-sm sm:text-base">
                      Plată securizată
                    </h4>
                    <p className="text-xs sm:text-sm text-blue-700">
                      Datele tale sunt protejate prin criptare SSL. Nu stocăm informații 
                      despre cardul tău bancar.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white border-2 border-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                    <CreditCard className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                    Detalii plată
                  </h3>
                </div>

                <CheckoutForm 
                  amount={Math.round(formData.servicePrice * 100)} // Convert to cents
                  formData={formData}
                />
              </div>

              {/* Payment Methods */}
              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 font-medium">
                  Metode de plată acceptate:
                </p>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
                  <div className="bg-white px-2 sm:px-3 py-2 rounded-lg border border-gray-200 text-xs sm:text-sm font-medium text-gray-700 text-center">
                    💳 Visa
                  </div>
                  <div className="bg-white px-2 sm:px-3 py-2 rounded-lg border border-gray-200 text-xs sm:text-sm font-medium text-gray-700 text-center">
                    💳 Mastercard
                  </div>
                  <div className="bg-white px-2 sm:px-3 py-2 rounded-lg border border-gray-200 text-xs sm:text-sm font-medium text-gray-700 text-center">
                    🏦 Maestro
                  </div>
                  <div className="bg-white px-2 sm:px-3 py-2 rounded-lg border border-gray-200 text-xs sm:text-sm font-medium text-gray-700 text-center">
                    💰 American Express
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={prevStep}
              className="w-full sm:w-auto group px-4 sm:px-6 py-3 sm:py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-lg sm:rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 font-semibold shadow-sm hover:shadow-md flex items-center justify-center sm:justify-start text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Înapoi la informații
            </button>

            {/* Progress Indicator */}
            <div className="text-center order-first sm:order-none">
              <div className="flex justify-center items-center space-x-2 sm:space-x-3 mb-2">
                <div className="flex items-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                    <CheckCircle className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="w-8 sm:w-12 h-0.5 sm:h-1 bg-emerald-500 mx-1"></div>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                    <CheckCircle className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="w-8 sm:w-12 h-0.5 sm:h-1 bg-gradient-to-r from-purple-500 to-pink-600 mx-1"></div>
                </div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  <span className="text-white font-bold text-xs sm:text-sm">3</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                Pasul 3 din 3 - Plată securizată
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 sm:mt-8 text-center">
            <div className="inline-flex items-start sm:items-center px-3 sm:px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <span className="text-yellow-600 mr-2 flex-shrink-0">⚡</span>
              <p className="text-xs sm:text-sm text-yellow-800 text-left sm:text-center">
                <span className="font-medium">Confirmare instantanee:</span> 
                <span className="block sm:inline"> Vei primi confirmarea pe email imediat după plată</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepPayment;