// src/hooks/useUnsubscribe.js
import { useState } from "react";

const useUnsubscribe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const unsubscribe = async (subscriptionId) => {
    setLoading(true);
    setError(null);

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
      const res = await fetch(`${BASE_URL}/subscriptions/unsubscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ subscriptionId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Unsubscription failed.");
      }

      const data = await res.json();
      return data.success; // Adjust based on your API response structure
    } catch (err) {
      console.error(err);
      setError(err.message || "Unsubscription failed.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { unsubscribe, loading, error };
};

export default useUnsubscribe;
