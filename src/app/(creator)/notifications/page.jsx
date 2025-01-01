"use client";

import React, { useState } from "react";
import SidebarLayout from "@/components/CreatorDashboardLayout";
import {
  FaBell,
  FaUserPlus,
  FaComment,
  FaMoneyBillAlt,
  FaTrash,
} from "react-icons/fa";

export default function NotificationsPage() {
  // Example notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "subscriber",
      text: "John Doe just subscribed at Silver Star tier.",
      time: "2 min ago",
      read: false,
    },
    {
      id: 2,
      type: "purchase",
      text: "Mary bought your exclusive track for Ksh.300.",
      time: "10 min ago",
      read: false,
    },
    {
      id: 3,
      type: "comment",
      text: "Mike commented on your recent video: “Awesome content!”",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 4,
      type: "system",
      text: "Scheduled maintenance on Aug 25, 2025.",
      time: "3 days ago",
      read: true,
    },
  ]);

  const [filter, setFilter] = useState("all");

  const handleMarkAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const handleRemoveRead = () => {
    setNotifications((prev) => prev.filter((n) => !n.read));
  };

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    return n.type === filter;
  });

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
            <button
              className={`rounded-full border px-4 py-1 text-sm ${
                filter === "all"
                  ? "bg-purple-600 text-white border-purple-600"
                  : "text-gray-600 border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`rounded-full border px-4 py-1 text-sm ${
                filter === "system"
                  ? "bg-purple-600 text-white border-purple-600"
                  : "text-gray-600 border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => setFilter("system")}
            >
              System
            </button>
            <button
              className={`rounded-full border px-4 py-1 text-sm ${
                filter === "comment"
                  ? "bg-purple-600 text-white border-purple-600"
                  : "text-gray-600 border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => setFilter("comment")}
            >
              Comments
            </button>
            <button
              className={`rounded-full border px-4 py-1 text-sm ${
                filter === "subscriber"
                  ? "bg-purple-600 text-white border-purple-600"
                  : "text-gray-600 border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => setFilter("subscriber")}
            >
              Subscribers
            </button>
            <button
              className={`rounded-full border px-4 py-1 text-sm ${
                filter === "purchase"
                  ? "bg-purple-600 text-white border-purple-600"
                  : "text-gray-600 border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => setFilter("purchase")}
            >
              Purchases
            </button>
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
          {filteredNotifications.length === 0 ? (
            <p className="text-sm text-gray-500">No notifications found.</p>
          ) : (
            filteredNotifications.map((notif) => {
              let icon;
              if (notif.type === "system") icon = <FaBell />;
              else if (notif.type === "comment") icon = <FaComment />;
              else if (notif.type === "subscriber") icon = <FaUserPlus />;
              else if (notif.type === "purchase") icon = <FaMoneyBillAlt />;
              else icon = <FaBell />;

              return (
                <div
                  key={notif.id}
                  className={`flex items-start gap-3 rounded-md border border-gray-200 p-3 ${
                    notif.read ? "bg-white" : "bg-purple-50"
                  }`}
                >
                  <div className="mt-1 text-purple-600">{icon}</div>
                  <div className="flex-1 text-sm">
                    <p
                      className={`${
                        notif.read ? "text-gray-700" : "font-semibold text-gray-800"
                      }`}
                    >
                      {notif.text}
                    </p>
                    <p className="text-xs text-gray-400">{notif.time}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}
