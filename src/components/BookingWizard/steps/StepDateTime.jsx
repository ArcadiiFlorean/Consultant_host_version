import React, { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";

function StepDateTime({ formData, setFormData, nextStep }) {
  const [availableDates, setAvailableDates] = useState([]);
  const [availableSlotsByDate, setAvailableSlotsByDate] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo(null);

      const apiUrl = "https://marina-cociug.com/admin/get_available_slots.php";
      console.log("Calling API:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
        cache: "no-store", // Forțează să nu folosească cache
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers.get("content-type"));

      // Enhanced debugging: log the actual response
      const responseText = await response.text();
      console.log("Raw response:", responseText.substring(0, 500));

      setDebugInfo({
        status: response.status,
        contentType: response.headers.get("content-type"),
        responsePreview: responseText.substring(0, 200),
        url: response.url,
      });

      if (!response.ok) {
        throw new Error(`Eroare server: HTTP ${response.status} - ${responseText.substring(0, 100)}`);
      }

      // Check if response is HTML
      if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
        throw new Error("Serverul returnează o pagină HTML în loc de JSON. Verificați configurarea API-ului și rutele.");
      }

      // Try to parse JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error("JSON Parse Error:", jsonError);
        throw new Error(`Răspuns invalid de la server. Nu este JSON valid: ${responseText.substring(0, 100)}...`);
      }

      console.log("API Response:", data);

      if (data.success) {
        if (!data.slots || !Array.isArray(data.slots)) {
          console.warn("Nu există slots în răspuns:", data);
          setAvailableSlotsByDate({});
          setAvailableDates([]);
          return;
        }

        const grouped = {};
        data.slots.forEach((slot) => {
          if (slot && slot.datetime_combined) {
            const [date, time] = slot.datetime_combined.split("T");
            if (date && time) {
              if (!grouped[date]) grouped[date] = [];
              grouped[date].push(time.slice(0, 5)); // HH:MM
            }
          }
        });

        setAvailableSlotsByDate(grouped);
        const uniqueDates = Object.keys(grouped).map((d) => new Date(d));
        setAvailableDates(uniqueDates);
        setError(null);

        console.log("Slots încărcate cu succes:", Object.keys(grouped).length, "zile disponibile");
      } else {
        const errorMessage = data.error || data.message || "Eroare necunoscută de la server";
        console.error("Eroare de la server:", errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error("Eroare completă la încărcarea sloturilor:", err);

      let userMessage = "Nu s-au putut încărca sloturile disponibile.";

      if (err.message.includes("Failed to fetch")) {
        userMessage = "Problemă de conexiune la server. Verificați conexiunea la internet sau încercați mai târziu.";
      } else if (err.message.includes("No routes matched") || err.message.includes("Not Found")) {
        userMessage = "API-ul nu a fost găsit. Verificați URL-ul sau contactați administratorul.";
      } else if (err.message.includes("HTML") || err.message.includes("DOCTYPE")) {
        userMessage = "Serverul returnează o pagină web în loc de date. Verificați configurarea API-ului.";
      } else if (err.message.includes("JSON") || err.message.includes("Unexpected token")) {
        userMessage = "Date corupte primite de la server. Format invalid.";
      } else if (err.message.includes("CORS")) {
        userMessage = "Problemă de securitate CORS. Contactați administratorul.";
      } else if (err.message.startsWith("Eroare server: HTTP 404")) {
        userMessage = "API-ul nu există la adresa specificată (404 Not Found).";
      } else if (err.message.startsWith("Eroare server: HTTP 500")) {
        userMessage = "Eroare internă a serverului (500). Contactați administratorul.";
      }

      setError(userMessage + " Detalii: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  const handleDateChange = ([date]) => {
    if (!date) return;
    const slot_date = date.toLocaleDateString("sv-SE");
    setFormData((prev) => ({
      ...prev,
      date: slot_date,
      hour: "",
    }));
  };

  const handleTimeChange = (selectedTime) => {
    setFormData((prev) => ({
      ...prev,
      hour: selectedTime,
    }));
  };

  const verifySlotAvailability = async () => {
    if (!formData.date || !formData.hour) return true;

    try {
      const timeWithSeconds = formData.hour.includes(":00") ? formData.hour : formData.hour + ":00";
      const apiUrl = `/admin/check_slot_availability.php?date=${formData.date}&time=${timeWithSeconds}`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        mode: "cors",
        cache: "no-cache",
      });

      const responseText = await response.text();
      
      if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
        console.warn("Slot verification API also returning HTML");
        return true; // Continue if verification API is also broken
      }

      const data = JSON.parse(responseText);

      if (!data.available) {
        setError("⚠️ Slotul selectat nu mai este disponibil. Vă rugăm să alegeți altul.");
        fetchAvailableSlots();
        return false;
      }

      return true;
    } catch (err) {
      console.warn("Nu s-a putut verifica disponibilitatea:", err);
      return true;
    }
  };

  const handleNext = async () => {
    if (!isValid) return;
    const isStillAvailable = await verifySlotAvailability();
    if (isStillAvailable) {
      nextStep();
    }
  };

  const isValid = formData.date && formData.hour;

  const formatDateDisplay = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ro-RO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50 p-4 sm:p-6 flex items-center justify-center relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-400/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-green-400/10 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-teal-400/10 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-lime-400/10 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 bg-white/95 backdrop-blur-sm p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl max-w-4xl w-full border border-white/30">
        {/* Enhanced Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl mb-6 shadow-xl">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Selectează
            <span className="relative inline-block mx-2">
              <span className="bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
                data și ora
              </span>
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 to-green-700 rounded-full"></div>
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Alege un moment potrivit pentru consultația ta de alăptare
          </p>
        </div>

        {/* Debug Information Panel (only when there's debug info) */}
        {debugInfo && error && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-sm">
            <h4 className="font-semibold text-gray-700 mb-2">🔍 Informații debugging:</h4>
            <div className="space-y-1 text-gray-600">
              <p><strong>Status:</strong> {debugInfo.status}</p>
              <p><strong>Content-Type:</strong> {debugInfo.contentType || 'N/A'}</p>
              <p><strong>URL:</strong> {debugInfo.url}</p>
              <p><strong>Response preview:</strong></p>
              <code className="block bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                {debugInfo.responsePreview}...
              </code>
            </div>
          </div>
        )}

        {/* Enhanced Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-rose-400 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-red-800 mb-2">A apărut o problemă</h4>
                <p className="text-red-700 mb-4">{error}</p>
                <div className="space-y-2">
                  <button
                    onClick={fetchAvailableSlots}
                    className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mr-3"
                  >
                    <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reîncarcă sloturile
                  </button>
                  <button
                    onClick={() => window.open('https://marina-cociug.com/admin/get_available_slots.php', '_blank')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Testează API direct
                  </button>
                </div>
                <div className="mt-4 p-3 bg-white/50 rounded-lg">
                  <p className="text-sm text-red-600">
                    <strong>Posibile soluții:</strong>
                  </p>
                  <ul className="text-sm text-red-600 mt-2 space-y-1">
                    <li>• Verificați dacă fișierul get_available_slots.php există pe server</li>
                    <li>• Asigurați-vă că API-ul returnează JSON valid, nu HTML</li>
                    <li>• Verificați configurarea CORS pe server</li>
                    <li>• Testați API-ul direct în browser pentru a vedea răspunsul</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Loading State */}
        {loading ? (
          <div className="text-center py-16">
            <div className="relative mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl shadow-2xl flex items-center justify-center mb-6 mx-auto animate-pulse">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-bounce"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Se încarcă sloturile disponibile...</h3>
            <p className="text-gray-600 mb-6">Verificăm programul și îți pregătim opțiunile</p>
            <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full animate-pulse" style={{ width: "65%" }}></div>
            </div>
          </div>
        ) : availableDates.length === 0 && !error ? (
          /* Enhanced No Slots Available */
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-4">Nu sunt sloturi disponibile momentan</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Ne pare rău, dar toate sloturile sunt ocupate. Te rugăm să revii mai târziu.
            </p>
            <button
              onClick={fetchAvailableSlots}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reîncarcă
            </button>
          </div>
        ) : availableDates.length > 0 ? (
          /* Enhanced Main Content */
          <div className="space-y-8 sm:space-y-10">
            {/* Enhanced Date Selection */}
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Alege data</h3>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <Flatpickr
                  options={{
                    enable: availableDates,
                    dateFormat: "Y-m-d",
                    minDate: "today",
                    defaultDate: formData.date || null,
                    static: true,
                    locale: { firstDayOfWeek: 1 },
                  }}
                  onChange={handleDateChange}
                  className="w-full border-2 border-blue-200 p-4 rounded-xl text-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white shadow-lg"
                  placeholder="Selectează data dorită"
                />
                <p className="text-sm text-blue-600 mt-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Doar datele cu sloturi disponibile pot fi selectate
                </p>
              </div>
            </div>

            {/* Enhanced Time Selection */}
            {formData.date && (
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Alege ora</h3>
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                    {(availableSlotsByDate[formData.date] || []).map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeChange(time)}
                        className={`group relative p-3 sm:p-4 rounded-xl text-center font-semibold transition-all duration-300 transform hover:-translate-y-1 ${
                          formData.hour === time
                            ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-xl scale-105"
                            : "bg-white border-2 border-gray-200 text-gray-700 hover:border-emerald-300 hover:shadow-lg"
                        }`}
                      >
                        <div className="text-base sm:text-lg font-bold">{time}</div>

                        {/* Selection indicator */}
                        {formData.hour === time && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-emerald-600 mt-4 text-center">
                    {availableSlotsByDate[formData.date]?.length || 0} sloturi disponibile pentru această dată
                  </p>
                </div>
              </div>
            )}

            {/* Enhanced Selected Slot Display */}
            {formData.date && formData.hour && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 sm:p-8 shadow-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-green-800 mb-2">🎉 Data și ora au fost selectate</h3>
                    <div className="text-green-700">
                      <p className="text-lg font-semibold mb-1">📅 {formatDateDisplay(formData.date)}</p>
                      <p className="text-lg font-semibold">🕐 Ora {formData.hour}</p>
                    </div>
                    <p className="text-sm text-green-600 mt-3 bg-white/50 rounded-lg px-3 py-2">
                      ✨ Confirmarea finală se va face după completarea formularului și plata serviciului.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Validation Message */}
            {!isValid && formData.date && (
              <div className="text-center">
                <div className="inline-flex items-center px-6 py-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl shadow-lg">
                  <svg className="w-6 h-6 text-amber-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-amber-700 font-medium">Te rugăm să selectezi și o oră disponibilă</p>
                </div>
              </div>
            )}

            {/* Enhanced Continue Button */}
            <button
              onClick={handleNext}
              disabled={!isValid}
              className={`w-full px-8 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-bold transition-all duration-300 transform shadow-xl ${
                isValid
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white hover:shadow-2xl hover:-translate-y-1"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isValid ? (
                <span className="flex items-center justify-center">
                  Continuă la informații
                  <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              ) : (
                "Selectează un slot pentru a continua"
              )}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default StepDateTime;