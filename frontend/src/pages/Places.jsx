import { useState } from "react";
import { searchExternalPlaces } from "../api/client";
import { motion, AnimatePresence } from "framer-motion";
import { FaGlobe, FaStar, FaMapMarkerAlt } from "react-icons/fa";

export default function Places() {
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSearch() {
    if (!query) return;
    setLoading(true);
    setError(null);
    setPlaces([]);
    
    try {
      const data = await searchExternalPlaces(query);
      setPlaces(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch places. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200 } }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 mt-10 mb-20">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-10 mb-10 shadow-2xl text-white relative overflow-hidden"
      >
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-pink-500 rounded-full blur-[80px] opacity-60"></div>
        <h2 className="text-4xl font-extrabold mb-4 relative z-10 flex items-center gap-3">
           <FaGlobe className="text-pink-400" /> Explore Incredible Places Live
        </h2>
        
        <p className="text-white/80 mb-6 relative z-10 text-lg">
          Search live for hotels, resorts, beaches, and attractions anywhere in the world.
        </p>

        <div className="flex gap-4 max-w-2xl relative z-10">
          <input
            className="flex-1 bg-white/10 border-2 border-white/20 rounded-2xl py-4 px-6 text-xl text-white placeholder-white/60 focus:outline-none focus:border-pink-500 focus:bg-white/20 transition-all font-semibold"
            placeholder="E.g., hotels in Mumbai, beaches in Goa..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            disabled={loading}
            className="px-8 py-4 bg-pink-500 hover:bg-pink-400 text-white font-bold rounded-2xl shadow-lg transition-colors text-lg disabled:opacity-50"
          >
            {loading ? "Searching..." : "Live Search"}
          </motion.button>
        </div>
      </motion.div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-red-500 font-bold p-4 bg-red-100 rounded-xl mb-6">
          {error}
        </motion.div>
      )}

      {loading ? (
        <div className="text-center text-gray-500 py-20 font-medium text-xl animate-pulse">
          Fetching best live results...
        </div>
      ) : places.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {places.map((p) => (
            <motion.div
              key={p.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.25)" 
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-[2rem] shadow-lg border border-gray-100 cursor-pointer overflow-hidden group flex flex-col"
            >
              {p.thumbnail ? (
                <img src={p.thumbnail} alt={p.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-48 bg-indigo-50 flex items-center justify-center text-4xl">📍</div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 text-xl mb-2 line-clamp-2 leading-tight">{p.name}</h3>
                
                {p.rating > 0 && (
                  <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold mb-3">
                    <FaStar /> {p.rating} <span className="text-gray-400 font-normal ml-1">({p.reviews})</span>
                  </div>
                )}
                
                <p className="text-sm text-gray-500 font-medium mt-auto flex items-start gap-1">
                  <FaMapMarkerAlt className="mt-0.5 flex-shrink-0 text-pink-400" /> <span className="line-clamp-2">{p.address || p.category}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : query !== "" && !loading ? (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center text-gray-500 py-20 font-medium text-lg"
        >
          No live results found. Try a different place.
        </motion.div>
      ) : null}
    </div>
  );
}
