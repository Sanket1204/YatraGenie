import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ItineraryResult from "./pages/ItineraryResult";
import Places from "./pages/Places";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SidebarDashboard from "./pages/SidebarDashboard";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-100 pt-4 pb-10">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/result" element={<ItineraryResult />} />
          <Route path="/places" element={<Places />} />
          <Route path="/about" element={<About />} />
          <Route path="/sidebar-dashboard" element={<SidebarDashboard />} />
        </Routes>
      </div>
    </>
  );
}
