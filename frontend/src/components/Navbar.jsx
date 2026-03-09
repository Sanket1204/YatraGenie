import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ userName }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="backdrop-blur-xl bg-white/70 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/40 rounded-full w-full max-w-7xl px-6 py-3"
      >
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl font-extrabold bg-gradient-to-r from-pink-500 via-indigo-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm flex items-center gap-2"
            >
              <span className="text-3xl">🧞‍♂️</span> YatraGenie
            </motion.div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8 text-slate-700 font-bold">
            {["Home", "Places", "About"].map((item) => (
              <Link key={item} to={item === "Home" ? "/" : `/${item.toLowerCase()}`}>
                <motion.div
                  whileHover={{ scale: 1.1, color: "#4f46e5" }}
                  whileTap={{ scale: 0.9 }}
                  className="transition-colors hover:text-indigo-600"
                >
                  {item}
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Auth Button / User Status */}
          <div className="hidden md:flex items-center">
            {userName ? (
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-700">Hey, {userName.split(' ')[0]}</span>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    localStorage.removeItem("user");
                    navigate("/login");
                  }}
                  className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-4 py-2 rounded-full font-bold transition-colors shadow-sm"
                >
                  Sign Out
                </motion.button>
              </div>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-md hover:shadow-lg transition-all"
              >
                Sign In
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden text-indigo-900 bg-indigo-100 p-2 rounded-full" 
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pt-4 border-t border-indigo-100 space-y-4"
            >
              {["Home", "Places", "About"].map((item, idx) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link 
                    className="block py-2 text-lg font-bold text-slate-700 hover:text-indigo-600" 
                    to={item === "Home" ? "/" : `/${item.toLowerCase()}`} 
                    onClick={() => setOpen(false)}
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
              
              {/* Mobile Auth */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-2 border-t border-indigo-50"
              >
                {userName ? (
                  <button 
                    onClick={() => {
                      localStorage.removeItem("user");
                      setOpen(false);
                      navigate("/login");
                    }}
                    className="w-full text-left py-2 text-lg font-bold text-red-500"
                  >
                    Sign Out
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setOpen(false);
                      navigate("/login");
                    }}
                    className="w-full bg-indigo-500 text-white py-3 rounded-xl font-bold mt-2"
                  >
                    Sign In
                  </button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
