import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function confirm() {
      const session_id = searchParams.get("session_id");
      if (!session_id) {
        setError("No session id provided");
        setLoading(false);
        return;
      }

      try {
        const resp = await fetch(`/api/payments/confirm?session_id=${session_id}`);
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.detail || JSON.stringify(data));
        // navigate to result with itinerary in state
        navigate('/result', { state: { itinerary: data } });
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    }
    confirm();
  }, [searchParams, navigate]);

  if (loading) return <div className="text-center mt-20">Confirming payment and preparing your itinerary...</div>;
  if (error) return <div className="text-center mt-20 text-red-600">Error: {error}</div>;
  return null;
}
