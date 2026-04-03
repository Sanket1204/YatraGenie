import { motion } from "framer-motion";
import {
  FaPlaneDeparture,
  FaMapMarkedAlt,
  FaRoute,
  FaBookmark,
  FaCrown,
  FaTimes
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PaymentWizard from "../components/PaymentWizard";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const navigate = useNavigate();

  // Auth check
  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (!stored) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      if (!parsed?.name) throw new Error();
      setUser(parsed);
      setLoading(false);
    } catch {
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] text-indigo-900 text-3xl font-bold animate-pulse">
        Loading...
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200 } }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 mt-10 mb-20 relative">

      {/* Hero Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-10 mb-10 shadow-2xl text-white relative overflow-hidden"
      >
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-pink-500 rounded-full blur-[80px] opacity-60"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-400 rounded-full blur-[80px] opacity-60"></div>
        
        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold mb-4"
          >
            Welcome back, {user?.name.split(' ')[0]} 🌍
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-white/80 text-lg md:text-xl max-w-2xl font-medium"
          >
            Your personalized travel dashboard. Plan new adventures, explore the world, and review your saved itineraries all in one place.
          </motion.p>
        </div>
      </motion.div>

      {/* Interactive Cards Section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10"
      >
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -10, boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.25)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/")}
          className="bg-white rounded-[2rem] p-8 shadow-xl border border-indigo-50 cursor-pointer overflow-hidden group relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <FaMapMarkedAlt className="text-5xl mb-6 text-yellow-500 relative z-10 drop-shadow-sm" />
          <h3 className="text-2xl font-extrabold text-indigo-950 mb-3 relative z-10 group-hover:text-indigo-600 transition-colors">Create Itinerary</h3>
          <p className="text-slate-500 font-medium relative z-10 text-sm md:text-base">
            Build an AI-powered personalized travel plan in seconds based on your budget and preferences.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -10, boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.25)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/places")}
          className="bg-white rounded-[2rem] p-8 shadow-xl border border-indigo-50 cursor-pointer overflow-hidden group relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <FaPlaneDeparture className="text-5xl mb-6 text-blue-500 relative z-10 drop-shadow-sm" />
          <h3 className="text-2xl font-extrabold text-indigo-950 mb-3 relative z-10 group-hover:text-indigo-600 transition-colors">Explore Places</h3>
          <p className="text-slate-500 font-medium relative z-10 text-sm md:text-base">
             Discover top destinations, hotels, and live attractions anywhere in the world.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -10, boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.25)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowPremiumModal(true)}
          className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-[2rem] p-8 shadow-xl cursor-pointer overflow-hidden group relative text-white"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <FaCrown className="text-5xl mb-6 text-yellow-400 relative z-10 drop-shadow-sm" />
          <h3 className="text-2xl font-extrabold mb-3 relative z-10 text-yellow-400">YatraGenie Pro</h3>
          <p className="text-white/80 font-medium relative z-10 text-sm md:text-base">
            Upgrade to premium for ₹999 to unlock priority AI parsing, unlimited searches, and exclusive hotel deals.
          </p>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showPremiumModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              className="relative w-full max-w-md"
            >
              <button 
                onClick={() => setShowPremiumModal(false)}
                className="absolute -top-10 right-0 text-white hover:text-red-400 transition-colors z-10 p-2"
              >
                <FaTimes size={24} />
              </button>
              <PaymentWizard amount={999} onSuccess={() => {
                setTimeout(() => setShowPremiumModal(false), 2000);
              }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
