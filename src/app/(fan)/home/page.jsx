"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UserSidebarLayout from "@/components/FanDashboardLayout";

// Static list of topics
const exploreTopics = [
  "Podcasts & Shows",
  "Tabletop Games",
  "Music",
  "Writing",
  "Apps & Software",
  "Visual Arts",
  "Video Games",
  "Lifestyle",
  "Handicrafts",
  "Social Impact",
];

export default function FanDashboard() {
  const router = useRouter();

  // State for each category of creators
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [creatorsForYou, setCreatorsForYou] = useState([]);
  const [popularThisWeek, setPopularThisWeek] = useState([]);
  const [newOnAroyyo, setNewOnAroyyo] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users, then filter + sort client-side
  const fetchAllUsers = async () => {
    try {
      const res = await fetch(
        "https://arroyob-ducqdydbheaxd9as.eastus-01.azurewebsites.net/users"
      ); // get all users
      const allUsers = await res.json();

      // 1) Filter to only "creator" roles
      const creators = allUsers.filter((u) => u.role === "creator");

      // 2) Recently Viewed: ONLY 2, sorted by `creatorView?.viewedAt` DESC
      const recentlyViewedArr = creators
        .filter((c) => c.creatorView?.viewedAt) // must have a viewedAt
        .sort(
          (a, b) =>
            new Date(b.creatorView.viewedAt) - new Date(a.creatorView.viewedAt)
        )
        .slice(0, 2);

      // 3) Creators For You (example: random 5)
      const creatorsForYouArr = [...creators]
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);

      // 4) Popular This Week (top 5 by `creator.profileViews` desc)
      const popularArr = creators
        .filter((c) => c.creator) // has a creator doc
        .sort(
          (a, b) =>
            (b.creator?.profileViews || 0) - (a.creator?.profileViews || 0)
        )
        .slice(0, 5);

      // 5) New on Aroyyo (top 5 by `createdAt` desc)
      const newOnAroyyoArr = [...creators]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      // Update state
      setRecentlyViewed(recentlyViewedArr);
      setCreatorsForYou(creatorsForYouArr);
      setPopularThisWeek(popularArr);
      setNewOnAroyyo(newOnAroyyoArr);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching all users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Navigate to /explore/creator/[id] on card click
  const handleCardClick = (creatorId) => {
    router.push(`explore/creator/${creatorId}`);
  };

  if (loading) {
    return (
      <UserSidebarLayout className="p-6">
        <div className="text-center">Loading creators...</div>
      </UserSidebarLayout>
    );
  }

  // Helper component for consistent card rendering
  const CreatorCard = ({ creator }) => {
    return (
      <div
        className="cursor-pointer rounded-lg bg-white p-4 shadow-md transition hover:shadow-lg"
        onClick={() => handleCardClick(creator._id)}
      >
        {/* Wrapper for uniform 200x200 images */}
        <div className="relative h-[200px] w-[200px] mx-auto">
          <Image
            fill
            src={
              creator.profileImage ||
              "https://res.cloudinary.com/dhz4c0oae/image/upload/v1735737500/Group_1000004214_jvbs2z.png"
            }
            alt={creator.email || "Creator image"}
            className="rounded-lg object-cover"
          />
        </div>

        <h3 className="mt-2 text-lg font-semibold">
          {creator.firstName || "No name"} {creator.lastName}
        </h3>
        <p className="text-sm text-gray-500">{creator.niche || "No niche"}</p>

        {/* If this is recentlyViewed */}
        {creator.creatorView?.viewedAt && (
          <p className="mt-1 text-xs text-gray-400">
            Last viewed:{" "}
            {new Date(creator.creatorView.viewedAt).toLocaleString()}
          </p>
        )}

        {/* If this is in the popular section */}
        {creator.creator?.profileViews !== undefined && (
          <p className="text-sm text-gray-500">
            Views: {creator.creator?.profileViews || 0}
          </p>
        )}
      </div>
    );
  };

  return (
    <UserSidebarLayout className="p-6">
      {/* Hero Section */}
      <section className="mb-8 rounded-lg bg-purple-600 p-8 text-center text-white">
        <h1 className="text-3xl font-bold">Welcome Back to Aroyyo</h1>
        <p className="mt-2 text-lg">Discover and support creators you love!</p>
      </section>

      {/* Recently Viewed (LAST 2) */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Recently Viewed</h2>
        {recentlyViewed.length === 0 ? (
          <p className="text-gray-500">No recently viewed creators yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {recentlyViewed.map((creator) => (
              <CreatorCard key={creator._id} creator={creator} />
            ))}
          </div>
        )}
      </section>

      {/* Creators For You Section */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Creators For You</h2>
        {creatorsForYou.length === 0 ? (
          <p className="text-gray-500">No recommendations found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {creatorsForYou.map((creator) => (
              <CreatorCard key={creator._id} creator={creator} />
            ))}
          </div>
        )}
      </section>

      {/* Popular This Week Section */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Popular This Week</h2>
        {popularThisWeek.length === 0 ? (
          <p className="text-gray-500">No popular creators this week.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {popularThisWeek.map((creator) => (
              <CreatorCard key={creator._id} creator={creator} />
            ))}
          </div>
        )}
      </section>

      {/* New on Aroyyo Section */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">New on Aroyyo</h2>
        {newOnAroyyo.length === 0 ? (
          <p className="text-gray-500">No new creators at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {newOnAroyyo.map((creator) => (
              <CreatorCard key={creator._id} creator={creator} />
            ))}
          </div>
        )}
      </section>

      {/* Explore Topics Section */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Explore Topics</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {exploreTopics.map((topic, index) => (
            <button
              key={index}
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
            >
              {topic}
            </button>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="mt-12 text-center">
        <h2 className="mb-4 text-xl font-semibold">Ready to Explore More?</h2>
        <button className="rounded-full bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700">
          Discover Now
        </button>
      </footer>
    </UserSidebarLayout>
  );
}
