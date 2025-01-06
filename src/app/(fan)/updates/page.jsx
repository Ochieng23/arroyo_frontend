// /src/app/(fan)/home/page.jsx

"use client";

import React, { useEffect, useState } from "react";
import UserSidebarLayout from "@/components/FanDashboardLayout";
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";
import axios from "axios";
import { FiDollarSign, FiUpload } from "react-icons/fi"; // Icons for notification types

function NotificationsPage() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [filter, setFilter] = useState("all"); // 'all', 'payment', 'upload'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications when the component mounts or user changes
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`, // Adjust according to your auth setup
            },
          }
        );
        setNotifications(response.data.notifications);
        setFilteredNotifications(response.data.notifications);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setError("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  // Filter notifications based on selected filter
  useEffect(() => {
    if (filter === "all") {
      setFilteredNotifications(notifications);
    } else {
      setFilteredNotifications(
        notifications.filter((n) => n.type === filter)
      );
    }
  }, [filter, notifications]);

  // Handle marking a notification as read
  const handleMarkAsRead = async (id) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications/mark-as-read`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      // Update the local state to mark as read
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                read: true,
              }
            : n
        )
      );
      setFilteredNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                read: true,
              }
            : n
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      // Optionally, display a user-facing error message
    }
  };

  return (
    <UserSidebarLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>

        {/* Filter Buttons */}
        <div className="flex space-x-4 mb-6">
          {[
            { label: "All", value: "all" },
            { label: "Payments", value: "payment" },
            { label: "Uploads", value: "upload" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-md ${
                filter === f.value
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } transition`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && <p>Loading notifications...</p>}

        {/* Error State */}
        {error && <p className="text-red-500">{error}</p>}

        {/* No Notifications */}
        {!loading && !error && filteredNotifications.length === 0 && (
          <p>No notifications to display.</p>
        )}

        {/* Notifications List */}
        <ul className="space-y-4">
          {filteredNotifications.map((notification) => (
            <li
              key={notification.id}
              className={`flex items-start p-4 bg-white rounded-lg shadow hover:bg-gray-50 transition ${
                !notification.read ? "border-l-4 border-purple-600" : ""
              } cursor-pointer`}
              onClick={() => !notification.read && handleMarkAsRead(notification.id)}
            >
              {/* Icon Based on Notification Type */}
              <div
                className={`p-3 rounded-full bg-gray-100 ${
                  notification.type === "payment"
                    ? "text-green-500"
                    : notification.type === "upload"
                    ? "text-blue-500"
                    : "text-gray-500"
                }`}
              >
                {notification.type === "payment" ? (
                  <FiDollarSign size={24} />
                ) : notification.type === "upload" ? (
                  <FiUpload size={24} />
                ) : (
                  <FiUpload size={24} />
                )}
              </div>

              {/* Notification Details */}
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <p
                    className={`text-sm font-medium text-gray-900 ${
                      !notification.read ? "font-semibold" : ""
                    }`}
                  >
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(notification.date).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center mt-2">
                  {notification.profileImage ? (
                    <Image
                      src={notification.profileImage}
                      alt={`${notification.creator} Profile`}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <Image
                      src="/placeholder-avatar.jpg"
                      alt="Default Profile"
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  )}
                  <p className="ml-2 text-xs text-gray-600">
                    {notification.creator}
                  </p>
                </div>
                {notification.type === "payment" && (
                  <p className="text-xs text-gray-500 mt-1">
                    Amount: ${notification.amount}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </UserSidebarLayout>
  );
}

export default NotificationsPage;
