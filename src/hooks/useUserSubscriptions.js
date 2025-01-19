// src/hooks/useUserSubscriptions.js
import { useState, useEffect } from "react";

const useUserSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserSubscriptions = async () => {
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
        const res = await fetch(`${BASE_URL}/subscriptions/my`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Error fetching user subscriptions: ${res.statusText}`);
        }

        const data = await res.json();
        setSubscriptions(data.subscriptions || []); // Adjust based on your API response structure
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch user subscriptions.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserSubscriptions();
  }, []);

  return { subscriptions, loading, error };
};

export default useUserSubscriptions;
