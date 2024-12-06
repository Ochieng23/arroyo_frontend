import { FiHeadphones, FiDollarSign } from "react-icons/fi";
import { AiOutlineLineChart, AiOutlineUser } from "react-icons/ai";
import { MdOutlineChatBubble } from "react-icons/md";

export default function WhyLoreax() {
  return (
    <section className="bg-purple-900 py-16 text-white">
      <div className="container mx-auto px-6 lg:px-20">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Why <span className="text-purple-300">Loreax?</span>
          </h2>
          <p className="text-gray-300 mt-4 text-lg sm:text-xl max-w-2xl mx-auto">
            Loreax empowers creators by providing direct communication channels,
            dedicated support, in-depth insights, personalized experiences, and
            fast payouts. Join us to elevate your creative journey and maximize
            your impact.
          </p>
        </div>

        {/* Feature Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature Card 1 */}
          <div className="flex items-start space-x-4 p-6 bg-purple-800 rounded-lg shadow-md hover:bg-purple-700 transition duration-300">
            <MdOutlineChatBubble
              className="text-purple-300 w-10 h-10 flex-shrink-0"
              aria-hidden="true"
            />
            <div>
              <h3 className="text-xl font-semibold">Direct Communication</h3>
              <p className="text-gray-300 mt-2">
                Communicate seamlessly between you and your fans, bypassing
                intermediaries.
              </p>
            </div>
          </div>

          {/* Feature Card 2 */}
          <div className="flex items-start space-x-4 p-6 bg-purple-800 rounded-lg shadow-md hover:bg-purple-700 transition duration-300">
            <FiHeadphones
              className="text-purple-300 w-10 h-10 flex-shrink-0"
              aria-hidden="true"
            />
            <div>
              <h3 className="text-xl font-semibold">Dedicated Support</h3>
              <p className="text-gray-300 mt-2">
                We offer specialized support for artists navigating the
                platform.
              </p>
            </div>
          </div>

          {/* Feature Card 3 */}
          <div className="flex items-start space-x-4 p-6 bg-purple-800 rounded-lg shadow-md hover:bg-purple-700 transition duration-300">
            <AiOutlineLineChart
              className="text-purple-300 w-10 h-10 flex-shrink-0"
              aria-hidden="true"
            />
            <div>
              <h3 className="text-xl font-semibold">In-depth Insights</h3>
              <p className="text-gray-300 mt-2">
                We provide artists with detailed analytics about their fan base
                and performance.
              </p>
            </div>
          </div>

          {/* Feature Card 4 */}
          <div className="flex items-start space-x-4 p-6 bg-purple-800 rounded-lg shadow-md hover:bg-purple-700 transition duration-300">
            <AiOutlineUser
              className="text-purple-300 w-10 h-10 flex-shrink-0"
              aria-hidden="true"
            />
            <div>
              <h3 className="text-xl font-semibold">Personalized Experience</h3>
              <p className="text-gray-300 mt-2">
                Give exclusive offers and personalized experiences to your
                patrons and fans.
              </p>
            </div>
          </div>

          {/* Feature Card 5 */}
          <div className="flex items-start space-x-4 p-6 bg-purple-800 rounded-lg shadow-md hover:bg-purple-700 transition duration-300">
            <FiDollarSign
              className="text-purple-300 w-10 h-10 flex-shrink-0"
              aria-hidden="true"
            />
            <div>
              <h3 className="text-xl font-semibold">Fast Payouts</h3>
              <p className="text-gray-300 mt-2">
                We offer transactions in multiple local currencies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
