import AiPlanner from "../components/AiPlanner";
import { useNavigate } from "react-router-dom";
import { createItinerary } from "../api/client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  async function handleSubmit(payload) {
    setError(null);
    try {
      console.log("Submitting payload:", payload);
      const itin = await createItinerary(payload);
      console.log("Received itinerary:", itin);
      navigate("/result", { state: { itinerary: itin } });
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || String(err));
    }
  }

  return (
    <div>
      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-500 text-white py-24 mb-10 overflow-hidden relative">
        {/* Animated background particles or effects could go here */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto px-4 text-center relative z-10"
        >
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-6xl font-extrabold mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
          >
            Meet Your AI Travel Genie 🧞‍♂️
          </motion.h1>
          <p className="text-xl mb-8 opacity-90 font-light max-w-2xl mx-auto">
            Experience the future of travel planning. Chat with our intelligent assistant to craft the perfect, personalized itinerary in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center space-x-6">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#plan"
              className="px-8 py-4 bg-white text-indigo-700 font-extrabold rounded-full shadow-[0_0_20px_rgba(255,255,255,0.6)] hover:bg-gray-100 transition"
            >
              Start Planning
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/places"
              className="px-8 py-4 border-2 border-white font-bold rounded-full hover:bg-white hover:text-indigo-700 transition shadow-lg"
            >
              Explore Destinations
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* SEARCH SECTION -> AI PLANNER WIZARD */}
      <div id="plan" className="max-w-5xl mx-auto px-4 pb-20 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <AiPlanner onSubmit={handleSubmit} />
          {error && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="mt-6 text-center text-lg font-bold text-red-500 bg-red-100/90 p-4 rounded-xl shadow-lg border border-red-200 backdrop-blur-md max-w-2xl mx-auto"
            >
              Oops! A glitch in the matrix: {error}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
