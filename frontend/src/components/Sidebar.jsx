import { Link } from "react-router-dom";
import {
  FaPlaneDeparture,
  FaRoute,
  FaMapMarkedAlt,
  FaBookmark,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar({ isOpen, onClose, userName, position = "right" }) {
  const isRight = position === "right";
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div onClick={onClose} className="fixed inset-0 bg-black/40 z-30" />
      )}

      {/* Sidebar: translate fully off-screen when closed to avoid blocking clicks */}
      <div
        className={`fixed top-0 ${isRight ? 'right-0' : 'left-0'} h-full bg-white/20 backdrop-blur-xl p-6 z-40 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0 w-60' : (isRight ? 'translate-x-full w-60 pointer-events-none' : '-translate-x-full w-60 pointer-events-none')
        }`}
        style={{ borderLeft: isRight ? '1px solid rgba(255,255,255,0.2)' : undefined, borderRight: !isRight ? '1px solid rgba(255,255,255,0.2)' : undefined }}
      >
        <div className="text-white text-xl font-bold flex items-center gap-2 mb-8">
          <FaPlaneDeparture /> YatraGenie
        </div>

        {userName && (
          <div className="text-white/80 text-sm mb-6 pb-4 border-b border-white/20">
            Welcome, <span className="font-semibold">{userName}</span>
          </div>
        )}

        <nav className="text-white space-y-5">
          <Link
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3 text-lg hover:text-yellow-300 transition"
          >
            <FaRoute /> Dashboard
          </Link>

          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 text-lg hover:text-yellow-300 transition"
          >
            <FaMapMarkedAlt /> Create Itinerary
          </Link>

          <Link
            to="/places"
            onClick={onClose}
            className="flex items-center gap-3 text-lg hover:text-yellow-300 transition"
          >
            <FaBookmark /> Explore Places
          </Link>

          <Link
            to="/about"
            onClick={onClose}
            className="flex items-center gap-3 text-lg hover:text-yellow-300 transition"
          >
            <FaBookmark /> About
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("user");
              onClose();
              window.location.href = "/login";
            }}
            className="flex items-center gap-3 text-lg text-red-300 hover:text-red-200 transition mt-10"
          >
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </div>
    </>
  );
}
