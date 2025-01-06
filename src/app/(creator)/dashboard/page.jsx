// app/dashboard/page.js
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SidebarLayout from "@/components/CreatorDashboardLayout";
import { useUser } from "@/contexts/userContext";
import { FaFacebookF, FaTwitter, FaYoutube, FaSpotify, FaInstagram } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";

// Tabs for the creator dashboard
const tabs = ["Home", "Collections", "Membership", "About"];

// Sample posts (can be dynamic)
const posts = [
  {
    id: 1,
    title: "Behind the scenes - Echoes and Silence",
    image:
      "https://res.cloudinary.com/dhz4c0oae/image/upload/v1735737804/image_5_bpt5xs.png",
    price: "Ksh.640.00",
    views: 654,
    time: "23:45",
    daysAgo: "2 Days ago",
  },
  {
    id: 2,
    title: "Soul Unveiled: The Journey of Rhythm and Roots",
    image:
      "https://res.cloudinary.com/dhz4c0oae/image/upload/v1735737797/image_4_ofyvtg.png",
    price: "Ksh.20,000",
    views: 234,
    time: "23:45",
    daysAgo: "3 Days ago",
  },
];

// Example membership count
const totalMembers = 1247;

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Home");
  const router = useRouter();

  // This 'user' comes from context after login
  const { user, setUser, loading } = useUser();
  console.log("Context user:", user);

  // Fetch user details from backend if we have user.id
  const fetchUserDetails = () => {
    if (!user?.id) return;

    fetch(`http://localhost:8000/users/${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched user details:", data);
        setUser((prev) => ({ ...prev, ...data }));
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  };

  useEffect(() => {
    fetchUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Handle "Upload content" button
  const handleUploadRedirect = () => {
    router.push("/upload");
  };

  // Render content inside each tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "Home":
        return (
          <div className="fade-in min-h-[300px]">
            <h3 className="mb-4 text-xl font-bold text-gray-800">Recent posts</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col rounded-lg bg-white p-4 shadow"
                >
                  <div className="relative h-48 w-full overflow-hidden rounded-md">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    <div className="absolute left-2 top-2 rounded-full bg-white/80 px-2 py-0.5 text-xs">
                      {post.daysAgo}
                    </div>
                    <div className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-0.5 text-xs text-white">
                      {post.time}
                    </div>
                  </div>
                  <div className="mt-3 flex-grow">
                    <h4 className="font-semibold text-gray-800">{post.title}</h4>
                    <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                      <span>{post.price}</span>
                      <span>{post.views} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "Collections":
        return (
          <div className="fade-in min-h-[300px]">
            <h3 className="mb-3 text-xl font-bold text-gray-800">Your Collections</h3>
            <p className="mb-4 text-gray-600">
              Group your content by themes, series, or categories.
            </p>
            <div className="rounded-md bg-white p-4 shadow">
              <p className="text-gray-500">You have no collections yet.</p>
              <button className="mt-3 rounded-md bg-purple-600 px-3 py-2 text-white hover:bg-purple-700">
                + Create your first collection
              </button>
            </div>
          </div>
        );

      case "Membership":
        return (
          <div className="fade-in min-h-[300px]">
            <h3 className="mb-3 text-xl font-bold text-gray-800">Memberships</h3>
            <p className="mb-4 text-gray-600">
              You currently have{" "}
              <span className="font-semibold text-purple-700">
                {totalMembers} active members
              </span>
              .
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-md bg-white p-4 shadow">
                <h4 className="text-base font-semibold text-gray-800">
                  Bronze Fan
                </h4>
                <p className="text-xs text-gray-500">Ksh.200 / month</p>
                <div className="mt-2 text-sm text-gray-700">
                  Access to exclusive posts
                </div>
              </div>
              <div className="rounded-md bg-white p-4 shadow">
                <h4 className="text-base font-semibold text-gray-800">
                  Silver Star
                </h4>
                <p className="text-xs text-gray-500">Ksh.500 / month</p>
                <div className="mt-2 text-sm text-gray-700">
                  Includes behind-the-scenes + Q&A
                </div>
              </div>
              <div className="rounded-md bg-white p-4 shadow">
                <h4 className="text-base font-semibold text-gray-800">
                  Gold VIP
                </h4>
                <p className="text-xs text-gray-500">Ksh.1,000 / month</p>
                <div className="mt-2 text-sm text-gray-700">
                  Early access + direct fan chats
                </div>
              </div>
            </div>
          </div>
        );

      case "About":
        return (
          <div className="fade-in min-h-[300px]">
            <h3 className="mb-3 text-xl font-bold text-gray-800">About Malik Kwezi</h3>
            <p className="leading-relaxed">
              Malik Kwezi is a passionate musician from Kenya, known for
              blending African rhythms with contemporary sounds. With a
              growing global fan base, Malik’s vision is to spread joy,
              empowerment, and unity through his artistry. From soulful
              ballads to electric live performances, Malik continues to
              push boundaries, making every heartbeat resonate with the
              power of music.
            </p>
            {/* Display Niche */}
            {user?.niche && (
              <div className="mt-4 text-sm text-gray-700">
                <strong>Niche:</strong> {user.niche}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Fallback to dummy banner/profile if user.bannerImage/user.profileImage aren't set
  const bannerSrc = user?.bannerImage || "https://res.cloudinary.com/dhz4c0oae/image/upload/v1735737481/image_2_vfed7a.png";
  const profileSrc = user?.profileImage || "https://res.cloudinary.com/dhz4c0oae/image/upload/v1735737500/Group_1000004214_jvbs2z.png";

  return (
    <SidebarLayout>
      <div className="relative flex flex-col bg-[#F8F5FF] min-h-screen p-4">
        {/* Banner Image from user context or dummy fallback */}
        <div className="relative h-[240px] w-full overflow-hidden rounded-xl">
          <Image
            src={user?.bannerImage}
            alt="Banner"
            fill
            style={{ objectFit: "cover" }}
          />
          <button
            onClick={handleUploadRedirect}
            className="absolute bottom-4 right-4 z-10 rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 transition"
          >
            Upload content
          </button>
        </div>

        {/* Profile Image from user context or dummy fallback */}
        <div className="relative mt-[-40px] flex flex-col items-center">
          <div className="relative h-[120px] w-[120px] overflow-hidden rounded-full border-4 border-white">
            <Image
              src={user.profileImage}
              alt="Profile"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>

          <h2 className="mt-3 text-2xl font-bold text-purple-800">{user?.firstName} {user?.lastName}</h2>
          <p className="mt-1 max-w-md text-center text-sm text-gray-600">
            {user?.about || "Tell us about yourself..."}
          </p>

          {/* Occupation + Country */}
          <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
            <span>{user?.countryFlag || "🌍"}</span>
            <span>{user?.occupation || "Occupation not set"}</span>
          </div>

          {/* Link */}
          <div className="mt-1 text-sm text-purple-600">
            <a
              href={`https://loreax.com/${user?.username || "username_not_set"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Loreax.com/{user?.username || "username_not_set"}
            </a>
          </div>

          {/* Social Icons */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {user?.socialLinks?.map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 transition-opacity hover:opacity-80"
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Tabs */}
          <div className="mt-6 flex space-x-8 text-sm font-medium text-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-2 transition-colors ${
                  activeTab === tab
                    ? "text-purple-700"
                    : "text-gray-700 hover:text-purple-700"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute left-1/2 bottom-[-6px] h-2 w-2 -translate-x-1/2 rounded-full bg-green-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6 min-h-[400px] transition-all duration-300">
          {renderTabContent()}
        </div>
      </div>
    </SidebarLayout>
  );
}
