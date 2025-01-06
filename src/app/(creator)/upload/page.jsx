"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import SidebarLayout from "@/components/CreatorDashboardLayout";
import {
  AiOutlineLoading3Quarters,
  AiOutlineClose,
  AiOutlineFilePdf,
  AiOutlineFileWord,
  AiOutlineFileExcel,
  AiOutlineFileImage,
  AiOutlineFileVideo,
  AiOutlineFileUnknown,
} from "react-icons/ai";
import { useUser } from "@/contexts/userContext";

export default function UploadContent() {
  // State Management
  const [contentType, setContentType] = useState("video"); // default: video
  const [file, setFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [thumbnailPreviewSrc, setThumbnailPreviewSrc] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState(""); // State for About
  const [price, setPrice] = useState("");
  const [priceType, setPriceType] = useState("paid"); // 'paid' or 'free'
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isCreatingLibrary, setIsCreatingLibrary] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [newLibraryName, setNewLibraryName] = useState(""); // Renamed from newCollectionName
  const [selectedLibrary, setSelectedLibrary] = useState(""); // Renamed from selectedCollection
  const { user, loading } = useUser(); // Ensure 'user.id' exists

  // Refs for file inputs to reset their values
  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  // API Base URL from environment variables
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // State to hold user details
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch user details from backend based on user.id
  const fetchUserDetails = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // If using session-based auth, include credentials
        // credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user details: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Fetched user details:", data);
      setCurrentUser(data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError("Error fetching user details.");
    }
  }, [API_BASE_URL, user?.id]);

  // Fetch user details on component mount or when user.id changes
  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  // Determine file icon based on MIME type
  const getFileIcon = useCallback((mimeType) => {
    if (mimeType === "application/pdf")
      return <AiOutlineFilePdf size={40} className="text-red-600" />;
    if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
      return <AiOutlineFileWord size={40} className="text-blue-600" />;
    if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
      return <AiOutlineFileExcel size={40} className="text-green-600" />;
    if (mimeType.startsWith("image/"))
      return <AiOutlineFileImage size={40} className="text-yellow-600" />;
    if (mimeType.startsWith("video/"))
      return <AiOutlineFileVideo size={40} className="text-purple-600" />;
    return <AiOutlineFileUnknown size={40} className="text-gray-600" />;
  }, []);

  // Generate preview based on file type
  const generatePreview = useCallback((file, type) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (type === "file") {
        setPreviewSrc(reader.result);
      } else if (type === "thumbnail") {
        setThumbnailPreviewSrc(reader.result);
      }
    };

    if (file) {
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        reader.readAsDataURL(file);
      } else {
        if (type === "file") {
          setPreviewSrc(null); // No preview for unsupported file types
        } else if (type === "thumbnail") {
          setThumbnailPreviewSrc(null);
        }
      }
    } else {
      if (type === "file") {
        setPreviewSrc(null);
      } else if (type === "thumbnail") {
        setThumbnailPreviewSrc(null);
      }
    }
  }, []);

  // Handle file selection and generate preview
  const handleFileChange = useCallback(
    (e) => {
      if (e.target.files && e.target.files.length > 0) {
        const selectedFile = e.target.files[0];
        // Optional: Add file size/type validation here
        setFile(selectedFile);
        generatePreview(selectedFile, "file");
      }
    },
    [generatePreview]
  );

  // Handle thumbnail file selection and generate preview
  const handleThumbnailChange = useCallback(
    (e) => {
      if (e.target.files && e.target.files.length > 0) {
        const selectedThumbnail = e.target.files[0];
        // Optional: Add file size/type validation here
        setThumbnailFile(selectedThumbnail);
        generatePreview(selectedThumbnail, "thumbnail");
      }
    },
    [generatePreview]
  );

  // Handle removing the main file
  const handleRemoveFile = useCallback(() => {
    setFile(null);
    setPreviewSrc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  // Handle removing the thumbnail
  const handleRemoveThumbnail = useCallback(() => {
    setThumbnailFile(null);
    setThumbnailPreviewSrc(null);
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  }, []);

  // Handle adding tags
  const handleAddTag = useCallback(() => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags((prevTags) => [...prevTags, trimmedTag]);
      setTagInput("");
    }
  }, [tagInput, tags]);

  // Handle removing a tag
  const handleRemoveTag = useCallback((tagToRemove) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  }, []);

  // Handle creating a new library
  const handleCreateLibrary = useCallback(async () => {
    if (!newLibraryName.trim()) {
      setError("Please enter a library name.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/libraries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // If using session-based auth, include credentials
        // credentials: "include",
        body: JSON.stringify({
          user_id: user.id, // Include user_id
          name: newLibraryName.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create library.");
      }

      const data = await response.json();

      // **Key Correction:** Use 'data.library' instead of 'data.collection'
      if (data.library) {
        // Update currentUser's libraries
        setCurrentUser((prevUser) => ({
          ...prevUser,
          libraries: [...(prevUser.libraries || []), data.library],
        }));
        setSelectedLibrary(data.library._id);
      } else {
        throw new Error("Invalid response from server: 'library' not found.");
      }

      setNewLibraryName("");
      setIsCreatingLibrary(false);
      setSuccessMessage("Library created successfully!");
    } catch (err) {
      console.error("Create Library Error:", err);
      setError(err.message);
    }
  }, [newLibraryName, API_BASE_URL, user.id]);

  // Handle form submission
  const handleUpload = useCallback(
    async (e) => {
      e.preventDefault();

      // Basic validation
      if (!file) {
        setError("Please select a file to upload.");
        return;
      }

      if (!title.trim()) {
        setError("Please enter a title for your content.");
        return;
      }

      if (
        priceType === "paid" &&
        (!price || isNaN(price) || parseFloat(price) <= 0)
      ) {
        setError("Please enter a valid price for your content.");
        return;
      }

      // Ensure 'about' is provided
      if (!about.trim()) {
        setError("Please provide an 'About' description for your content.");
        return;
      }

      // For non-image and non-video content types, ensure a thumbnail is uploaded
      if (
        contentType !== "image" &&
        contentType !== "video" &&
        !thumbnailFile
      ) {
        setError("Please upload a thumbnail for your content.");
        return;
      }

      setError("");
      setIsProcessing(true);
      setSuccessMessage("");

      try {
        // 1. Upload the main file to Azure Blob Storage via /upload_azure
        const formData = new FormData();
        formData.append("file", file);
        formData.append("contentType", contentType);

        const uploadResponse = await fetch(`${API_BASE_URL}/upload_azure`, {
          method: "POST",
          body: formData,
          // If using session-based auth, include credentials
          // credentials: "include",
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.message || "Failed to upload file to Azure.");
        }

        const uploadData = await uploadResponse.json();
        const fileUrl = uploadData.urls?.file?.[0] || null;

        if (!fileUrl) {
          throw new Error("File URL not returned from Azure upload.");
        }

        // 2. If a separate thumbnail is uploaded, upload it to Azure
        let thumbnailUrl = "";

        if (contentType !== "image" && thumbnailFile) {
          const thumbnailFormData = new FormData();
          thumbnailFormData.append("file", thumbnailFile);
          thumbnailFormData.append("contentType", "thumbnail");

          const thumbnailUploadResponse = await fetch(
            `${API_BASE_URL}/upload_azure`,
            {
              method: "POST",
              body: thumbnailFormData,
              // If using session-based auth, include credentials
              // credentials: "include",
            }
          );

          if (!thumbnailUploadResponse.ok) {
            const errorData = await thumbnailUploadResponse.json();
            throw new Error(
              errorData.message || "Failed to upload thumbnail to Azure."
            );
          }

          const thumbnailUploadData = await thumbnailUploadResponse.json();
          thumbnailUrl = thumbnailUploadData.urls?.file?.[0] || "";
        } else if (contentType === "image") {
          // For images, use the same file as thumbnail
          thumbnailUrl = fileUrl;
        }

        // 3. Create content data with the file and thumbnail URLs
        const contentData = {
          user_id: user.id, // Include user_id
          title: title.trim(),
          about: about.trim(), // Include the 'about' field
          type: contentType,
          url: fileUrl,
          thumbnail: thumbnailUrl, // Ensure thumbnail is set
          tags: tags,
          library: selectedLibrary || null, // **Changed from 'collection' to 'library'**
          price: priceType === "paid" ? parseFloat(price) : 0, // Include price
          priceType: priceType, // Include priceType
        };

        const contentResponse = await fetch(`${API_BASE_URL}/content`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // If using session-based auth, include credentials
          // credentials: "include",
          body: JSON.stringify(contentData),
        });

        if (!contentResponse.ok) {
          const errorData = await contentResponse.json();
          throw new Error(
            errorData.message || "Failed to store content in the database."
          );
        }

        const createdContent = await contentResponse.json();
        console.log("Content created:", createdContent);

        setSuccessMessage("Content uploaded and stored successfully!");

        // Reset form
        handleRemoveFile();
        handleRemoveThumbnail();
        setTitle("");
        setAbout(""); // Reset 'about' field
        setPrice("");
        setPriceType("paid");
        setTags([]);
        setSelectedLibrary(""); // Reset selected library
      } catch (err) {
        console.error("Upload error:", err);
        setError(err.message);
      } finally {
        setIsProcessing(false);
      }
    },
    [
      file,
      title,
      about,
      contentType,
      thumbnailFile,
      tags,
      selectedLibrary,
      price,
      priceType,
      handleRemoveFile,
      handleRemoveThumbnail,
      API_BASE_URL,
      user.id, // Ensure user.id is included
    ]
  );

  // Memoized preview components to prevent unnecessary re-renders
  const filePreview = useMemo(() => {
    if (!previewSrc)
      return <p className="text-sm text-gray-400">No file selected</p>;

    if (contentType === "image") {
      return (
        <div className="relative w-full h-full">
          <img
            src={previewSrc}
            alt="Preview"
            className="w-full h-full object-contain rounded-md border border-gray-300"
          />
          <button
            type="button"
            onClick={handleRemoveFile}
            className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Remove file"
          >
            <AiOutlineClose size={16} />
          </button>
        </div>
      );
    } else if (contentType === "video") {
      return (
        <div className="relative w-full h-full">
          <video
            src={previewSrc}
            controls
            className="w-full h-full object-contain rounded-md border border-gray-300"
          />
          <button
            type="button"
            onClick={handleRemoveFile}
            className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Remove file"
          >
            <AiOutlineClose size={16} />
          </button>
        </div>
      );
    } else {
      // Non-media files: Display icon based on file type
      return (
        <div className="relative flex flex-col items-center justify-center w-full h-full p-4 bg-gray-50 rounded-md border border-gray-300">
          {getFileIcon(file.type)}
          <p className="mt-2 text-sm text-gray-700">{file.name}</p>
          <button
            type="button"
            onClick={handleRemoveFile}
            className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Remove file"
          >
            <AiOutlineClose size={16} />
          </button>
        </div>
      );
    }
  }, [previewSrc, contentType, file, handleRemoveFile, getFileIcon]);

  const thumbnailPreview = useMemo(() => {
    if (!thumbnailPreviewSrc) return null;

    return (
      <div className="relative w-full h-full">
        <img
          src={thumbnailPreviewSrc}
          alt="Thumbnail Preview"
          className="w-full h-full object-contain rounded-md border border-gray-300"
        />
        <button
          type="button"
          onClick={handleRemoveThumbnail}
          className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
          aria-label="Remove thumbnail"
        >
          <AiOutlineClose size={16} />
        </button>
      </div>
    );
  }, [thumbnailPreviewSrc, handleRemoveThumbnail]);

  return (
    <SidebarLayout>
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-10">
        {/* Page Title */}
        <h1 className="mb-6 text-2xl font-bold text-gray-700">Upload Your Content</h1>

        {/* Display Success or Error Messages */}
        {successMessage && (
          <div className="mb-4 rounded-md bg-green-100 p-4 text-green-700">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-md bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left 2/3 */}
            <div className="col-span-2 space-y-6">
              {/* Content Type Select */}
              <div>
                <label
                  htmlFor="contentType"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Content Type
                </label>
                <select
                  id="contentType"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="video">Video</option>
                  <option value="podcast">Podcast Episode</option>
                  <option value="image">Image</option>
                  <option value="downloadable">Downloadable File</option>
                  <option value="gamemod">Game Mod</option>
                  <option value="3dprint">3D Print Template</option>
                  <option value="digitalprint">Digital Print</option>
                </select>
              </div>

              {/* File Input */}
              <div>
                <label
                  htmlFor="file"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Upload File
                </label>
                <input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept={
                    contentType === "image"
                      ? "image/*"
                      : contentType === "video"
                      ? "video/*"
                      : "*/*"
                  }
                  ref={fileInputRef}
                  className="block w-full cursor-pointer text-sm text-gray-600 file:mr-4 file:rounded file:border-0 file:bg-purple-600 file:px-4 file:py-2 file:text-white hover:file:bg-purple-700 focus:outline-none"
                  required
                />
                <p className="mt-2 text-xs text-gray-400">
                  Select a file for your {contentType}.
                </p>
              </div>

              {/* Thumbnail Input for Non-Image Content */}
              {contentType !== "image" && (
                <div>
                  <label
                    htmlFor="thumbnail"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Upload Thumbnail (Required)
                  </label>
                  <input
                    id="thumbnail"
                    type="file"
                    onChange={handleThumbnailChange}
                    accept="image/*"
                    ref={thumbnailInputRef}
                    className="block w-full cursor-pointer text-sm text-gray-600 file:mr-4 file:rounded file:border-0 file:bg-purple-600 file:px-4 file:py-2 file:text-white hover:file:bg-purple-700 focus:outline-none"
                    required
                  />
                  <p className="mt-2 text-xs text-gray-400">
                    Upload a thumbnail image for your {contentType}.
                  </p>
                </div>
              )}

              {/* Preview */}
              <div className="flex flex-col space-y-4">
                {/* Main File Preview */}
                <div className="w-full h-56">
                  <p className="mb-2 text-sm font-medium text-gray-700">File Preview:</p>
                  <div className="w-full h-full bg-gray-100 rounded-md overflow-hidden">
                    {file && previewSrc ? (
                      filePreview
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-gray-400">No file selected</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Thumbnail Preview */}
                {contentType !== "image" && (
                  <div className="w-full h-32">
                    <p className="mb-2 text-sm font-medium text-gray-700">Thumbnail Preview:</p>
                    <div className="w-full h-full bg-gray-100 rounded-md overflow-hidden">
                      {thumbnailPreviewSrc ? (
                        thumbnailPreview
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-sm text-gray-400">No thumbnail selected</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder={`Name your ${contentType}`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* About the Content */}
              <div>
                <label
                  htmlFor="about"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  About the Content
                </label>
                <textarea
                  id="about"
                  placeholder="Provide a description for your content"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={4}
                  required
                ></textarea>
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Price
                </label>
                <input
                  id="price"
                  type="number"
                  placeholder="Set a price or leave blank for free"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={`w-full rounded-md border border-gray-300 p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    priceType === "free" ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  disabled={priceType === "free"}
                  min="0"
                  step="0.01"
                />
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-700">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="paid"
                      name="priceType"
                      value="paid"
                      checked={priceType === "paid"}
                      onChange={() => setPriceType("paid")}
                      className="h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="paid" className="ml-2">
                      Paid
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="free"
                      name="priceType"
                      value="free"
                      checked={priceType === "free"}
                      onChange={() => setPriceType("free")}
                      className="h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="free" className="ml-2">
                      Free
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column: Libraries + Tags */}
            <div className="space-y-6">
              {/* Libraries Card */}
              <div className="rounded-md border border-gray-200 p-4">
                <h3 className="mb-2 text-sm font-semibold text-gray-700">Libraries</h3>
                <p className="mb-4 text-xs text-gray-500">
                  Helps your fans connect with related content and shared themes.
                </p>
                {/* Select Existing Library */}
                <select
                  value={selectedLibrary}
                  onChange={(e) => setSelectedLibrary(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">-- Select a Library --</option>
                  {currentUser &&
                    currentUser.libraries &&
                    currentUser.libraries.map((library) => (
                      // Ensure that 'library' is defined and has '_id'
                      <option key={library._id} value={library._id}>
                        {library.name}
                      </option>
                    ))}
                </select>
                {/* Option to Create New Library */}
                {!isCreatingLibrary && (
                  <button
                    type="button"
                    className="mt-3 w-full rounded-md bg-purple-600 px-3 py-2 text-sm text-white hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onClick={() => setIsCreatingLibrary(true)}
                  >
                    + Create Library
                  </button>
                )}
                {/* Create Library Form */}
                {isCreatingLibrary && (
                  <div className="mt-3 space-y-2">
                    <input
                      type="text"
                      placeholder="New library name"
                      value={newLibraryName}
                      onChange={(e) => setNewLibraryName(e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleCreateLibrary}
                        className="flex-1 rounded-md bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        Create
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingLibrary(false);
                          setNewLibraryName("");
                        }}
                        className="flex-1 rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
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
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="rounded-md bg-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    +
                  </button>
                </div>
                {/* Display Tags */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-700"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 rounded-full bg-purple-300 p-1 text-white hover:bg-purple-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        aria-label={`Remove tag ${tag}`}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Upload Button */}
          <div className="mt-8 flex items-center justify-end gap-4">
            <button
              type="submit"
              disabled={isProcessing}
              className={`flex items-center gap-2 rounded-md bg-purple-600 px-6 py-3 text-white hover:bg-purple-700 transition-colors duration-200 ${
                isProcessing ? "cursor-not-allowed bg-purple-400" : ""
              }`}
            >
              {isProcessing && (
                <AiOutlineLoading3Quarters className="animate-spin" />
              )}
              {isProcessing ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </SidebarLayout>
  );
}
