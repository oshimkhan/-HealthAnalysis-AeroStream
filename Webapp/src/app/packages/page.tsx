"use client";

import { useState } from "react";
import Link from "next/link";

export default function PackagesPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const basicFeatures = [
    "Basic health metrics monitoring",
    "Monthly health report",
    "Email support",
    "Limited data access",
    "1 user profile",
  ];

  const standardFeatures = [
    "All Basic features",
    "Weekly health reports",
    "24/7 chat support",
    "Full data access",
    "Up to 3 user profiles",
    "Medication management",
    "Integration with wearable devices",
  ];

  const premiumFeatures = [
    "All Standard features",
    "Daily health insights",
    "Priority 24/7 support",
    "Video consultations (2/month)",
    "Personalized health recommendations",
    "Family health dashboard",
    "Up to 5 user profiles",
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="container mx-auto text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Packages</h1>
        <p className="text-lg text-gray-300 mb-8">
          Choose the perfect plan for your health monitoring needs.
        </p>

        {/* Monthly/Annual Toggle */}
        <div className="mt-8 mb-12 flex items-center justify-center space-x-4">
          <span
            className={`font-semibold cursor-pointer ${
              isAnnual ? "text-gray-500" : "text-green-500"
            }`}
            onClick={() => setIsAnnual(false)}
          >
            Monthly
          </span>
          <div
            className={`w-14 h-8 rounded-full flex items-center p-1 cursor-pointer ${
              isAnnual
                ? "bg-green-500 justify-end"
                : "bg-gray-500 justify-start"
            }`}
            onClick={() => setIsAnnual(!isAnnual)}
          >
            <div className="w-6 h-6 bg-white rounded-full shadow-md transform"></div>
          </div>
          <span
            className={`font-semibold cursor-pointer ${
              isAnnual ? "text-green-500" : "text-gray-500"
            }`}
            onClick={() => setIsAnnual(true)}
          >
            Annual (Save 15%)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Basic Package Card */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700 flex flex-col">
            <h2 className="text-3xl font-bold mb-4 text-purple-400">Basic</h2>
            <p className="text-gray-300 mb-6">
              Essential health monitoring for individuals.
            </p>
            <p className="text-4xl font-bold mb-6">
              {isAnnual ? "₹35,600" : "₹3,490"}
              <span className="text-xl text-gray-400 font-normal">
                {isAnnual ? "/year" : "/month"}
              </span>
            </p>
            <ul className="text-gray-300 text-left space-y-3 flex-grow">
              {basicFeatures.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <Link href="/signup">
              <button className="mt-8 w-full bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors">
                Get Started with Basic
              </button>
            </Link>
          </div>

          {/* Standard Package Card */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-purple-600 flex flex-col transform scale-105">
            <h2 className="text-3xl font-bold mb-4 text-green-400">Standard</h2>
            <p className="text-gray-300 mb-6">
              Comprehensive monitoring for health-conscious individuals.
            </p>
            <p className="text-4xl font-bold mb-6">
              {isAnnual ? "₹71,300" : "₹6,990"}
              <span className="text-xl text-gray-400 font-normal">
                {isAnnual ? "/year" : "/month"}
              </span>
            </p>
            <ul className="text-gray-300 text-left space-y-3 flex-grow">
              {standardFeatures.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <Link href="/signup">
              <button className="mt-8 w-full bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors">
                Get Started with Standard
              </button>
            </Link>
          </div>

          {/* Premium Package Card */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700 flex flex-col">
            <h2 className="text-3xl font-bold mb-4 text-yellow-400">Premium</h2>
            <p className="text-gray-300 mb-6">
              Complete health solution for families and advanced users.
            </p>
            <p className="text-4xl font-bold mb-6">
              {isAnnual ? "₹121,300" : "₹11,900"}
              <span className="text-xl text-gray-400 font-normal">
                {isAnnual ? "/year" : "/month"}
              </span>
            </p>
            <ul className="text-gray-300 text-left space-y-3 flex-grow">
              {premiumFeatures.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <Link href="/signup">
              <button className="mt-8 w-full bg-yellow-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-yellow-700 transition-colors">
                Get Started with Premium
              </button>
            </Link>
          </div>
        </div>

        {/* Add more sections like FAQ, Contact, etc. if needed */}
      </div>
    </div>
  );
}
