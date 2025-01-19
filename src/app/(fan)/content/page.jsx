"use client";

import React, { useEffect, useState } from "react";
import UserSidebarLayout from "@/components/FanDashboardLayout";
import { useUser } from "@/context/userContext";

/**
 * A page that displays all of a user's purchased content:
 *   - Thumbnails and/or embedded videos
 *   - Content titles and short descriptions
 *   - Purchase price and date
 *   - Potential further interactions (download, comment, rate, etc.)
 */
export default function PurchasedContentPage() {
  const { user } = useUser();
  const [purchasedContents, setPurchasedContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch all purchased content from:
   *   GET /purchased-content/user/:userId
   */
  const fetchPurchasedContents = async () => {
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

      // If your user object uses `_id` instead of `id`, swap accordingly.
      const userId = user._id || user.id;

      const response = await fetch(`${BASE_URL}/purchased-content/user/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // passport-local session cookies
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch purchased content: ${response.statusText}`);
      }

      const data = await response.json();
      setPurchasedContents(data.purchasedContents || []);
    } catch (err) {
      console.error("Error fetching purchased content:", err);
      setError(err.message || "Failed to fetch purchased content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || (!user._id && !user.id)) {
      setLoading(false);
      setError("User not logged in or no userId found.");
      return;
    }
    fetchPurchasedContents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Loading state
  if (loading) {
    return (
      <UserSidebarLayout>
        <div className="p-4">Loading your content...</div>
      </UserSidebarLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <UserSidebarLayout>
        <div className="p-4 text-red-500">Error: {error}</div>
      </UserSidebarLayout>
    );
  }

  // If the user has no purchased content
  if (purchasedContents.length === 0) {
    return (
      <UserSidebarLayout>
        <div className="p-4">
          You haven&apos;t purchased any content yet.
        </div>
      </UserSidebarLayout>
    );
  }

  /**
   * Renders each purchased item in a more "YouTube / Patreon" style:
   *   - Thumbnail or video preview
   *   - Title, short about/description
   *   - Purchase info (price, date)
   *   - Possibly some user interactions (like, share) in future
   */
  return (
    <UserSidebarLayout>
      <h1 className="text-2xl font-bold mb-6">Your Content</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchasedContents.map((purchase) => {
          const content = purchase.content || {};
          const {
            _id: contentId,
            title = "Untitled Content",
            about = "",
            type,
            url,
            thumbnail,
          } = content;

          return (
            <div
              key={purchase._id}
              className="bg-white rounded-lg shadow overflow-hidden flex flex-col"
            >
              {/* Media Section */}
              <div className="relative w-full h-48 bg-gray-200">
                {type === "video" ? (
                  // Video preview
                  <video
                    src={url}
                    poster={thumbnail}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : thumbnail ? (
                  // Image or thumbnail
                  <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // Fallback if no thumbnail
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No thumbnail available
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="p-4 flex flex-col flex-1">
                <h2 className="text-lg font-bold mb-1 line-clamp-2">
                  {title}
                </h2>
                {/* Brief description or about */}
                {about && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                    {about}
                  </p>
                )}

                {/* Footer / Additional Info */}
                <div className="mt-auto flex flex-col space-y-1 text-gray-500 text-sm">
                  <span>
                    <strong>Price Paid:</strong>{" "}
                    {purchase.pricePaid} {purchase.currency}
                  </span>
                  <span>
                    <strong>Purchased On:</strong>{" "}
                    {new Date(purchase.purchaseDate).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </UserSidebarLayout>
  );
}
