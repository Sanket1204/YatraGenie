import { motion } from "framer-motion";
import { FaPlaneDeparture, FaMapMarkedAlt, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

      <video
        src="/videos/travel-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/50"></div>

      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full px-8 py-4 flex justify-between items-center bg-white/10 backdrop-blur-xl border-b border-white/20"
      >
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FaPlaneDeparture /> YatraGenie
        </h1>

        <div className="flex items-center gap-6 text-white">
          <span className="flex items-center gap-2 text-lg">
            <FaUserCircle className="text-2xl" />
            {user.name}
          </span>

          <button
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="flex items-center gap-2 bg-red-600/80 hover:bg-red-700 px-4 py-2 rounded-xl"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </motion.nav>

      {/* rest of your dashboard unchanged */}
    </div>
  );
}
