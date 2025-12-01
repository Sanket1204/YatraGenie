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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-900 p-4">
      
      {/* Animated background elements */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 0.15, y: 0 }}
        transition={{ duration: 2 }}
        className="absolute top-10 text-white text-9xl opacity-10"
      >
        ✈️
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 0.2, x: 0 }}
        transition={{ duration: 2 }}
        className="absolute bottom-10 right-10 text-white text-8xl opacity-10"
      >
        🌍
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8"
      >
        <div className="text-center mb-6">
          <motion.div 
            initial={{ rotate: -20 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl text-blue-700 flex justify-center"
          >
            <FaPlaneDeparture />
          </motion.div>
          <h1 className="text-3xl font-bold text-blue-800 mt-3">
            YatraGenie
          </h1>
          <p className="text-gray-500 text-sm">
            Your personal budget-friendly travel planner 🌏
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              className="w-full mt-1 px-4 py-3 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-600 outline-none"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-3 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-600 outline-none"
              placeholder="•••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Animated Button */}
          <motion.button
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            className="w-full bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>

          <p className="text-center text-sm text-gray-600 mt-3">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-700 font-semibold">
              Create one
            </a>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
