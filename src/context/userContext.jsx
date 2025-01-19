// /contexts/UserContext.js

"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

// Create the UserContext with an initial value
const UserContext = createContext({
  user: null,
  setUser: () => {},
  userDetails: null,
  setUserDetails: () => {},
  loadingUserDetails: false,
  userDetailsError: null,
});

// UserProvider component that wraps around children components
export function UserProvider({ children }) {
  // Initialize user state with a function to read from localStorage
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          return JSON.parse(storedUser);
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
      }
    }
    return null;
  });

  // State to hold userDetails
  const [userDetails, setUserDetails] = useState(null);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  const [userDetailsError, setUserDetailsError] = useState(null);

  // useEffect to save or remove user in localStorage when user state changes
  useEffect(() => {
    // console.log("User state changed:", user);
    if (typeof window !== "undefined") {
      try {
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          localStorage.removeItem("user");
          setUserDetails(null); // Clear userDetails when user logs out
        }
      } catch (error) {
        console.error("Failed to write user to localStorage", error);
      }
    }
  }, [user]);

  // useEffect to fetch userDetails when user.id changes
  useEffect(() => {
    console.log("User ID for fetching details:", user?.id);
    // If there's no user or user.id, do not fetch
    if (!user?.id) {
      console.log("No user.id found. Skipping fetchUserDetails.");
      setUserDetails(null);
      return;
    }

    // Define an asynchronous function to fetch userDetails
    const fetchUserDetails = async () => {
      setLoadingUserDetails(true);
      setUserDetailsError(null);
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!apiBaseUrl) {
          throw new Error("API base URL is not defined in environment variables.");
        }

        const url = `${apiBaseUrl}/users/${user.id}`;
        // console.log("Fetching userDetails from:", url);

        const response = await fetch(url);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error fetching user details: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        // console.log("Fetched userDetails:", data);
        setUserDetails(data);
      } catch (error) {
        console.error("Failed to fetch user details", error);
        setUserDetailsError(error);
      } finally {
        setLoadingUserDetails(false);
      }
    };

    fetchUserDetails();
  }, [user?.id]);

  // console.log("User in Context:", user);
  // console.log("UserDetails in Context:", userDetails);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      userDetails,
      setUserDetails,
      loadingUserDetails,
      userDetailsError,
    }),
    [user, userDetails, loadingUserDetails, userDetailsError]
  );

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}

// Custom hook to use the UserContext
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
