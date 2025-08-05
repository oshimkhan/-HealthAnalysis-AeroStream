"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import {
  User,
  Calendar,
  Clock,
  Users,
  FileText,
  Bell,
  Settings,
  BarChart3,
  Activity,
  Heart,
  Stethoscope,
  LogOut,
} from "lucide-react";

const DoctorDashboard = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-6 z-10">
        {/* Logo */}
        <h2 className="text-xl font-bold text-black">AeroStream</h2>

        {/* User Profile */}
        <div className="flex items-center space-x-3 relative">
          <span className="font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Dr. Smith</span>
          <div
            className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <Stethoscope className="w-5 h-5 text-white" />
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
            {/* Dashboard (Active) */}
            <div className="flex items-center text-blue-600 cursor-pointer hover:text-blue-700 transition-colors duration-200">
              <BarChart3 className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Dashboard</span>
            </div>

            {/* Other Navigation Items */}
            <div className="flex items-center text-gray-600 cursor-pointer hover:text-black transition-colors duration-200">
              <Calendar className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Appointments</span>
            </div>

            <div className="flex items-center text-gray-600 cursor-pointer hover:text-black transition-colors duration-200">
              <Users className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Patients</span>
            </div>

            <div className="flex items-center text-gray-600 cursor-pointer hover:text-black transition-colors duration-200">
              <FileText className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Medical Records</span>
            </div>

            <div className="flex items-center text-gray-600 cursor-pointer hover:text-black transition-colors duration-200">
              <Bell className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Notifications</span>
            </div>

            <div className="flex items-center text-gray-600 cursor-pointer hover:text-black transition-colors duration-200">
              <Settings className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Settings</span>
            </div>
          </nav>
        </div>
      </div>
      
      <div className="pt-32 px-6">

        {/* Main Content */}
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Doctor Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, Dr. Smith. Here's your overview for today.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's Appointments
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  +2 from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Patients
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">+12 this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Reports
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                  -3 from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Hours Worked
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6.5</div>
                <p className="text-xs text-muted-foreground">Today's hours</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">John Doe - 2:30 PM</p>
                      <p className="text-xs text-gray-500">Regular checkup</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Jane Smith - 3:15 PM
                      </p>
                      <p className="text-xs text-gray-500">
                        Follow-up consultation
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Mike Johnson - 4:00 PM
                      </p>
                      <p className="text-xs text-gray-500">Emergency visit</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Calendar className="w-6 h-6 text-blue-600 mb-2" />
                    <p className="text-sm font-medium">Schedule Appointment</p>
                  </button>
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <FileText className="w-6 h-6 text-green-600 mb-2" />
                    <p className="text-sm font-medium">View Records</p>
                  </button>
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Users className="w-6 h-6 text-purple-600 mb-2" />
                    <p className="text-sm font-medium">Patient List</p>
                  </button>
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Bell className="w-6 h-6 text-orange-600 mb-2" />
                    <p className="text-sm font-medium">Notifications</p>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
