import { motion } from "framer-motion";
import { FaRobot, FaWallet, FaMagic } from "react-icons/fa";

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 150 } }
  };

  const features = [
    { title: "AI-based Planning", desc: "Intelligent day-wise itineraries crafted using your preferences.", icon: FaRobot, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "Budget Estimation", desc: "Accurate estimates for food, transport, entries & more.", icon: FaWallet, color: "text-indigo-500", bg: "bg-indigo-50" },
    { title: "Smart Search", desc: "Discover the best attractions in seconds with our Genie.", icon: FaMagic, color: "text-pink-500", bg: "bg-pink-50" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto px-4 mt-16 mb-20"
    >
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-pink-500 mb-6 drop-shadow-sm"
        >
          About YatraGenie
        </motion.h2>
        <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-medium">
          YatraGenie is a next-generation travel planning assistant powered by
          smart algorithms that help you explore India affordably and efficiently.
        </p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid md:grid-cols-3 gap-8"
      >
        {features.map((feature, idx) => (
          <motion.div 
            key={idx}
            variants={itemVariants}
            whileHover={{ y: -10, scale: 1.02 }}
            className="bg-white shadow-xl hover:shadow-2xl transition-all rounded-[2rem] p-8 text-center border border-gray-100 group"
          >
            <div className={`w-20 h-20 mx-auto ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
              <feature.icon />
            </div>
            <h3 className="font-extrabold text-xl text-gray-800 mb-3">{feature.title}</h3>
            <p className="text-gray-500 font-medium">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
