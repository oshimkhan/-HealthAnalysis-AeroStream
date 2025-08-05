"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { motion } from "framer-motion";
import { countries } from "@/utils/countries";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { debounce } from "lodash";
import { generatePatientId } from "@/lib/utils";

type UserType = "user" | "doctor" | "admin";

export default function UnifiedSignup() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [selectedUserType, setSelectedUserType] = useState<UserType>("user");
  const [showUserTypeDropdown, setShowUserTypeDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Common form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "",
    country: "",
    address: "",
    contact: "",
    // User-specific fields
    date_of_birth: "",
    user_contact: "",
    emergency_contact: "",
    medical_history: "",
    // Doctor-specific fields
    username: "",
    degrees: "",
    medical_license_number: "",
    training_history: "",
    area_of_expertise: "",
    // Admin-specific fields
    admin_username: "",
  });

  const [userContactCode, setUserContactCode] = useState("");
  const [emergencyContactCode, setEmergencyContactCode] = useState("");
  const [contactCountryCode, setContactCountryCode] = useState("");

  const userTypeOptions = [
    { value: "user", label: "Patient", icon: "👤", color: "blue" },
    { value: "doctor", label: "Doctor", icon: "👨‍⚕️", color: "green" },
    { value: "admin", label: "Admin", icon: "👨‍💼", color: "purple" },
  ];

  useEffect(() => {
    if (countries.length > 0) {
      setContactCountryCode(countries[0].phone_code);
      setUserContactCode(countries[0].phone_code);
      setEmergencyContactCode(countries[0].phone_code);
    }
  }, []);

  useEffect(() => {
    if (formData.country) {
      const selectedCountry = countries.find(
        (c) => c.name === formData.country
      );
      if (selectedCountry) {
        setUserContactCode(selectedCountry.phone_code);
        setEmergencyContactCode(selectedCountry.phone_code);
        setContactCountryCode(selectedCountry.phone_code);
      }
    }
  }, [formData.country]);

  const checkUsernameAvailability = debounce(
    async (username: string, table: string) => {
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
        .from(table)
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
    },
    500
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "username" && selectedUserType === "doctor") {
      checkUsernameAvailability(value.toLowerCase(), "doctor");
    } else if (name === "admin_username" && selectedUserType === "admin") {
      checkUsernameAvailability(value.toLowerCase(), "admin");
    }
  };

  const handleCountryCodeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    field: "user" | "emergency" | "contact"
  ) => {
    const { value } = e.target;
    if (field === "user") {
      setUserContactCode(value);
    } else if (field === "emergency") {
      setEmergencyContactCode(value);
    } else if (field === "contact") {
      setContactCountryCode(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSignupSuccess(false);

    // Username validation for doctor and admin
    if (
      (selectedUserType === "doctor" || selectedUserType === "admin") &&
      usernameAvailable === false
    ) {
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
        let insertError;

        if (selectedUserType === "user") {
          // Generate a unique patient ID
          const patientId = await generatePatientId(supabase, formData.country);
          
          // Insert into users table
          const { error } = await supabase.from("users").insert([
            {
              id: authData.user.id,
              patient_id: patientId, // Add the generated patient ID
              first_name: formData.first_name,
              middle_name: formData.middle_name,
              last_name: formData.last_name,
              gender: formData.gender,
              date_of_birth: formData.date_of_birth,
              country: formData.country,
              user_contact: `${userContactCode}${formData.user_contact}`,
              emergency_contact: `${emergencyContactCode}${formData.emergency_contact}`,
              medical_history: formData.medical_history
                .split(",")
                .map((item) => item.trim()),
              address: formData.address,
            },
          ]);
          insertError = error;
        } else if (selectedUserType === "doctor") {
          // Insert into doctor table
          const { error } = await supabase.from("doctor").insert([
            {
              id: authData.user.id,
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
          insertError = error;
        } else if (selectedUserType === "admin") {
          // Insert into admin table
          const { error } = await supabase.from("admin").insert([
            {
              id: authData.user.id,
              first_name: formData.first_name,
              middle_name: formData.middle_name,
              last_name: formData.last_name,
              username: formData.admin_username.toLowerCase(),
              address: formData.address,
              contact: `${contactCountryCode}${formData.contact}`,
            },
          ]);
          insertError = error;
        }

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

  const getCurrentUserTypeOption = () => {
    return (
      userTypeOptions.find((option) => option.value === selectedUserType) ||
      userTypeOptions[0]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Create Your Account
          </h1>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {signupSuccess && (
            <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 text-center">
              Account created successfully! Redirecting to login...
            </div>
          )}

          {!signupSuccess && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Type Selection */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type *
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setShowUserTypeDropdown(!showUserTypeDropdown)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-3">
                        {getCurrentUserTypeOption().icon}
                      </span>
                      <span>{getCurrentUserTypeOption().label}</span>
                    </div>
                    <ChevronDownIcon className="w-5 h-5" />
                  </button>

                  {showUserTypeDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      {userTypeOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setSelectedUserType(option.value as UserType);
                            setShowUserTypeDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left text-gray-900 hover:bg-gray-50 flex items-center"
                        >
                          <span className="text-xl mr-3">{option.icon}</span>
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Common Fields */}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Enter your last name"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    aria-label="Select Country"
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number *
                  </label>
                  <div className="flex">
                    <select
                      value={contactCountryCode}
                      onChange={(e) => handleCountryCodeChange(e, "contact")}
                      className="flex-shrink-0 mr-2 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 w-1/4"
                      aria-label="Select Contact Country Code"
                    >
                      {countries.map((country) => (
                        <option key={country.code} value={country.phone_code}>
                          {country.name} ({country.phone_code})
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      name="contact"
                      required
                      value={formData.contact}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 w-3/4"
                      placeholder="e.g., 1234567890"
                    />
                  </div>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  rows={3}
                  placeholder="Enter your address"
                />
              </div>

              {/* User-specific fields */}
              {selectedUserType === "user" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        name="date_of_birth"
                        required
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        title="Select your date of birth"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact *
                      </label>
                      <div className="flex">
                        <select
                          value={emergencyContactCode}
                          onChange={(e) =>
                            handleCountryCodeChange(e, "emergency")
                          }
                          className="flex-shrink-0 mr-2 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 w-1/4"
                          aria-label="Select Emergency Contact Country Code"
                        >
                          {countries.map((country) => (
                            <option
                              key={country.code}
                              value={country.phone_code}
                            >
                              {country.name} ({country.phone_code})
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          name="emergency_contact"
                          required
                          value={formData.emergency_contact}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 w-3/4"
                          placeholder="e.g., 0987654321"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medical History (comma-separated)
                    </label>
                    <textarea
                      name="medical_history"
                      value={formData.medical_history}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      rows={3}
                      placeholder="e.g., Allergies, Diabetes, etc."
                    />
                  </div>
                </>
              )}

              {/* Doctor-specific fields */}
              {selectedUserType === "doctor" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                          usernameAvailable === true
                            ? "border-green-500"
                            : usernameAvailable === false
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter username"
                      />
                      {checkingUsername && (
                        <p className="text-xs text-gray-500 mt-1">
                          Checking availability...
                        </p>
                      )}
                      {usernameAvailable === true && (
                        <p className="text-xs text-green-600 mt-1">
                          Username available!
                        </p>
                      )}
                      {usernameAvailable === false && (
                        <p className="text-xs text-red-600 mt-1">
                          Username not available
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Medical License Number *
                      </label>
                      <input
                        type="text"
                        name="medical_license_number"
                        required
                        value={formData.medical_license_number}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        placeholder="Enter license number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Degrees *
                    </label>
                    <input
                      type="text"
                      name="degrees"
                      required
                      value={formData.degrees}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="e.g., MD, MBBS, etc."
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="e.g., Cardiology, Pediatrics, etc."
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      rows={3}
                      placeholder="Describe your training and experience"
                    />
                  </div>
                </>
              )}

              {/* Admin-specific fields */}
              {selectedUserType === "admin" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Username *
                  </label>
                  <input
                    type="text"
                    name="admin_username"
                    required
                    value={formData.admin_username}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                      usernameAvailable === true
                        ? "border-green-500"
                        : usernameAvailable === false
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter admin username"
                  />
                  {checkingUsername && (
                    <p className="text-xs text-gray-500 mt-1">
                      Checking availability...
                    </p>
                  )}
                  {usernameAvailable === true && (
                    <p className="text-xs text-green-600 mt-1">
                      Username available!
                    </p>
                  )}
                  {usernameAvailable === false && (
                    <p className="text-xs text-red-600 mt-1">
                      Username not available
                    </p>
                  )}
                </div>
              )}

              {/* Email and Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Enter your email"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
