import { FaBars } from "react-icons/fa";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function SidebarToggle({ onClick, isOpen, position = 'right' }) {
  const location = useLocation();
  
  // Hide button on login, register, and dashboard pages
  const hideOnPages = ["/login", "/register", "/dashboard"];
  if (hideOnPages.includes(location.pathname)) {
    return null;
  }

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`fixed top-5 ${position === 'right' ? 'right-3' : 'left-3'} z-50 text-white text-3xl bg-white/20 hover:bg-white/30 backdrop-blur-xl p-3 rounded-xl border border-white/30 transition`}
      title={isOpen ? "Close Sidebar" : "Open Sidebar"}
    >
      <FaBars />
    </motion.button>
  );
}

