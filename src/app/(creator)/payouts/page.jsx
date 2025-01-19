"use client";

import React, { useEffect, useState } from "react";
import SidebarLayout from "@/components/CreatorDashboardLayout";
import { FaMoneyBillWave } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { useUser } from "@/context/userContext";
import useSocket from "@/context/socketContext"; // Import the socket context
import axios from "axios";
import { toast } from "react-toastify"; // Optional: For toast notifications

export default function Payouts() {
  const { user, userDetails } = useUser(); // Using user and userDetails from useUser context
  const socket = useSocket(); // Access the Socket.IO client
  const [payoutMethods, setPayoutMethods] = useState([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [banks, setBanks] = useState([]); // Store list of banks
  const [balance, setBalance] = useState(0); // State for balance
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateWithdrawal, setShowCreateWithdrawal] = useState(false);
  const [createWithdrawalData, setCreateWithdrawalData] = useState({
    amount: "",
    recipient: "",
    reference: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  /**
   * Fetch user data from /users/user.id
   */
  const fetchUserData = async () => {
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await axios.get(`${BASE_URL}/users/${user.id}`, {
        headers: { "Content-Type": "application/json" },
      });

      const userData = response.data;

      // Check if creator has a subaccount
      if (userData.creator && userData.creator.subaccountCode) {
        setPayoutMethods([
          {
            method: "Bank Transfer",
            details: `${userData.creator.settlement_bank || "N/A"} •••• ${
              userData.creator.account_number
                ? userData.creator.account_number.slice(-4)
                : "****"
            }`,
          },
          // Add more methods if available
        ]);

        // Fetch balance
        await fetchBalance(userData.creator._id);

        // Fetch withdrawal history
        await fetchWithdrawalHistory(userData.creator._id);
      } else {
        // No subaccount exists; prompt user to create one
        setShowCreateWithdrawal(false); // Ensure withdrawal form is hidden
        setPayoutMethods([]);
        setBalance(0);
        setWithdrawalHistory([]);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching user data:", err.response?.data || err.message);
      setError("Failed to fetch user data. Please try again later.");
      setLoading(false);
    }
  };

  /**
   * Fetch list of banks from backend
   */
  const fetchBanks = async () => {
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await axios.get(`${BASE_URL}/payments/paystack/banks`, {
        headers: { "Content-Type": "application/json" },
      });
      setBanks(response.data.banks || []);
    } catch (err) {
      console.error("Error fetching banks:", err.response?.data || err.message);
      setError("Failed to fetch banks. Please try again later.");
    }
  };

  /**
   * Fetch Creator's Balance
   */
  const fetchBalance = async (creatorId) => {
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await axios.get(`${BASE_URL}/payments/paystack/balance`, {
        params: { creatorId },
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      setBalance(response.data.balance || 0);
    } catch (err) {
      console.error("Error fetching balance:", err.response?.data || err.message);
      setError("Failed to fetch balance.");
    }
  };

  /**
   * Fetch Withdrawal History
   */
  const fetchWithdrawalHistory = async (creatorId) => {
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await axios.get(`${BASE_URL}/withdrawals`, {
        params: { creatorId },
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setWithdrawalHistory(response.data.withdrawals || []);
    } catch (err) {
      console.error("Error fetching withdrawal history:", err.response?.data || err.message);
      setError("Failed to fetch withdrawal history.");
    }
  };

  /**
   * Handle form input changes for withdrawal
   */
  const handleWithdrawalChange = (e) => {
    setCreateWithdrawalData({ ...createWithdrawalData, [e.target.name]: e.target.value });
  };

  /**
   * Handle withdrawal form submission
   */
  const handleWithdrawalSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
      const payload = {
        creatorId: userDetails.creator._id, // Assuming creator ID is available
        amount: parseFloat(createWithdrawalData.amount),
        recipient: createWithdrawalData.recipient,
        reference: createWithdrawalData.reference || `WD-${Date.now()}`,
      };

      // Validate withdrawal amount
      if (payload.amount < 1) { // Assuming minimum withdrawal is KES 1.00
        setError("Withdrawal amount must be at least KES 1.00.");
        setSubmitting(false);
        return;
      }

      const response = await axios.post(`${BASE_URL}/payments/paystack/withdrawals`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response.status === 201 || response.status === 200) {
        setMessage("Withdrawal request created successfully!");
        setCreateWithdrawalData({
          amount: "",
          recipient: "",
          reference: "",
        });
        setShowCreateWithdrawal(false);
        // Refetch balance and withdrawal history
        await fetchBalance(userDetails.creator._id);
        await fetchWithdrawalHistory(userDetails.creator._id);
      } else {
        setError(response.data.message || "Failed to create withdrawal request.");
      }
    } catch (err) {
      console.error("Error creating withdrawal:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to create withdrawal request.");
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle removing a payout method
   */
  const handleRemoveMethod = async (method) => {
    try {
      // Implement removal logic if needed
      // This might involve calling a backend endpoint to remove the payout method
      // For now, we'll just remove it from the state
      setPayoutMethods(payoutMethods.filter((m) => m.method !== method.method));
      // Optionally, inform the backend about the removal
    } catch (err) {
      console.error("Error removing payout method:", err);
      setError("Failed to remove payout method.");
    }
  };

  /**
   * Listen for real-time updates via Socket.IO
   */
  useEffect(() => {
    if (!user || !user.id) {
      setLoading(false);
      setError("User not logged in or no user ID found.");
      return;
    }
    fetchBanks(); // Fetch banks for the withdrawal form
    fetchUserData(); // Fetch user data

    // Listen for new withdrawal notifications
    if (socket) {
      socket.on("newNotification", (notification) => {
        // Optionally, filter notifications related to payouts
        if (notification.type === "withdrawal" || notification.type === "purchase") {
          toast.info(notification.text, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          // Refetch balance and withdrawal history if necessary
          fetchBalance(userDetails.creator._id);
          fetchWithdrawalHistory(userDetails.creator._id);
        }
      });
    }

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.off("newNotification");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userDetails, socket]);

  /**
   * Render Loading, Error, or Main Content
   */
  if (loading) {
    return (
      <SidebarLayout>
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-gray-800">
          <p>Loading your payout information...</p>
        </div>
      </SidebarLayout>
    );
  }

  if (error) {
    return (
      <SidebarLayout>
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-gray-800">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-gray-800">
        <h1 className="mb-4 text-2xl font-bold text-purple-700">Payouts</h1>

        {/* Balance Display */}
        <div className="bg-white rounded-xl p-6 shadow mb-8 flex items-center">
          <FaMoneyBillWave className="text-3xl text-purple-700 mr-4" />
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Current Balance</h3>
            <p className="text-2xl font-bold">Ksh. {balance.toLocaleString()}</p>
          </div>
        </div>

        {/* Payout Methods Section */}
        <div className="bg-white rounded-xl p-6 shadow mb-8">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Saved Payout Methods</h3>
          <p className="mb-4 text-xs text-gray-500">Decide how you get your funds.</p>
          <div className="space-y-3 text-sm">
            {payoutMethods.length > 0 ? (
              payoutMethods.map((method, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border border-gray-100 rounded-md p-2"
                >
                  <div>
                    <p className="font-medium">{method.method}</p>
                    <p className="text-xs text-gray-400">{method.details}</p>
                  </div>
                  <span
                    className="text-gray-500 hover:text-red-500 cursor-pointer text-xs"
                    onClick={() => handleRemoveMethod(method)}
                  >
                    Remove
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-xs">No payout methods found.</p>
            )}
            <button
              onClick={() => setShowCreateWithdrawal(true)}
              className="mt-3 w-full rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200"
            >
              + Add new method
            </button>
          </div>
        </div>

        {/* Withdrawal Creation Section */}
        {showCreateWithdrawal && (
          <div className="bg-white rounded-xl p-6 shadow mb-8">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">Create Withdrawal</h3>
            <form onSubmit={handleWithdrawalSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Amount (KES)</label>
                <input
                  type="number"
                  name="amount"
                  value={createWithdrawalData.amount}
                  onChange={handleWithdrawalChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  placeholder="Enter amount to withdraw"
                  min="100" // Assuming minimum withdrawal is KES 100
                  step="100"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Recipient (Bank Account)</label>
                <input
                  type="text"
                  name="recipient"
                  value={createWithdrawalData.recipient}
                  onChange={handleWithdrawalChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  placeholder="Enter recipient account number or identifier"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Reference</label>
                <input
                  type="text"
                  name="reference"
                  value={createWithdrawalData.reference}
                  onChange={handleWithdrawalChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  placeholder="Unique reference for withdrawal"
                />
              </div>
              {message && <p className="text-green-500 mb-2">{message}</p>}
              {error && <p className="text-red-500 mb-2">Error: {error}</p>}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateWithdrawal(false);
                    setCreateWithdrawalData({ amount: "", recipient: "", reference: "" });
                    setError("");
                    setMessage("");
                  }}
                  className="mr-2 bg-gray-200 text-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 ${
                    submitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {submitting ? "Submitting..." : "Create Withdrawal"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Recent Payouts Table */}
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Recent Payouts</h3>
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
                {withdrawalHistory.length > 0 ? (
                  withdrawalHistory.map((withdrawal, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-2">
                        {new Date(withdrawal.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-2">{withdrawal.method}</td>
                      <td className="py-2 px-2">Ksh. {withdrawal.amount.toLocaleString()}</td>
                      <td className="py-2 px-2">Ksh. {withdrawal.fees.toLocaleString()}</td>
                      <td className="py-2 px-2">Ksh. {withdrawal.netAmount.toLocaleString()}</td>
                      <td
                        className={`py-2 px-2 ${
                          withdrawal.status.toLowerCase() === "successful"
                            ? "text-green-600"
                            : withdrawal.status.toLowerCase() === "failed"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-4 text-center text-gray-400">
                      No recent payouts found.
                    </td>
                  </tr>
                )}
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
