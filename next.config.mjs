/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        // Optional: Specify a path if needed
        // pathname: '/dhz4c0oae/image/upload/**',
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        // Optional: Specify a path if needed
        // pathname: '/dhz4c0oae/image/upload/**',
      },
      // Add the following pattern for Azure Blob Storage
      {
        protocol: "https",
        hostname: "caziniaifiles.blob.core.windows.net",
        pathname: "/**", // This allows all paths under the hostname
      },
    ],
    // Alternatively, you can use the 'domains' array if you prefer
    /*
    domains: [
      "res.cloudinary.com",
      "upload.wikimedia.org",
      "caziniaifiles.blob.core.windows.net",
    ],
    */
  },
};

export default nextConfig;
