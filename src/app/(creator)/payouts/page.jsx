"use client";

import React from "react";
import SidebarLayout from "@/components/CreatorDashboardLayout";
import { FaArrowUp, FaArrowDown, FaMoneyBillWave } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";

export default function Payouts() {
  return (
    <SidebarLayout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-gray-800">
        <h1 className="mb-4 text-2xl font-bold text-purple-700">Payouts</h1>

        {/* Top Stats and Withdraw Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Available Balance */}
          <div className="col-span-1 lg:col-span-2 bg-white rounded-xl p-6 shadow flex flex-col justify-between">
            <h2 className="mb-2 text-sm font-medium text-gray-500">
              Available Balance
            </h2>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold">Ksh. 14,950</p>
                <span className="text-xs text-gray-400">
                  after fees & hold period
                </span>
              </div>
              <button className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
                Withdraw
              </button>
            </div>
          </div>

          {/* Card 2: Lifetime Earnings */}
          <div className="bg-white rounded-xl p-6 shadow flex flex-col justify-between">
            <h2 className="mb-2 text-sm font-medium text-gray-500">
              Lifetime Earnings
            </h2>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold">Ksh. 256,300</p>
                <span className="text-xs text-gray-400">
                  across all content sales
                </span>
              </div>
              <FaMoneyBillWave className="text-2xl text-green-500" />
            </div>
          </div>
        </div>

        {/* Middle Row: Payout Methods + Next Payout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Saved Payout Methods */}
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">
              Saved Payout Methods
            </h3>
            <p className="mb-4 text-xs text-gray-500">
              Decide how you get your funds.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between border border-gray-100 rounded-md p-2">
                <div>
                  <p className="font-medium">M-Pesa</p>
                  <p className="text-xs text-gray-400">+254 712 345 678</p>
                </div>
                <span className="text-gray-500 hover:text-red-500 cursor-pointer text-xs">
                  Remove
                </span>
              </div>
              <div className="flex items-center justify-between border border-gray-100 rounded-md p-2">
                <div>
                  <p className="font-medium">Bank Transfer</p>
                  <p className="text-xs text-gray-400">
                    Equity Bank •••• 4562
                  </p>
                </div>
                <span className="text-gray-500 hover:text-red-500 cursor-pointer text-xs">
                  Remove
                </span>
              </div>
              <button className="mt-3 w-full rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200">
                + Add new method
              </button>
            </div>
          </div>

          {/* Next Scheduled Payout */}
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">
              Next Scheduled Payout
            </h3>
            <p className="mb-4 text-xs text-gray-500">
              Your funds will automatically be transferred.
            </p>
            <div className="flex items-center justify-between rounded-md border border-gray-200 p-4">
              <div>
                <h4 className="text-base font-medium text-gray-700">Aug 24, 2025</h4>
                <p className="text-sm text-gray-500">
                  3 business days remaining
                </p>
              </div>
              <FaArrowDown className="text-xl text-gray-400" />
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500 gap-2">
              <FaArrowUp className="text-green-400" />
              <p>Auto-withdrawal to Equity Bank •••• 4562</p>
            </div>
          </div>
        </div>

        {/* Recent Payouts Table */}
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">
              Recent Payouts
            </h3>
            <button className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200">
              <FiDownload />
              <span>Export CSV</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="border-b text-xs font-medium uppercase text-gray-500">
                <tr>
                  <th className="py-2 px-2">Date</th>
                  <th className="py-2 px-2">Method</th>
                  <th className="py-2 px-2">Amount</th>
                  <th className="py-2 px-2">Fees</th>
                  <th className="py-2 px-2">Net Received</th>
                  <th className="py-2 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b">
                  <td className="py-2 px-2">Aug 16, 2025</td>
                  <td className="py-2 px-2">M-Pesa</td>
                  <td className="py-2 px-2">Ksh.15,000</td>
                  <td className="py-2 px-2">Ksh.150</td>
                  <td className="py-2 px-2">Ksh.14,850</td>
                  <td className="py-2 px-2 text-green-600">Completed</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-2">Aug 09, 2025</td>
                  <td className="py-2 px-2">Bank Transfer</td>
                  <td className="py-2 px-2">Ksh.20,000</td>
                  <td className="py-2 px-2">Ksh.200</td>
                  <td className="py-2 px-2">Ksh.19,800</td>
                  <td className="py-2 px-2 text-green-600">Completed</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-2">Aug 02, 2025</td>
                  <td className="py-2 px-2">M-Pesa</td>
                  <td className="py-2 px-2">Ksh.10,000</td>
                  <td className="py-2 px-2">Ksh.100</td>
                  <td className="py-2 px-2">Ksh.9,900</td>
                  <td className="py-2 px-2 text-green-600">Completed</td>
                </tr>
                <tr>
                  <td className="py-2 px-2">Jul 25, 2025</td>
                  <td className="py-2 px-2">Bank Transfer</td>
                  <td className="py-2 px-2">Ksh.12,000</td>
                  <td className="py-2 px-2">Ksh.120</td>
                  <td className="py-2 px-2">Ksh.11,880</td>
                  <td className="py-2 px-2 text-green-600">Completed</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            * Transfer times may vary based on your bank’s processing speed.
          </p>
        </div>
      </div>
    </SidebarLayout>
  );
}
