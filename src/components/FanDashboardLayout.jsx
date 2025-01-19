// /components/UserSidebarLayout.jsx

"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useUser } from "@/context/userContext";

import {
  FiHome,
  FiCompass,
  FiBell,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

const UserSidebarLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser, userDetails, loadingUserDetails, userDetailsError } = useUser();

  // console.log("User in UserSidebarLayout:", user);
  // console.log("UserDetails in UserSidebarLayout:", userDetails);

  useEffect(() => {
    // Update active menu item based on pathname
    console.log(`${pathname} is active`);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const logoutUrl = process.env.NEXT_PUBLIC_LOGOUT_URL;

      if (!logoutUrl) {
        throw new Error("Logout URL is not defined in environment variables.");
      }

      const response = await fetch(`${logoutUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        console.log("Logged out successfully");
        setUser(null); // Clear user state
        router.push("/login");
      } else {
        const errorData = await response.json();
        console.error("Logout failed:", errorData.message || response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while logging out", error);
    }
  };

  const menuItems = [
    {
      href: "/home",
      icon: <FiHome size={20} />,
      label: "Home",
    },
    {
      href: "/explore",
      icon: <FiCompass size={20} />,
      label: "Explore",
    },
    {
      href: "/content",
      icon: <FiCompass size={20} />,
      label: "My Content",
    },
    {
      href: "/updates",
      icon: <FiBell size={20} />,
      label: "Updates",
    },
    {
      href: "/setup",
      icon: <FiSettings size={20} />,
      label: "Setup",
    },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col fixed top-0 left-0 h-full overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center justify-center h-20 border-b">
          <Logo />
        </div>

        {/* User Profile Section */}
        <div className="flex flex-col items-center mt-6 px-4">
          {loadingUserDetails ? (
            <div className="w-16 h-16 rounded-full bg-gray-300 animate-pulse mb-3"></div>
          ) : userDetails ? (
            <Image
              src={userDetails.profileImage || " "} // Ensure this path exists
              alt={`${userDetails.name || userDetails.email} Profile`}
              width={64}
              height={64}
              className="rounded-full object-cover mb-3 border-4 border-white shadow-md"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-300 mb-3 flex items-center justify-center text-gray-500">
              ?
            </div>
          )}
          <span className="text-lg font-semibold">
            {userDetails?.name || userDetails?.email || "User Name"}
          </span>
          <span className="text-sm text-gray-500">
            {userDetails?.role || "User Role"}
          </span>
          {userDetailsError && (
            <span className="text-xs text-red-500 mt-1">
              Failed to load user details
            </span>
          )}
        </div>

        {/* Menu Items */}
        <nav className="mt-10 flex-1 px-2 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                href={item.href}
                key={item.href}
                className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md w-full relative ${
                  isActive
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute left-0 inset-y-0 w-1 bg-green-500 rounded-r-md"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section: Logout */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="group flex items-center px-4 py-2 text-sm font-medium rounded-md w-full text-left text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            <FiLogOut className="mr-3" size={20} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-6 w-full overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default UserSidebarLayout;
