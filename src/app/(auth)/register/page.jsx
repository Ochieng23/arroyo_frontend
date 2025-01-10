"use client"; // Only needed if using Next.js app router in a client component
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("creator");

  // Track password checks
  const [passwordChecks, setPasswordChecks] = useState({
    hasMinLength: false,
    hasNumber: false,
    hasLetter: false,
    hasSpecialChar: false,
  });

  // Validate password on every keystroke
  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);

    setPasswordChecks({
      hasMinLength: val.length >= 8,
      hasNumber: /\d/.test(val),            // checks for at least one digit
      hasLetter: /[a-zA-Z]/.test(val),      // checks for at least one letter
      hasSpecialChar: /[^a-zA-Z0-9]/.test(val), // checks for special characters
    });
  };

  // Handle form submission (POST to localhost:8000/auth/register)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      if (!response.ok) {
        console.error("Registration failed:", response.statusText);
        return;
      }
      console.log("Registration successful!");
      // Optionally redirect or show success message
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="relative h-screen w-full flex flex-col md:flex-row overflow-x-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://res.cloudinary.com/dhz4c0oae/image/upload/v1733729131/image_uqf9uw.png"
          alt="Background Image"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        {/* Overlay for better form visibility */}
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>

      {/* Sign-Up Form Container */}
      <div className="relative z-10 flex-1 flex items-center justify-center md:justify-start px-6 md:px-12 lg:px-24">
        <div className="bg-white shadow-lg rounded-2xl px-8 py-6 w-full max-w-md flex flex-col">
          {/* Logo */}
          <Link href="/" className="flex justify-center text-center mb-6">
            <Image
              src="https://res.cloudinary.com/dhz4c0oae/image/upload/v1733474194/Frame_2085663663_i0cui1.png"
              alt="Loreax Logo"
              






              
              height={40}
            />
          </Link>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-purple-700 text-center mb-2">
            Sign up
          </h2>
          <p className="text-sm text-gray-600 text-center mb-4">
            Monetize your content with ease and engage with your fans better.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
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
                value={password}
                required
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Are you a Creator or a Fan?
              </label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="creator">Creator</option>
                <option value="fan">Fan</option>
              </select>
            </div>

            {/* Password Conditions (dynamically updated) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 text-sm text-gray-600">
              <div className="space-y-2">
                <div>
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={passwordChecks.hasMinLength}
                    readOnly
                  />
                  8 characters minimum
                </div>
                <div>
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={passwordChecks.hasNumber}
                    readOnly
                  />
                  At least 1 number
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={passwordChecks.hasLetter}
                    readOnly
                  />
                  At least 1 letter
                </div>
                <div>
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={passwordChecks.hasSpecialChar}
                    readOnly
                  />
                  At least 1 special character
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
            >
              Sign up
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-3">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Social Login */}
          <div className="flex justify-center space-x-4">
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

          {/* Terms and Conditions */}
          <p className="text-xs text-center text-gray-500 mt-6">
            By clicking the Sign Up button, you agree to our{" "}
            <a href="#" className="text-purple-600 underline">
              Terms &amp; Conditions
            </a>
            .
          </p>
        </div>
      </div>

      {/* Login Link */}
      <div className="absolute bg-white px-4 py-1 top-4 right-6 z-20 rounded-md shadow-md">
        <Link
          href="/login"
          className="text-purple-600 hover:underline text-sm font-medium"
        >
          Login →
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
