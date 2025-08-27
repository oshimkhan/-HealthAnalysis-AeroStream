"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { motion } from "framer-motion";
import { countries } from "@/utils/countries";
import { debounce } from "lodash";

export default function DoctorSignup() {
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
    country: "",
    address: "",
    contact: "",
    gender: "",
    degrees: "",
    medical_license_number: "",
    training_history: "",
    area_of_expertise: "",
  });
  const [contactCountryCode, setContactCountryCode] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [checkingUsername, setCheckingUsername] = useState(false);

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
    const allowedCharsRegex = /^[a-z0-9_-]+$/;
    if (!allowedCharsRegex.test(username)) {
      setUsernameAvailable(false);
      setCheckingUsername(false);
      return;
    }

    setCheckingUsername(true);
    setUsernameAvailable(null);
    const { data, error } = await supabase
      .from("doctor")
      .select("username")
      .eq("username", username)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error checking username:", error);
      setUsernameAvailable(false);
    } else if (data) {
      setUsernameAvailable(false);
    } else {
      setUsernameAvailable(true);
    }
    setCheckingUsername(false);
  }, 500);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "username") {
      checkUsernameAvailability(value.toLowerCase());
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
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Generate 5-digit doctor_id
        const { data: existingDoctors, error: fetchError } = await supabase
          .from("doctor")
          .select("doctor_id")
          .order("doctor_id", { ascending: false })
          .limit(1);

        let nextDoctorId = "10001"; // Start from 10001 for 5-digit IDs
        
        if (!fetchError && existingDoctors && existingDoctors.length > 0) {
          const lastDoctorId = existingDoctors[0].doctor_id;
          if (lastDoctorId) {
            const nextId = parseInt(lastDoctorId) + 1;
            nextDoctorId = nextId.toString().padStart(5, '0');
          }
        }

        const { error: insertError } = await supabase.from("doctor").insert([
          {
            id: authData.user.id,
            user_id: authData.user.id,
            doctor_id: nextDoctorId,
            first_name: formData.first_name,
            middle_name: formData.middle_name,
            last_name: formData.last_name,
            username: formData.username.toLowerCase(),
            country: formData.country,
            address: formData.address,
            contact: `${contactCountryCode}${formData.contact}`,
            gender: formData.gender,
            degrees: formData.degrees,
            medical_license_number: formData.medical_license_number,
            training_history: formData.training_history,
            area_of_expertise: formData.area_of_expertise,
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
          <h1 className="text-3xl font-extrabold text-green-600 mb-8">
            Doctor Registration
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {signupSuccess && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 text-center text-sm">
            Doctor Registered. Redirecting to Login page...
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="Enter your first name"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="Enter your middle name"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="Enter your last name"
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
                    : "border-gray-300 focus:ring-green-500"
                } focus:border-green-500 text-gray-900`}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="Create a password"
                aria-label="Password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                name="gender"
                required
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                aria-label="Select Gender"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <select
                name="country"
                required
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                aria-label="Select Country"
              >
                <option value="">Select Country</option>
                {countries.map(
                  (country: {
                    code: string;
                    name: string;
                    phone_code: string;
                  }) => (
                    <option key={country.code} value={country.name}>
                      {country.name}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number *
              </label>
              <div className="flex items-center">
                <select
                  value={contactCountryCode}
                  onChange={handleContactCountryCodeChange}
                  className="flex-shrink-0 mr-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 text-sm w-1/4"
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
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-900 w-3/4"
                  placeholder="Enter your contact number"
                  aria-label="Contact Number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical License Number
              </label>
              <input
                type="text"
                name="medical_license_number"
                value={formData.medical_license_number}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="Enter medical license number"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
              rows={3}
              placeholder="Enter your address"
              aria-label="Address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Degrees *
            </label>
            <textarea
              name="degrees"
              required
              value={formData.degrees}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
              rows={3}
              placeholder="Enter your medical degrees (comma-separated)"
              aria-label="Degrees"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Training History
            </label>
            <textarea
              name="training_history"
              value={formData.training_history}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
              rows={3}
              placeholder="Enter your training history"
              aria-label="Training History"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Area of Expertise *
            </label>
            <input
              type="text"
              name="area_of_expertise"
              required
              value={formData.area_of_expertise}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:focus:border-green-500 text-gray-900"
              placeholder="Enter your area of expertise"
              aria-label="Area of Expertise"
            />
          </div>

          <button
            type="submit"
            disabled={
              loading || usernameAvailable === false || checkingUsername
            }
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register Doctor"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
