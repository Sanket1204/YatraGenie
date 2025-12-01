import { useState } from "react";
import { motion } from "framer-motion";

export default function SearchForm({ onSubmit }) {
  const [originCity, setOriginCity] = useState("");
  const [destinationCityId, setDestinationCityId] = useState("");
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(8000);
  const [travelerType, setTravelerType] = useState("solo");
  const [preferences, setPreferences] = useState([]);

  const prefOptions = ["beach", "nature", "temple", "heritage", "nightlife", "food"];

  const togglePref = (p) => {
    setPreferences((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      origin_city: originCity,
      destination_city_id: Number(destinationCityId),
      days: Number(days),
      budget_total: Number(budget),
      traveler_type: travelerType,
      preferences,
    });
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit}
      className="backdrop-blur-lg bg-black/80 border border-red-700 shadow-xl rounded-3xl p-8 space-y-6"
    >
      <h2 className="text-2xl font-bold text-red-800">Plan Your Trip</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          className="input-premium"
          placeholder="Origin City"
          value={originCity}
          onChange={(e) => setOriginCity(e.target.value)}
          required
        />
        <select
          className="input-premium"
          value={destinationCityId}
          onChange={(e) => setDestinationCityId(e.target.value)}
          required
        >
          <option value="">Select Destination City</option>
          <option value="1">Goa</option>
          <option value="2">Jaipur</option>
          <option value="3">Kerala</option>
        </select>
        <input
          className="input-premium"
          type="number"
          placeholder="Days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />
        <input
          className="input-premium"
          type="number"
          placeholder="Total Budget (₹)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
      </div>

      <select
        className="input-premium"
        value={travelerType}
        onChange={(e) => setTravelerType(e.target.value)}
      >
        <option value="solo">Solo</option>
        <option value="couple">Couple</option>
        <option value="family">Family</option>
        <option value="friends">Friends</option>
      </select>

      <div>
        <label className="font-medium">Preferences</label>
        <div className="flex flex-wrap gap-3 mt-2">
          {prefOptions.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => togglePref(p)}
              className={`tag-btn ${
                preferences.includes(p)
                  ? "bg-blue-600 text-white"
                  : "bg-white/30 text-gray-700 backdrop-blur"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:opacity-90 transition"
      >
        Generate Itinerary
      </button>
    </motion.form>
  );
}
