"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import UserSidebarLayout from "@/components/FanDashboardLayout";
import { useUser } from "@/context/userContext";

export default function CreatorProfilePage() {
  const { id } = useParams();
  const [creatorr, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [normalizedContents, setNormalizedContents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  // State to manage user subscription
  const [userSubscription, setUserSubscription] = useState(null); // null or subscription tier
  const [isSubscribing, setIsSubscribing] = useState(false); // To handle subscription loading state

  // Normalization function to convert MongoDB-like fields to standard JS values
  const normalizeContent = (content) => ({
    _id: content._id?.$oid || content._id, // Fallback if already a string
    userId: content.user?.$oid || content.user,
    title: content.title || "Untitled Content",
    about: content.about || "",
    type: content.type || "unknown",
    url: content.url || "",
    thumbnail: content.thumbnail || "",
    tags: content.tags || [],
    priceType: content.priceType || "free", // Removed 'price' as it's now based on subscription
    createdAt: content.createdAt ? new Date(content.createdAt) : null,
    updatedAt: content.updatedAt ? new Date(content.updatedAt) : null,
    viewCount: content.viewCount || 0,
  });

  // Fetch the user (with all their data) by `id`
  useEffect(() => {
    if (!id) return;

    const fetchCreator = async () => {
      try {
        const res = await fetch(`http://localhost:8000/users/${id}`);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        setCreator(data);

        // Normalize contents immediately after fetching
        if (data.contents && Array.isArray(data.contents)) {
          const normalized = data.contents.map(normalizeContent);
          setNormalizedContents(normalized);
        }

        // TODO: Fetch user's subscription status for this creator
        // Replace the following mock data with an actual API call
        // Example: { tierId: "tier1", name: "Basic", price: 5 }
        setUserSubscription(null); // Assume no subscription initially
      } catch (error) {
        console.error("Error fetching creator:", error);
        setCreator(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCreator();
  }, [id]);

  // Debounce search input to optimize performance
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Handle loading and not found states
  if (loading) {
    return (
      <UserSidebarLayout className="bg-gray-50 min-h-screen">
        <p className="p-4">Loading creator profile...</p>
      </UserSidebarLayout>
    );
  }

  if (!creatorr) {
    return (
      <UserSidebarLayout className="bg-gray-50 min-h-screen">
        <p className="p-4">Creator not found.</p>
      </UserSidebarLayout>
    );
  }

  // Destructure the fields from the user payload
  const {
    bannerImage,
    profileImage,
    firstName,
    lastName,
    about,
    niche,
    phoneNumber,
    address,
    email,
    social = {}, // e.g. { facebook, x, youtube, ... }
    libraries = [], // array of creator's libraries
    creator = [], // Array of subscription tiers set by the creator
  } = creatorr;

  // Prepare fallback images
  const bannerSrc =
    bannerImage || "https://via.placeholder.com/1200x400?text=No+Banner";
  const avatarSrc =
    profileImage || "https://via.placeholder.com/200?text=No+Avatar";

  // Handle Search Filtering
  const filteredContents = normalizedContents.filter((content) => {
    const query = debouncedSearch.toLowerCase();
    const titleMatch = content.title.toLowerCase().includes(query);
    const tagsMatch = content.tags.some((tag) =>
      tag.toLowerCase().includes(query)
    );
    return titleMatch || tagsMatch;
  });

  // Handle Subscription Action
  const handleSubscribe = async (tier) => {
    // TODO: Implement actual subscription logic (e.g., integrate with payment gateway)
    // For demonstration, we'll simulate a subscription with a timeout
    setIsSubscribing(tier.id);
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // After successful subscription, update the userSubscription
      setUserSubscription(tier);

      alert(`Subscribed to ${tier.name} tier successfully!`);
    } catch (error) {
      console.error("Subscription failed:", error);
      alert("Subscription failed. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <UserSidebarLayout className="bg-gray-50 min-h-screen">
      {/* Banner */}
      <header className="relative w-full h-64 overflow-hidden">
        <img
          src={bannerSrc}
          alt="Creator Banner"
          className="object-cover w-full h-full"
        />
      </header>

      {/* Profile Section */}
      <section className="relative flex flex-col items-center px-4">
        {/* Avatar overlaps banner */}
        <div className="w-32 h-32 rounded-full overflow-hidden -mt-16 shadow-lg border-4 border-white">
          <img
            src={avatarSrc}
            alt="Creator Avatar"
            className="object-cover w-full h-full"
          />
        </div>

        <h1 className="mt-4 text-2xl font-bold">
          {firstName} {lastName}
        </h1>
        <p className="italic text-gray-600 mb-1">{about || "No bio yet..."}</p>

        {niche && (
          <p className="text-sm text-gray-500 mb-2">
            <strong>Niche:</strong> {niche}
          </p>
        )}
      </section>

      {/* Navigation Tabs */}
      <nav className="bg-white border-t border-b border-gray-200">
        <ul className="flex justify-center space-x-6 text-gray-700 font-medium">
          <li>
            <button
              onClick={() => setActiveTab("home")}
              className={`block px-4 py-3 hover:bg-gray-100 ${
                activeTab === "home" ? "text-blue-600" : ""
              }`}
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("about")}
              className={`block px-4 py-3 hover:bg-gray-100 ${
                activeTab === "about" ? "text-blue-600" : ""
              }`}
            >
              About
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("subscriptions")}
              className={`block px-4 py-3 hover:bg-gray-100 ${
                activeTab === "subscriptions" ? "text-blue-600" : ""
              }`}
            >
              Subscriptions
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("collections")}
              className={`block px-4 py-3 hover:bg-gray-100 ${
                activeTab === "collections" ? "text-blue-600" : ""
              }`}
            >
              Collections
            </button>
          </li>
        </ul>
      </nav>

      {/* Tab Content */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        {/* HOME TAB: Show content based on subscription */}
        {activeTab === "home" && (
          <div>
            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search content by title or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <h2 className="text-2xl font-bold mb-4">Home</h2>
            {filteredContents.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContents.map((item) => {
                  const isFree = item.priceType === "free";
                  const hasAccess = isFree || userSubscription;

                  return (
                    <div
                      key={item._id}
                      className="bg-white rounded-lg overflow-hidden shadow-lg flex flex-col"
                    >
                      {/* Content Display */}
                      <div className="relative h-48">
                        {/* For Videos */}
                        {item.type === "video" ? (
                          hasAccess ? (
                            <video
                              src={item.url}
                              poster={item.thumbnail}
                              controls
                              className="w-full h-full object-cover"
                            >
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <img
                              src={
                                item.thumbnail ||
                                "https://via.placeholder.com/400x200"
                              }
                              alt={item.title}
                              className="w-full h-full object-cover filter blur-sm"
                            />
                          )
                        ) : (
                          // For Images and Downloadables
                          <img
                            src={item.url}
                            alt={item.title}
                            className={`w-full h-full object-cover transition-transform duration-300 ${
                              !hasAccess ? "filter blur-sm" : ""
                            }`}
                          />
                        )}
                      </div>

                      {/* Content Details */}
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="text-lg font-bold">{item.title}</h3>
                        <p className="text-sm text-gray-400 mb-2">
                          {item.createdAt
                            ? item.createdAt.toLocaleDateString()
                            : "N/A"}
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          {item.about.length > 100
                            ? `${item.about.slice(0, 100)}...`
                            : item.about}
                        </p>

                        {/* Render Content Based on Access and Type */}
                        {hasAccess && (
                          <>
                            {item.type === "video" && (
                              // Video already rendered above
                              <></>
                            )}

                            {item.type === "image" && (
                              <img
                                src={item.url}
                                alt={item.title}
                                className="w-full h-32 object-cover rounded"
                              />
                            )}

                            {item.type === "downloadable" && (
                              <a
                                href={item.url}
                                download
                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded mt-auto"
                              >
                                Download
                              </a>
                            )}

                            {/* Add more content types as needed */}
                          </>
                        )}

                        {/* Subscription Prompt */}
                        {!hasAccess && !isFree && (
                          <div className="mt-auto">
                            <p className="text-gray-700 mb-2">
                              Subscribe to access this content.
                            </p>
                            <button
                              onClick={() => setActiveTab("subscriptions")}
                              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded"
                            >
                              View Subscriptions
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Footer Section */}
                      <div className="flex items-center justify-between p-4 border-t border-gray-200">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1 text-gray-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                              />
                            </svg>
                            <span>{item.viewCount}</span>
                          </span>
                          <span className="flex items-center space-x-1 text-gray-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2h-2m-4 0h-4m6-10h-2m-6 0H5a2 2 0 00-2 2v8a2 2 0 002 2h2m6-10h-2m4-2a2 2 0 110-4m-4 4a2 2 0 100-4"
                              />
                            </svg>
                            <span>74</span>
                          </span>
                        </div>
                        {/* Action Button (e.g., Share) */}
                        <button className="text-gray-500 hover:text-gray-700">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 10l7-7m0 0l7 7m-7-7v18"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>No content available for this creator.</p>
            )}
          </div>
        )}

        {/* SUBSCRIPTIONS TAB: Show subscription tiers and allow subscribing */}
        {/* SUBSCRIPTIONS TAB: Show subscription tiers and allow subscribing */}
{activeTab === "subscriptions" && (
  <div>
    <h2 className="text-2xl font-bold mb-4">Subscriptions</h2>
    {creator?.subscriptionTiers?.length ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creator?.subscriptionTiers.map((tier) => {
          const isCurrentTier =
            userSubscription && userSubscription.id === tier._id;

          return (
            <div
              key={tier._id}
              className={`border rounded-lg p-6 flex flex-col ${
                isCurrentTier ? "border-blue-500" : "border-gray-300"
              }`}
            >
              <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
              <p className="text-gray-600 mb-4">{tier.description}</p>
              <p className="text-2xl font-bold mb-4">
                KES {tier.price} / month
              </p>
              {isCurrentTier ? (
                <button
                  className="mt-auto bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
                  onClick={() => {
                    // TODO: Implement unsubscribe logic
                    alert("Unsubscribe functionality to be implemented.");
                  }}
                >
                  Unsubscribe
                </button>
              ) : (
                <button
                  onClick={() => handleSubscribe(tier)}
                  className="mt-auto bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
                  disabled={isSubscribing === tier._id}
                >
                  {isSubscribing === tier._id
                    ? "Processing..."
                    : `Subscribe to ${tier.name}`}
                </button>
              )}
            </div>
          );
        })}
      </div>
    ) : (
      <p>No subscription tiers available for this creator.</p>
    )}
  </div>
)}

{/* ABOUT TAB: Show about info, plus contact details */}
{activeTab === "about" && (
  <div>
    <h2 className="text-2xl font-bold mb-4">About</h2>
    <p>{about || "No bio available for this creator."}</p>
    {email && (
      <p className="text-gray-700 mt-2">
        <strong>Email:</strong> {email}
      </p>
    )}
    {phoneNumber && (
      <p className="text-gray-700">
        <strong>Phone:</strong> {phoneNumber}
      </p>
    )}
    {address && (
      <p className="text-gray-700">
        <strong>Address:</strong> {address}
      </p>
    )}
  </div>
)}

        {/* COLLECTIONS TAB: Show the creator’s libraries */}
        {activeTab === "collections" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Collections</h2>
            {libraries.length ? (
              <ul className="list-disc list-inside space-y-2">
                {libraries.map((library) => (
                  <li key={library._id}>{library.name}</li>
                ))}
              </ul>
            ) : (
              <p>No libraries found for this creator.</p>
            )}
          </div>
        )}
      </section>
    </UserSidebarLayout>
  );
}
