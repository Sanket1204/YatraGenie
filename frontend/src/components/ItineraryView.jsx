import { motion } from "framer-motion";

export default function ItineraryView({ itinerary }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="mt-10 mb-20"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white shadow-2xl rounded-[2.5rem] p-10 mb-8 relative overflow-hidden"
      >
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
        
        <div className="relative z-10">
          <h2 className="text-5xl font-extrabold mb-4 drop-shadow-md">{itinerary.city_name}</h2>
          <p className="text-xl text-white/80 mb-6 font-light leading-relaxed max-w-3xl">{itinerary.summary}</p>
          <div className="flex flex-wrap gap-4 items-center bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20 inline-flex">
            <span className="font-semibold text-white/70 tracking-wider uppercase text-sm">Budget:</span>
            <span className="text-2xl font-bold">₹{itinerary.budget_total}</span>
            <div className="w-px h-8 bg-white/20 mx-2"></div>
            <span className="font-semibold text-white/70 tracking-wider uppercase text-sm">Estimated Cost:</span>
            <span className="text-2xl font-bold text-pink-300">₹{itinerary.estimated_total_cost}</span>
          </div>
        </div>
      </motion.div>

      {/* Day Timeline */}
      <div className="space-y-8">
        {itinerary.days.map((day, dayIndex) => (
          <motion.div
            key={day.day}
            variants={itemVariants}
            className="bg-white rounded-[2rem] shadow-xl p-8 border-l-8 border-indigo-600 relative"
          >
            <div className="absolute -left-[3rem] top-8 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-600/30 hidden md:flex">
              {dayIndex + 1}
            </div>

            <h3 className="text-3xl font-bold text-indigo-900 mb-6 flex items-center gap-3">
              <span className="md:hidden">Day {day.day}</span>
              <span className="hidden md:inline">Day {day.day} Itinerary</span>
            </h3>

            <div className="space-y-4">
              {day.items.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02, translateX: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-indigo-50/50 hover:bg-indigo-100/50 transition-colors p-5 rounded-2xl border border-indigo-100 group"
                >
                  <div className="flex items-start gap-4 mb-2 sm:mb-0">
                    <div className="w-2 h-2 mt-2.5 rounded-full bg-pink-500 group-hover:scale-150 transition-transform"></div>
                    <div>
                      <span className="block font-bold text-indigo-950 text-xl">{item.place_name}</span>
                      <p className="text-indigo-600/70 font-medium tracking-wide flex items-center gap-2 mt-1">
                        ⏱️ {item.time_slot}
                      </p>
                    </div>
                  </div>
                  <span className="bg-white text-indigo-800 font-extrabold px-5 py-2 rounded-xl shadow-sm border border-indigo-100 group-hover:shadow-md transition-shadow">
                    ₹{item.estimated_cost}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
