// pages/notifications.js

"use client";

import React, { useEffect, useState } from "react";
import SidebarLayout from "@/components/CreatorDashboardLayout";
import {
  FaBell,
  FaUserPlus,
  FaComment, 
  FaMoneyBillAlt,
  FaTrash,
} from "react-icons/fa";
import { useUser } from "@/context/userContext";
import useSocket from "@/context/SocketContext"; // Import the socket context
import axios from "axios";
import { toast } from "react-toastify"; // For toast notifications

export default function NotificationsPage() {
  const { user, userDetails, loading: userLoading } = useUser(); // Include loading state
  const socket = useSocket(); // Access the Socket.IO client
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch notifications from the backend
   */
  const fetchNotifications = async () => {
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await axios.get(`${BASE_URL}/notifications`, {
        params: { userID: user.id }, // Pass user ID explicitly
        headers: { "Content-Type": "application/json" },
      });
      setNotifications(response.data.notifications || []);
    } catch (err) {
      console.error("Error fetching notifications:", err.response?.data || err.message);
      setError("Failed to fetch notifications.");
    }
  };

  /**
   * Handle marking a single notification as read
   */
  const handleMarkAsRead = async (notificationId) => {
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
      await axios.patch(
        `${BASE_URL}/notifications/${notificationId}/read`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error(
        "Error marking notification as read:",
        err.response?.data || err.message
      );
      toast.error("Failed to mark notification as read.");
    }
  };

  /**
   * Handle marking all notifications as read
   */
  const handleMarkAllRead = async () => {
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
      await axios.patch(
        `${BASE_URL}/notifications/read-all`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
      toast.success("All notifications marked as read.");
    } catch (err) {
      console.error(
        "Error marking all notifications as read:",
        err.response?.data || err.message
      );
      toast.error("Failed to mark all notifications as read.");
    }
  };

  /**
   * Handle removing read notifications
   */
  const handleRemoveRead = async () => {
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
      // Assuming you have an endpoint to delete read notifications
      await axios.delete(`${BASE_URL}/notifications`, {
        headers: { "Content-Type": "application/json" },
        data: { read: true }, // Payload to specify which notifications to delete
        withCredentials: true,
      });

      setNotifications((prev) => prev.filter((n) => !n.read));
      toast.success("Read notifications removed.");
    } catch (err) {
      console.error(
        "Error removing read notifications:",
        err.response?.data || err.message
      );
      toast.error("Failed to remove read notifications.");
    }
  };

  /**
   * Listen for real-time updates via Socket.IO
   */
  useEffect(() => {
    if (userLoading) return; // Wait until user data is loaded

    if (!user || !userDetails || !userDetails.id) {
      setLoading(false);
      setError("User not logged in or no user ID found.");
      return;
    }
    fetchNotifications(); // Fetch notifications on component mount

    // Listen for new notifications
    if (socket) {
      socket.on("newNotification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        toast.info(notification.text, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
    }

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.off("newNotification");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userDetails, socket, userLoading]);

  /**
   * Filter notifications based on selected filter
   */
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    return n.type === filter;
  });

  /**
   * Determine the appropriate icon based on notification type
   */
  const getIcon = (type) => {
    switch (type) {
      case "system":
        return <FaBell />;
      case "comment":
        return <FaComment />;
      case "subscriber":
        return <FaUserPlus />;
      case "purchase":
        return <FaMoneyBillAlt />;
      default:
        return <FaBell />;
    }
  };

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-gray-800">
        <h1 className="mb-4 text-2xl font-bold text-purple-700">
          Notifications
        </h1>

        {/* Filter and Actions */}
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* Filter buttons */}
          <div className="flex items-center gap-2">
            {["all", "system", "comment", "subscriber", "purchase"].map((f) => (
              <button
                key={f}
                className={`rounded-full border px-4 py-1 text-sm ${
                  filter === f
                    ? "bg-purple-600 text-white border-purple-600"
                    : "text-gray-600 border-gray-300 hover:bg-gray-100"
                }`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
            >
              Mark all read
            </button>
            <button
              onClick={handleRemoveRead}
              className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
            >
              <FaTrash className="text-xs" />
              Remove read
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {loading ? (
            <p className="text-sm text-gray-500">Loading notifications...</p>
          ) : error ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : filteredNotifications.length === 0 ? (
            <p className="text-sm text-gray-500">No notifications found.</p>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id} // Use `id` instead of `_id`
                className={`flex items-start gap-3 rounded-md border border-gray-200 p-3 cursor-pointer ${
                  notif.read ? "bg-white" : "bg-purple-50"
                }`}
                onClick={() => {
                  if (!notif.read) {
                    handleMarkAsRead(notif.id); // Use `id` instead of `_id`
                  }
                }}
              >
                <div className="mt-1 text-purple-600">{getIcon(notif.type)}</div>
                <div className="flex-1 text-sm">
                  <p
                    className={`${
                      notif.read ? "text-gray-700" : "font-semibold text-gray-800"
                    }`}
                  >
                    {notif.text}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}
