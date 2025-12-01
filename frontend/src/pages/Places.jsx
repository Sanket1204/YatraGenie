import { useState } from "react";
import { searchPlaces } from "../api/client";
import { motion } from "framer-motion";

export default function Places() {
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState([]);

  async function handleSearch() {
    const data = await searchPlaces({ query });
    setPlaces(data);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mt-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Explore Places in India
      </h2>

      <div className="flex gap-3 mb-6">
        <input
          className="input-premium"
          placeholder="Search beaches, temples, forts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow"
        >
          Search
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {places.map((p, idx) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-3xl shadow-xl p-6"
          >
            <h3 className="font-bold text-lg mb-2">{p.name}</h3>
            <p className="text-sm text-gray-600">{p.category}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
