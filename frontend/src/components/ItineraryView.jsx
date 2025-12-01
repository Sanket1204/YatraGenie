import { motion } from "framer-motion";

export default function ItineraryView({ itinerary }) {
  return (
    <div className="mt-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-xl rounded-3xl p-8 mb-6"
      >
        <h2 className="text-3xl font-bold text-gray-800">{itinerary.city_name}</h2>
        <p className="text-gray-600 mt-1">{itinerary.summary}</p>
        <p className="mt-3 font-semibold">
          Budget: ₹{itinerary.budget_total} • Estimated:{" "}
          <span className="text-blue-600">
            ₹{itinerary.estimated_total_cost}
          </span>
        </p>
      </motion.div>

      {/* Day Timeline */}
      {itinerary.days.map((day) => (
        <motion.div
          key={day.day}
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl shadow-xl p-6 mb-6 border-l-4 border-blue-600"
        >
          <h3 className="text-xl font-semibold text-blue-700 mb-3">
            Day {day.day}
          </h3>

          <div className="space-y-3">
            {day.items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between bg-blue-50 p-4 rounded-xl shadow-sm"
              >
                <div>
                  <span className="font-semibold">{item.place_name}</span>
                  <p className="text-sm text-gray-600">Time: {item.time_slot}</p>
                </div>
                <span className="text-blue-700 font-semibold">
                  ₹{item.estimated_cost}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
