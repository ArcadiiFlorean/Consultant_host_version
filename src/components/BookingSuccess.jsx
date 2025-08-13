import React from 'react';

function BookingSuccess() {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg 
            className="w-12 h-12 text-green-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Rezervarea confirmată!
        </h1>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          Plata dumneavoastră a fost procesată cu succes. 
          Veți primi un email de confirmare în scurt timp cu toate detaliile consultației.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 text-sm">
            <strong>Vă mulțumim pentru încrederea acordată!</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGoHome}
            className="w-full bg-[#4a584b] text-white py-3 px-6 rounded-lg hover:bg-[#3a4739] transition-colors font-medium"
          >
            Înapoi la pagina principală
          </button>
          
          <button
            onClick={() => window.print()}
            className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Printează confirmarea
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Pentru întrebări, ne puteți contacta la{' '}
            <a href="mailto:info@consultant.ro" className="text-[#4a584b] underline">
              info@consultant.ro
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookingSuccess;