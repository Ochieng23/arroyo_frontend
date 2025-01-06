'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import UserSidebarLayout from '@/components/FanDashboardLayout';
const recentlyViewed = [
  {
    name: 'Coffeezilla',
    category: 'Investigative Journalism',
    image: 'https://res.cloudinary.com/dhz4c0oae/image/upload/v1736068181/Rectangle_5164_5_uiacii.png',
  },
];

const creatorsForYou = [
  {
    name: 'Beau of The Fifth Column',
    category: 'Social Commentary',
    image: 'https://res.cloudinary.com/dhz4c0oae/image/upload/v1736068181/Rectangle_5164_6_mb4eot.png',
  },
  {
    name: 'The China Show',
    category: 'Current Events',
    image: 'https://res.cloudinary.com/dhz4c0oae/image/upload/v1736068181/Rectangle_5164_7_gv9djd.png',
  },
  {
    name: 'Jim Browning',
    category: 'Tech Scams',
    image: 'https://res.cloudinary.com/dhz4c0oae/image/upload/v1736068179/Rectangle_5164_1_vabvbr.png',
  },
];

const popularThisWeek = [
  {
    name: 'MarkE Miller',
    category: 'Exclusive Content',
    image: 'https://res.cloudinary.com/dhz4c0oae/image/upload/v1736068178/Rectangle_5164_2_sk7pjx.png',
  },
  {
    name: 'Doriana Gray Games',
    category: 'Interactive Fiction',
    image: 'https://res.cloudinary.com/dhz4c0oae/image/upload/v1736068181/Rectangle_5164_5_uiacii.png',
  },
];

const newOnAroyyo = [
  {
    name: 'Grim Fairy',
    category: 'Fantasy Art',
    image: 'https://res.cloudinary.com/dhz4c0oae/image/upload/v1736068181/Rectangle_5164_6_mb4eot.png',
  },
  {
    name: 'Drich’s Demesne',
    category: 'Fanfiction',
    image: 'https://res.cloudinary.com/dhz4c0oae/image/upload/v1736068181/Rectangle_5164_7_gv9djd.png',
  },
];

const exploreTopics = [
  'Podcasts & Shows',
  'Tabletop Games',
  'Music',
  'Writing',
  'Apps & Software',
  'Visual Arts',
  'Video Games',
  'Lifestyle',
  'Handicrafts',
  'Social Impact',
];

function FanDashboard() {
  return (
    <UserSidebarLayout className="p-6">
      {/* Hero Section */}
      <section className="bg-purple-600 text-white rounded-lg p-8 mb-8 text-center">
        <h1 className="text-3xl font-bold">Welcome Back to Aroyyo</h1>
        <p className="text-lg mt-2">Discover and support creators you love!</p>
      </section>

      {/* Recently Viewed Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Recently Viewed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recentlyViewed.map((creator, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4">
              <Image
                src={creator.image}
                alt={creator.name}
                width={200}
                height={200}
                className="rounded-lg object-cover"
              />
              <h3 className="text-lg font-semibold mt-2">{creator.name}</h3>
              <p className="text-sm text-gray-500">{creator.category}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Creators For You Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Creators For You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {creatorsForYou.map((creator, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4">
              <Image
                src={creator.image}
                alt={creator.name}
                width={200}
                height={200}
                className="rounded-lg object-cover"
              />
              <h3 className="text-lg font-semibold mt-2">{creator.name}</h3>
              <p className="text-sm text-gray-500">{creator.category}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular This Week Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Popular This Week</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularThisWeek.map((creator, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4">
              <Image
                src={creator.image}
                alt={creator.name}
                width={200}
                height={200}
                className="rounded-lg object-cover"
              />
              <h3 className="text-lg font-semibold mt-2">{creator.name}</h3>
              <p className="text-sm text-gray-500">{creator.category}</p>
            </div>
          ))}
        </div>
      </section>

      {/* New on Aroyyo Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">New on Aroyyo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {newOnAroyyo.map((creator, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4">
              <Image
                src={creator.image}
                alt={creator.name}
                width={200}
                height={200}
                className="rounded-lg object-cover"
              />
              <h3 className="text-lg font-semibold mt-2">{creator.name}</h3>
              <p className="text-sm text-gray-500">{creator.category}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Explore Topics Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Explore Topics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {exploreTopics.map((topic, index) => (
            <button
              key={index}
              className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
            >
              {topic}
            </button>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="text-center mt-12">
        <h2 className="text-xl font-semibold mb-4">Ready to Explore More?</h2>
        <button className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition">
          Discover Now
        </button>
      </footer>
    </UserSidebarLayout>
  );
}

export default FanDashboard;
