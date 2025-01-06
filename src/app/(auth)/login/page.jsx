"use client"; // Needed if you're in Next.js 13+ 'app' directory

import { useState } from "react";
import { useRouter } from "next/navigation"; // or "next/router" if using Pages Router
import Image from "next/image";
import Link from "next/link";

// Import our user context hook
import { useUser } from "../../../contexts/UserContext";

export default function Login() {
  const router = useRouter();

  // State hooks for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Access setUser from context
  const { setUser } = useUser();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make POST request to your backend
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        // credentials: 'include' if you need cookies for sessions
      });

      if (!response.ok) {
        // Handle server error or unauthorized
        const errorData = await response.json();
        console.error("Login failed:", errorData.error || response.statusText);
        return;
      }

      // Parse response
      const data = await response.json();

      // Update context with the user object from the response
      // (This triggers localStorage to update as well, thanks to your context logic)
      setUser(data.user); 

      // Check the user role for redirect
      const userRole = data.user?.role;
      if (userRole === "creator") {
        router.push("/dashboard");
      } else {
        router.push("/home");
      }
    } catch (err) {
      console.error("Error during login:", err);
      // Optionally show error message to the user
    }
  };

  return (
    <div className="relative h-screen w-full flex flex-col md:flex-row overflow-x-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0">
        <Image
          src="https://res.cloudinary.com/dhz4c0oae/image/upload/v1733729131/image_uqf9uw.png"
          alt="Background Image"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 bg-black opacity-40" />
      </div>

      {/* Login Form Container (pure white background) */}
      <div className="relative z-10 flex-1 flex items-center justify-start px-6 md:px-12 lg:px-24">
        <div className="bg-white shadow-lg rounded-2xl px-8 py-6 w-full max-w-md flex flex-col items-center">
          {/* Logo */}
          <Link href="/" className="mb-6">
            <Image
              src="https://res.cloudinary.com/dhz4c0oae/image/upload/v1733474194/Frame_2085663663_i0cui1.png"
              alt="Loreax Logo"
              width={120}
              height={40}
            />
          </Link>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-purple-700 text-center mb-2">
            Login
          </h2>
          <p className="text-sm text-gray-600 text-center mb-4">
            Welcome back, continue from where you left off.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 
                         rounded-md hover:bg-purple-700 transition"
            >
              Log in
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6 w-full">
            <div className="flex-grow border-t border-gray-300" />
            <span className="px-3 text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          {/* Social Login */}
          <div className="flex justify-center space-x-4 w-full">
            <button className="flex items-center px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-100">
              <Image
                src="https://res.cloudinary.com/dhz4c0oae/image/upload/v1735543615/Google_Logo_yxu2xp.png"
                alt="Google"
                width={20}
                height={20}
              />
              <span className="ml-2">Google</span>
            </button>
            <button className="flex items-center px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-100">
              <Image
                src="https://res.cloudinary.com/dhz4c0oae/image/upload/v1735543009/Apple_Logo_lkykgq.png"
                alt="Apple"
                width={20}
                height={20}
              />
              <span className="ml-2">Apple ID</span>
            </button>
          </div>
        </div>
      </div>

      {/* Create Account Link */}
      <div className="absolute bg-white px-5 top-4 right-6 z-20">
        <Link
          href="/register"
          className="text-purple-600 hover:underline text-sm font-medium"
        >
          Create an account →
        </Link>
      </div>

      {/* Featured Creator */}
      <div className="absolute bottom-4 right-6 z-20">
        <p className="bg-white/80 text-sm text-gray-800 px-4 py-2 rounded-md shadow-md">
          Featured Creator: <strong>Lexi Wachera</strong>
        </p>
      </div>
    </div>
  );
}
