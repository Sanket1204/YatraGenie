import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FaPlaneDeparture,
  FaRoute,
  FaMapMarkedAlt,
  FaBookmark,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar({ isOpen, onClose, userName }) {
  const navigate = useNavigate();
  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30, staggerChildren: 0.1, delayChildren: 0.1 } },
    closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  const itemVariants = {
    open: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { opacity: 0, x: -30 }
  };

  return (
    <AnimatePresence>
      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed top-0 left-0 h-full w-72 bg-gradient-to-br from-indigo-900/90 to-purple-900/90 backdrop-blur-2xl border-r border-white/20 p-8 z-[70] shadow-[20px_0_50px_rgba(0,0,0,0.5)] flex flex-col"
      >
        <motion.div variants={itemVariants} className="text-white text-3xl font-extrabold flex items-center gap-3 mb-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
          <FaPlaneDeparture className="text-pink-400" /> YatraGenie
        </motion.div>

        {userName && (
          <motion.div variants={itemVariants} className="bg-white/10 rounded-2xl p-4 mb-8 border border-white/10 shadow-inner">
            <p className="text-white/70 text-sm uppercase tracking-wider font-semibold mb-1">Welcome Back,</p>
            <p className="text-white text-xl font-bold truncate">{userName}</p>
          </motion.div>
        )}

        <nav className="text-white space-y-4 flex-1">
          {[
            { to: "/dashboard", icon: FaRoute, label: "Dashboard" },
            { to: "/", icon: FaMapMarkedAlt, label: "Create Itinerary" },
            { to: "/places", icon: FaBookmark, label: "Explore Places" },
            { to: "/about", icon: FaBookmark, label: "About" }
          ].map((item, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <Link
                to={item.to}
                onClick={onClose}
                className="flex items-center gap-4 text-lg p-3 rounded-xl hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:text-pink-300 transition-all group"
              >
                <item.icon className="text-2xl text-white/50 group-hover:text-pink-400 group-hover:scale-110 transition-all" /> 
                <span className="font-semibold">{item.label}</span>
              </Link>
            </motion.div>
          ))}
        </nav>

        <motion.div variants={itemVariants}>
          <button
            onClick={() => {
              localStorage.removeItem("user");
              onClose();
              navigate("/login");
            }}
            className="w-full flex justify-center items-center gap-3 text-lg font-bold text-white bg-red-500/80 hover:bg-red-500 p-4 rounded-xl shadow-lg hover:shadow-red-500/50 transition-all mt-auto"
          >
            <FaSignOutAlt /> Sign Out
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
