import Image from "next/image";

export default function CallToAction() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center">
        {/* Text Section */}
        <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0">
          <h2 className="text-3xl lg:text-5xl font-bold text-purple-700">
            Ready to{" "}
            <span className="relative">
              <span className="text-green-500 bg-purple-700 px-2 py-1 rounded-md inline-block">
                level up
              </span>{" "}
            </span>
            your content creation?
          </h2>
          <p className="text-gray-600 mt-6 text-lg">
            Let us handle the technicalities while you focus on crafting amazing
            content and connecting with your fans. We will take care of the
            rest.
          </p>
          <button className="mt-6 bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition duration-300">
            Get started on Loreax
          </button>
        </div>

        {/* Image Section */}
        <div className="lg:w-1/2 flex justify-center lg:justify-end">
          <Image
            src="https://res.cloudinary.com/dhz4c0oae/image/upload/v1733483598/Group_1000004297_xbcvdn.png"
            alt="Call to action image"
            width={500}
            height={500}
            className="object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}
