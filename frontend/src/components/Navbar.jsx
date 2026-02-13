import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="backdrop-blur bg-white/70 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md border border-white/30">YG</div>
          <span className="text-2xl font-extrabold text-gray-900">YatraGenie</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-10 text-gray-800 font-medium">
          <Link className="hover:text-blue-600 transition" to="/">Home</Link>
          <Link className="hover:text-blue-600 transition" to="/places">Places</Link>
          <Link className="hover:text-blue-600 transition" to="/about">About</Link>
        </div>

        {/* sidebar position control removed */}

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-t px-6 pb-4 space-y-3"
        >
          <Link className="block py-2" to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link className="block py-2" to="/places" onClick={() => setOpen(false)}>Places</Link>
          <Link className="block py-2" to="/about" onClick={() => setOpen(false)}>About</Link>
        </motion.div>
      )}
    </nav>
  );
}
