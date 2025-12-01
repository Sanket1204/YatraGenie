import SearchForm from "../components/SearchForm";
import { useNavigate } from "react-router-dom";
import { createItinerary } from "../api/client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(payload) {
    setLoading(true);
    setError(null);
    try {
      console.log("Submitting payload:", payload);
      const itin = await createItinerary(payload);
      console.log("Received itinerary:", itin);
      navigate("/result", { state: { itinerary: itin } });
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-500 text-white py-24 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto px-4 text-center"
        >
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
            Discover India on a Budget
          </h1>
          <p className="text-lg mb-6 opacity-90">
            AI-powered itinerary planning for smart, affordable travel.
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center space-x-4">
            <a
              href="#plan"
              className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-full shadow-lg hover:bg-gray-200 transition"
            >
              Plan Your Trip
            </a>
            <a
              href="/places"
              className="px-6 py-3 border border-white font-semibold rounded-full hover:bg-white hover:text-blue-700 transition"
            >
              Explore Places
            </a>
          </div>
        </motion.div>
      </section>

      {/* SEARCH SECTION */}
      <div id="plan" className="max-w-5xl mx-auto px-4 pb-10">
        <SearchForm onSubmit={handleSubmit} />
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
      </div>
    </div>
  );
}
