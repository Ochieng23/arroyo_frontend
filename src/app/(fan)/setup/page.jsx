'use client';

import React, { useState, useEffect } from "react";
import { useUser } from "@/contexts/userContext";
import { useRouter } from "next/navigation";
import Image from "next/image"; 
import UserSidebarLayout from "@/components/FanDashboardLayout";// Import Next.js Image component for optimized images

export default function Setup() {
  const { user: currentUser, loading: userLoading, setUser } = useUser(); // Destructure setUser
  const router = useRouter();

  const [formData, setFormData] = useState({
    bannerImage: null, // File object for new banner image
    profileImage: null, // File object for new profile image
    firstName: "",
    lastName: "",
    email: "",
    about: "",
    address: "",
    phoneNumber: "",
    niche: "",
    social: {
      platform: "",
      link: "",
    },
    isPublic: true,
    noExplicitContent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Image previews
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [bannerImagePreview, setBannerImagePreview] = useState(null);

  // Flags to indicate image removal
  const [removeBannerImage, setRemoveBannerImage] = useState(false);
  const [removeProfileImage, setRemoveProfileImage] = useState(false);

  // Extract userId from the user context
  const userId = currentUser?.id || currentUser?._id;

  // Populate form with existing user data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      console.log("Populating form with current user data.");
      setFormData((prev) => ({
        ...prev,
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        about: currentUser.about || "",
        address: currentUser.address || "",
        phoneNumber: currentUser.phoneNumber || "",
        niche: currentUser.niche || "",
        isPublic:
          typeof currentUser.isPublic === "boolean"
            ? currentUser.isPublic
            : true,
        noExplicitContent:
          typeof currentUser.noExplicitContent === "boolean"
            ? currentUser.noExplicitContent
            : false,
        social: {
          platform: "",
          link: "",
        },
      }));

      // Set existing social links if any (assuming only one for simplicity)
      const existingSocial = currentUser.social || {};
      const platforms = Object.keys(existingSocial);
      if (platforms.length > 0) {
        setFormData((prev) => ({
          ...prev,
          social: {
            platform: platforms[0],
            link: existingSocial[platforms[0]],
          },
        }));
        console.log(
          `Existing social link found: ${platforms[0]} - ${existingSocial[platforms[0]]}`
        );
      }

      // Set existing image previews if images are not marked for removal
      if (currentUser.bannerImage && !removeBannerImage) {
        setBannerImagePreview(`${currentUser.bannerImage}?t=${new Date().getTime()}`);
        console.log("Existing banner image set for preview.");
      }
      if (currentUser.profileImage && !removeProfileImage) {
        setProfileImagePreview(`${currentUser.profileImage}?t=${new Date().getTime()}`);
        console.log("Existing profile image set for preview.");
      }
    }
  }, [currentUser, removeBannerImage, removeProfileImage]);

  // Effect to handle profile image preview (for new uploads)
  useEffect(() => {
    if (formData.profileImage) {
      const objectUrl = URL.createObjectURL(formData.profileImage);
      setProfileImagePreview(objectUrl);
      console.log("New profile image selected for preview:", formData.profileImage.name);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [formData.profileImage]);

  // Effect to handle banner image preview (for new uploads)
  useEffect(() => {
    if (formData.bannerImage) {
      const objectUrl = URL.createObjectURL(formData.bannerImage);
      setBannerImagePreview(objectUrl);
      console.log("New banner image selected for preview:", formData.bannerImage.name);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [formData.bannerImage]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      console.log(`Checkbox ${name} changed to ${checked}`);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      console.log(`Input ${name} changed to ${value}`);
    }
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      social: { ...prev.social, [name]: value },
    }));
    console.log(`Social field ${name} changed to ${value}`);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      console.log(`File input ${name} selected file:`, files[0].name);

      // Reset removal flags if a new image is selected
      if (name === "bannerImage" && removeBannerImage) {
        setRemoveBannerImage(false);
        console.log("Banner image removal flag reset.");
      }
      if (name === "profileImage" && removeProfileImage) {
        setRemoveProfileImage(false);
        console.log("Profile image removal flag reset.");
      }
    }
  };

  const handleDeleteImage = (imageType) => {
    if (imageType === "profileImage") {
      setFormData((prev) => ({ ...prev, profileImage: null }));
      setProfileImagePreview(null);
      setRemoveProfileImage(true); // Set flag to remove image
      console.log("Profile image marked for removal.");
    }
    if (imageType === "bannerImage") {
      setFormData((prev) => ({ ...prev, bannerImage: null }));
      setBannerImagePreview(null);
      setRemoveBannerImage(true); // Set flag to remove image
      console.log("Banner image marked for removal.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission if user data is still loading or userId is not available
    if (userLoading || !userId) {
      setError("User data is still loading. Please try again shortly.");
      console.error(
        "Submission attempted while user data is loading or userId is missing."
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);
    console.log("Form submission started.");

    try {
      // 1. Upload Images to Azure
      const uploadImage = async (file, fieldName) => {
        const uploadFormData = new FormData();
        uploadFormData.append(fieldName, file); // Append using fieldName

        console.log(`Uploading ${fieldName}:`, file.name);

        const response = await fetch("http://localhost:8000/upload_azure", {
          method: "POST",
          body: uploadFormData,
          // Headers like authentication tokens can be added here if required
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Error uploading ${fieldName}:`, errorData.error);
          throw new Error(errorData.error || `Image upload failed for ${fieldName}`);
        }

        const data = await response.json();
        console.log(`${fieldName} upload response data:`, data);

        // Access URL using fieldName
        if (
          data.success &&
          data.urls &&
          data.urls[fieldName] &&
          data.urls[fieldName].length > 0
        ) {
          console.log(
            `${fieldName} uploaded successfully. URL:`,
            data.urls[fieldName][0]
          );
          return data.urls[fieldName][0];
        } else {
          console.error(`${fieldName} upload did not return a URL.`);
          throw new Error(`${fieldName} upload did not return a URL.`);
        }
      };

      let bannerImageUrl = currentUser.bannerImage || null;
      let profileImageUrl = currentUser.profileImage || null;

      // Upload Banner Image if a new one is selected
      if (formData.bannerImage) {
        console.log("New banner image detected. Initiating upload.");
        bannerImageUrl = await uploadImage(formData.bannerImage, "bannerImage");
      } else if (removeBannerImage) {
        console.log("Banner image removal detected. Setting URL to null.");
        // If banner image is to be removed
        bannerImageUrl = null;
      } else {
        console.log("No changes detected for banner image.");
      }

      // Upload Profile Image if a new one is selected
      if (formData.profileImage) {
        console.log("New profile image detected. Initiating upload.");
        profileImageUrl = await uploadImage(formData.profileImage, "profileImage");
      } else if (removeProfileImage) {
        console.log("Profile image removal detected. Setting URL to null.");
        // If profile image is to be removed
        profileImageUrl = null;
      } else {
        console.log("No changes detected for profile image.");
      }

      // 2. Prepare User Data
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        about: formData.about,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        niche: formData.niche,
        isPublic: formData.isPublic,
        noExplicitContent: formData.noExplicitContent,
        // Include image URLs with consistent naming
        bannerImage: bannerImageUrl,
        profileImage: profileImageUrl,
      };

      // Include social links if provided
      if (formData.social.platform && formData.social.link) {
        userData.social = {
          [formData.social.platform]: formData.social.link,
        };
        console.log("Social links added to user data:", userData.social);
      } else {
        userData.social = {}; // Clear social links if none provided
        console.log("No social links provided. Clearing existing social links.");
      }

      console.log("User Data to Update:", userData);

      // 3. Update User Data via PUT /users/:id
      console.log(`Sending PUT request to update user data for userId: ${userId}`);
      const updateResponse = await fetch(`http://localhost:8000/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Include authentication headers if required (e.g., cookies handled automatically)
        },
        body: JSON.stringify(userData),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        console.error("Error updating user data:", errorData.error);
        throw new Error(errorData.error || "Failed to update user data");
      }

      const updateData = await updateResponse.json();
      console.log("User data updated successfully:", updateData);

      // 4. Update User Context with New Data
      setUser(updateData); // Update the user context
      console.log("User context updated with new data.");

      // 5. Handle Success (e.g., redirect to dashboard)
      console.log("Redirecting to dashboard.");
      router.push("/dashboard"); // Navigate to dashboard
    } catch (err) {
      console.error("Error during form submission:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
      console.log("Form submission process completed.");
    }
  };

  // If user data is loading, display a loading indicator
  if (userLoading) {
    console.log("User data is loading. Displaying loading indicator.");
    return (
      <UserSidebarLayout>
        <div className="min-h-screen w-full flex items-center justify-center">
          <p className="text-gray-500">Loading user data...</p>
        </div>
      </UserSidebarLayout>
    );
  }

  // If user is not authenticated, show a message
  if (!currentUser) {
    console.log("User is not authenticated. Displaying authentication message.");
    return (
      <UserSidebarLayout>
        <div className="min-h-screen w-full flex items-center justify-center">
          <p className="text-red-500">You need to be logged in to set up your account.</p>
        </div>
      </UserSidebarLayout>
    );
  }

  return (
    <UserSidebarLayout>
      {/* Container for the entire form area */}
      <div className="min-h-screen w-full bg-white p-6 md:p-10 flex items-start justify-center">
        <div className="w-full max-w-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-purple-600 mb-8 text-center">
            Complete Your Profile
          </h1>

          {error && (
            <div className="mb-4 text-red-500 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Profile Banner */}
            <div className="mb-4">
              <label htmlFor="profile-banner" className="block text-sm font-medium text-gray-700 mb-2">
                Profile Banner
              </label>
              <div className="flex items-center border border-gray-300 rounded-md p-3">
                <input
                  type="file"
                  accept="image/*"
                  id="profile-banner"
                  name="bannerImage"
                  onChange={handleFileChange}
                  className="hidden"
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
              {bannerImagePreview && (
                <div className="mt-2 relative">
                  {/* Use Next.js Image component for optimized image rendering */}
                  <Image
                    src={bannerImagePreview}
                    alt="Banner Preview"
                    width={1200}
                    height={400}
                    className="w-full h-32 object-cover rounded-md"
                    priority // Optional: Preload the banner image
                  />
                  {/* Remove Image Button Overlay */}
                  <button
                    type="button"
                    onClick={() => handleDeleteImage("bannerImage")}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 focus:outline-none"
                    title="Remove Banner Image"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>

            {/* Profile Picture */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden relative">
                  {/* Use Next.js Image component */}
                  {profileImagePreview ? (
                    <Image
                      src={profileImagePreview}
                      alt="Profile picture preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw,
                             (max-width: 1200px) 50vw,
                             33vw"
                    />
                  ) : (
                    <Image
                      src="/placeholder-avatar.jpg" // Ensure this placeholder exists in the public directory
                      alt="Profile picture placeholder"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw,
                             (max-width: 1200px) 50vw,
                             33vw"
                    />
                  )}
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
                    id="profile-picture"
                    name="profileImage"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
              {profileImagePreview && (
                <button
                  type="button"
                  className="text-sm text-red-500 hover:underline"
                  onClick={() => handleDeleteImage("profileImage")}
                >
                  Remove
                </button>
              )}
            </div>

            {/* First and Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-md p-3 w-full"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-md p-3 w-full"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md p-3 w-full"
                disabled // Assuming email is already set and should not be changed
              />
            </div>

            {/* Bio */}
            <div className="mb-6">
              <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="about"
                id="about"
                placeholder="Bio (max 100 characters, short and punchy)"
                className="border border-gray-300 rounded-md p-3 w-full"
                maxLength={100}
                value={formData.about}
                onChange={handleChange}
                required
              />
              <div className="text-right text-xs text-gray-500">
                {formData.about.length}/100
              </div>
            </div>

            {/* Location and Phone Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  placeholder="City or location"
                  value={formData.address}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-3 w-full"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="flex">
                  <select
                    name="phoneCountryCode"
                    id="phoneCountryCode"
                    className="border border-gray-300 rounded-l-md p-3 w-20 bg-gray-50"
                    value="+254"
                    disabled // Assuming fixed country code
                  >
                    <option>+254</option>
                    {/* Add more country codes if needed */}
                  </select>
                  <input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    placeholder="Phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-r-md p-3 w-full"
                  />
                </div>
              </div>
            </div>

            {/* Niche */}
            <div className="mb-6">
              <label htmlFor="niche" className="block text-sm font-medium text-gray-700 mb-2">
                Niche (optional)
              </label>
              <input
                type="text"
                name="niche"
                id="niche"
                placeholder="Niche (optional)"
                value={formData.niche}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-3 w-full"
              />
            </div>

            {/* Social Links */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Social Links
              </label>
              <div className="flex items-center gap-4">
                <select
                  name="platform"
                  id="platform"
                  className="border border-gray-300 rounded-md p-3 w-1/3 bg-gray-50"
                  value={formData.social.platform}
                  onChange={handleSocialChange}
                >
                  <option value="">Platform</option>
                  <option value="facebook">Facebook</option>
                  <option value="x">X</option>
                  <option value="youtube">YouTube</option>
                  <option value="spotify">Spotify</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="pinterest">Pinterest</option>
                  {/* Add more platforms as needed */}
                </select>
                <input
                  type="url"
                  name="link"
                  id="link"
                  placeholder="Link"
                  value={formData.social.link}
                  onChange={handleSocialChange}
                  className="border border-gray-300 rounded-md p-3 w-full"
                />
              </div>
              {/* Display existing social links */}
              {currentUser.social && Object.keys(currentUser.social).length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Current Social Links:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {Object.entries(currentUser.social).map(([platform, link]) => (
                      <li key={platform}>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:underline"
                        >
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}: {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Toggles */}
            <div className="flex flex-col gap-2 mb-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  className="h-5 w-5 text-purple-600"
                />
                <span>My profile is public to all visitors</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="noExplicitContent"
                  checked={formData.noExplicitContent}
                  onChange={handleChange}
                  className="h-5 w-5 text-purple-600"
                />
                <span>My content does not contain any explicit material</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${
                  isSubmitting
                    ? "bg-purple-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                } text-white rounded-full px-6 py-3 text-lg`}
              >
                {isSubmitting ? "Submitting..." : "Finish setup and go to Dashboard"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </UserSidebarLayout>
  );
}
