import { motion } from "framer-motion";
import { useState } from "react";
import { FaUserPlus } from "react-icons/fa";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPass: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">

      {/* 🔥 Background Video */}
      <video
        src="/videos/travel-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Animated floating emoji */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 0.15, y: 0 }}
        transition={{ duration: 2 }}
        className="absolute top-10 left-10 text-white text-8xl"
      >
        🌏
      </motion.div>

      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="relative w-full max-w-md bg-white/20 backdrop-blur-2xl shadow-2xl rounded-3xl p-8 border border-white/30"
      >
        <div className="text-center mb-6">
          <motion.div 
            initial={{ rotate: -20 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl text-white flex justify-center"
          >
            <FaUserPlus />
          </motion.div>

          <h1 className="text-3xl font-bold text-white mt-3">Create Account</h1>
          <p className="text-white/80 text-sm">
            Join YatraGenie and begin your travel adventures ✈️
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/90">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 rounded-lg bg-white/30 text-white placeholder-white/70 
                         focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 rounded-lg bg-white/30 text-white placeholder-white/70 
                         focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 rounded-lg bg-white/30 text-white placeholder-white/70 
                         focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="•••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPass"
              value={form.confirmPass}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 rounded-lg bg-white/30 text-white placeholder-white/70 
                         focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="•••••••••"
            />
          </div>

          {/* Animated Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-blue-600/80 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg"
          >
            Register
          </motion.button>

          <p className="text-center text-sm text-white/90 mt-3">
            Already have an account?{" "}
            <a href="/login" className="text-blue-300 font-semibold">
              Login
            </a>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
