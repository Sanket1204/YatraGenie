import React from "react";

export default function ItineraryOptionsModal({ options, onClose, onChoose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div className="relative bg-[rgba(6,6,20,0.95)] text-gray-100 rounded-2xl p-6 w-full max-w-4xl shadow-2xl border border-[rgba(255,255,255,0.04)]">
        <h3 className="text-2xl font-semibold mb-4">Choose an itinerary option</h3>
        <div className="grid grid-cols-1 gap-4">
          {options.map((opt, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)]">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <div className="text-lg font-semibold">{opt.variant.toUpperCase()}</div>
                  <div className="text-sm text-gray-400">{opt.summary}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-orange-400">₹{Math.round(opt.estimated_total_cost)}</div>
                  <div className="text-xs text-gray-400">Est. cost</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-300">{opt.days.length} days • {opt.budget_fit}</div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 rounded-md border border-[rgba(255,255,255,0.04)] text-sm" onClick={() => onChoose(opt)}>
                    Select
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-right">
          <button className="px-4 py-2 rounded-lg" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
