import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
        {/* Logo Section */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="https://res.cloudinary.com/dhz4c0oae/image/upload/v1733474194/Frame_2085663663_i0cui1.png"
            alt="Loreax Logo"
            width={100}
            height={100}
            className="object-contain"
          />
        </Link>

        {/* Button Section */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link
            href="/login"
            className="text-purple-600 hover:bg-purple-100 px-4 py-2 rounded-md transition duration-300"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-300"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
