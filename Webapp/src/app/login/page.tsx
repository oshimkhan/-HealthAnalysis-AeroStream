"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLoginSuccess(false);

    try {
      // Sign in with email and password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Check user type by querying different tables
        const userId = authData.user.id;

        // Check if user is a doctor
        const { data: doctorData, error: doctorError } = await supabase
          .from("doctor")
          .select("id")
          .eq("id", userId)
          .single();

        if (doctorData) {
          setLoginSuccess(true);
          setTimeout(() => {
            router.push("/dashboard/doctor"); // Redirect to doctor dashboard
          }, 1000);
          return;
        }

        // Check if user is an admin
        const { data: adminData, error: adminError } = await supabase
          .from("admin")
          .select("id")
          .eq("id", userId)
          .single();

        if (adminData) {
          setLoginSuccess(true);
          setTimeout(() => {
            router.push("/dashboard/admin"); // Redirect to admin dashboard
          }, 1000);
          return;
        }

        // Check if user is a patient (in users table)
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id")
          .eq("id", userId)
          .single();

        if (userData) {
          setLoginSuccess(true);
          setTimeout(() => {
            router.push("/user_home"); // Redirect to patient dashboard
          }, 1000);
          return;
        }

        // If user exists in auth but not in any role table
        throw new Error("User account not found in any role table");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-2xl p-8"
      >
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {loginSuccess && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-4 text-center text-sm">
            Login successful! Redirecting...
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
              required
              aria-label="Email Address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
              required
              aria-label="Password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign Up
          </Link>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          &copy; 2024 Your Health Companion. All rights reserved.
        </div>
      </motion.div>
    </div>
  );
}
