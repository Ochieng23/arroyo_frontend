import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useUser } from "@/context/userContext"; // Adjust the path as needed

const useSocket = () => {
  const { user } = useUser();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Ensure the user exists and has an ID before connecting
    if (user?.id) {
      const socketInstance = io("http://localhost:7000", {
        transports: ["websocket", "polling"], // Allow WebSocket and fallback to polling
        withCredentials: true, // Enable CORS credentials
        query: { userId: user.id }, // Pass userId as a query parameter
      });

      // Connection event
      socketInstance.on("connect", () => {
        console.log(`Connected to WebSocket server as user ${user.id}`);
      });

      // Disconnection event
      socketInstance.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
      });

      // Error handling for connection issues
      socketInstance.on("connect_error", (error) => {
        console.error("WebSocket connection error:", error);
      });

      // Store the socket instance
      setSocket(socketInstance);

      // Clean up the socket on component unmount or user change
      return () => {
        socketInstance.disconnect();
        console.log("Socket connection closed");
      };
    }
  }, [user]);

  return socket;
};

export default useSocket;
