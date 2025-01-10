"use client";

import React, { useEffect, useState } from "react";
import UserSidebarLayout from "@/components/FanDashboardLayout";
import Image from "next/image";
import { useRouter } from "next/navigation";

// The "niche" categories from your schema:
const niches = [
  "All",
  "Science fiction",
  "Writing",
  "Pop culture",
  "Comedy",
  "Role playing games",
  "True crime",
  "Art tutorials",
  "Handicrafts",
  "Illustration",
  "Musical education",
  "Educational",
  "Indie games",
];

export default function Explore() {
  const router = useRouter();

  const [allCreators, setAllCreators] = useState([]);
  const [filteredCreators, setFilteredCreators] = useState([]);
  const [selectedNiche, setSelectedNiche] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Fetch only creator users from backend (?role=creator)
  const fetchCreators = async () => {
    try {
      const res = await fetch("http://localhost:8000/users?role=creator");
      const data = await res.json();
      setAllCreators(data);
      setFilteredCreators(data);
    } catch (error) {
      console.error("Error fetching creators:", error);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, []);

  // 2. Apply filters (by niche + search) whenever they change
  useEffect(() => {
    let creators = [...allCreators];

    // If niche isn't "All", filter by user.niche
    if (selectedNiche !== "All") {
      creators = creators.filter((c) => c.niche === selectedNiche);
    }

    // Search by firstName, lastName, email, or niche
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      creators = creators.filter(
        (c) =>
          c.firstName?.toLowerCase().includes(q) ||
          c.lastName?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.niche?.toLowerCase().includes(q)
      );
    }

    setFilteredCreators(creators);
  }, [selectedNiche, searchQuery, allCreators]);

  // Handle niche button click
  const handleFilterClick = (niche) => {
    setSelectedNiche(niche);
  };

  // Handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Card click -> dynamic route `/explore/creator/[id]`
  const handleCardClick = (creatorId) => {
    router.push(`/explore/creator/${creatorId}`);
  };

  return (
    <UserSidebarLayout>
      <div className="p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search your favourite creator or by topic"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Filters (Niche Buttons) */}
        <div className="flex flex-wrap gap-3 mb-6">
          {niches.map((niche, index) => (
            <button
              key={index}
              onClick={() => handleFilterClick(niche)}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedNiche === niche
                  ? "bg-purple-100 text-purple-600 border border-purple-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {niche}
              {/* Optional 'clear' icon if the niche is selected and isn't "All" */}
              {selectedNiche === niche && niche !== "All" && (
                <span className="ml-2">✖</span>
              )}
            </button>
          ))}
        </div>

        {/* Creator Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredCreators.map((creator) => (
            <div
              key={creator._id}
              onClick={() => handleCardClick(creator._id)}
              className="cursor-pointer bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Uniform card image (200x200) */}
              <div className="relative w-full h-48">
                <Image
                  fill
                  className="object-cover"
                  src={
                    creator.profileImage ||
                    "https://res.cloudinary.com/dhz4c0oae/image/upload/v1735737481/image_2_vfed7a.png"
                  }
                  alt={creator.firstName || "Creator"}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">
                  {creator.firstName} {creator.lastName}
                </h3>
                <p className="text-sm text-gray-500">
                  {creator.niche || "Unknown niche"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </UserSidebarLayout>
  );
}
