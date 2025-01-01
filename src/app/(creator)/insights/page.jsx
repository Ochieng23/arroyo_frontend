"use client";

import React from "react";
import SidebarLayout from "@/components/CreatorDashboardLayout";
import {
  FaEye,
  FaDollarSign,
  FaUsers,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

export default function Insights() {
  return (
    <SidebarLayout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-gray-800">
        <h1 className="mb-4 text-2xl font-bold text-purple-700">Insights &amp; Analytics</h1>

        {/* Overall Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Stat Card: Monthly Revenue */}
          <div className="flex flex-col justify-between rounded-xl bg-white p-4 shadow">
            <div className="flex items-center">
              <div className="mr-3 rounded-full bg-purple-100 p-3 text-purple-600">
                <FaDollarSign size={20} />
              </div>
              <div className="text-sm font-medium text-gray-600">
                This Month&apos;s Revenue
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold">Ksh. 65,400</h2>
                <p className="text-xs text-gray-500">+18% from last month</p>
              </div>
              <FaArrowUp className="text-green-500" />
            </div>
          </div>

          {/* Stat Card: Active Subscribers */}
          <div className="flex flex-col justify-between rounded-xl bg-white p-4 shadow">
            <div className="flex items-center">
              <div className="mr-3 rounded-full bg-purple-100 p-3 text-purple-600">
                <FaUsers size={20} />
              </div>
              <div className="text-sm font-medium text-gray-600">Active Subscribers</div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold">1,254</h2>
                <p className="text-xs text-gray-500">+54 new subscribers</p>
              </div>
              <FaArrowUp className="text-green-500" />
            </div>
          </div>

          {/* Stat Card: Pay-Per-View Sales */}
          <div className="flex flex-col justify-between rounded-xl bg-white p-4 shadow">
            <div className="flex items-center">
              <div className="mr-3 rounded-full bg-purple-100 p-3 text-purple-600">
                <FaEye size={20} />
              </div>
              <div className="text-sm font-medium text-gray-600">Pay-Per-View Sales</div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold">230</h2>
                <p className="text-xs text-gray-500">-12% from last month</p>
              </div>
              <FaArrowDown className="text-red-500" />
            </div>
          </div>

          {/* Stat Card: Projected Growth */}
          <div className="flex flex-col justify-between rounded-xl bg-white p-4 shadow">
            <div className="flex items-center">
              <div className="mr-3 rounded-full bg-purple-100 p-3 text-purple-600">
                <FaChartLine size={20} />
              </div>
              <div className="text-sm font-medium text-gray-600">Projected Growth</div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold">+24%</h2>
                <p className="text-xs text-gray-500">in the next 30 days</p>
              </div>
              <FaArrowUp className="text-green-500" />
            </div>
          </div>
        </div>

        {/* Tier Performance / Graph */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Tiers / Membership Levels */}
          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-semibold text-gray-700">Membership Tiers</h3>
            <div className="space-y-4">
              {/* Tier 1 */}
              <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                <div>
                  <h4 className="font-semibold">Bronze Fan</h4>
                  <p className="text-xs text-gray-500">Ksh.200 / month</p>
                </div>
                <div className="text-sm text-gray-600">324 members</div>
              </div>
              {/* Tier 2 */}
              <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                <div>
                  <h4 className="font-semibold">Silver Star</h4>
                  <p className="text-xs text-gray-500">Ksh.500 / month</p>
                </div>
                <div className="text-sm text-gray-600">512 members</div>
              </div>
              {/* Tier 3 */}
              <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                <div>
                  <h4 className="font-semibold">Gold VIP</h4>
                  <p className="text-xs text-gray-500">Ksh.1,000 / month</p>
                </div>
                <div className="text-sm text-gray-600">158 members</div>
              </div>
            </div>
          </div>

          {/* Simple "Revenue Over Time" placeholder chart */}
          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-semibold text-gray-700">Revenue Over Time</h3>
            <div className="flex h-48 items-center justify-center rounded-md bg-gray-100 text-sm text-gray-400">
              {/* Placeholder for a chart */}
              <p>Chart goes here</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="rounded-xl bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold text-gray-700">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-2 py-2 font-medium text-gray-600">Date</th>
                  <th className="px-2 py-2 font-medium text-gray-600">User</th>
                  <th className="px-2 py-2 font-medium text-gray-600">Item</th>
                  <th className="px-2 py-2 font-medium text-gray-600">Amount</th>
                  <th className="px-2 py-2 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-2 py-2">Aug 18, 2025</td>
                  <td className="px-2 py-2">userX123</td>
                  <td className="px-2 py-2">Gold VIP (monthly)</td>
                  <td className="px-2 py-2">Ksh.1,000</td>
                  <td className="px-2 py-2 text-green-600">Completed</td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 py-2">Aug 18, 2025</td>
                  <td className="px-2 py-2">sarah_mwangi</td>
                  <td className="px-2 py-2">Behind-the-scenes video (PPV)</td>
                  <td className="px-2 py-2">Ksh.400</td>
                  <td className="px-2 py-2 text-green-600">Completed</td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 py-2">Aug 17, 2025</td>
                  <td className="px-2 py-2">john_doe</td>
                  <td className="px-2 py-2">Silver Star (monthly)</td>
                  <td className="px-2 py-2">Ksh.500</td>
                  <td className="px-2 py-2 text-green-600">Completed</td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 py-2">Aug 17, 2025</td>
                  <td className="px-2 py-2">kevo238</td>
                  <td className="px-2 py-2">Exclusive track (PPV)</td>
                  <td className="px-2 py-2">Ksh.300</td>
                  <td className="px-2 py-2 text-green-600">Completed</td>
                </tr>
                <tr>
                  <td className="px-2 py-2">Aug 16, 2025</td>
                  <td className="px-2 py-2">lisa_254</td>
                  <td className="px-2 py-2">Bronze Fan (monthly)</td>
                  <td className="px-2 py-2">Ksh.200</td>
                  <td className="px-2 py-2 text-green-600">Completed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
