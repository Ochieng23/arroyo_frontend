"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import UserSidebarLayout from "@/components/FanDashboardLayout";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const PaymentCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'SUCCESS' or 'FAILED'
  const [paystackReference, setPaystackReference] = useState(null);

  useEffect(() => {
    const verifyPaystackPayment = async () => {
      const paystackRefParam = searchParams.get("reference");
      console.log("Extracted Paystack reference:", paystackRefParam);

      if (!paystackRefParam) {
        setPaymentStatus("FAILED");
        setLoading(false);
        toast.error("Invalid payment reference received.");
        return;
      }

      setPaystackReference(paystackRefParam);

      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

        const response = await fetch(
          `${backendUrl}/payments/paystack/verify?reference=${paystackRefParam}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to verify payment on the server.");
        }

        const statusData = await response.json();
        const paymentStatusFromBackend =
          statusData.status ||
          (statusData.transaction && statusData.transaction.status) ||
          "failed";

        if (paymentStatusFromBackend.toLowerCase() === "completed") {
          setPaymentStatus("SUCCESS");
          toast.success("Payment was successful!");

          setTimeout(() => {
            router.push("/home");
          }, 3000);
        } else {
          setPaymentStatus("FAILED");
          setLoading(false);
          toast.error(statusData.message || "Payment verification failed.");
        }
      } catch (error) {
        console.error("Error verifying Paystack payment:", error.message);
        setPaymentStatus("FAILED");
        setLoading(false);
        toast.error(error.message || "An error occurred during payment verification.");
      }
    };

    verifyPaystackPayment();
  }, [searchParams, router]);

  const renderContent = () => {
    switch (paymentStatus) {
      case "SUCCESS":
        return (
          <div className="flex flex-col justify-center items-center bg-white shadow-xl rounded-lg p-10 w-full max-w-md">
            <FaCheckCircle className="text-green-500 mb-6" size={100} />
            <h1 className="text-3xl font-bold text-green-700 mb-4">
              Payment Successful!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for your purchase. You will be redirected shortly.
            </p>
            {paystackReference && (
              <div className="bg-green-50 border border-green-200 rounded p-4 mb-6 w-full">
                <h2 className="text-xl font-semibold text-green-700">
                  Paystack Reference:
                </h2>
                <p className="mt-2 text-gray-700 break-all">{paystackReference}</p>
              </div>
            )}
            <p className="text-gray-500">Redirecting...</p>
          </div>
        );

      case "FAILED":
        return (
          <div className="flex flex-col justify-center items-center bg-white shadow-xl rounded-lg p-10 w-full max-w-md">
            <FaTimesCircle className="text-red-500 mb-6" size={100} />
            <h1 className="text-3xl font-bold text-red-700 mb-4">
              Payment Failed
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              There was an issue processing your payment. Please try again later.
            </p>
            {paystackReference && (
              <div className="bg-red-50 border border-red-200 rounded p-4 mb-6 w-full">
                <h2 className="text-xl font-semibold text-red-700">
                  Paystack Reference:
                </h2>
                <p className="mt-2 text-gray-700 break-all">
                  {paystackReference}
                </p>
              </div>
            )}
            <button
              onClick={() => router.push("/checkout")}
              className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-lg font-medium"
            >
              Retry Payment
            </button>
          </div>
        );

      default:
        return (
          <div className="flex flex-col justify-center items-center bg-white shadow-xl rounded-lg p-10 w-full max-w-md">
            <p className="mt-4 text-gray-600">Processing your payment...</p>
          </div>
        );
    }
  };

  return renderContent();
};

const PaymentCallbackPage = () => {
  return (
    <UserSidebarLayout>
      <main className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-100 to-yellow-100 p-4">
        <Suspense fallback={<p>Loading...</p>}>
          <PaymentCallbackContent />
        </Suspense>
      </main>
    </UserSidebarLayout>
  );
};

export default PaymentCallbackPage;
