"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SidebarLayout from "@/components/CreatorDashboardLayout";
import { useUser } from "@/context/userContext";
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaSpotify,
  FaInstagram,
} from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import CreateCollectionModal from "@/components/CreateCollectionModal";
import CreateTierModal from "@/components/CreateTierModal";

// Tabs for the creator dashboard
const tabs = ["Home", "Collections", "Membership", "About"];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Home");
  const router = useRouter();

  // User context
  const { user, setUser, loading } = useUser();
  console.log("Context user:", user);

  // State for Membership Tiers
  const [membershipTiers, setMembershipTiers] = useState([]);
  const [showCreateCollectionModal, setShowCreateCollectionModal] =
    useState(false);
  const [showCreateTierModal, setShowCreateTierModal] = useState(false);

  // Fetch user details from backend if we have user.id
  const fetchUserDetails = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(
        `https://arroyob-ducqdydbheaxd9as.eastus-01.azurewebsites.net/users/${user.id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched user details:", data);
      setUser((prev) => ({ ...prev, ...data }));
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Function to fetch membership tiers
  const fetchMembershipTiers = () => {
    if (!user?.creator?.subscriptionTiers) {
      console.error("Subscription Tiers not found in user payload");
      setMembershipTiers([]);
      return;
    }

    setMembershipTiers(user.creator.subscriptionTiers);
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    fetchMembershipTiers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.creator?.subscriptionTiers]);

  // Handle "Upload content" button
  const handleUploadRedirect = () => {
    router.push("/upload");
  };

  // Render content inside each tab
  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[300px]">
          <p>Loading...</p>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="flex items-center justify-center min-h-[300px]">
          <p>User data is not available.</p>
        </div>
      );
    }

    switch (activeTab) {
      case "Home":
        return renderHomeTab();
      case "Collections":
        return renderCollectionsTab();
      case "Membership":
        return renderMembershipTab();
      case "About":
        return renderAboutTab();
      default:
        return null;
    }
  };

  // Render Home Tab
  const renderHomeTab = () => (
    <div className="fade-in min-h-[300px]">
      <h3 className="mb-4 text-xl font-bold text-gray-800">Recent Posts</h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {user.contents && user.contents.length > 0 ? (
          user.contents
            .slice(-2)
            .reverse()
            .map((post) => (
              <div
                key={post._id}
                className="flex flex-col rounded-lg bg-white p-4 shadow"
              >
                <div className="relative h-48 w-full overflow-hidden rounded-md">
                  <Image
                    src={post.thumbnail || "https://via.placeholder.com/150"}
                    alt={post.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  <div className="absolute left-2 top-2 rounded-full bg-white/80 px-2 py-0.5 text-xs">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <div className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-0.5 text-xs text-white">
                    {post.type.toUpperCase()}
                  </div>
                </div>
                <div className="mt-3 flex-grow">
                  <h4 className="font-semibold text-gray-800">{post.title}</h4>
                  <p className="mt-1 text-sm text-gray-600">{post.about}</p>
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                    <span>Ksh.{post.price}</span>
                    <span>{post.viewCount} views</span>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <p className="text-gray-500">
            You have no posts yet. Start creating!
          </p>
        )}
      </div>
    </div>
  );

  // Render Collections Tab
  const renderCollectionsTab = () => (
    <div className="fade-in min-h-[300px]">
      <h3 className="mb-3 text-xl font-bold text-gray-800">Your Collections</h3>
      <p className="mb-4 text-gray-600">
        Group your content by themes, series, or categories.
      </p>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-700">Collections</h4>
        <button
          onClick={() => setShowCreateCollectionModal(true)}
          className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 transition"
        >
          + Create Collection
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {user.libraries && user.libraries.length > 0 ? (
          user.libraries.map((collection) => (
            <div
              key={collection._id}
              className="flex flex-col rounded-lg bg-white p-4 shadow"
            >
              <div className="relative h-32 w-full overflow-hidden rounded-md">
                <Image
                  src={
                    collection.thumbnail ||
                    "https://res.cloudinary.com/dhz4c0oae/image/upload/v1736068101/Rectangle_5164_lonk9x.png"
                  }
                  alt={collection.name}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="mt-3 flex-grow">
                <h4 className="font-semibold text-gray-800">
                  {collection.name}
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  {collection.description || "No description provided."}
                </p>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                  <span>{collection.content.length} items</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            You have no collections yet. Start creating one!
          </p>
        )}
      </div>
      {/* Create Collection Modal */}
      {showCreateCollectionModal && (
        <CreateCollectionModal
          onClose={() => setShowCreateCollectionModal(false)}
          onSuccess={fetchUserDetails}
        />
      )}
    </div>
  );

  // Render Membership Tab
  const renderMembershipTab = () => (
    <div className="fade-in min-h-[300px]">
      <h3 className="mb-3 text-xl font-bold text-gray-800">Memberships</h3>
      <p className="mb-4 text-gray-600">
        Create and manage your membership tiers to offer exclusive content.
      </p>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-700">
          Your Membership Tiers
        </h4>
        <button
          onClick={() => setShowCreateTierModal(true)}
          className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 transition"
        >
          + Create Tier
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {membershipTiers && membershipTiers.length > 0 ? (
          membershipTiers.map((tier) => (
            <div
              key={tier._id}
              className="flex flex-col rounded-lg bg-white p-4 shadow"
            >
              <h4 className="text-base font-semibold text-gray-800">
                {tier.name}
              </h4>
              <p className="text-xs text-gray-500">Ksh.{tier.price} / month</p>
              <div className="mt-2 text-sm text-gray-700">
                {tier.description}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            You have no membership tiers yet. Start creating one!
          </p>
        )}
      </div>
      {/* Create Tier Modal */}
      {showCreateTierModal && (
        <CreateTierModal
          creatorId={user.creator?._id}
          onClose={() => setShowCreateTierModal(false)}
          onSuccess={fetchUserDetails}
        />
      )}
    </div>
  );

  // Render About Tab
  const renderAboutTab = () => (
    <div className="fade-in min-h-[300px]">
      <h3 className="mb-3 text-xl font-bold text-gray-800">
        About {user.firstName} {user.lastName}
      </h3>
      <p className="leading-relaxed">
        {user.about || "You haven't added an about section yet."}
      </p>
      {/* Display Niche */}
      {user.niche && (
        <div className="mt-4 text-sm text-gray-700">
          <strong>Niche:</strong> {user.niche}
        </div>
      )}
    </div>
  );

  // Fallback to dummy banner/profile if user.bannerImage/user.profileImage aren't set
  const bannerSrc =
    user?.bannerImage ||
    "https://res.cloudinary.com/dhz4c0oae/image/upload/v1735737481/image_2_vfed7a.png";
  const profileSrc =
    user?.profileImage ||
    "https://res.cloudinary.com/dhz4c0oae/image/upload/v1735737500/Group_1000004214_jvbs2z.png";

  return (
    <SidebarLayout>
      <div className="relative flex flex-col bg-[#F8F5FF] min-h-screen p-4">
        {/* Banner Image from user context or dummy fallback */}
        <div className="relative h-[240px] w-full overflow-hidden rounded-xl">
          <Image
            src={bannerSrc}
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
              src={profileSrc}
              alt="Profile"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>

          <h2 className="mt-3 text-2xl font-bold text-purple-800">
            {user?.firstName} {user?.lastName}
          </h2>
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
              href={`https://loreax.com/${
                user?.username || "username_not_set"
              }`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Loreax.com/{user?.username || "username_not_set"}
            </a>
          </div>

          {/* Social Icons */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {user?.social && (
              <>
                {user.social.facebook && (
                  <a
                    href={user.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 transition-opacity hover:opacity-80"
                  >
                    <FaFacebookF />
                  </a>
                )}
                {user.social.x && (
                  <a
                    href={user.social.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 transition-opacity hover:opacity-80"
                  >
                    {/* Assuming 'x' refers to Twitter */}
                    <FaTwitter />
                  </a>
                )}
                {user.social.youtube && (
                  <a
                    href={user.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 transition-opacity hover:opacity-80"
                  >
                    <FaYoutube />
                  </a>
                )}
                {user.social.spotify && (
                  <a
                    href={user.social.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 transition-opacity hover:opacity-80"
                  >
                    <FaSpotify />
                  </a>
                )}
                {user.social.instagram && (
                  <a
                    href={user.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 transition-opacity hover:opacity-80"
                  >
                    <FaInstagram />
                  </a>
                )}
                {user.social.tiktok && (
                  <a
                    href={user.social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 transition-opacity hover:opacity-80"
                  >
                    <SiTiktok />
                  </a>
                )}
                {user.social.pinterest && (
                  <a
                    href={user.social.pinterest}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 transition-opacity hover:opacity-80"
                  >
                    {/* Replace with Pinterest Icon */}
                    <span>P</span>
                  </a>
                )}
              </>
            )}
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
