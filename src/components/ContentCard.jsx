// components/ContentCard.jsx
import React from "react";

export default function ContentCard({
  content,
  hasAccess,
  onPurchaseClick,
  onSubscribeClick,
  isProcessing,
}) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg flex flex-col">
      {/* Media Section */}
      <div className="relative h-48">
        {content.type === "video" ? (
          hasAccess ? (
            <video
              src={content.url}
              poster={content.thumbnail}
              controls
              className="w-full h-full object-cover"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={content.thumbnail || "https://via.placeholder.com/400x200"}
              alt={content.title}
              className="w-full h-full object-cover filter blur-sm"
            />
          )
        ) : content.type === "image" ? (
          hasAccess ? (
            <img
              src={content.url}
              alt={content.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={content.thumbnail || "https://via.placeholder.com/400x200"}
              alt={content.title}
              className="w-full h-full object-cover filter blur-sm"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No media available
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-bold">{content.title}</h3>
        <p className="text-sm text-gray-400 mb-2">
          {content.createdAt ? content.createdAt.toLocaleDateString() : "N/A"}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          {content.about.length > 100
            ? `${content.about.slice(0, 100)}...`
            : content.about}
        </p>

        {hasAccess && (
          <>
            {content.type === "downloadable" && (
              <a
                href={content.url}
                download
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded mt-auto"
              >
                Download
              </a>
            )}
            {/* Add more interactive elements as needed */}
          </>
        )}

        {!hasAccess && content.priceType === "paid" && (
          <div className="mt-auto">
            <p className="text-gray-700 mb-2">
              Subscribe or purchase to access this content.
            </p>
            <button
              onClick={onPurchaseClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded mr-2"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : `Buy for KES ${content.price.toFixed(2)}`}
            </button>
            <button
              onClick={onSubscribeClick}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded"
            >
              Subscribe
            </button>
          </div>
        )}
      </div>

      {/* Footer / Additional Info */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1 text-gray-500">
            {/* Example Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
            <span>{content.viewCount}</span>
          </span>
          {/* Another Example Icon */}
          <span className="flex items-center space-x-1 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2h-2m-4 0h-4m6-10h-2m-6 0H5a2 2 0 00-2 2v8a2 2 0 002 2h2m6-10h-2m4-2a2 2 0 110-4m-4 4a2 2 0 100-4"
              />
            </svg>
            <span>74</span>
          </span>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          {/* Example Button */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
