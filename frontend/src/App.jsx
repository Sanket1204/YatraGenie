import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ItineraryResult from "./pages/ItineraryResult";
import Places from "./pages/Places";
import About from "./pages/About";
import Login from "./pages/Login";


export default function App() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-100 pt-4 pb-10">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/result" element={<ItineraryResult />} />
          <Route path="/places" element={<Places />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </>
  );
}
