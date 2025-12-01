import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaPlaneDeparture,
  FaRoute,
  FaMapMarkedAlt,
  FaBookmark,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar({ isOpen, onClose, userName }) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-10"
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: isOpen ? 0 : -250 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 h-full w-60 bg-white/20 backdrop-blur-xl border-r border-white/30 p-6 z-20"
      >
        <div className="text-white text-xl font-bold flex items-center gap-2 mb-8">
          <FaPlaneDeparture /> YatraGenie
        </div>

        {userName && (
          <div className="text-white/80 text-sm mb-6 pb-4 border-b border-white/20">
            Welcome, <span className="font-semibold">{userName}</span>
          </div>
        )}

        <nav className="text-white space-y-5">
          <Link
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3 text-lg hover:text-yellow-300 transition"
          >
            <FaRoute /> Dashboard
          </Link>

          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 text-lg hover:text-yellow-300 transition"
          >
            <FaMapMarkedAlt /> Create Itinerary
          </Link>

          <Link
            to="/places"
            onClick={onClose}
            className="flex items-center gap-3 text-lg hover:text-yellow-300 transition"
          >
            <FaBookmark /> Explore Places
          </Link>

          <Link
            to="/about"
            onClick={onClose}
            className="flex items-center gap-3 text-lg hover:text-yellow-300 transition"
          >
            <FaBookmark /> About
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("user");
              onClose();
              window.location.href = "/login";
            }}
            className="flex items-center gap-3 text-lg text-red-300 hover:text-red-200 transition mt-10"
          >
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </motion.div>
    </>
  );
}
