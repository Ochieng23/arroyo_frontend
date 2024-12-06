import Image from "next/image";

export default function Explainer() {
  return (
    <section className="bg-purple-50 py-16">
      <div className="container mx-auto px-6 lg:px-20">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-purple-700 text-center mb-12">
          The ultimate partner you have been searching for
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* First Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col">
            <div className="flex justify-center mb-4">
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Upload your content</span>
              </span>
            </div>
            <Image
              src="https://res.cloudinary.com/dhz4c0oae/image/upload/v1733475683/Rectangle_6_2_rmkmr7.png"
              alt="Upload and share with ease"
              width={400}
              height={300}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="rounded-lg object-cover"
            />
            <h3 className="text-lg md:text-xl font-semibold text-purple-700 mt-4">
              Upload and share with ease
            </h3>
            <p className="text-gray-600 mt-2 flex-grow">
              Showcase your talent to the world. High-quality uploads, fast
              delivery with easy-to-access performance metrics.
            </p>
            <button
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
              aria-label="Upload your content on Loreax"
            >
              Upload now
            </button>
          </div>

          {/* Second Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col">
            <div className="flex justify-center mb-4">
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Connect with your audience</span>
              </span>
            </div>
            <Image
              src="https://res.cloudinary.com/dhz4c0oae/image/upload/v1733475690/Rectangle_6_1_dqfp2n.png"
              alt="Connect directly with your fans"
              width={400}
              height={300}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="rounded-lg object-cover"
            />
            <h3 className="text-lg md:text-xl font-semibold text-orange-700 mt-4">
              Connect directly with your fans
            </h3>
            <p className="text-gray-600 mt-2 flex-grow">
              Regardless of your follower count, build a loyal community by
              engaging deeply with your audience.
            </p>
            <button
              className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
              aria-label="Connect with your audience on Loreax"
            >
              Connect now
            </button>
          </div>

          {/* Third Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col">
            <div className="flex justify-center mb-4">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Sell your content</span>
              </span>
            </div>
            <Image
              src="https://res.cloudinary.com/dhz4c0oae/image/upload/v1733475697/Rectangle_6_azn2ug.png"
              alt="Monetize like a pro"
              width={400}
              height={300}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="rounded-lg object-cover"
            />
            <h3 className="text-lg md:text-xl font-semibold text-green-700 mt-4">
              Monetize like a pro
            </h3>
            <p className="text-gray-600 mt-2 flex-grow">
              Easily upload, price, and sell your content. Reach a wider
              audience and earn what you deserve.
            </p>
            <button
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-300"
              aria-label="Start selling your content on Loreax"
            >
              Start selling
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
