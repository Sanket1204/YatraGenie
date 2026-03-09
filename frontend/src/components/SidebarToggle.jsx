import { FaBars } from "react-icons/fa";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function SidebarToggle({ onClick, isOpen }) {
  const location = useLocation();
  
  // Hide button on login, register, and dashboard pages
  const hideOnPages = ["/login", "/register", "/dashboard"];
  if (hideOnPages.includes(location.pathname)) {
    return null;
  }

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.4)" }}
      whileTap={{ scale: 0.95 }}
      animate={
        !isOpen
          ? {
              boxShadow: [
                "0px 0px 0px rgba(236,72,153,0)",
                "0px 0px 15px rgba(236,72,153,0.5)",
                "0px 0px 0px rgba(236,72,153,0)"
              ],
            }
          : { boxShadow: "none" }
      }
      transition={{ repeat: !isOpen ? Infinity : 0, duration: 2 }}
      className={`fixed top-5 left-5 z-[80] text-white text-3xl p-3 border rounded-xl backdrop-blur-xl transition-colors ${
        isOpen ? "bg-white/10 hover:bg-white/20 border-white/10" : "bg-indigo-600/80 hover:bg-indigo-500 border-indigo-400"
      }`}
      title={isOpen ? "Close Sidebar" : "Open Sidebar"}
    >
      <FaBars />
    </motion.button>
  );
}

