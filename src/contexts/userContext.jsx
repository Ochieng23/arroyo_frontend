// context/UserContext.js

"use client";

import { createContext, useContext, useState, useEffect, useMemo } from "react";

// Create the UserContext
const UserContext = createContext(null);

// Create a provider component
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

  // useEffect to save or remove user in localStorage when user state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Failed to write user to localStorage", error);
      }
    }
  }, [user]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({ user, setUser }), [user]);

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

// Custom hook to use the UserContext
export function useUser() {
  return useContext(UserContext);
}
