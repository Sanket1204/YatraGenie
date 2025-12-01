import { motion } from "framer-motion";
import {
  FaBars,
  FaPlaneDeparture,
  FaUserCircle,
  FaMapMarkedAlt,
  FaRoute,
  FaBookmark,
  FaSignOutAlt,
} from "react-icons/fa";
import { useEffect, useState } from "react";

export default function SidebarDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Auth check
  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (!stored) {
      window.location.replace("/login");
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      if (!parsed?.name) throw new Error();
      setUser(parsed);
      setLoading(false);
    } catch {
      localStorage.removeItem("user");
      window.location.replace("/login");
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white text-3xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      {/* Background video */}
      <video
        src="/videos/travel-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: sidebarOpen ? 0 : -250 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 h-full w-60 bg-white/20 backdrop-blur-xl border-r border-white/30 p-6 z-20"
      >
        <div className="text-white text-xl font-bold flex items-center gap-2 mb-6">
          <FaPlaneDeparture /> YatraGenie
        </div>

        <nav className="text-white space-y-5">
          <a
            href="/dashboard"
            className="flex items-center gap-3 text-lg hover:text-yellow-300 transition"
          >
            <FaRoute /> Dashboard
          </a>

          <a
            href="/create-itinerary"
            className="flex items-center gap-3 text-lg hover:text-yellow-300 transition"
          >
            <FaMapMarkedAlt /> Create Itinerary
          </a>

          <a
            href="/places"
            className="flex items-center gap-3 text-lg hover:text-yellow-300 transition"
          >
            <FaBookmark /> Explore Places
          </a>

          <a
            href="/saved-trips"
            className="flex items-center gap-3 text-lg hover:text-yellow-300 transition"
          >
            <FaBookmark /> Saved Trips
          </a>

          <button
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="flex items-center gap-3 text-lg text-red-300 mt-10"
          >
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </motion.div>

      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-5 left-5 z-30 text-white text-3xl bg-white/20 backdrop-blur-xl p-2 rounded-xl border border-white/30"
      >
        <FaBars />
      </button>

      {/* MAIN CONTENT */}
      <div className="relative z-10 ml-0 md:ml-60 p-10 text-white">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-bold mb-4"
        >
          Welcome, {user.name} 🌍
        </motion.h1>

        <p className="text-white/80 text-lg mb-6">
          Your personalized travel dashboard — plan, explore, save & discover.
        </p>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/20 cursor-pointer"
          >
            <FaMapMarkedAlt className="text-5xl mb-4 text-yellow-300" />
            <h3 className="text-2xl font-bold mb-2">Create Itinerary</h3>
            <p className="text-white/80">
              Build an AI-powered personalized itinerary.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/20 cursor-pointer"
          >
            <FaPlaneDeparture className="text-5xl mb-4 text-blue-300" />
            <h3 className="text-2xl font-bold mb-2">Explore Places</h3>
            <p className="text-white/80">
              Discover top destinations & attractions.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/20 cursor-pointer"
          >
            <FaBookmark className="text-5xl mb-4 text-green-300" />
            <h3 className="text-2xl font-bold mb-2">Saved Trips</h3>
            <p className="text-white/80">
              View your saved itineraries anytime.
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
