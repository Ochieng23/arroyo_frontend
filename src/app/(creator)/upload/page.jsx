// pages/upload-content.js
"use client";

import React, { useState } from "react";
import SidebarLayout from "@/components/CreatorDashboardLayout";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function UploadContent() {
  const [contentType, setContentType] = useState("video"); // default: video
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle file selection (preview)
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Simulate or implement the actual Azure upload
  const handleUpload = async () => {
    if (!file) return;

    setIsProcessing(true);

    try {
      // Example: You might POST to your backend endpoint that uploads to Azure
      // const formData = new FormData();
      // formData.append("file", file);
      // formData.append("contentType", contentType);

      // const response = await fetch("/api/upload_azure", {
      //   method: "POST",
      //   body: formData,
      // });

      // if (!response.ok) {
      //   throw new Error(`Upload failed: ${response.statusText}`);
      // }

      // Simulate a short delay for "upload"
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert("File uploaded to Azure successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading file.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SidebarLayout>
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-10">
        {/* Page Title */}
        <h1 className="mb-6 text-xl font-bold text-gray-700">Upload Your Content</h1>

        {/* Main Container */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left 2/3 */}
          <div className="col-span-2 space-y-6">
            {/* Content Type Select */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Content Type
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm"
              >
                <option value="video">Video</option>
                <option value="podcast">Podcast episode</option>
                <option value="image">Images</option>
                <option value="downloadable">Downloadable files</option>
                <option value="gamemod">Game mods</option>
                <option value="3dprint">3D print templates</option>
                <option value="digitalprint">Digital prints</option>
              </select>
            </div>

            {/* File Input */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Upload File
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full cursor-pointer text-sm text-gray-600 file:mr-4 file:rounded file:border-0 file:bg-purple-600 file:px-4 file:py-2 file:text-white hover:file:bg-purple-700"
              />
              <p className="mt-2 text-xs text-gray-400">
                Select a file for your {contentType}.
              </p>
            </div>

            {/* Preview */}
            <div className="flex h-56 w-full items-center justify-center rounded-md bg-gray-100">
              {file ? (
                !isProcessing ? (
                  <div className="px-4 text-center text-sm text-gray-600">
                    <p className="mb-2 font-semibold">Preview:</p>
                    <p>{file.name}</p>
                  </div>
                ) : (
                  <div className="text-center text-sm text-gray-500">
                    <AiOutlineLoading3Quarters className="mx-auto mb-1 animate-spin text-xl" />
                    <p>Uploading {contentType} to Azure...</p>
                  </div>
                )
              ) : (
                <p className="text-sm text-gray-400">No file selected</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                placeholder={`Name your ${contentType}`}
                className="w-full rounded-md border border-gray-300 p-3 text-sm placeholder:text-gray-400"
              />
            </div>

            {/* Price */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="text"
                placeholder="Set a price or leave blank for free"
                className="w-full rounded-md border border-gray-300 p-3 text-sm placeholder:text-gray-400"
              />
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  id="free"
                  name="priceType"
                  className="h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="free">Offer this for free to active fans</label>
              </div>
            </div>
          </div>

          {/* Right column: Collections + Tags */}
          <div className="space-y-6">
            {/* Collections Card */}
            <div className="rounded-md border border-gray-200 p-4">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">
                Collections
              </h3>
              <p className="mb-4 text-xs text-gray-500">
                Helps your fans connect with related content and shared themes.
              </p>
              <button className="rounded-md bg-purple-600 px-3 py-2 text-sm text-white hover:bg-purple-700">
                + Create collection
              </button>
            </div>

            {/* Tags Card */}
            <div className="rounded-md border border-gray-200 p-4">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">Tags</h3>
              <p className="mb-3 text-xs text-gray-500">
                Organize your content by adding relevant tags.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Name of tag"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm placeholder:text-gray-400 focus:outline-none"
                />
                <button className="rounded-md bg-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-300">
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Autosave + Upload */}
        <div className="mt-8 flex items-center justify-end gap-4 text-sm text-gray-500">
          <span className="text-gray-400">Autosaved just now</span>
          <button
            onClick={handleUpload}
            disabled={!file || isProcessing}
            className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isProcessing ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </SidebarLayout>
  );
}
