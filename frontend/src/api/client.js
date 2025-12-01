const BASE_URL = "http://localhost:8000";

export async function searchPlaces(params = {}) {
  const url = new URL(`${BASE_URL}/api/places/search`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.append(k, v);
    }
  });
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch places");
  return res.json();
}

export async function createItinerary(payload) {
  const res = await fetch(`${BASE_URL}/api/itineraries/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.text();
    console.error(`API Error (${res.status}):`, errorData);
    throw new Error(`Failed to create itinerary: ${errorData}`);
  }
  return res.json();
}
