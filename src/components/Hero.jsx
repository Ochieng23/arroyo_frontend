import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-6 lg:px-20 py-16 flex flex-col-reverse lg:flex-row items-center justify-between">
        {/* Text Section */}
        <div className="lg:w-1/2 w-full mt-10 lg:mt-0">
          <Image
            src="https://res.cloudinary.com/dhz4c0oae/image/upload/v1733474234/Group_15_efm7in.png"
            alt="Earn money from your content"
            width={500}
            height={200}
            priority
            layout="responsive"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
          />
          <p className="mt-6 text-gray-600 text-lg">
            Unlock your full artistic potential. Sell, connect, and grow with
            Loreax.
          </p>
          <button
            className="mt-6 bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 focus:ring focus:ring-green-200 transition duration-300"
            aria-label="Get started on Loreax"
          >
            Get started on Loreax →
          </button>
        </div>

        {/* Image Section */}
        <div className="lg:w-1/2 w-full flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md">
            <Image
              src="https://res.cloudinary.com/dhz4c0oae/image/upload/v1733474173/Group_1000004289_fy9wb6.png"
              alt="Creative Lady with Camera"
              width={400}
              height={400}
              priority
              layout="responsive"
              sizes="(max-width: 768px) 100vw, 50vw"
              className="rounded-lg"
            />
            {/* Decorative elements */}
            <div className="absolute -top-5 right-10 w-6 h-6 bg-yellow-300 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-10 left-5 w-10 h-1 bg-purple-600 rounded-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
