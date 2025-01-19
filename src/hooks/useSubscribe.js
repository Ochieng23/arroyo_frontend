// src/hooks/useSubscribe.js
import { useState } from "react";

const useSubscribe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const subscribe = async (creatorId, tierId) => {
    setLoading(true);
    setError(null);

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
      const res = await fetch(`${BASE_URL}/subscriptions/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ creatorId, tierId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Subscription failed.");
      }

      const data = await res.json();
      return data.subscription; // Adjust based on your API response structure
    } catch (err) {
      console.error(err);
      setError(err.message || "Subscription failed.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { subscribe, loading, error };
};

export default useSubscribe;
