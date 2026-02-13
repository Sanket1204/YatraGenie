import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import SidebarToggle from "./components/SidebarToggle";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import ItineraryResult from "./pages/ItineraryResult";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Places from "./pages/Places";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SidebarDashboard from "./pages/SidebarDashboard";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setUserName(user.name || null);
      } catch {
        setUserName(null);
      }
    }
  }, []);

  return (
    <>
      <Navbar />
      <SidebarToggle onClick={() => setSidebarOpen(!sidebarOpen)} isOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} userName={userName} />
      <div className="min-h-screen bg-slate-100 pt-4 pb-10">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/result" element={<ItineraryResult />} />
          <Route path="/checkout-success" element={<CheckoutSuccess />} />
          <Route path="/places" element={<Places />} />
          <Route path="/about" element={<About />} />
          <Route path="/sidebar-dashboard" element={<SidebarDashboard />} />
        </Routes>
      </div>
    </>
  );
}
