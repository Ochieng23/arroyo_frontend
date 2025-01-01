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
        <h1 className="text-2xl font-bold text-purple-700 mb-4">Insights & Analytics</h1>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Stat Card: Monthly Revenue */}
          <div className="bg-white rounded-xl p-4 shadow flex flex-col justify-between">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-3">
                <FaDollarSign size={20} />
              </div>
              <div className="text-sm font-medium text-gray-600">This Month's Revenue</div>
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
          <div className="bg-white rounded-xl p-4 shadow flex flex-col justify-between">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-3">
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
          <div className="bg-white rounded-xl p-4 shadow flex flex-col justify-between">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-3">
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
          <div className="bg-white rounded-xl p-4 shadow flex flex-col justify-between">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-3">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Tiers / Membership Levels */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Membership Tiers</h3>
            <div className="space-y-4">
              {/* Tier 1 */}
              <div className="p-3 border border-gray-200 rounded-md flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Bronze Fan</h4>
                  <p className="text-xs text-gray-500">Ksh.200 / month</p>
                </div>
                <div className="text-sm text-gray-600">324 members</div>
              </div>
              {/* Tier 2 */}
              <div className="p-3 border border-gray-200 rounded-md flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Silver Star</h4>
                  <p className="text-xs text-gray-500">Ksh.500 / month</p>
                </div>
                <div className="text-sm text-gray-600">512 members</div>
              </div>
              {/* Tier 3 */}
              <div className="p-3 border border-gray-200 rounded-md flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Gold VIP</h4>
                  <p className="text-xs text-gray-500">Ksh.1,000 / month</p>
                </div>
                <div className="text-sm text-gray-600">158 members</div>
              </div>
            </div>
          </div>

          {/* Simple "Revenue Over Time" placeholder chart */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Revenue Over Time</h3>
            <div className="h-48 flex items-center justify-center bg-gray-100 text-gray-400 text-sm rounded-md">
              {/* Placeholder for a chart */}
              <p>Chart goes here</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Recent Transactions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-2 font-medium text-gray-600">Date</th>
                  <th className="py-2 px-2 font-medium text-gray-600">User</th>
                  <th className="py-2 px-2 font-medium text-gray-600">Item</th>
                  <th className="py-2 px-2 font-medium text-gray-600">Amount</th>
                  <th className="py-2 px-2 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-2">Aug 18, 2025</td>
                  <td className="py-2 px-2">userX123</td>
                  <td className="py-2 px-2">Gold VIP (monthly)</td>
                  <td className="py-2 px-2">Ksh.1,000</td>
                  <td className="py-2 px-2 text-green-600">Completed</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-2">Aug 18, 2025</td>
                  <td className="py-2 px-2">sarah_mwangi</td>
                  <td className="py-2 px-2">Behind-the-scenes video (PPV)</td>
                  <td className="py-2 px-2">Ksh.400</td>
                  <td className="py-2 px-2 text-green-600">Completed</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-2">Aug 17, 2025</td>
                  <td className="py-2 px-2">john_doe</td>
                  <td className="py-2 px-2">Silver Star (monthly)</td>
                  <td className="py-2 px-2">Ksh.500</td>
                  <td className="py-2 px-2 text-green-600">Completed</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-2">Aug 17, 2025</td>
                  <td className="py-2 px-2">kevo238</td>
                  <td className="py-2 px-2">Exclusive track (PPV)</td>
                  <td className="py-2 px-2">Ksh.300</td>
                  <td className="py-2 px-2 text-green-600">Completed</td>
                </tr>
                <tr>
                  <td className="py-2 px-2">Aug 16, 2025</td>
                  <td className="py-2 px-2">lisa_254</td>
                  <td className="py-2 px-2">Bronze Fan (monthly)</td>
                  <td className="py-2 px-2">Ksh.200</td>
                  <td className="py-2 px-2 text-green-600">Completed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
