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
      }
      // Add more patterns if necessary
    ],
  },
};

export default nextConfig;
