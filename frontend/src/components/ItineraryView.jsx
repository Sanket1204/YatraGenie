import { motion } from "framer-motion";

export default function ItineraryView({ itinerary }) {
  return (
    <div className="mt-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-dark rounded-3xl p-8 mb-6"
      >
        <h2 className="text-3xl font-bold text-gray-100">{itinerary.city_name}</h2>
        <p className="text-gray-300 mt-1">{itinerary.summary}</p>
        <p className="mt-3 font-semibold">
          Budget: <span className="text-gray-200">₹{itinerary.budget_total}</span> • Estimated: {" "}
          <span className="text-orange-400">₹{itinerary.estimated_total_cost}</span>
        </p>
      </motion.div>

      {/* Day Timeline */}
      {itinerary.days.map((day) => (
        <motion.div
          key={day.day}
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="card-dark rounded-3xl p-6 mb-6 border-l-4 border-[rgba(255,140,60,0.15)]"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-orange-400 mb-3">
              Day {day.day}
            </h3>
            <div className="text-sm font-semibold text-gray-200">Day total: <span className="text-orange-300">₹{day.day_total}</span></div>
          </div>

          <div className="space-y-3">
            {day.items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between bg-[rgba(255,255,255,0.02)] p-4 rounded-xl shadow-sm"
              >
                <div>
                  <span className="font-semibold text-gray-100">{item.place_name}</span>
                  <p className="text-sm text-gray-300">Time: {item.time_slot}</p>
                </div>
                <span className="text-orange-300 font-semibold">
                  ₹{item.estimated_cost}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 text-sm text-gray-300 flex flex-col gap-1">
            <div className="flex justify-between">
              <div>Places total</div>
              <div className="font-semibold">₹{day.place_total}</div>
            </div>
            <div className="flex justify-between">
              <div>Accommodation</div>
              <div className="font-semibold">₹{day.accommodation_cost}</div>
            </div>
            <div className="flex justify-between">
              <div>Surcharge</div>
              <div className="font-semibold">₹{day.surcharge}</div>
            </div>
            <div className="flex justify-between text-orange-300 font-bold">
              <div>Day total</div>
              <div>₹{day.day_total}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
