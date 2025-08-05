"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import {
  Heart,
  Droplets,
  Thermometer,
  Shield,
  Activity,
  Brain,
  Wind,
  Apple,
  Pill,
  User,
  BarChart3,
  Bell,
  Settings,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

const HealthDashboard = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Sample data for charts (simplified representation)
  const chartData = Array.from({ length: 7 }, (_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    value: Math.floor(Math.random() * 40) + 60,
  }));

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single();

          if (error) throw error;
          setUserData(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [supabase]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const SimpleChart = ({
    data,
    color = "rgb(59, 130, 246)",
  }: {
    data: any[];
    color?: string;
  }) => (
    <div className="flex items-end justify-between h-16 gap-1">
      {data.map((point, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div
            className="w-full rounded-t-sm"
            style={{
              height: `${(point.value / 100) * 64}px`,
              backgroundColor: color,
              opacity: 0.7,
            }}
          />
          <span className="text-xs text-gray-500 mt-1">{point.day}</span>
        </div>
      ))}
    </div>
  );

  const getUserDisplayName = () => {
    if (!userData) return "User";
    const { first_name, last_name } = userData;
    if (first_name && last_name) {
      return `${first_name} ${last_name}`;
    } else if (first_name) {
      return first_name;
    } else if (last_name) {
      return last_name;
    }
    return "User";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-6 z-10">
        {/* Logo - Top Left */}
        <h2 className="text-xl font-bold text-black">AeroStream</h2>

        {/* User Profile - Top Right */}
        <div className="flex items-center space-x-3 relative">
          <span className="font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {getUserDisplayName()}
          </span>
          <div
            className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <User className="w-5 h-5 text-white" />
          </div>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[120px] z-20">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-black hover:bg-gray-50 flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Floating Navigation Bar - Center Top */}
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 px-6 py-3">
          <nav className="flex items-center space-x-8">
            {/* Overview (Active) */}
            <div className="flex items-center text-blue-600 cursor-pointer hover:text-blue-700 transition-colors duration-200">
              <BarChart3 className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Overview</span>
            </div>

            {/* Other Navigation Items */}
            <div className="flex items-center text-gray-600 cursor-pointer hover:text-black transition-colors duration-200">
              <Activity className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Vital Dashboard</span>
            </div>

            <div className="flex items-center text-gray-600 cursor-pointer hover:text-black transition-colors duration-200">
              <Heart className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Health Timeline</span>
            </div>

            <div className="flex items-center text-gray-600 cursor-pointer hover:text-black transition-colors duration-200">
              <Bell className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Conditions & Alert</span>
            </div>

            <div className="flex items-center text-gray-600 cursor-pointer hover:text-black transition-colors duration-200">
              <Settings className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Settings</span>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-32 px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {getUserDisplayName()}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Today</span>
            <span className="text-sm font-medium">This week</span>
          </div>
        </div>

        {/* Vitals Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Vitals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* Heart Rate */}
            <Card className="bg-red-500 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">HEART RATE</p>
                    <p className="text-2xl font-bold">72 bpm</p>
                  </div>
                  <Heart className="w-8 h-8 opacity-90" />
                </div>
                <div className="mt-2">
                  <div className="w-full h-8 opacity-60">
                    <svg viewBox="0 0 100 20" className="w-full h-full">
                      <polyline
                        fill="none"
                        stroke="white"
                        strokeWidth="1"
                        points="0,10 20,10 25,5 30,15 35,10 55,10 60,5 65,15 70,10 100,10"
                      />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Blood Pressure */}
            <Card className="bg-teal-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">BLOOD PRESSURE</p>
                    <p className="text-2xl font-bold">120/80 mmHg</p>
                  </div>
                  <Activity className="w-8 h-8 opacity-90" />
                </div>
              </CardContent>
            </Card>

            {/* SpO2 */}
            <Card className="bg-cyan-400 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">SPO2</p>
                    <p className="text-2xl font-bold">98%</p>
                    <p className="text-xs opacity-75">Normal</p>
                  </div>
                  <Droplets className="w-8 h-8 opacity-90" />
                </div>
              </CardContent>
            </Card>

            {/* Temperature */}
            <Card className="bg-orange-400 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">TEMPERATURE</p>
                    <p className="text-2xl font-bold">36.4°F</p>
                    <p className="text-xs opacity-75">Normal</p>
                  </div>
                  <Thermometer className="w-8 h-8 opacity-90" />
                </div>
              </CardContent>
            </Card>

            {/* Risk Status */}
            <Card className="bg-yellow-500 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">RISK STATUS</p>
                    <p className="text-lg font-bold">LOW</p>
                    <p className="text-xs opacity-75">No immediate concerns</p>
                  </div>
                  <Shield className="w-8 h-8 opacity-90" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Health Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Weekly Activity</span>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">+12%</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleChart data={chartData} />
            </CardContent>
          </Card>

          {/* Sleep Quality */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Sleep Quality</span>
                <div className="flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-blue-500">Good</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">7.5h</p>
                  <p className="text-sm text-gray-500">Average sleep</p>
                </div>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Brain className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Medications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Pill className="w-5 h-5 mr-2 text-purple-600" />
                Medications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Vitamin D</p>
                    <p className="text-sm text-gray-500">1 tablet daily</p>
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Omega-3</p>
                    <p className="text-sm text-gray-500">2 capsules daily</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Apple className="w-5 h-5 mr-2 text-green-600" />
                Health Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Daily Steps</span>
                  <span className="text-sm font-medium">8,432 / 10,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "84%" }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Water Intake</span>
                  <span className="text-sm font-medium">6 / 8 glasses</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <Activity className="w-6 h-6 text-blue-600 mb-2" />
                  <p className="text-sm font-medium">Log Vitals</p>
                </button>
                <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <Bell className="w-6 h-6 text-orange-600 mb-2" />
                  <p className="text-sm font-medium">Set Reminder</p>
                </button>
                <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <User className="w-6 h-6 text-green-600 mb-2" />
                  <p className="text-sm font-medium">Book Appointment</p>
                </button>
                <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <Settings className="w-6 h-6 text-gray-600 mb-2" />
                  <p className="text-sm font-medium">Settings</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HealthDashboard;
