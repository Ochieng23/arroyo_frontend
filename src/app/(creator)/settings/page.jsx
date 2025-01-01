// pages/setup-account.js
"use client";

import React from "react";
import SidebarLayout from "@/components/CreatorDashboardLayout";

export default function SetupAccount() {
  return (
    <SidebarLayout>
      {/* Container for the entire form area */}
      <div className="min-h-screen w-full bg-white p-6 md:p-10 flex items-start justify-center">
        <div className="w-full max-w-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-purple-600 mb-8 text-center">
            Setup your account
          </h1>

          <form>
            {/* Profile banner */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile banner
              </label>
              <div className="flex items-center border border-gray-300 rounded-md p-3">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="profile-banner"
                />
                <label
                  htmlFor="profile-banner"
                  className="text-purple-600 cursor-pointer hover:underline"
                >
                  Choose an image
                </label>
                <span className="ml-2 text-sm text-gray-500">
                  Recommended dimensions: 1200 x 400 px
                </span>
              </div>
            </div>

            {/* Profile picture */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                  <img
                    src="/placeholder-avatar.jpg"
                    alt="Profile picture preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <label
                    htmlFor="profile-picture"
                    className="text-sm text-purple-600 cursor-pointer hover:underline"
                  >
                    Upload new picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="profile-picture"
                  />
                </div>
              </div>
              <button
                type="button"
                className="text-sm text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>

            {/* Name and username */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                placeholder="First name"
                className="border border-gray-300 rounded-md p-3 w-full"
              />
              <input
                type="text"
                placeholder="Last name"
                className="border border-gray-300 rounded-md p-3 w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                placeholder="Username"
                className="border border-gray-300 rounded-md p-3 w-full"
              />
              <input
                type="email"
                placeholder="Email address"
                className="border border-gray-300 rounded-md p-3 w-full"
              />
            </div>

            {/* Bio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <textarea
                placeholder="Bio (max 100 characters, short and punchy)"
                className="border border-gray-300 rounded-md p-3 w-full"
                maxLength={100}
              />
              <textarea
                placeholder="Bio (max 100 characters, short and punchy)"
                className="border border-gray-300 rounded-md p-3 w-full"
                maxLength={100}
              />
            </div>

            {/* Location and phone number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                placeholder="City or location"
                className="border border-gray-300 rounded-md p-3 w-full"
              />
              <div className="flex items-center">
                <select className="border border-gray-300 rounded-l-md p-3 w-20 bg-gray-50">
                  <option>+254</option>
                </select>
                <input
                  type="text"
                  placeholder="Phone number"
                  className="border border-gray-300 rounded-r-md p-3 w-full"
                />
              </div>
            </div>

            {/* Niche */}
            <div className="mb-6">
              <select className="border border-gray-300 rounded-md p-3 w-full bg-gray-50">
                <option>Select from options</option>
              </select>
            </div>

            {/* Social links */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add social links
              </label>
              <div className="flex items-center gap-4">
                <select className="border border-gray-300 rounded-md p-3 w-1/3 bg-gray-50">
                  <option>Platform</option>
                </select>
                <input
                  type="url"
                  placeholder="Link"
                  className="border border-gray-300 rounded-md p-3 w-full"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-col gap-2 mb-6">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-5 w-5 text-purple-600" />
                <span>My profile is public to all visitors</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-5 w-5 text-purple-600" />
                <span>My content does not contain any explicit material</span>
              </label>
            </div>

            {/* Submit button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-purple-600 text-white rounded-full px-6 py-3 text-lg hover:bg-purple-700"
              >
                Finish setup and go to Homepage
              </button>
            </div>
          </form>
        </div>
      </div>
    </SidebarLayout>
  );
}
