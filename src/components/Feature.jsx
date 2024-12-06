import Image from "next/image";

export default function Feature() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-6 lg:px-20">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-5xl font-bold text-purple-700">
            For Creators, <span className="text-green-500">By Creators.</span>
          </h2>
          <p className="text-gray-600 mt-4 text-lg">
            Creators deserve more than just visibility – they need a platform
            that truly supports their journey. A space that amplifies their
            content, streamlines their workflow, and genuinely rewards their
            passion is essential for unlocking their full potential and ensuring
            their creative efforts have a lasting impact.
          </p>
        </div>

        {/* Feature Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="relative rounded-lg shadow-lg overflow-hidden">
            <Image
              src="https://res.cloudinary.com/dhz4c0oae/image/upload/v1733476455/Group_5_grqg3v.png"
              alt="Boss Babes Podcast by Ann Mueni"
              width={400}
              height={250}
              className="object-cover"
            />
          </div>

          {/* Card 2 */}
          <div className="relative rounded-lg shadow-lg overflow-hidden">
            <Image
              src="https://res.cloudinary.com/dhz4c0oae/image/upload/v1733476428/Group_1000004290_xupmo4.png"
              alt="Boss Babes Podcast by Ann Mueni"
              width={400}
              height={250}
              className="object-cover"
            />
          </div>

          {/* Card 3 */}
          <div className="relative rounded-lg shadow-lg overflow-hidden">
            <Image
              src="https://res.cloudinary.com/dhz4c0oae/image/upload/v1733476455/Group_5_grqg3v.png"
              alt="Boss Babes Podcast by Ann Mueni"
              width={400}
              height={250}
              className="object-cover"
            />
          </div>

          {/* Card 4 */}
          <div className="relative rounded-lg shadow-lg overflow-hidden">
            <Image
              src="https://res.cloudinary.com/dhz4c0oae/image/upload/v1733476455/Group_5_grqg3v.png"
              alt="Boss Babes Podcast by Ann Mueni"
              width={400}
              height={250}
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
