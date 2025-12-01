import { useLocation } from "react-router-dom";
import ItineraryView from "../components/ItineraryView";

export default function ItineraryResult() {
  const { state } = useLocation();
  
  if (!state?.itinerary) {
    return <p className="text-center mt-10">No itinerary found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      <ItineraryView itinerary={state.itinerary} />
    </div>
  );
}
