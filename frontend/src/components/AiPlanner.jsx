import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave, FaUserFriends, FaHeart, FaMagic } from "react-icons/fa";

const PREF_OPTIONS = [
  { id: "beach", label: "Beach 🏖️" },
  { id: "nature", label: "Nature 🌲" },
  { id: "temple", label: "Temple 🛕" },
  { id: "heritage", label: "Heritage 🏛️" },
  { id: "nightlife", label: "Nightlife 🪩" },
  { id: "food", label: "Food 🍛" },
];



export default function AiPlanner({ onSubmit }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    originCity: "",
    destinationCity: "",
    days: 3,
    budget: 8000,
    travelerType: "solo",
    preferences: [],
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const updateForm = (key, value) => setFormData({ ...formData, [key]: value });

  const togglePref = (pref) => {
    const current = formData.preferences;
    updateForm(
      "preferences",
      current.includes(pref) ? current.filter((p) => p !== pref) : [...current, pref]
    );
  };

  const handleNext = () => {
    if (step === 1 && !formData.originCity) return;
    if (step === 2 && !formData.destinationCity) return;
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate a brief AI thinking delay for UX
    setTimeout(() => {
      onSubmit({
        origin_city: formData.originCity,
        destination_city: formData.destinationCity,
        days: Number(formData.days),
        budget_total: Number(formData.budget),
        traveler_type: formData.travelerType,
        preferences: formData.preferences,
      });
      // the parent component will navigate away, so no need to reset here
    }, 1500);
  };

  const slideVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white/20 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-7xl mb-6 text-pink-500"
        >
          <FaMagic />
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-2 animate-pulse">
          Genie is weaving your perfect itinerary...
        </h3>
        <p className="text-white/80">Analyzing best locations, optimizing routes & adjusting budgets.</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900/80 via-purple-900/80 to-pink-900/80 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl w-full max-w-2xl mx-auto p-8 text-white">
      {/* Progress Bar */}
      <div className="flex justify-between items-center mb-8">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex-1 flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                step >= s ? "bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.6)]" : "bg-white/20 text-white/50"
              }`}
            >
              {s}
            </div>
            {s < 5 && (
              <div
                className={`flex-1 h-1 mx-2 rounded transition-colors duration-300 ${
                  step > s ? "bg-pink-500/70" : "bg-white/10"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="min-h-[250px] relative">
        <AnimatePresence mode="wait">
          {/* STEP 1: Origin */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-extrabold flex items-center gap-3">
                <FaMapMarkerAlt className="text-pink-400" /> Let's start! Where are you flying from?
              </h2>
              <input
                type="text"
                autoFocus
                placeholder="E.g., Mumbai, Delhi, Goa..."
                value={formData.originCity}
                onChange={(e) => updateForm("originCity", e.target.value)}
                className="w-full bg-white/10 border-2 border-white/20 rounded-2xl py-4 px-6 text-xl text-white placeholder-white/40 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all"
                onKeyDown={(e) => e.key === "Enter" && handleNext()}
              />
            </motion.div>
          )}

          {/* STEP 2: Destination */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-extrabold flex items-center gap-3">
                <FaMapMarkerAlt className="text-pink-400" /> Where is your dream vacation?
              </h2>
              <p className="text-white/70">Our AI uses live Google search data to build your ideal plan!</p>
              <input
                type="text"
                autoFocus
                placeholder="E.g., Goa, Uttarakhand, Kerala..."
                value={formData.destinationCity}
                onChange={(e) => updateForm("destinationCity", e.target.value)}
                className="w-full bg-white/10 border-2 border-white/20 rounded-2xl py-4 px-6 text-xl text-white placeholder-white/40 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all font-semibold"
                onKeyDown={(e) => e.key === "Enter" && handleNext()}
              />
            </motion.div>
          )}

          {/* STEP 3: Duration & Budget */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-extrabold flex items-center gap-3">
                <FaCalendarAlt className="text-pink-400" /> Trip Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-white/70 mb-2 uppercase tracking-wider">How many days?</label>
                  <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-2 border border-white/20">
                    <button onClick={() => updateForm("days", Math.max(1, formData.days - 1))} className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 text-2xl font-bold flex items-center justify-center transition-colors">-</button>
                    <div className="flex-1 text-center text-2xl font-bold">{formData.days}</div>
                    <button onClick={() => updateForm("days", formData.days + 1)} className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 text-2xl font-bold flex items-center justify-center transition-colors">+</button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white/70 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <FaMoneyBillWave className="text-green-400" /> Total Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => updateForm("budget", e.target.value)}
                    className="w-full bg-white/10 border-2 border-white/20 rounded-2xl py-4 px-6 text-2xl font-bold text-white placeholder-white/40 focus:outline-none focus:border-pink-500 transition-all text-center"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Traveler Type */}
          {step === 4 && (
            <motion.div
              key="step4"
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-extrabold flex items-center gap-3">
                <FaUserFriends className="text-pink-400" /> Who's going?
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: "solo", label: "Solo", icon: "🧍" },
                  { id: "couple", label: "Couple", icon: "👩‍❤️‍👨" },
                  { id: "family", label: "Family", icon: "👨‍👩‍👧‍👦" },
                  { id: "friends", label: "Friends", icon: "🍻" }
                ].map((type) => (
                  <motion.div
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateForm("travelerType", type.id)}
                    className={`cursor-pointer rounded-2xl p-5 flex items-center gap-4 border-2 transition-all ${
                      formData.travelerType === type.id
                        ? "bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)] border-pink-400"
                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="text-4xl">{type.icon}</div>
                    <div className="font-bold text-xl">{type.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 5: Preferences */}
          {step === 5 && (
            <motion.div
              key="step5"
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-extrabold flex items-center gap-3">
                <FaHeart className="text-pink-400" /> What do you love doing?
              </h2>
              <p className="text-white/70">Select all that apply.</p>
              
              <div className="flex flex-wrap gap-4">
                {PREF_OPTIONS.map((pref) => {
                  const isSelected = formData.preferences.includes(pref.id);
                  return (
                    <motion.button
                      key={pref.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => togglePref(pref.id)}
                      className={`px-6 py-3 rounded-full font-bold text-lg border-2 transition-all ${
                        isSelected
                          ? "bg-pink-500 border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.5)] text-white"
                          : "bg-white/5 border-white/20 text-white/80 hover:bg-white/20"
                      }`}
                    >
                      {pref.label}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
        <button
          onClick={handleBack}
          className={`px-6 py-3 font-bold rounded-xl transition-all ${
            step === 1 ? "opacity-0 pointer-events-none" : "hover:bg-white/10 text-white/70 hover:text-white"
          }`}
        >
          Back
        </button>

        {step < 5 ? (
          <button
            onClick={handleNext}
            disabled={
              (step === 1 && !formData.originCity) || 
              (step === 2 && !formData.destinationCity) ||
              (step === 3 && formData.budget <= 0)
            }
            className="px-8 py-3 bg-white text-indigo-900 font-extrabold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            Next Step
          </button>
        ) : (
          <button
            onClick={handleGenerate}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-extrabold rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.6)] hover:shadow-[0_0_30px_rgba(236,72,153,0.8)] hover:scale-105 transition-all flex items-center gap-2"
          >
            <FaMagic /> Generate My Trip !
          </button>
        )}
      </div>
    </div>
  );
}
