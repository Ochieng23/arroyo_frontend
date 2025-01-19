"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation"; // Ensure correct import based on Next.js version
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import UserSidebarLayout from "@/components/FanDashboardLayout";
import Modal from "@/components/Modal";
import useSubscribe from "@/hooks/useSubscribe";
import useUnsubscribe from "@/hooks/useUnsubscribe";
import useUserSubscriptions from "@/hooks/useUserSubscriptions";
import { useUser } from "@/context/userContext";

/**
 * Helper function to return SVG icons based on the platform.
 * @param {string} platform - The name of the social platform.
 * @returns {JSX.Element|null} The SVG icon or null if the platform is unsupported.
 */
const getSocialIcon = (platform) => {
  const size = "20";
  const icons = {
    facebook: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-${size} w-${size}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M22 12c0-5.522-4.478-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898v-2.891h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.891h-2.33v6.987C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
    twitter: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-${size} w-${size}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04A4.28 4.28 0 0016.11 4c-2.37 0-4.3 1.93-4.3 4.3 0 .34.04.67.12.99A12.17 12.17 0 013 5.15a4.28 4.28 0 001.33 5.73 4.27 4.27 0 01-1.95-.54v.05c0 2.08 1.48 3.82 3.44 4.22a4.3 4.3 0 01-1.93.07c.54 1.69 2.11 2.92 3.97 2.95A8.6 8.6 0 012 19.54a12.13 12.13 0 006.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19-.004-.38-.013-.57A8.72 8.72 0 0024 5.5a8.56 8.56 0 01-2.54.7z" />
      </svg>
    ),
    // Add more platforms as needed
  };

  return icons[platform.toLowerCase()] || null;
};

/**
 * Normalizes content data to ensure consistent structure.
 * @param {Object} content - The content object from the API.
 * @returns {Object} The normalized content object.
 */
const normalizeContent = (content) => ({
  _id: content._id,
  userId: content.user_id, // Updated from content.user to content.user_id
  title: content.title || "Untitled Content",
  about: content.about || "",
  type: content.type || "unknown",
  url: content.url || "",
  thumbnail: content.thumbnail || "",
  tags: content.tags || [],
  priceType: content.priceType || "free",
  price: content.price || 0,
  createdAt: content.createdAt ? new Date(content.createdAt) : null,
  updatedAt: content.updatedAt ? new Date(content.updatedAt) : null,
  viewCount: content.viewCount || 0,
});

/**
 * The main component for displaying a creator's profile.
 */
export default function CreatorProfilePage() {
  const { id } = useParams(); // Creator ID from route
  const { user } = useUser(); // Current logged-in user

  // State Hooks
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [normalizedContents, setNormalizedContents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [userSubscription, setUserSubscription] = useState(null);
  const [accessMap, setAccessMap] = useState({});
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [isProcessing, setIsProcessing] = useState(null); // Tracks processing state

  // Custom Hooks
  const {
    subscribe,
    loading: subscribeLoading,
    error: subscribeError,
  } = useSubscribe();
  const {
    unsubscribe,
    loading: unsubscribeLoading,
    error: unsubscribeError,
  } = useUnsubscribe();
  const {
    subscriptions,
    loading: subsLoading,
    error: subsError,
  } = useUserSubscriptions();

  // React Hook Form Instances
  const {
    register: registerPurchase,
    handleSubmit: handleSubmitPurchase,
    reset: resetPurchase,
    formState: { errors: errorsPurchase },
  } = useForm();
  const {
    register: registerSubscribe,
    handleSubmit: handleSubmitSubscribe,
    reset: resetSubscribe,
    formState: { errors: errorsSubscribe },
  } = useForm();

  /**
   * Fetches the creator's data from the backend.
   */
  const fetchCreator = useCallback(async () => {
    if (!id) return;

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await axios.get(`${BASE_URL}/users/${id}`, {
        withCredentials: true,
      });

      const data = response.data;
      setCreator(data);

      // Normalize and set contents
      if (Array.isArray(data.contents)) {
        const normalized = data.contents.map(normalizeContent);
        setNormalizedContents(normalized);
      }

      // Find active subscription for this creator
      if (Array.isArray(subscriptions)) {
        const activeSub = subscriptions.find(
          (sub) => sub.creator.toString() === id && sub.status === "active"
        );
        setUserSubscription(activeSub || null);
      }
    } catch (error) {
      console.error("Error fetching creator:", error);
      setCreator(null);
      toast.error("Failed to load creator profile.");
    } finally {
      setLoading(false);
    }
  }, [id, subscriptions]);

  /**
   * Checks access status for all contents.
   */
  const checkAccessForContents = useCallback(async () => {
    if (!creator || !normalizedContents.length || !user) return;

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
      const contentIds = normalizedContents.map((content) => content._id);

      const accessRequests = contentIds.map((contentId) =>
        axios.get(`${BASE_URL}/content/${contentId}/access`, { // Updated endpoint
          params: {
            user_id: user.id, // Updated from user.id to user._id
          },
          withCredentials: true, // Ensure credentials are sent if required
        })
      );

      const accessResponses = await Promise.all(accessRequests);

      const newAccessMap = {};
      accessResponses.forEach((response, index) => {
        const contentId = contentIds[index];
        newAccessMap[contentId] = response.data.accessGranted;
      });

      setAccessMap(newAccessMap);
    } catch (error) {
      console.error("Error checking access statuses:", error);
      toast.error("Failed to fetch access statuses.");
    }
  }, [creator, normalizedContents, user]);

  /**
   * Debounces the search input to optimize performance.
   */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  /**
   * Fetches creator data on component mount or when `id` changes.
   */
  useEffect(() => {
    fetchCreator();
  }, [fetchCreator]);

  /**
   * Checks access after contents are loaded or when user changes.
   */
  useEffect(() => {
    if (normalizedContents.length && user) {
      checkAccessForContents();
    }
  }, [normalizedContents, user, checkAccessForContents]);

  /**
   * Handles the subscribe button click.
   * @param {Object|null} tier - The subscription tier selected or null.
   */
  const handleSubscribeClick = (tier) => {
    if (tier) {
      setSelectedTier(tier);
      setIsSubscribeModalOpen(true);
    } else {
      setActiveTab("subscriptions");
      toast.info("Please select a subscription tier from the Subscriptions tab.");
    }
  };

  /**
   * Handles the purchase button click.
   * @param {Object} item - The content item selected for purchase.
   */
  const handlePurchaseClick = (item) => {
    setSelectedItem(item);
    setIsPurchaseModalOpen(true);
  };

  /**
   * Initializes subscription payment with Paystack.
   * @param {Object} data - The form data submitted.
   */
  const onSubmitSubscribe = async (data) => {
    if (!selectedTier) return;

    const paystackAmount = parseFloat(selectedTier.price.toFixed(2)) * 100; // Convert to kobo
    const paystackReference = uuidv4();

    const billingAddress = {
      name: data.name,
      address_line1: data.address_line1,
      address_line2: data.address_line2,
      city: data.city,
      state: data.state,
      postal_code: data.postal_code,
      country: data.country,
    };

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

      const paystackPayload = {
        paystack_reference: paystackReference,
        email: user?.email,
        amount: paystackAmount,
        callback_url: `${window.location.origin}/payment-callback`,
        subaccount: creator?.creator?.subaccountCode, // Updated from creatorInfo to creator
        metadata: {
          userId: user?.id, // Updated from user.id to user._id
          creatorId: creator?.creator?._id, // Updated from creatorInfo to creator
          purchaseType: "subscription",
          subscriptionUuid: uuidv4(),
          billingAddress,
        },
      };

      console.log("=== [DEBUG] Subscription Payload ===");
      console.log(JSON.stringify(paystackPayload, null, 2));

      setIsProcessing(selectedTier._id);

      const response = await axios.post(
        `${BASE_URL}/payments/paystack/initialize`, // Updated endpoint
        paystackPayload,
        { withCredentials: true }
      );

      if (response.data.authorization_url) {
        window.location.href = response.data.authorization_url;
      } else {
        throw new Error("No Paystack authorization_url received.");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error(error.response?.data?.message || "Subscription failed.");
    } finally {
      setIsSubscribeModalOpen(false);
      setSelectedTier(null);
      resetSubscribe();
      setIsProcessing(null);
    }
  };

  /**
   * Initializes individual purchase payment with Paystack.
   * @param {Object} data - The form data submitted.
   */
  const onSubmitPurchase = async (data) => {
    if (!selectedItem) return;

    const paystackAmount = parseFloat(selectedItem.price.toFixed(2)) * 100; // Convert to kobo
    const paystackReference = uuidv4();

    const billingAddress = {
      name: data.name,
      address_line1: data.address_line1,
      address_line2: data.address_line2,
      city: data.city,
      state: data.state,
      postal_code: data.postal_code,
      country: data.country,
    };

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

      const paystackPayload = {
        paystack_reference: paystackReference,
        email: user?.email,
        amount: paystackAmount,
        callback_url: `${window.location.origin}/payment-callback`,
        subaccount: creator?.creator?.subaccountCode, // Updated from creatorInfo to creator
        metadata: {
          userId: user?.id, // Updated from user.id to user._id
          creatorId: creator?.creator?._id, // Updated from creatorInfo to creator
          contentId: selectedItem?._id,
          purchaseType: "individual",
          billingAddress,
        },
      };

      console.log("=== [DEBUG] Purchase Payload ===");
      console.log(JSON.stringify(paystackPayload, null, 2));

      setIsProcessing(selectedItem._id);

      const response = await axios.post(
        `${BASE_URL}/payments/paystack/initialize`, // Updated endpoint
        paystackPayload,
        { withCredentials: true }
      );

      if (response.data.authorization_url) {
        window.location.href = response.data.authorization_url;
      } else {
        throw new Error("No Paystack authorization_url received.");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error(error.response?.data?.message || "Purchase failed.");
    } finally {
      setIsPurchaseModalOpen(false);
      setSelectedItem(null);
      resetPurchase();
      setIsProcessing(null);
    }
  };

  /**
   * Handles unsubscribing from a subscription tier.
   */
  const handleUnsubscribe = async () => {
    if (!userSubscription) return;

    try {
      await unsubscribe(userSubscription._id);
      setUserSubscription(null);
      toast.success("Unsubscribed successfully.");
      // Refetch access statuses after unsubscribing
      checkAccessForContents();
    } catch (error) {
      console.error("Error unsubscribing:", error);
      toast.error(error.response?.data?.message || "Unsubscription failed.");
    }
  };

  /**
   * Filters contents based on the debounced search query.
   */
  const filteredContents = useMemo(() => {
    const query = debouncedSearch.toLowerCase();
    return normalizedContents.filter(
      (content) =>
        content.title.toLowerCase().includes(query) ||
        content.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [debouncedSearch, normalizedContents]);

  /**
   * Extracts social platforms with valid URLs.
   */
  const socialPlatforms = useMemo(() => {
    if (!creator?.creator?.social) return []; // Updated from creatorInfo to creator

    const { social } = creator.creator; // Updated from creatorInfo to creator

    const platforms = [
      "facebook",
      "x",
      "youtube",
      "spotify",
      "instagram",
      "tiktok",
      "pinterest",
    ];

    return platforms
      .map((platform) => [platform, social[platform]])
      .filter(([_, url]) => url && url.trim() !== "");
  }, [creator]);

  /**
   * Extracts subscription tiers.
   */
  const subscriptionTiers = useMemo(() => {
    return creator?.creator?.subscriptionTiers || []; // Updated from creatorInfo to creator
  }, [creator]);

  /**
   * Renders the component.
   */
  return (
    <UserSidebarLayout className="bg-gray-50 min-h-screen">
      {/* Banner */}
      <header className="relative w-full h-64 overflow-hidden">
        <img
          src={creator?.bannerImage || "https://via.placeholder.com/1200x400?text=No+Banner"}
          alt="Creator Banner"
          className="object-cover w-full h-full"
        />
      </header>

      {/* Profile */}
      <section className="relative flex flex-col items-center px-4">
        <div className="w-32 h-32 rounded-full overflow-hidden -mt-16 shadow-lg border-4 border-white">
          <img
            src={creator?.profileImage || "https://via.placeholder.com/200?text=No+Avatar"}
            alt="Creator Avatar"
            className="object-cover w-full h-full"
          />
        </div>
        <h1 className="mt-4 text-2xl font-bold">
          {creator?.firstName} {creator?.lastName}
        </h1>
        <p className="italic text-gray-600 mb-1">{creator?.about || "No bio yet..."}</p>
        {creator?.niche && (
          <p className="text-sm text-gray-500 mb-2">
            <strong>Niche:</strong> {creator.niche}
          </p>
        )}

        {/* Social Links */}
        <div className="flex space-x-4 mt-2">
          {socialPlatforms.map(([platform, url]) => (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-500"
              aria-label={platform}
            >
              {getSocialIcon(platform)}
            </a>
          ))}
        </div>
      </section>

      {/* Tabs */}
      <nav className="bg-white border-t border-b border-gray-200">
        <ul className="flex justify-center space-x-6 text-gray-700 font-medium">
          {["home", "about", "subscriptions", "collections"].map((tab) => (
            <li key={tab}>
              <button
                onClick={() => setActiveTab(tab)}
                className={`block px-4 py-3 hover:bg-gray-100 ${
                  activeTab === tab ? "text-blue-600" : ""
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Tab Content */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        {/* SUBSCRIPTIONS Tab */}
        {activeTab === "subscriptions" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Subscriptions</h2>
            {subsLoading ? (
              <p>Loading subscription tiers...</p>
            ) : subscriptionTiers.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subscriptionTiers.map((tier) => {
                  const isCurrentTier =
                    userSubscription &&
                    userSubscription.tier.toString() === tier._id.toString();

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
                        KES {tier.price.toFixed(2)} / month
                      </p>

                      {isCurrentTier ? (
                        <button
                          className="mt-auto bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
                          onClick={handleUnsubscribe}
                          disabled={unsubscribeLoading}
                        >
                          {unsubscribeLoading ? "Processing..." : "Unsubscribe"}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSubscribeClick(tier)}
                          className="mt-auto bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
                          disabled={subscribeLoading}
                        >
                          {subscribeLoading
                            ? "Processing..."
                            : `Subscribe to ${tier.name}`}
                        </button>
                      )}
                      {subscribeError && (
                        <p className="text-red-500 mt-2">{subscribeError}</p>
                      )}
                      {unsubscribeError && (
                        <p className="text-red-500 mt-2">{unsubscribeError}</p>
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

        {/* HOME Tab */}
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
                  const hasAccess = accessMap[item._id] || isFree;

                  return (
                    <div
                      key={item._id}
                      className="bg-white rounded-lg overflow-hidden shadow-lg flex flex-col"
                    >
                      {/* Thumbnail / Video */}
                      <div className="relative h-48">
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
                                "https://via.placeholder.com/400x200?text=No+Thumbnail"
                              }
                              alt={item.title}
                              className="w-full h-full object-cover filter blur-sm"
                            />
                          )
                        ) : (
                          <img
                            src={item.url}
                            alt={item.title}
                            className={`w-full h-full object-cover ${
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

                        {hasAccess && (
                          <>
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
                          </>
                        )}

                        {!hasAccess && !isFree && (
                          <div className="mt-auto">
                            <p className="text-gray-700 mb-2">
                              {userSubscription
                                ? "Upgrade your subscription to access this content."
                                : "Subscribe or purchase to access this content."}
                            </p>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handlePurchaseClick(item)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                                disabled={isProcessing === item._id}
                              >
                                {isProcessing === item._id
                                  ? "Processing..."
                                  : `Buy for KES ${item.price.toFixed(2)}`}
                              </button>
                              <button
                                onClick={() => handleSubscribeClick(null)}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded"
                              >
                                Subscribe
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
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
              <p>No content found.</p>
            )}
          </div>
        )}

        {/* ABOUT Tab */}
        {activeTab === "about" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <p>{creator?.about || "No bio available for this creator."}</p>
            {creator?.creator?.email && ( // Updated from creatorInfo to creator
              <p className="text-gray-700 mt-2">
                <strong>Email:</strong> {creator.creator.email}
              </p>
            )}
            {creator?.creator?.phoneNumber && ( // Updated from creatorInfo to creator
              <p className="text-gray-700">
                <strong>Phone:</strong> {creator.creator.phoneNumber}
              </p>
            )}
            {creator?.creator?.address && ( // Updated from creatorInfo to creator
              <p className="text-gray-700">
                <strong>Address:</strong> {creator.creator.address}
              </p>
            )}
          </div>
        )}

        {/* COLLECTIONS Tab */}
        {activeTab === "collections" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Collections</h2>
            {creator?.creator?.libraries && creator.creator.libraries.length ? ( // Updated from creatorInfo to creator
              <ul className="list-disc list-inside space-y-2">
                {creator.creator.libraries.map((library) => (
                  <li key={library._id}>{library.name}</li>
                ))}
              </ul>
            ) : (
              <p>No libraries found for this creator.</p>
            )}
          </div>
        )}
      </section>

      {/* Purchase Modal */}
      {selectedItem && (
        <Modal
          isOpen={isPurchaseModalOpen}
          closeModal={() => {
            setIsPurchaseModalOpen(false);
            setSelectedItem(null);
            resetPurchase();
            setIsProcessing(null);
          }}
          title={`Purchase: ${selectedItem.title}`}
        >
          <form onSubmit={handleSubmitPurchase(onSubmitPurchase)}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                {...registerPurchase("name", { required: true })}
                type="text"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errorsPurchase.name ? "border-red-500" : ""
                }`}
              />
              {errorsPurchase.name && (
                <p className="text-red-500 text-sm mt-1">Name is required.</p>
              )}
            </div>
            {/* Additional billing fields can be added here */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
              disabled={isProcessing === selectedItem._id}
            >
              {isProcessing === selectedItem._id ? "Processing..." : "Submit Purchase"}
            </button>
          </form>
        </Modal>
      )}

      {/* Subscribe Modal */}
      {selectedTier && (
        <Modal
          isOpen={isSubscribeModalOpen}
          closeModal={() => {
            setIsSubscribeModalOpen(false);
            setSelectedTier(null);
            resetSubscribe();
            setIsProcessing(null);
          }}
          title={`Subscribe to ${selectedTier.name}`}
        >
          <form onSubmit={handleSubmitSubscribe(onSubmitSubscribe)}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                {...registerSubscribe("name", { required: true })}
                type="text"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errorsSubscribe.name ? "border-red-500" : ""
                }`}
              />
              {errorsSubscribe.name && (
                <p className="text-red-500 text-sm mt-1">Name is required.</p>
              )}
            </div>
            {/* Additional billing fields can be added here */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
              disabled={isProcessing === selectedTier._id}
            >
              {isProcessing === selectedTier._id ? "Processing..." : "Submit Subscription"}
            </button>
          </form>
        </Modal>
      )}
    </UserSidebarLayout>
  );
}
