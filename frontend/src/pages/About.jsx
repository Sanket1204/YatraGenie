export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 mt-10">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
        About YatraGenie
      </h2>
      <p className="text-lg text-gray-700 leading-relaxed mb-4">
        YatraGenie is a next-generation travel planning assistant powered by
        smart algorithms that help you explore India affordably and efficiently.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        <div className="bg-white shadow-lg rounded-3xl p-6 text-center">
          <h3 className="font-bold mb-2 text-blue-600">AI-based Planning</h3>
          <p className="text-gray-600 text-sm">
            Intelligent day-wise itineraries crafted using your preferences.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-3xl p-6 text-center">
          <h3 className="font-bold mb-2 text-indigo-600">Budget Estimation</h3>
          <p className="text-gray-600 text-sm">
            Accurate estimates for food, transport, entries & more.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-3xl p-6 text-center">
          <h3 className="font-bold mb-2 text-pink-600">Smart Search</h3>
          <p className="text-gray-600 text-sm">
            Discover the best attractions in seconds.
          </p>
        </div>
      </div>
    </div>
  );
}
