"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div>
      {/* Header */}
      <header className="flex justify-between items-center py-4 px-8">
        <div className="flex items-center">
          {/* Logo */}
          <span className="text-lg font-bold">Healio</span>
          {/* Replace with actual logo image later */}
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="/packages" className="text-black hover:text-gray-700">
            Packages
          </a>
          <a href="#" className="text-black hover:text-gray-700">
            Doctors List
          </a>
          <a href="#" className="text-black hover:text-gray-700">
            Achievements
          </a>
          <a href="#" className="text-black hover:text-gray-700">
            Instant Statistics
          </a>
        </nav>
        <div>
          {/* Login Button */}
          <a
            href="/login"
            className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors"
          >
            Login
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full min-h-screen bg-gradient-to-r from-purple-600 to-pink-500 text-white flex items-center px-8">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-16">
          {/* Text Content */}
          <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Your Health Journey, Simplified & Enhanced
            </h1>
            <p className="mt-4 text-lg md:text-xl mb-8">
              Healio helps you track, monitor, and improve your health with
              cutting-edge technology and personalized care plans.
            </p>
            <div className="flex gap-4">
              <a
                href="/signup"
                className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Getting Started
              </a>
              <a
                href="/packages"
                className="border border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-colors"
              >
                View Packages
              </a>
            </div>
          </div>

          {/* Image Placeholder */}
          <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
            {
              <Image
                src="/healthcare-professionals.png"
                alt="Healthcare professionals"
                width={500}
                height={400}
                priority
                className="rounded-lg shadow-lg"
              />
            }
            {/* Real-time Monitoring Text Card */}
            <div className="absolute bottom-8 right-8 bg-white text-gray-800 px-4 py-2 rounded-md shadow-lg text-sm flex flex-col items-start">
              <span className="font-semibold">Real-time Monitoring</span>
              <span className="text-xs text-gray-500">
                Access your health metrics anytime, anywhere.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Healio? Section */}
      <section className="py-16 px-8 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black">
            Why Choose Healio?
          </h2>
          <p className="mt-4 text-lg text-gray-800 max-w-2xl mx-auto">
            Our comprehensive health monitoring system offers cutting-edge
            features designed to make healthcare more accessible, efficient, and
            personalized.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {/* Feature Card 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-purple-200 rounded-full mx-auto flex items-center justify-center text-purple-700">
                {/* Icon Placeholder */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 11c0 1.38-.99 2.5-2.22 2.5C8.53 13.5 7.5 12.38 7.5 11c0-1.38.99-2.5 2.22-2.5C10.47 8.5 11.5 9.62 11.5 11z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.5 13.5c-1.23 0-2.22-1.12-2.22-2.5S14.27 8.5 15.5 8.5C16.73 8.5 17.72 9.62 17.72 11s-.99 2.5-2.22 2.5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 15.5c-2.34 0-4.25-1.79-4.25-4s1.91-4 4.25-4 4.25 1.79 4.25 4-1.91 4-4.25 4z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-black">
                Secure Health Records
              </h3>
              <p className="mt-2 text-gray-800 text-sm">
                Your medical data is encrypted and securely stored in the cloud,
                accessible only to you and your authorized healthcare providers.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-200 rounded-full mx-auto flex items-center justify-center text-blue-700">
                {/* Icon Placeholder */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.75 17L9 20l-1 1h5c.02-.87.2-1.73.5-2.5M14.25 17L15 20l1 1h-5c-.02-.87-.2-1.73-.5-2.5"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12.75a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.547V12.75m0 0V19.5"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-black">
                Real-time Monitoring
              </h3>
              <p className="mt-2 text-gray-800 text-sm">
                Track vital signs, medication schedules, and health metrics in
                real-time with accurate and user-friendly visualizations.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-red-200 rounded-full mx-auto flex items-center justify-center text-red-700">
                {/* Icon Placeholder */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h.01M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 22a10 10 0 100-20 10 10 0 000 20z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-black">
                Timely Notifications
              </h3>
              <p className="mt-2 text-gray-800 text-sm">
                Get alerts for medication reminders, appointment schedules, and
                critical health changes that require attention.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-green-200 rounded-full mx-auto flex items-center justify-center text-green-700">
                {/* Icon Placeholder */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-black">
                Direct Communication
              </h3>
              <p className="mt-2 text-gray-800 text-sm">
                Communicate directly with your healthcare providers through
                secure messaging for quick consultations and follow-ups.
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-yellow-200 rounded-full mx-auto flex items-center justify-center text-yellow-700">
                {/* Icon Placeholder */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-black">
                Personalized Insights
              </h3>
              <p className="mt-2 text-gray-800 text-sm">
                Receive tailored health insights and recommendations based on
                your health data and medical history.
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-indigo-200 rounded-full mx-auto flex items-center justify-center text-indigo-700">
                {/* Icon Placeholder */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L20 20m-2-8a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m0 4v2m0-6h-2.004a2 2 0 00-1.84 1.203L7 21h10l-.156-.797A2 2 0 0015.004 17H13v-2z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-black">
                Medical History
              </h3>
              <p className="mt-2 text-gray-800 text-sm">
                Access and manage your complete medical history, including
                diagnoses, treatments, medications, and test results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Health Monitoring Packages Section */}
      <section className="py-16 px-8">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Health Monitoring Packages
          </h2>
          <p className="mt-4 text-lg text-gray-800 max-w-2xl mx-auto">
            Choose the perfect package that suits your health monitoring needs
            and budget.
          </p>

          {/* Monthly/Annual Toggle */}
          <div className="mt-8 mb-12 flex items-center justify-center space-x-4">
            <span
              className={`font-semibold cursor-pointer ${
                isAnnual ? "text-gray-500" : "text-green-600"
              }`}
              onClick={() => setIsAnnual(false)}
            >
              Monthly
            </span>
            <div
              className={`w-14 h-8 rounded-full flex items-center p-1 cursor-pointer ${
                isAnnual
                  ? "bg-green-600 justify-end"
                  : "bg-gray-300 justify-start"
              }`}
              onClick={() => setIsAnnual(!isAnnual)}
            >
              <div className="w-6 h-6 bg-white rounded-full shadow-md transform"></div>
            </div>
            <span
              className={`font-semibold cursor-pointer ${
                isAnnual ? "text-green-600" : "text-gray-500"
              }`}
              onClick={() => setIsAnnual(true)}
            >
              Annual (Save 15%)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Package Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center text-left">
              <h3 className="text-2xl font-semibold text-black">Basic</h3>
              <p className="mt-1 text-gray-800">
                Essential health monitoring for individuals.
              </p>
              <p className="mt-6 text-4xl font-bold text-purple-600">
                {isAnnual ? "₹35,600" : "₹3,490"}
                <span className="text-xl text-gray-800 font-normal">
                  {isAnnual ? "/year" : "/month"}
                </span>
              </p>
              <ul className="mt-6 space-y-3 text-gray-800 flex-grow">
                <li className="flex items-center">
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
                  </svg>{" "}
                  Basic health metrics monitoring
                </li>
                <li className="flex items-center">
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
                  </svg>{" "}
                  Monthly health report
                </li>
                <li className="flex items-center">
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
                  </svg>{" "}
                  Email support
                </li>
                <li className="flex items-center">
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
                  </svg>{" "}
                  Limited data access
                </li>
                <li className="flex items-center">
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
                  </svg>{" "}
                  1 user profile
                </li>
              </ul>
              <a
                href="/packages"
                className="mt-8 w-full bg-white text-purple-600 border border-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-purple-600 hover:text-white transition-colors text-center"
              >
                Get Started
              </a>
            </div>

            {/* Premium Package Card (Renamed from Standard) */}
            <div className="bg-purple-600 text-white p-6 rounded-lg shadow-md border border-purple-600 flex flex-col items-center text-left transform scale-105">
              <h3 className="text-2xl font-semibold">Standard</h3>
              <p className="mt-1 text-purple-200">
                Comprehensive monitoring for health-conscious individuals.
              </p>
              <p className="mt-6 text-4xl font-bold">
                {isAnnual ? "₹71,300" : "₹6,990"}
                <span className="text-xl text-purple-200 font-normal">
                  {isAnnual ? "/year" : "/month"}
                </span>
              </p>
              <ul className="mt-6 space-y-3 flex-grow">
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-400 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>{" "}
                  All Basic features
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-400 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>{" "}
                  Weekly health reports
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-400 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>{" "}
                  24/7 chat support
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-400 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>{" "}
                  Full data access
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-400 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>{" "}
                  Up to 3 user profiles
                </li>
              </ul>
              <a
                href="/packages"
                className="mt-8 w-full bg-white text-purple-600 border border-white px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors text-center"
              >
                Get Started
              </a>
            </div>

            {/* Premium Package Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center text-left">
              <h3 className="text-2xl font-semibold text-black">Premium</h3>
              <p className="mt-1 text-gray-800">
                Complete health solution for families and advanced users.
              </p>
              <p className="mt-6 text-4xl font-bold text-purple-600">
                {isAnnual ? "₹121,300" : "₹11,900"}
                <span className="text-xl text-gray-800 font-normal">
                  {isAnnual ? "/year" : "/month"}
                </span>
              </p>
              <ul className="mt-6 space-y-3 text-gray-800 flex-grow">
                <li className="flex items-center">
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
                  </svg>{" "}
                  All Standard features
                </li>
                <li className="flex items-center">
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
                  </svg>{" "}
                  Daily health insights
                </li>
                <li className="flex items-center">
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
                  </svg>{" "}
                  Priority 24/7 support
                </li>
                <li className="flex items-center">
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
                  </svg>{" "}
                  Video consultations (2/month)
                </li>
                <li className="flex items-center">
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
                  </svg>{" "}
                  Up to 5 user profiles
                </li>
              </ul>
              <a
                href="/packages"
                className="mt-8 w-full bg-white text-purple-600 border border-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-purple-600 hover:text-white transition-colors text-center"
              >
                Get Started
              </a>
            </div>
          </div>

          {/* Enterprise Button */}
          <div className="mt-12">
            <button className="bg-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-700 transition-colors">
              Need a custom solution for your organization? Contact Us for
              Enterprise Plans
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12 px-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Healio Info */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="text-lg font-bold text-white">Healio</h4>
            <p className="mt-4 text-sm">
              Healio is a leading health monitoring system that connects
              patients with healthcare providers for better health outcomes and
              personalized care.
            </p>
            <div className="flex space-x-4 mt-6">
              {/* Social Icons - Placeholder */}
              <a href="#" aria-label="Facebook">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-400 hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V16.404H7.61V12h2.516V9.305c0-2.523 1.492-3.693 3.566-3.693 1.051 0 1.714.078 1.94.113v2.45h-1.44c-1.132 0-1.281.56-1.281 1.549V12h2.89l-.371 4.404h-2.519V23.854C19.612 22.954 24 17.99 24 12z" />
                </svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-400 hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.895-.959-2.173-1.559-3.591-1.559-2.719 0-4.926 2.207-4.926 4.927 0 .386.044.76.127 1.124-4.1-.206-7.752-2.178-10.2-5.135-.424.728-.663 1.578-.663 2.489 0 1.709.87 3.215 2.19 4.096-.807-.026-1.566-.247-2.22-.614v.061c0 2.385 1.693 4.374 3.946 4.827-.411.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 2.377 4.604 3.417-1.68 1.318-3.809 2.109-6.113 2.109-.398 0-.79-.023-1.175-.068 2.184 1.399 4.768 2.212 7.548 2.212 9.057 0 14.01-7.493 14.01-13.985 0-.188-.004-.376-.014-.563A10 10 0 0024 4.557z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-400 hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.178 0 3.585.016 4.85.071 1.17.067 1.772.249 2.224.469.949.483 1.64.115 2.332.807.692.692.874 1.383 1.352 2.331.221.452.403 1.054.469 2.225.055 1.265.071 1.672.071 4.85s-.016 3.585-.071 4.85c-.067 1.17-.249 1.772-.469 2.224-.483.949-1.115 1.64-1.807 2.332-.692.692-1.383.874-2.331 1.352-.452.221-1.054.403-2.225.469-1.265.055-1.672.071-4.85.071s-3.585-.016-4.85-.071c-1.17-.067-1.772-.249-2.224-.469-.949-.483-1.64-.115-2.332-.807-.692-.692-.874-1.383-1.352-2.331-.221-.452-.403-1.054-.469-2.225-.055-1.265-.071-1.672-.071-4.85s.016-3.585.071 4.85c.067 1.17.249 1.772.469 2.224.483.949 1.115 1.64 1.807 2.332.692.692 1.383.874 2.331 1.352.452.221 1.054.403 2.225.469 1.265.055 1.672.071 4.85.071zM12 0C8.741 0 8.333.014 7.053.072c-1.175.066-1.805.249-2.324.5C3.09 1.51 2.025 2.576 1.21 3.391c-.715.715-.962 1.448-1.116 2.323C.014 7.054 0 7.461 0 12c0 3.259.014 3.667.072 4.947.066 1.175.249 1.805.5 2.324.816.816 1.881 1.881 2.696 2.696.715.715 1.448.962 2.323 1.116C7.054 23.986 7.461 24 12 24c3.259 0 3.667-.014 4.947-.072 1.175-.066 1.805-.249 2.324-.5.816-.816 1.881-1.881 2.696-2.696.715-.715.962-1.448 1.116-2.323.058-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.066-1.175-.249-1.805-.5-2.324C22.91 1.51 21.844.444 21.029.629c-.715-.715-1.448-.962-2.323-1.116C16.946.014 16.539 0 12 0zm0 4.324a7.676 7.676 0 100 15.353 7.676 7.676 0 000-15.353zm0 2.532a5.144 5.144 0 110 10.288 5.144 5.144 0 010-10.288zm0 2.532a2.612 2.612 0 100 5.224 2.612 2.612 0 000-5.224z" />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-400 hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5 1.11-2.5 2.48-2.5 2.48 1.119 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0H7.943v16h3.982v-6.57c0-3.668 4.775-4 4.775 0v6.57h3.982v-8.359c0-6.281-3.095-8.34-7.819-8.34-3.42 0-5.336 1.914-6.225 3.548h-.02v-3.089h-4.017c.059 1.218 0 16 0 16h4.017v-5.65c0-1.038.035-2.068.189-2.848.417-2.091 2.037-3.583 4.389-3.583 3.415 0 4.935 2.37 4.935 5.77v7.411h3.983z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="text-lg font-bold text-white">Services</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-white">
                  Health Packages
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white">
                  Find a Doctor
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white">
                  Health Monitoring
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white">
                  Telehealth
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="text-lg font-bold text-white">Company</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white">
                  Achievements
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="text-lg font-bold text-white">Resources</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-white">
                  Health Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white">
                  Partner Resources
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white">
                  Help Center
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="container mx-auto mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2024 Healio Health Monitoring System. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="https://rahul-yadav.com.np/" className="hover:text-white" target="_blank">
              Rahul Yadav 
            </a>
            <a href="#" className="hover:text-white">
              Aashish Mahato
            </a>
            <a href="#" className="hover:text-white">
              Oshim Pathan
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
