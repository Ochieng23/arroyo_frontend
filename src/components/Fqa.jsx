"use client";
import { useState } from "react";
import { FiHeadphones, FiDollarSign } from "react-icons/fi";
import { AiOutlineLineChart, AiOutlineUser } from "react-icons/ai";
import { MdOutlineChatBubble } from "react-icons/md";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

export default function Faq() {
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const questions = [
    {
      question: "Can I edit or delete uploaded content?",
      answer:
        "You have full control over pricing your content. You can set individual prices for each piece or create tiered pricing packages.",
    },
    {
      question: "What payment methods are available?",
      answer:
        "We accept popular payment methods in Kenya, including M-Pesa, Airtel Money, credit/debit cards, and direct bank transfers.",
    },
    {
      question: "How often are payments made?",
      answer:
        "Payments are processed weekly, ensuring that creators receive their earnings promptly. For M-Pesa users, payouts are immediate once the payment is approved.",
    },
    {
      question: "What are the fees and commissions?",
      answer:
        "We charge a 10% commission on all earnings to cover platform operations. There are no hidden fees, and creators receive the majority of their earnings.",
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-6 lg:px-20">
        {/* Title Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-purple-700">
            Frequently asked questions
          </h2>
          <p className="text-gray-600 mt-2">Have questions? We have answers.</p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {questions.map((item, index) => (
            <div
              key={index}
              className={`border rounded-lg ${
                openQuestion === index ? "bg-purple-50" : "bg-white"
              } transition-colors duration-300`}
            >
              <button
                className="flex justify-between items-center px-6 py-4 w-full text-left focus:outline-none"
                onClick={() => toggleQuestion(index)}
                aria-expanded={openQuestion === index}
                aria-controls={`faq-answer-${index}`}
              >
                <h3
                  className={`text-lg font-semibold ${
                    openQuestion === index ? "text-purple-700" : "text-gray-900"
                  }`}
                >
                  {item.question}
                </h3>
                {openQuestion === index ? (
                  <ChevronUpIcon className="w-6 h-6 text-purple-700" />
                ) : (
                  <ChevronDownIcon className="w-6 h-6 text-gray-600" />
                )}
              </button>
              {openQuestion === index && (
                <div
                  id={`faq-answer-${index}`}
                  className="px-6 pb-4 text-gray-600"
                >
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="text-center mt-10">
          <p className="text-gray-600">
            Can not find what you are looking for? No worries. Email us at{" "}
            <a
              href="mailto:hello@loreax.com"
              className="text-purple-700 underline"
            >
              hello@loreax.com
            </a>{" "}
            and we will get back to you.
          </p>
        </div>
      </div>
    </section>
  );
}

// Import Chevron Icons from react-icons
