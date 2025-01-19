"use client";

import React, { useEffect, useState } from "react";
import UserSidebarLayout from "@/components/FanDashboardLayout";
import Image from "next/image";
import { useUser } from "@/context/userContext";
import axios from "axios";
import { FiDollarSign, FiUpload } from "react-icons/fi";

function NotificationsPage() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [filter, setFilter] = useState("all"); // 'all', 'payment', 'upload'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true); // To track if more notifications are available

  // Fetch notifications when the component mounts or user changes
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        setLoading(true);

        // Fetch initial notifications
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications`,
          {
            params: { userID: user.id, limit: 20, skip: 0 }, // Fetch first 20
          }
        );

        setNotifications(response.data.notifications); // Use the 'notifications' key
        setFilteredNotifications(response.data.notifications);

        // Check if more notifications are available
        setHasMore(response.data.notifications.length === 20);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setError("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  // Fetch more notifications for infinite scroll
  const fetchMoreNotifications = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications`,
        {
          params: {
            userID: user.id,
            limit: 20,
            skip: notifications.length, // Skip already fetched notifications
          },
        }
      );

      // Append new notifications
      setNotifications((prev) => [...prev, ...response.data.notifications]);
      setFilteredNotifications((prev) => [
        ...prev,
        ...response.data.notifications,
      ]);

      // Update hasMore based on response
      setHasMore(response.data.notifications.length === 20);
    } catch (err) {
      console.error("Failed to load more notifications:", err);
    }
  };

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
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications/${id}/read`,
        null,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // Update local state to mark as read
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
        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="p-4 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
        )}

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
              onClick={() =>
                !notification.read && handleMarkAsRead(notification.id)
              }
            >
              {/* Icon Based on Notification Type */}
              <div
                className={`p-3 rounded-full bg-gray-100 ${
                  notification.type === "content_purchase"
                    ? "text-green-500"
                    : "text-gray-500"
                }`}
              >
                {notification.type === "content_purchase" ? (
                  <FiDollarSign size={24} />
                ) : (
                  <FiUpload size={24} />
                )}
              </div>

              {/* Notification Details */}
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {notification.title}
                </p>
                <p className="text-xs text-gray-600 mt-1">{notification.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* Load More Button */}
        {hasMore && !loading && (
          <button
            onClick={fetchMoreNotifications}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          >
            Load More
          </button>
        )}
      </div>
    </UserSidebarLayout>
  );
}

export default NotificationsPage;
