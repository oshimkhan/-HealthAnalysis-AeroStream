"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { motion } from "framer-motion";
import { countries } from "@/utils/countries"; // Import countries data
import { debounce } from "lodash"; // Assuming lodash is installed for debouncing

export default function AdminSignup() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    username: "",
    address: "",
    contact: "",
  });
  const [contactCountryCode, setContactCountryCode] = useState(""); // State for contact country code
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  ); // null: checking, true: available, false: not available
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Set initial contact country code to the first country's code on mount
  useEffect(() => {
    if (countries.length > 0) {
      setContactCountryCode(countries[0].phone_code);
    }
  }, []);

  const checkUsernameAvailability = debounce(async (username: string) => {
    if (!username) {
      setUsernameAvailable(null);
      setCheckingUsername(false);
      return;
    }
    // Basic validation for allowed characters
    const allowedCharsRegex = /^[a-z0-9_-]+$/;
    if (!allowedCharsRegex.test(username)) {
      setUsernameAvailable(false); // Mark as unavailable due to invalid characters
      setCheckingUsername(false);
      return;
    }

    setCheckingUsername(true);
    setUsernameAvailable(null); // Indicate checking
    const { data, error } = await supabase
      .from("admin") // Check in the admin table
      .select("username")
      .eq("username", username)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 means no rows found
      console.error("Error checking username:", error);
      setUsernameAvailable(false);
    } else if (data) {
      setUsernameAvailable(false); // Username found, not available
    } else {
      setUsernameAvailable(true); // No data found, username is available
    }
    setCheckingUsername(false);
  }, 500); // Debounce for 500ms

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "username") {
      checkUsernameAvailability(value.toLowerCase()); // Check availability for lowercase username
    }
  };

  const handleContactCountryCodeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setContactCountryCode(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSignupSuccess(false);

    // Additional check for username availability before submitting
    if (usernameAvailable === false) {
      setError("Username is not available or contains invalid characters.");
      setLoading(false);
      return;
    }
    if (checkingUsername) {
      setError("Please wait while username availability is checked.");
      setLoading(false);
      return;
    }

    try {
      // Sign up the admin
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Insert admin data into the admin table
        const { error: insertError } = await supabase.from("admin").insert([
          {
            id: authData.user.id,
            first_name: formData.first_name,
            middle_name: formData.middle_name,
            last_name: formData.last_name,
            username: formData.username.toLowerCase(), // Store username in lowercase
            address: formData.address,
            contact: `${contactCountryCode}${formData.contact}`, // Combine country code and contact
          },
        ]);

        if (insertError) throw insertError;

        setSignupSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full space-y-8 bg-white rounded-2xl shadow-2xl p-8"
      >
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-purple-600 mb-8">
            Admin Registration
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {signupSuccess && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 text-center text-sm">
            Admin Registered. Redirecting to Login page...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="first_name"
                required
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                placeholder="Enter your first name"
                aria-label="First Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Middle Name
              </label>
              <input
                type="text"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                placeholder="Enter your middle name"
                aria-label="Middle Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="last_name"
                required
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                placeholder="Enter your last name"
                aria-label="Last Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                  usernameAvailable === true
                    ? "border-green-500 focus:ring-green-500"
                    : usernameAvailable === false
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-purple-500"
                } focus:border-purple-500 text-gray-900`}
                placeholder="Choose a username (a-z, 0-9, _, -)"
                aria-invalid={usernameAvailable === false ? "true" : "false"}
                aria-describedby="username-status"
              />
              <div id="username-status" className="text-sm mt-1">
                {checkingUsername && (
                  <span className="text-gray-500">
                    Checking availability...
                  </span>
                )}
                {usernameAvailable === true && !checkingUsername && (
                  <span className="text-green-600">Username available</span>
                )}
                {usernameAvailable === false && !checkingUsername && (
                  <span className="text-red-600">
                    Username not available or invalid characters
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                placeholder="Enter your email"
                aria-label="Email Address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                placeholder="Create a password"
                aria-label="Password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number *
              </label>
              <div className="flex items-center">
                <select
                  value={contactCountryCode}
                  onChange={handleContactCountryCodeChange}
                  className="flex-shrink-0 mr-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 text-sm w-1/4"
                  aria-label="Select Contact Country Code"
                >
                  {countries.map(
                    (country: {
                      code: string;
                      name: string;
                      phone_code: string;
                    }) => (
                      <option key={country.code} value={country.phone_code}>
                        {country.name} ({country.phone_code})
                      </option>
                    )
                  )}
                </select>
                <input
                  type="tel"
                  name="contact"
                  required
                  value={formData.contact}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-gray-900 w-3/4"
                  placeholder="Enter your contact number"
                  aria-label="Contact Number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                rows={3}
                placeholder="Enter your address"
                aria-label="Address"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={
              loading || usernameAvailable === false || checkingUsername
            }
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register Admin"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
