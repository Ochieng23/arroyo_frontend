// src/hooks/useSubscriptionTiers.js

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

/**
 * Custom hook to fetch subscription tiers for a given creator.
 *
 * @param {string} creatorId - The ID of the creator.
 * @returns {object} - An object containing the tiers, loading state, and error message.
 */
export default function useSubscriptionTiers(creatorId) {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!creatorId) {
      setTiers([]);
      setLoading(false);
      return;
    }

    const fetchSubscriptionTiers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://arroyob-ducqdydbheaxd9as.eastus-01.azurewebsites.net/creators/${creatorId}/subscription-tiers`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Include cookies if authentication is cookie-based
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch subscription tiers: ${response.statusText}`
          );
        }

        const data = await response.json();
        setTiers(data.tiers || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
        toast.error(err.message || "Unable to load subscription tiers.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionTiers();
  }, [creatorId]);

  return { tiers, loading, error };
}
