import React, { useState } from "react";
import { User, Mail, Phone, AlertCircle, CheckCircle, Shield, ArrowLeft, ArrowRight } from "lucide-react";

function StepUserInfo({ formData, setFormData, nextStep, prevStep }) {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Funcții de validare
  const validateField = (name, value) => {
    const validationErrors = {};

    switch (name) {
      case "firstName":
        if (!value || value.trim().length < 2) {
          validationErrors.firstName =
            "Prenumele trebuie să aibă cel puțin 2 caractere";
        } else if (!/^[a-zA-ZăâîșțĂÂÎȘȚ\s-]+$/.test(value)) {
          validationErrors.firstName = "Prenumele conține caractere nevalide";
        }
        break;

      case "lastName":
        if (!value || value.trim().length < 2) {
          validationErrors.lastName =
            "Numele trebuie să aibă cel puțin 2 caractere";
        } else if (!/^[a-zA-ZăâîșțĂÂÎȘȚ\s-]+$/.test(value)) {
          validationErrors.lastName = "Numele conține caractere nevalide";
        }
        break;

      case "email":
        if (!value) {
          validationErrors.email = "Email-ul este obligatoriu";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          validationErrors.email = "Formatul email-ului nu este valid";
        }
        break;

      case "phone":
        if (!value) {
          validationErrors.phone = "Telefonul este obligatoriu";
        } else {
          // Remove spaces, dashes, parentheses
          const cleanPhone = value.replace(/[\s\-\(\)]/g, "");

          // Validare internațională: începe opțional cu + și conține 8-20 cifre
          if (!/^\+?[0-9]{8,20}$/.test(cleanPhone)) {
            validationErrors.phone =
              "Numărul de telefon internațional nu este valid";
          }
        }
        break;

      default:
        break;
    }

    return validationErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Actualizăm form data
    setFormData({ ...formData, [name]: value });

    // Validăm câmpul dacă a fost atins
    if (touched[name]) {
      const fieldErrors = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        ...fieldErrors,
        ...(Object.keys(fieldErrors).length === 0 && { [name]: undefined }),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    // Marcăm câmpul ca atins
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validăm câmpul
    const fieldErrors = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      ...fieldErrors,
      ...(Object.keys(fieldErrors).length === 0 && { [name]: undefined }),
    }));
  };

  const validateAllFields = () => {
    const allErrors = {};
    const fields = ["firstName", "lastName", "email", "phone"];

    fields.forEach((field) => {
      const fieldErrors = validateField(field, formData[field] || "");
      Object.assign(allErrors, fieldErrors);
    });

    setErrors(allErrors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
    });

    return Object.keys(allErrors).length === 0;
  };

  const handleNext = () => {
    if (validateAllFields()) {
      nextStep();
    }
  };

  // Helper pentru formatarea automată a telefonului
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");

    if (cleaned.startsWith("40")) {
      // +40 format
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, "+$1 $2 $3 $4");
    } else if (cleaned.startsWith("0")) {
      // 0xxx format
      return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{3})/, "$1$2 $3 $4");
    }

    return value;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const formatted = formatPhoneNumber(value);

    setFormData({ ...formData, phone: formatted });

    if (touched.phone) {
      const fieldErrors = validateField("phone", value);
      setErrors((prev) => ({
        ...prev,
        ...fieldErrors,
        ...(Object.keys(fieldErrors).length === 0 && { phone: undefined }),
      }));
    }
  };

  // Check dacă un câmp este valid
  const isFieldValid = (fieldName) => {
    return touched[fieldName] && !errors[fieldName] && formData[fieldName];
  };

  const isFormValid = () => {
    return ["firstName", "lastName", "email", "phone"].every(
      (field) => formData[field] && !errors[field]
    );
  };

  const getFieldBorderClass = (fieldName) => {
    if (errors[fieldName]) {
      return "border-red-300 bg-red-50/30 focus:ring-red-100 focus:border-red-400";
    }
    if (isFieldValid(fieldName)) {
      return "border-emerald-300 bg-emerald-50/30 focus:ring-emerald-100 focus:border-emerald-400";
    }
    return "border-gray-200 bg-white/70 focus:ring-blue-100 focus:border-blue-400 hover:border-gray-300";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-4 sm:p-6 flex items-center justify-center relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-400/10 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-purple-400/10 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-pink-400/10 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 bg-white/95 backdrop-blur-sm p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl max-w-4xl w-full border border-white/30">
        
        {/* Enhanced Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-xl">
            <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Spune-ne despre
            <span className="relative inline-block mx-2">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                tine
              </span>
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full"></div>
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Completează datele pentru a finaliza rezervarea consultației de alăptare
          </p>
        </div>

        <div className="space-y-8 sm:space-y-10">
          {/* Name Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Prenume */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <label className="text-sm sm:text-base font-bold text-gray-800">
                  Prenume *
                </label>
              </div>
              <div className="relative group">
                <input
                  name="firstName"
                  type="text"
                  placeholder="Prenumele tău"
                  value={formData.firstName || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-4 sm:pl-5 pr-12 sm:pr-14 py-4 sm:py-5 border-2 rounded-2xl text-base sm:text-lg transition-all duration-300 shadow-lg focus:shadow-xl ${getFieldBorderClass("firstName")}`}
                />
                <div className="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2">
                  {isFieldValid("firstName") && (
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {errors.firstName && (
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <AlertCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
              {errors.firstName && (
                <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-4 shadow-lg">
                  <p className="text-sm text-red-700 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="break-words">{errors.firstName}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Nume */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <label className="text-sm sm:text-base font-bold text-gray-800">
                  Nume *
                </label>
              </div>
              <div className="relative group">
                <input
                  name="lastName"
                  type="text"
                  placeholder="Numele tău de familie"
                  value={formData.lastName || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-4 sm:pl-5 pr-12 sm:pr-14 py-4 sm:py-5 border-2 rounded-2xl text-base sm:text-lg transition-all duration-300 shadow-lg focus:shadow-xl ${getFieldBorderClass("lastName")}`}
                />
                <div className="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2">
                  {isFieldValid("lastName") && (
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {errors.lastName && (
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <AlertCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
              {errors.lastName && (
                <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-4 shadow-lg">
                  <p className="text-sm text-red-700 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="break-words">{errors.lastName}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <label className="text-sm sm:text-base font-bold text-gray-800">
                Adresa de email *
              </label>
            </div>
            <div className="relative group">
              <div className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2">
                <Mail className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200 ${
                  isFieldValid("email") ? "text-emerald-500" : 
                  errors.email ? "text-red-500" : "text-gray-400"
                }`} />
              </div>
              <input
                name="email"
                type="email"
                placeholder="exemplu@email.com"
                value={formData.email || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full pl-12 sm:pl-14 pr-12 sm:pr-14 py-4 sm:py-5 border-2 rounded-2xl text-base sm:text-lg transition-all duration-300 shadow-lg focus:shadow-xl ${getFieldBorderClass("email")}`}
              />
              <div className="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2">
                {isFieldValid("email") && (
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
                {errors.email && (
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>
            {errors.email && (
              <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-4 shadow-lg">
                <p className="text-sm text-red-700 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="break-words">{errors.email}</span>
                </p>
              </div>
            )}
          </div>

          {/* Telefon */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <label className="text-sm sm:text-base font-bold text-gray-800">
                Număr de telefon *
              </label>
            </div>
            <div className="relative group">
              <div className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2">
                <Phone className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200 ${
                  isFieldValid("phone") ? "text-emerald-500" : 
                  errors.phone ? "text-red-500" : "text-gray-400"
                }`} />
              </div>
              <input
                name="phone"
                type="tel"
                placeholder="0712 345 678"
                value={formData.phone || ""}
                onChange={handlePhoneChange}
                onBlur={handleBlur}
                className={`w-full pl-12 sm:pl-14 pr-12 sm:pr-14 py-4 sm:py-5 border-2 rounded-2xl text-base sm:text-lg transition-all duration-300 shadow-lg focus:shadow-xl ${getFieldBorderClass("phone")}`}
              />
              <div className="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2">
                {isFieldValid("phone") && (
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
                {errors.phone && (
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>
            {errors.phone && (
              <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-4 shadow-lg">
                <p className="text-sm text-red-700 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="break-words">{errors.phone}</span>
                </p>
              </div>
            )}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-4 shadow-sm">
              <p className="text-xs sm:text-sm text-gray-600 flex items-center">
                <span className="text-lg mr-2">💡</span>
                Formatul acceptat: 0712345678, +40712345678
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Privacy Notice */}
        <div className="mt-8 sm:mt-10 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0 shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-bold text-blue-800 mb-2">
                🔒 Protecția datelor personale
              </h3>
              <p className="text-sm sm:text-base text-blue-700 leading-relaxed">
                Informațiile tale vor fi folosite doar pentru procesarea rezervării 
                și nu vor fi partajate cu terți. Respectăm pe deplin GDPR și toate datele sunt criptate.
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-between gap-4 sm:gap-6">
          <button
            onClick={prevStep}
            className="group w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-5 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 font-bold shadow-lg hover:shadow-xl flex items-center justify-center text-base sm:text-lg transform hover:-translate-y-0.5 order-2 sm:order-1"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Înapoi la dată
          </button>

          <button
            onClick={handleNext}
            disabled={!isFormValid()}
            className={`group w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center shadow-xl text-base sm:text-lg transform order-1 sm:order-2 ${
              isFormValid()
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white hover:shadow-2xl hover:-translate-y-1"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isFormValid() ? (
              <>
                <span className="hidden sm:inline">Continuă la plată</span>
                <span className="sm:hidden">Continuă</span>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Completează toate câmpurile</span>
                <span className="sm:hidden">Completează câmpurile</span>
              </>
            )}
          </button>
        </div>

        {/* Enhanced Progress Indicator */}
        <div className="mt-8 sm:mt-10 text-center">
          <div className="flex justify-center items-center space-x-3 sm:space-x-4 mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-xl">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="w-12 sm:w-16 h-1 sm:h-1.5 bg-gradient-to-r from-emerald-500 to-green-600 mx-2 rounded-full"></div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-xl">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="w-12 sm:w-16 h-1 sm:h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 mx-2 rounded-full"></div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl animate-pulse">
              <span className="text-white font-bold text-sm sm:text-base">3</span>
            </div>
            <div className="w-12 sm:w-16 h-1 sm:h-1.5 bg-gray-300 mx-2 rounded-full"></div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-500 font-bold text-sm sm:text-base">4</span>
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-600 font-semibold">
            Pasul 3 din 4 - Informații personale
          </p>
          <div className="mt-2 flex justify-center">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full px-4 py-2">
              <p className="text-xs text-blue-600">
                🎉 Aproape gata! Încă un pas și consultația ta va fi rezervată
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepUserInfo;