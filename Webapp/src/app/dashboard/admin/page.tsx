"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import {
  User,
  Users,
  Shield,
  Settings,
  BarChart3,
  Activity,
  FileText,
  Bell,
  Database,
  UserCheck,
  UserX,
  TrendingUp,
  LogOut,
} from "lucide-react";

const AdminDashboard = () => {
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
        {/* Logo - Top Left */}
        <h2 className="text-xl font-bold text-black">AeroStream</h2>

        {/* User Profile - Top Right */}
        <div className="flex items-center space-x-3 relative">
          <span className="font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Admin
          </span>
          <div
            className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-600 transition-colors"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <Shield className="w-5 h-5 text-white" />
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
              <Users className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">User Management</span>
            </div>

            <div
              className="flex items-center text-gray-600 cursor-pointer hover:text-black transition-colors duration-200"
              onClick={() => router.push("/dashboard/admin/patient-report")}
            >
              <Database className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Patient Report</span>
            </div>

            <div className="flex items-center text-gray-600 cursor-pointer hover:text-black transition-colors duration-200">
              <FileText className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Reports</span>
            </div>

            <div className="flex items-center text-gray-600 cursor-pointer hover:text-black transition-colors duration-200">
              <Bell className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Messages</span>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            Admin Dashboard
          </h1>
          <p className="text-black">System overview and management controls</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">2,847</div>
              <p className="text-xs text-black">+180 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">
                Active Doctors
              </CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">156</div>
              <p className="text-xs text-black">+12 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">
                Pending Approvals
              </CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">23</div>
              <p className="text-xs text-black">-5 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">
                System Uptime
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">99.9%</div>
              <p className="text-xs text-black">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-black">
                Recent User Registrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-black">
                      Dr. Sarah Johnson
                    </p>
                    <p className="text-xs text-gray-500">
                      Doctor - 2 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-black">John Smith</p>
                    <p className="text-xs text-gray-500">
                      Patient - 4 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-black">
                      Dr. Mike Wilson
                    </p>
                    <p className="text-xs text-gray-500">
                      Doctor - 6 hours ago
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">System Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-black">CPU Usage</span>
                  <span className="text-sm font-medium text-black">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "45%" }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-black">Memory Usage</span>
                  <span className="text-sm font-medium text-black">62%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: "62%" }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-black">Storage Usage</span>
                  <span className="text-sm font-medium text-black">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full"
                    style={{ width: "78%" }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-black">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Users className="w-6 h-6 text-blue-600 mb-2" />
                  <p className="text-sm font-medium text-black">Manage Users</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Shield className="w-6 h-6 text-green-600 mb-2" />
                  <p className="text-sm font-medium text-black">Security</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Database className="w-6 h-6 text-purple-600 mb-2" />
                  <p className="text-sm font-medium text-black">Backup</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <TrendingUp className="w-6 h-6 text-orange-600 mb-2" />
                  <p className="text-sm font-medium text-black">Analytics</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
