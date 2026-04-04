import React, { useState } from 'react';
import { useRazorpay } from 'react-razorpay';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCreditCard, FaCheckCircle, FaSpinner } from 'react-icons/fa';

export default function PaymentWizard({ amount, onSuccess }) {
  const { error, isLoading, Razorpay } = useRazorpay();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const API_URL = import.meta.env.VITE_API_URL || "https://yatragenie-backend.onrender.com";

  const handlePayment = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      // 1. Create order on backend
      const res = await fetch(`${API_URL}/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount, currency: "INR", receipt: "rcptid_11" })
      });
      if (!res.ok) throw new Error("Could not create backend order");

      const orderData = await res.json();

      // 2. Setup Razorpay Options
      const options = {
        key: "rzp_test_SYy7u1mZ0SjXdd", // Ideally from env var, using dummy structure here matching backend fallback
        amount: orderData.amount, // amount in paise
        currency: orderData.currency,
        name: "YatraGenie",
        description: "Premium Itinerary Booking",
        image: "https://your-logo-url.com/logo.png",
        order_id: orderData.id,
        handler: async (response) => {
          try {
            // 3. Verify Payment Signature
            const verifyRes = await fetch(`${API_URL}/payment/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            });
            if (verifyRes.ok) {
              setSuccess(true);
              if (onSuccess) onSuccess();
            } else {
              setErrorMsg("Payment verification failed.");
            }
          } catch (err) {
            setErrorMsg("Payment verification error.");
          }
        },
        prefill: {
          name: "John Doe",
          email: "johndoe@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3b82f6", // tailwind blue-500
        },
      };

      const rzpay = new Razorpay(options);

      rzpay.on("payment.failed", function (response) {
        setErrorMsg(`Payment Failed: ${response.error.description}`);
      });

      rzpay.open();

    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to initialize payment gateway.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-5 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 w-full max-w-sm mx-auto flex flex-col items-center">
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
        Complete Your Booking
      </h3>
      <p className="text-slate-600 mb-6 text-sm text-center">
        Securely pay for your custom premium itinerary
      </p>

      {success ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center text-green-600"
        >
          <FaCheckCircle size={48} className="mb-2" />
          <span className="font-semibold">Payment Successful!</span>
        </motion.div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePayment}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {loading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaCreditCard />
          )}
          {loading ? "Processing..." : `Pay ₹${amount}`}
        </motion.button>
      )}

      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 text-sm text-red-500 text-center w-full p-2 bg-red-50 rounded-lg border border-red-100"
          >
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
