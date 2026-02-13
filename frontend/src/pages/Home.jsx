import SearchForm from "../components/SearchForm";
import PaymentModal from "../components/PaymentModal";
import { useNavigate } from "react-router-dom";
import { createItinerary, getItineraryOptions } from "../api/client";
import ItineraryOptionsModal from "../components/ItineraryOptionsModal";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [pendingPayload, setPendingPayload] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [options, setOptions] = useState([]);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [originalRequest, setOriginalRequest] = useState(null);

  async function handleSubmit(payload) {
    console.log('handleSubmit payload', payload);
    // compute payment amount and show payment modal before generating itinerary
    setError(null);
    setLoading(true);
    try {
      // request a few itinerary preview options from backend
      setOriginalRequest(payload);
      const resp = await getItineraryOptions(payload);
      const opts = resp.options || [];
      if (!opts.length) throw new Error('No itinerary options returned');
      setOptions(opts);
      setShowOptionsModal(true);
      setLoading(false);
    } catch (err) {
      setError(String(err));
      setLoading(false);
    }
  }
  function handleChooseOption(option) {
    // attach chosen preview to payload so server can persist the final itinerary after payment
      const chosenPayload = { ...(originalRequest || {}) };
    // if handleSubmit invoked this before options were fetched, use the original payload passed to handleSubmit
    // we'll store the full preview under `final_itinerary`
    const final_itin = option;
    // compute amount from preview estimated cost (round up)
    const amount = Math.max(0, Math.round(final_itin.estimated_total_cost));
    setPaymentAmount(amount);
    setPendingPayload({ payload: { ...chosenPayload, final_itinerary: final_itin }, breakdown: { base: 0 } });
    setShowOptionsModal(false);
    setShowPaymentModal(true);
  }

  async function handleModalPay(serverItinerary) {
    setShowPaymentModal(false);
    if (!pendingPayload) return;
    setLoading(true);
    try {
      if (serverItinerary && serverItinerary.id) {
        navigate("/result", { state: { itinerary: serverItinerary } });
      } else {
        const itin = await createItinerary(pendingPayload.payload);
        navigate("/result", { state: { itinerary: itin } });
      }
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
      setPendingPayload(null);
    }
  }

  return (
    <div>
      {/* HERO SECTION */}
      <section className="hero-bg text-white py-24 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto px-4 text-center"
        >
          <div className="hero-card card-dark p-10 rounded-3xl mx-auto max-w-4xl">
            <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
              Discover India on a Budget
            </h1>
            <p className="text-lg mb-6 opacity-90 text-gray-300">
              AI-powered itinerary planning for smart, affordable travel.
            </p>

            {/* CTA Buttons */}
            <div className="flex justify-center space-x-4">
              <a
                href="#plan"
                className="px-6 py-3 rounded-full shadow-lg orange-btn font-semibold transition"
              >
                Plan Your Trip
              </a>
              <a
                href="/places"
                className="px-6 py-3 rounded-full border border-[rgba(255,255,255,0.06)] font-semibold text-gray-200 hover:bg-[rgba(255,255,255,0.02)] transition"
              >
                Explore Places
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SEARCH SECTION */}
      <div id="plan" className="max-w-5xl mx-auto px-4 pb-10">
        <SearchForm onSubmit={handleSubmit} />
        {showPaymentModal && (
          <PaymentModal
            amount={paymentAmount}
            breakdown={pendingPayload?.breakdown}
            payload={pendingPayload?.payload}
            onClose={() => setShowPaymentModal(false)}
            onSuccess={handleModalPay}
          />
        )}
        {showOptionsModal && (
          <ItineraryOptionsModal options={options} onClose={() => setShowOptionsModal(false)} onChoose={handleChooseOption} />
        )}
        {loading && (
          <div className="mt-6 text-center text-lg font-semibold text-blue-600">
            Generating your perfect itinerary...
          </div>
        )}
        {error && (
          <div className="mt-6 text-center text-lg font-semibold text-red-600">
            Error: {error}
          </div>
        )}
        {/* Payment handled via Stripe Checkout redirect */}
      </div>
    </div>
  );
}
