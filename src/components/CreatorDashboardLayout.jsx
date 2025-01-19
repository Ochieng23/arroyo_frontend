"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";

// Icons
import { RxDashboard } from "react-icons/rx";
import { FiBarChart2, FiDollarSign, FiBell, FiHeart } from "react-icons/fi";
import { FiSettings, FiLogOut, FiMenu, FiX } from "react-icons/fi";
// Replace HiOutlineMegaphone with HiOutlineSpeakerphone, which actually exists:
import { HiOutlineSpeakerphone } from "react-icons/hi";

const SidebarLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const [activeMenuItem, setActiveMenuItem] = useState(pathname);
  const router = useRouter();

  useEffect(() => {
    setActiveMenuItem(pathname);
    console.log(`${pathname} is active`);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        console.log("Logged out successfully");
        router.push("/login");
      } else {
        console.error("Logout failed", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while logging out", error);
    }
  };

  const handleNavigation = (href) => {
    router.push(href);
  };

  const menuItems = [
    {
      href: "/dashboard",
      icon: <RxDashboard size={17} />,
      label: "My Dashboard",
    },
    {
        href: "/upload",
        // Use HiOutlineSpeakerphone instead of HiOutlineMegaphone
        icon: <HiOutlineSpeakerphone size={17} />,
        label: "Upload Content",
      },
    // {
    //   href: "/insights",
    //   icon: <FiBarChart2 size={17} />,
    //   label: "Insights",
    // },
    {
      href: "/payouts",
      icon: <FiDollarSign size={17} />,
      label: "Payouts",
    },
    {
      href: "/notifications",
      icon: <FiBell size={17} />,
      label: "Notifications",
    },
    {
      href: "/settings",
      icon: <FiSettings size={17} />,
      label: "Settings",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100 text-black">
      {/* Sidebar */}
      <div
        className={`fixed h-screen flex flex-col justify-between border-r bg-white p-6 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        } lg:w-64`}
      >
        {/* Top Section */}
        <div className="flex flex-col items-center">
          {/* Logo / Title */}
          <Link href="/dashboard" passHref>
            <div className="my-1 inline-block cursor-pointer rounded-lg p-3 hover:bg-gray-200">
              <Logo size={17} />
            </div>
          </Link>

          {/* Dashboard Label (visible in expanded sidebar) */}
          {/* <h5
            className={`mt-4 text-center font-semibold ${
              sidebarOpen ? "block" : "hidden"
            } lg:block`}
          >
            My Dashboard
          </h5> */}

          {/* Menu Items */}
          <div className="mt-4 flex flex-col">
            {menuItems.map((item) => {
              const isActive = activeMenuItem?.startsWith(item.href);
              return (
                <div
                  key={item.href}
                  className={`relative my-1 flex cursor-pointer items-center gap-x-2 rounded-lg p-3 transition-colors duration-200 ${
                    isActive ? "bg-gray-200" : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleNavigation(item.href)}
                >
                  {item.icon}
                  <span
                    className={`ml-2 whitespace-nowrap text-sm ${
                      sidebarOpen ? "block" : "hidden"
                    } lg:block`}
                  >
                    {item.label}
                  </span>
                  {/* Highlight bar when active */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Section: Upload + Logout */}
        <div className="flex flex-col items-center">
          {/* “Upload content” button */}
          {/* <button
            className={`mb-4 w-full rounded-md bg-purple-600 py-2 text-white hover:bg-purple-700 transition-colors duration-200 ${
              sidebarOpen ? "block" : "hidden"
            } lg:block`}
          >
            Upload content
          </button> */}

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className={`my-1 flex w-full items-center justify-center gap-x-2 rounded-lg p-3 transition-colors duration-200 hover:bg-gray-200 ${
              sidebarOpen ? "flex" : "hidden"
            } lg:flex`}
          >
            <FiLogOut size={17} />
            <span className="text-sm">Log out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main
        className={`flex-1 p-6 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        } lg:ml-64`}
      >
        {/* Mobile hamburger button */}
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-black focus:outline-none"
          >
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>

        {children}
      </main>
    </div>
  );
};

export default SidebarLayout;
