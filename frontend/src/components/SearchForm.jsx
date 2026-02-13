import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function SearchForm({ onSubmit }) {
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originCity, setOriginCity] = useState("");
  const [destinationCityId, setDestinationCityId] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const destRef = useRef(null);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const originRef = useRef(null);
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(8000);
  const [travelerType, setTravelerType] = useState("solo");
  const [people, setPeople] = useState(1);
  const [preferences, setPreferences] = useState([]);

  const prefOptions = ["beach", "nature", "temple", "heritage", "nightlife", "food"];

  const destinations = [
    { id: 1, name: "Goa" },
    { id: 2, name: "Jaipur" },
    { id: 3, name: "Kerala" },
    { id: 4, name: "Mumbai" },
    { id: 5, name: "Delhi" }
  ];

  const popular = ["Goa", "Kerala", "Jaipur"];

  const togglePref = (p) => {
    setPreferences((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;
    setFormError(null);
    setIsSubmitting(true);
    console.log('SearchForm handleSubmit called', { originCity, destinationQuery, destinationCityId, people, days, budget });
    // Basic client-side validation
    if (!originCity || originCity.trim() === "") {
      setFormError("Please enter an origin city.");
      return;
    }
    if (!destinationQuery || destinationQuery.trim() === "") {
      setFormError("Please choose a destination city.");
      return;
    }

    // Resolve destination id from typed query if not explicitly selected
    const matched = destinations.find(
      (d) => d.name.toLowerCase() === destinationQuery.trim().toLowerCase()
    );
    const resolvedId = destinationCityId || (matched ? matched.id : null);
    if (!resolvedId) {
      setFormError("Please select a destination from the suggestions or popular list.");
      return;
    }
    try {
      await onSubmit({
      origin_city: originCity,
      destination_city_id: Number(resolvedId),
      destination_city_name: destinationQuery || null,
      people: Number(people),
      days: Number(days),
      budget_total: Number(budget),
      traveler_type: travelerType,
      preferences,
      });
    } catch (err) {
      // surface errors from parent
      setFormError(String(err.message || err));
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    function onDocClick(e) {
      if (destRef.current && !destRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (originRef.current && !originRef.current.contains(e.target)) {
        setShowOriginSuggestions(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <motion.form
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit}
      className="hero-card p-8 space-y-6 relative z-50 card-dark max-w-3xl mx-auto rounded-3xl"
    >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-100">Plan Your Trip</h2>
          <div className="text-sm text-gray-300">Tell us where and we'll craft your plan</div>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="font-medium text-gray-200">Popular Destinations</label>
          <div className="flex flex-wrap gap-3 mt-2 mb-4">
            {popular.map((p) => (
              <button
                key={p}
                type="button"
                className="pill"
                onClick={() => {
                  const found = destinations.find((d) => d.name === p);
                  if (found) {
                    setDestinationCityId(found.id);
                    setDestinationQuery(found.name);
                  } else {
                    setDestinationQuery(p);
                  }
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="relative" ref={originRef}>
          <label className="block text-sm font-medium text-gray-200 mb-1">Origin City</label>
          <div className="text-xs text-gray-400 mb-2">Start typing to search cities or pick a popular destination.</div>
          <input
            className="input-premium pr-10 bg-transparent text-gray-100 placeholder-gray-400 border border-transparent focus:border-indigo-500"
            placeholder="e.g., Mumbai"
            aria-label="Origin city"
            value={originCity}
            onChange={(e) => {
              setOriginCity(e.target.value);
              setShowOriginSuggestions(true);
            }}
            onFocus={() => setShowOriginSuggestions(true)}
            required
          />
          <div
            role="button"
            tabIndex={0}
            onClick={() => setShowOriginSuggestions((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
          >
            ▾
          </div>
          {showOriginSuggestions && originCity && (
            <ul className="absolute z-50 mt-1 w-full bg-[rgba(8,6,20,0.9)] text-gray-200 rounded-lg shadow-lg max-h-40 overflow-auto border border-transparent">
              {destinations
                .filter((d) => d.name.toLowerCase().includes(originCity.toLowerCase()))
                .map((d) => (
                  <li
                    key={d.id}
                    className="px-4 py-2 hover:bg-indigo-700 hover:text-white cursor-pointer"
                    onClick={() => {
                      setOriginCity(d.name);
                      setShowOriginSuggestions(false);
                    }}
                  >
                    {d.name}
                  </li>
                ))}
            </ul>
          )}
        </div>
        <div className="relative" ref={destRef}>
          <label className="block text-sm font-medium text-gray-200 mb-1">Destination</label>
          <div className="text-xs text-gray-400 mb-2">Type the city you'd like to visit and select from suggestions.</div>
          <input
            className="input-premium pr-10 bg-transparent text-gray-100 placeholder-gray-400 border border-transparent focus:border-indigo-500"
            placeholder="e.g., Goa"
            aria-label="Destination city"
            value={destinationQuery}
            onChange={(e) => {
              setDestinationQuery(e.target.value);
              setShowSuggestions(true);
              setDestinationCityId("");
            }}
            onFocus={() => setShowSuggestions(true)}
            required
          />
          <div
            role="button"
            tabIndex={0}
            onClick={() => setShowSuggestions((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
          >
            ▾
          </div>
          {showSuggestions && destinationQuery && (
            <ul className="absolute z-50 mt-1 w-full bg-[rgba(8,6,20,0.9)] text-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto border border-transparent">
              {destinations
                .filter((d) => d.name.toLowerCase().includes(destinationQuery.toLowerCase()))
                .map((d) => (
                  <li
                    key={d.id}
                    className="px-4 py-2 hover:bg-indigo-700 hover:text-white cursor-pointer"
                    onClick={() => {
                      setDestinationCityId(d.id);
                      setDestinationQuery(d.name);
                      setShowSuggestions(false);
                    }}
                  >
                    {d.name}
                  </li>
                ))}
            </ul>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Days</label>
          <input
            className="input-premium bg-transparent text-gray-100 placeholder-gray-400 border border-transparent focus:border-indigo-500"
            type="number"
            placeholder="Number of days (e.g., 3)"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">People</label>
          <input
            className="input-premium bg-transparent text-gray-100 placeholder-gray-400 border border-transparent focus:border-indigo-500"
            type="number"
            placeholder="Number of people"
            min={1}
            value={people}
            onChange={(e) => setPeople(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Budget (₹)</label>
          <input
            className="input-premium bg-transparent text-gray-100 placeholder-gray-400 border border-transparent focus:border-indigo-500"
            type="number"
            placeholder="Total budget (e.g., 8000)"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>
      </div>

      {formError && (
        <div className="text-center text-sm text-red-600 font-medium">{formError}</div>
      )}

      <div className="relative">
        <select
          className="input-premium appearance-none pr-10 bg-white text-gray-900 border border-gray-200"
          value={travelerType}
          onChange={(e) => setTravelerType(e.target.value)}
        >
          <option value="solo">Solo</option>
          <option value="couple">Couple</option>
          <option value="family">Family</option>
          <option value="friends">Friends</option>
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▾</div>
      </div>

        <div>
        <label className="font-medium text-gray-800">Preferences</label>
        <div className="flex flex-wrap gap-3 mt-2">
          {prefOptions.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => togglePref(p)}
              className={`tag-btn ${
                preferences.includes(p)
                  ? "bg-blue-600 text-white"
                  : "bg-[rgba(255,255,255,0.02)] text-gray-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 rounded-xl shadow transition ${isSubmitting ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'orange-btn hover:opacity-95'}`}
      >
        {isSubmitting ? 'Generating...' : 'Generate Itinerary'}
      </button>
    </motion.form>
  );
}
