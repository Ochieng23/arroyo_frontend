import React from "react";
import UserSidebarLayout from "@/components/fanDashboardLayout";

const creators = [
  {
    name: "Lexx Wachera",
    category: "Music - Afrosoul",
    image:
      "https://res.cloudinary.com/dhz4c0oae/image/upload/v1736068181/Rectangle_5164_5_uiacii.png",
  },
  {
    name: "Malik Kwezi",
    category: "Music - Afrosoul",
    image:
      "https://res.cloudinary.com/dhz4c0oae/image/upload/v1736068181/Rectangle_5164_4_qmvk3m.png",
  },
  {
    name: "Levi Aurora",
    category: "Music - Indie, Rock",
    image:
      "https://res.cloudinary.com/dhz4c0oae/image/upload/v1736068181/Rectangle_5164_6_mb4eot.png",
  },
  {
    name: "Kaleem Flow",
    category: "Music - Hip Hop",
    image:
      "https://res.cloudinary.com/dhz4c0oae/image/upload/v1736068181/Rectangle_5164_7_gv9djd.png",
  },
  {
    name: "Milo Chord",
    category: "Music - Jazz",
    image:
      "https://res.cloudinary.com/dhz4c0oae/image/upload/v1736068179/Rectangle_5164_1_vabvbr.png",
  },
  {
    name: "Ryder Stone",
    category: "Music - Rock, Country",
    image:
      "https://res.cloudinary.com/dhz4c0oae/image/upload/v1736068178/Rectangle_5164_2_sk7pjx.png",
  },
  {
    name: "Jahmali Roots",
    category: "Music - Reggae",
    image:
      "https://res.cloudinary.com/dhz4c0oae/image/upload/v1736068178/Rectangle_5164_3_m262dt.png",
  },
  {
    name: "Neon Pulse",
    category: "Music - EDM, Afro House",
    image:
      "https://res.cloudinary.com/dhz4c0oae/image/upload/v1736068101/Rectangle_5164_lonk9x.png",
  },
];

function Explore() {
  return (
    <UserSidebarLayout>
      <div className="p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search your favourite creator or by topic"
            className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {["All", "Podcast", "Art", "Education", "Music", "Design", "Writing", "Crafts"].map(
            (filter, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-lg text-sm ${
                  filter === "Music"
                    ? "bg-purple-100 text-purple-600 border border-purple-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter} {filter === "Music" && <span className="ml-2">✖</span>}
              </button>
            )
          )}
        </div>

        {/* Creator Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {creators.map((creator, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={creator.image}
                alt={creator.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{creator.name}</h3>
                <p className="text-sm text-gray-500">{creator.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </UserSidebarLayout>
  );
}

export default Explore;
