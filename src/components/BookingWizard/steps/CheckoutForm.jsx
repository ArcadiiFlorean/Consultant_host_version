import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

/**
 * Renders a Stripe checkout form for processing payments.
 * @param {object} props - The component props.
 * @param {number} [props.amount=2000] - The amount to charge in pence (e.g., 5000 for £50.00).
 * @param {object} props.formData - The complete booking data from the wizard.
 */
function CheckoutForm({ amount = 2000, formData }) {
  const stripe = useStripe();
  const elements = useElements();

  // State for cardholder name and postal code
  const [cardName, setCardName] = useState("");
  const [zip, setZip] = useState("");
  // State for loading and error messages
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  /**
   * Saves the booking to the database before processing payment
   */
  const saveBookingToDatabase = async () => {
    try {
      const bookingData = {
        ...formData,
        paymentMethod: "card" // Since we're using card payment
      };

      console.log("💾 Saving booking to database:", bookingData);

  const response = await fetch(
  "https://marina-cociug.com/api/bookings.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Eroare la salvarea rezervării");
      }

      console.log("✅ Booking saved successfully:", data);
      return data.data;
      
    } catch (error) {
      console.error("❌ Error saving booking:", error);
      throw error;
    }
  };

  /**
   * Handles the form submission for payment processing.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    setIsLoading(true); // Set loading state

    console.log("➡️ handleSubmit a fost apelat");

    // Ensure Stripe and Elements are loaded
    if (!stripe || !elements) {
      setMessage("❌ Stripe nu este încărcat încă. Te rugăm să aștepți...");
      setIsLoading(false);
      return;
    }

    try {
      // First, save the booking to the database
      console.log("💾 Saving booking to database...");
      const bookingResult = await saveBookingToDatabase();
      
      const cardElement = elements.getElement(CardElement);

      // Create a PaymentMethod with Stripe
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: cardName,
          address: zip ? { postal_code: zip } : {}, // Only include postal_code if zip is provided
        },
      });

      if (error) {
        setMessage("❌ " + error.message);
        setIsLoading(false);
        return;
      }

      console.log("🚀 Processing payment...");

      // Send the paymentMethodId to your backend
  const res = await fetch(
  "https://marina-cociug.com/api/charge.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            paymentMethodId: paymentMethod.id,
            amount,
            currency: "gbp", // ✅ Set currency to GBP for pounds
            bookingId: bookingResult.bookingId, // Include booking ID
          }),
        }
      );

      console.log("📡 Payment response status:", res.status);

      // Check if the response is OK before parsing JSON
      if (!res.ok) {
        console.error("❌ Payment HTTP Error:", res.status, res.statusText);
        const errorText = await res.text();
        console.error("❌ Payment error response body:", errorText);
        throw new Error(`Payment failed: HTTP ${res.status}`);
      }

      const paymentData = await res.json();
      console.log("✅ Payment response:", paymentData);

      if (paymentData.success) {
        setMessage("✅ Rezervarea și plata au fost procesate cu succes!");
        
        // Clear form fields
        setCardName("");
        setZip("");
        cardElement.clear();
        
        // Optionally redirect to a success page after a delay
        setTimeout(() => {
          window.location.href = "/booking-success";
        }, 2000);
        
      } else {
        setMessage(
          "❌ Eroare la plată: " +
            (paymentData.message || "A apărut o eroare necunoscută.")
        );
      }
      
    } catch (error) {
      console.error("🚨 Error during booking/payment process:", error);
      
      if (error.message.includes("fetch")) {
        setMessage(
          "❌ Eroare de conectare: Nu se poate conecta la server. Verifică dacă serverul rulează."
        );
      } else {
        setMessage("❌ Eroare: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading message if Stripe is not ready
  if (!stripe || !elements) {
    return (
      <div className="w-full max-w-md mx-auto space-y-4 p-4 sm:p-6 bg-white shadow-md rounded-lg">
        <div className="flex items-center justify-center py-6 sm:py-8">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-sm sm:text-base text-gray-600">Se încarcă sistemul de plată...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 sm:space-y-6 p-4 sm:p-0"
      >
        {/* Cardholder Name Input */}
        <div>
          <label
            htmlFor="card-name"
            className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2"
          >
            Nume de pe card
          </label>
          <input
            id="card-name"
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="ex: Maria Popescu"
            required
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl text-base sm:text-lg focus:ring-2 sm:focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 shadow-sm"
          />
        </div>

        {/* Postal Code Input (Optional) */}
        <div>
          <label
            htmlFor="zip-code"
            className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2"
          >
            Cod poștal (opțional)
          </label>
          <input
            id="zip-code"
            type="text"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="ex: SW1A 1AA"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl text-base sm:text-lg focus:ring-2 sm:focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 shadow-sm"
          />
        </div>

        {/* Stripe CardElement */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
            Detalii card
          </label>
          <div className="border-2 border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 bg-white focus-within:ring-2 sm:focus-within:ring-4 focus-within:ring-purple-100 focus-within:border-purple-500 transition-all duration-200 shadow-sm">
            <CardElement
              options={{
                hidePostalCode: true,
                style: {
                  base: {
                    fontSize: window.innerWidth < 640 ? "16px" : "18px",
                    color: "#374151",
                    fontFamily: "'Inter', 'Segoe UI', sans-serif",
                    "::placeholder": { 
                      color: "#9CA3AF" 
                    },
                  },
                  invalid: { 
                    color: "#EF4444" 
                  },
                  complete: {
                    color: "#059669"
                  }
                },
              }}
            />
          </div>
        </div>

        {/* Submission Button */}
        <button
          type="submit"
          disabled={!stripe || isLoading}
          className={`w-full px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl text-base sm:text-lg font-bold transition-all duration-200 transform ${
            !stripe || isLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 sm:mr-3"></div>
              <span className="text-sm sm:text-base">Se procesează plata...</span>
            </span>
          ) : (
            `Plătește £${(amount/100).toFixed(2)}`
          )}
        </button>

        {/* Display Messages (Success/Error) */}
        {message && (
          <div
            className={`p-3 sm:p-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium border-2 ${
              message.startsWith("✅")
                ? "bg-green-50 text-green-800 border-green-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            <div className="break-words">{message}</div>
          </div>
        )}
      </form>
    </div>
  );
}

export default CheckoutForm;