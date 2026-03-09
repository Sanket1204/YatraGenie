import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlaneDeparture } from "react-icons/fa";
import { loginUser } from "../api/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await loginUser({ email, password });
      localStorage.setItem("user", JSON.stringify(res));
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
      console.error("Login error:", err);
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
          backgroundImage: "url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2668&auto=format&fit=crop')",
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
        className="absolute top-20 left-[10%] text-white/10 text-9xl blur-sm"
      >
        ☁️
      </motion.div>
      <motion.div
        animate={{ 
          y: [20, -20, 20],
          x: [-10, 10, -10],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-40 right-[15%] text-indigo-500/10 text-9xl blur-md"
      >
        🌏
      </motion.div>

      {/* Main Glassmorphic Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="relative z-10 w-full max-w-lg mx-4"
      >
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-[2.5rem] p-10 md:p-12 overflow-hidden">
          
          {/* Inner Glow Effect */}
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-500/30 rounded-full blur-[80px]"></div>
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-pink-500/20 rounded-full blur-[80px]"></div>

          <div className="relative z-20 text-center mb-10">
            <motion.div 
              initial={{ rotate: -45, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
              className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl mb-6"
            >
              <FaPlaneDeparture className="text-4xl text-white" />
            </motion.div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
              Welcome Back
            </h1>
            <p className="text-zinc-300 font-medium text-lg">
              To your magical travel companion.
            </p>
          </div>

          <form className="relative z-20 space-y-6" onSubmit={handleSubmit}>
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
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:bg-white/10 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-300"
                placeholder="you@adventure.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="block text-sm font-semibold text-zinc-300">
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:bg-white/10 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-300"
                placeholder="•••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02, boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold text-lg py-4 rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4 transition-all"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Authenticating...
                </span>
              ) : "Sign In to YatraGenie"}
            </motion.button>

            <div className="text-center mt-8">
              <p className="text-sm text-zinc-400 font-medium">
                New to YatraGenie?{" "}
                <button 
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-pink-400 font-bold hover:text-pink-300 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-pink-400 after:transition-all hover:after:w-full"
                >
                  Create an account
                </button>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
