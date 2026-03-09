import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import { registerUser } from "../api/auth";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPass: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (form.password !== form.confirmPass) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.message);
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-zinc-950">
      
      {/* Stunning Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1542259009477-d625272157b7?q=80&w=2669&auto=format&fit=crop')", // Different, but matching adventure style
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent backdrop-blur-[2px]"></div>
      </div>

      {/* Floating Animated Elements */}
      <motion.div
        animate={{ 
          y: [-20, 20, -20],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-[10%] text-white/10 text-9xl blur-sm"
      >
        ✨
      </motion.div>
      <motion.div
        animate={{ 
          y: [20, -20, 20],
          x: [-10, 10, -10],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-40 left-[15%] text-pink-500/10 text-9xl blur-md"
      >
        🌏
      </motion.div>

      {/* Main Glassmorphic Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="relative z-10 w-full max-w-lg mx-4 my-8"
      >
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-[2.5rem] p-10 md:p-12 overflow-hidden">
          
          {/* Inner Glow Effect */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-pink-500/30 rounded-full blur-[80px]"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"></div>

          <div className="relative z-20 text-center mb-8">
            <motion.div 
              initial={{ rotate: 45, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
              className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl mb-6"
            >
              <FaUserPlus className="text-4xl text-white ml-2" />
            </motion.div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
              Join the Adventure
            </h1>
            <p className="text-zinc-300 font-medium text-lg">
              Create your YatraGenie account.
            </p>
          </div>

          <form className="relative z-20 space-y-5" onSubmit={handleSubmit}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/20 backdrop-blur-md border border-red-500/50 text-red-100 rounded-2xl text-sm font-semibold text-center shadow-lg"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-zinc-300 ml-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:bg-white/10 focus:border-pink-400 focus:ring-4 focus:ring-pink-500/20 outline-none transition-all duration-300"
                placeholder="Genie Traveler"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-zinc-300 ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:bg-white/10 focus:border-pink-400 focus:ring-4 focus:ring-pink-500/20 outline-none transition-all duration-300"
                placeholder="you@adventure.com"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-zinc-300 ml-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:bg-white/10 focus:border-pink-400 focus:ring-4 focus:ring-pink-500/20 outline-none transition-all duration-300"
                placeholder="•••••••••"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-zinc-300 ml-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPass"
                value={form.confirmPass}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:bg-white/10 focus:border-pink-400 focus:ring-4 focus:ring-pink-500/20 outline-none transition-all duration-300"
                placeholder="•••••••••"
                required
                disabled={loading}
              />
            </div>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02, boxShadow: "0 0 20px rgba(236, 72, 153, 0.4)" }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-lg py-4 rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4 transition-all"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Creating Account...
                </span>
              ) : "Sign Up"}
            </motion.button>

            <div className="text-center mt-6">
              <p className="text-sm text-zinc-400 font-medium">
                Already have an account?{" "}
                <button 
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-indigo-400 after:transition-all hover:after:w-full"
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
