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
        <Link
          to="/"
          className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
        >
          YatraGenie
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-10 text-gray-800 font-medium">
          <Link className="hover:text-blue-600 transition" to="/">Home</Link>
          <Link className="hover:text-blue-600 transition" to="/places">Places</Link>
          <Link className="hover:text-blue-600 transition" to="/about">About</Link>
        </div>

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
