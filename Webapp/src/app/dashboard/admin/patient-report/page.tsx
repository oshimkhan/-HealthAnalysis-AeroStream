"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import {
  Search,
  User,
  Mail,
  Phone,
  Upload,
  ArrowLeft,
  Shield,
  LogOut,
  X,
  Activity,
  Wind,
} from "lucide-react";

const PatientReport = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedPatientName, setSelectedPatientName] = useState("");
  
  // Form data state
  const [formData, setFormData] = useState({
    // Vitals Monitoring
    heart_rate_bpm: "",
    pulse_bpm: "",
    spo2_percent: "",
    body_temp_c: "",
    ecg_signal_raw: "",
    ecg_rhythm_type: "Normal",
    systolic_bp: "",
    diastolic_bp: "",
    mean_bp: "",
    
    // Breath Analysis
    ammonia_ppm: "",
    co2_ppm_mq: "",
    benzene_ppm: "",
    co2_ppm_mhz19: "",
    ethanol_ppm: "",
    vocs_ppm_mics: "",
    acetone_ppm_qcm: "",
    voc_type_chemo: "",
    voc_value_ppm_chemo: ""
  });
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [searchQuery, patients]);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterPatients = () => {
    if (!searchQuery.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = patients.filter((patient) => {
      const fullName = `${patient.first_name || ""} ${patient.last_name || ""}`.toLowerCase();
      const email = patient.email?.toLowerCase() || "";
      const phone = patient.user_contact?.toLowerCase() || "";
      const patientId = patient.patient_id?.toLowerCase() || "";
      const userId = patient.id?.toLowerCase() || "";

      return (
        fullName.includes(query) ||
        email.includes(query) ||
        phone.includes(query) ||
        patientId.includes(query) ||
        userId.includes(query)
      );
    });

    setFilteredPatients(filtered);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleUploadReport = (patientId: string, patientName: string) => {
    setSelectedPatientId(patientId);
    setSelectedPatientName(patientName);
    setShowReportModal(true);
    // Reset form data when opening the modal
    setFormData({
      // Vitals Monitoring
      heart_rate_bpm: "",
      pulse_bpm: "",
      spo2_percent: "",
      body_temp_c: "",
      ecg_signal_raw: "",
      ecg_rhythm_type: "Normal",
      systolic_bp: "",
      diastolic_bp: "",
      mean_bp: "",
      
      // Breath Analysis
      ammonia_ppm: "",
      co2_ppm_mq: "",
      benzene_ppm: "",
      co2_ppm_mhz19: "",
      ethanol_ppm: "",
      vocs_ppm_mics: "",
      acetone_ppm_qcm: "",
      voc_type_chemo: "",
      voc_value_ppm_chemo: ""
    });
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Extract vitals monitoring data
      const vitalsData = {
        patient_id: selectedPatientId,
        heart_rate_bpm: formData.heart_rate_bpm ? parseInt(formData.heart_rate_bpm) : null,
        pulse_bpm: formData.pulse_bpm ? parseInt(formData.pulse_bpm) : null,
        spo2_percent: formData.spo2_percent ? parseFloat(formData.spo2_percent) : null,
        body_temp_c: formData.body_temp_c ? parseFloat(formData.body_temp_c) : null,
        ecg_signal_raw: formData.ecg_signal_raw,
        ecg_rhythm_type: formData.ecg_rhythm_type,
        systolic_bp: formData.systolic_bp ? parseInt(formData.systolic_bp) : null,
        diastolic_bp: formData.diastolic_bp ? parseInt(formData.diastolic_bp) : null,
        mean_bp: formData.mean_bp ? parseInt(formData.mean_bp) : null
      };
      
      // Extract breath analysis data
      const breathData = {
        patient_id: selectedPatientId,
        ammonia_ppm: formData.ammonia_ppm ? parseFloat(formData.ammonia_ppm) : null,
        co2_ppm_mq: formData.co2_ppm_mq ? parseFloat(formData.co2_ppm_mq) : null,
        benzene_ppm: formData.benzene_ppm ? parseFloat(formData.benzene_ppm) : null,
        co2_ppm_mhz19: formData.co2_ppm_mhz19 ? parseFloat(formData.co2_ppm_mhz19) : null,
        ethanol_ppm: formData.ethanol_ppm ? parseFloat(formData.ethanol_ppm) : null,
        vocs_ppm_mics: formData.vocs_ppm_mics ? parseFloat(formData.vocs_ppm_mics) : null,
        acetone_ppm_qcm: formData.acetone_ppm_qcm ? parseFloat(formData.acetone_ppm_qcm) : null,
        voc_type_chemo: formData.voc_type_chemo,
        voc_value_ppm_chemo: formData.voc_value_ppm_chemo ? parseFloat(formData.voc_value_ppm_chemo) : null
      };
      
      // Insert data into vitals_monitoring table
      const { error: vitalsError } = await supabase
        .from('vitals_monitoring')
        .insert([vitalsData]);
      
      if (vitalsError) throw vitalsError;
      
      // Insert data into breath_analysis table
      const { error: breathError } = await supabase
        .from('breath_analysis')
        .insert([breathData]);
      
      if (breathError) throw breathError;
      
      // Close modal and show success message
      setShowReportModal(false);
      alert('Report data submitted successfully!');
      
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    }
  };

  const getPatientDisplayName = (patient: any) => {
    const firstName = patient.first_name || "";
    const lastName = patient.last_name || "";
    return `${firstName} ${lastName}`.trim() || "Unknown Patient";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-black">Loading patients...</p>
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
            {/* Dashboard */}
            <div 
              className="flex items-center text-gray-600 cursor-pointer hover:text-black transition-colors duration-200"
              onClick={() => router.push("/dashboard/admin")}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </div>

            {/* Patient Report (Active) */}
            <div className="flex items-center text-blue-600 cursor-pointer hover:text-blue-700 transition-colors duration-200">
              <User className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Patient Report</span>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-32 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            Patient Report
          </h1>
          <p className="text-black">
            Search and manage patient reports
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-black">Search Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by Patient ID, Phone Number, Email, or Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patients List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-black">
              Patients ({filteredPatients.length})
            </h2>
          </div>

          {filteredPatients.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-black font-medium">No patients found</p>
                  <p className="text-gray-500 text-sm">
                    {searchQuery ? "Try adjusting your search criteria" : "No patients registered yet"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredPatients.map((patient) => (
                <Card key={patient.patient_id || patient.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      {/* Patient ID */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-black">
                            Patient ID: {patient.patient_id || "Not assigned"}
                          </span>
                        </div>
                      </div>

                      {/* Full Name */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-black">
                            {getPatientDisplayName(patient)}
                          </span>
                        </div>
                      </div>

                      {/* Upload Report Button */}
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => handleUploadReport(patient.patient_id || patient.id, getPatientDisplayName(patient))}
                          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          <span className="text-sm font-medium">Upload Report</span>
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Report Upload Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white/95 backdrop-blur-sm p-6 shadow-xl border border-gray-200">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Upload Report for {selectedPatientName}
              </h2>
              <button
                onClick={() => setShowReportModal(false)}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            <div className="mb-2 text-sm text-gray-500">
              Patient ID: {selectedPatientId}
            </div>
            
            <form onSubmit={handleSubmitReport} className="mt-6">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Vitals Monitoring Section */}
                <div className="rounded-lg border border-gray-200 bg-white/90 p-6 shadow-sm">
                  <div className="mb-4 flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-red-500" />
                    <h3 className="text-lg font-medium text-gray-800">🩺 Vitals Monitoring</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Heart Rate */}
                    <div>
                      <label htmlFor="heart_rate_bpm" className="mb-1 block text-sm font-medium text-gray-700">
                        Heart Rate (bpm)
                      </label>
                      <input
                        type="number"
                        id="heart_rate_bpm"
                        name="heart_rate_bpm"
                        value={formData.heart_rate_bpm}
                        onChange={handleFormChange}
                        placeholder="60-100"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                      />
                    </div>
                    
                    {/* Pulse Rate */}
                    <div>
                      <label htmlFor="pulse_bpm" className="mb-1 block text-sm font-medium text-gray-700">
                        Pulse Rate (bpm)
                      </label>
                      <input
                        type="number"
                        id="pulse_bpm"
                        name="pulse_bpm"
                        value={formData.pulse_bpm}
                        onChange={handleFormChange}
                        placeholder="60-100"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                      />
                    </div>
                    
                    {/* Oxygen Saturation */}
                    <div>
                      <label htmlFor="spo2_percent" className="mb-1 block text-sm font-medium text-gray-700">
                        Oxygen Saturation (%)
                      </label>
                      <input
                        type="number"
                        id="spo2_percent"
                        name="spo2_percent"
                        value={formData.spo2_percent}
                        onChange={handleFormChange}
                        placeholder="95-100"
                        step="0.1"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                      />
                    </div>
                    
                    {/* Body Temperature */}
                    <div>
                      <label htmlFor="body_temp_c" className="mb-1 block text-sm font-medium text-gray-700">
                        Body Temperature (°C)
                      </label>
                      <input
                        type="number"
                        id="body_temp_c"
                        name="body_temp_c"
                        value={formData.body_temp_c}
                        onChange={handleFormChange}
                        placeholder="36.5-37.5"
                        step="0.1"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                      />
                    </div>
                    
                    {/* ECG Signal */}
                    <div>
                      <label htmlFor="ecg_signal_raw" className="mb-1 block text-sm font-medium text-gray-700">
                        ECG Signal (raw text or waveform data)
                      </label>
                      <textarea
                        id="ecg_signal_raw"
                        name="ecg_signal_raw"
                        value={formData.ecg_signal_raw}
                        onChange={handleFormChange}
                        placeholder="Enter ECG signal data or upload waveform"
                        rows={3}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                      />
                    </div>
                    
                    {/* ECG Rhythm Type */}
                    <div>
                      <label htmlFor="ecg_rhythm_type" className="mb-1 block text-sm font-medium text-gray-700">
                        ECG Rhythm Type
                      </label>
                      <select
                        id="ecg_rhythm_type"
                        name="ecg_rhythm_type"
                        value={formData.ecg_rhythm_type}
                        onChange={handleFormChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                      >
                        <option value="Normal">Normal</option>
                        <option value="Arrhythmia">Arrhythmia</option>
                        <option value="Unknown">Unknown</option>
                      </select>
                    </div>
                    
                    {/* Blood Pressure */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="systolic_bp" className="mb-1 block text-sm font-medium text-gray-700">
                          Systolic BP (mmHg)
                        </label>
                        <input
                          type="number"
                          id="systolic_bp"
                          name="systolic_bp"
                          value={formData.systolic_bp}
                          onChange={handleFormChange}
                          placeholder="90-120"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="diastolic_bp" className="mb-1 block text-sm font-medium text-gray-700">
                          Diastolic BP (mmHg)
                        </label>
                        <input
                          type="number"
                          id="diastolic_bp"
                          name="diastolic_bp"
                          value={formData.diastolic_bp}
                          onChange={handleFormChange}
                          placeholder="60-80"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                        />
                      </div>
                    </div>
                    
                    {/* Mean Arterial Pressure */}
                    <div>
                      <label htmlFor="mean_bp" className="mb-1 block text-sm font-medium text-gray-700">
                        Mean Arterial Pressure (optional)
                      </label>
                      <input
                        type="number"
                        id="mean_bp"
                        name="mean_bp"
                        value={formData.mean_bp}
                        onChange={handleFormChange}
                        placeholder="70-100"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Breath Analysis Section */}
                <div className="rounded-lg border border-gray-200 bg-white/90 p-6 shadow-sm">
                  <div className="mb-4 flex items-center space-x-2">
                    <Wind className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-medium text-gray-800">🌬️ Breath Analysis</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Ammonia */}
                    <div>
                      <label htmlFor="ammonia_ppm" className="mb-1 block text-sm font-medium text-gray-700">
                        Ammonia (ppm)
                      </label>
                      <input
                        type="number"
                        id="ammonia_ppm"
                        name="ammonia_ppm"
                        value={formData.ammonia_ppm}
                        onChange={handleFormChange}
                        placeholder="0.5-2.0"
                        step="0.01"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                      />
                    </div>
                    
                    {/* CO2 (MQ Sensor) */}
                    <div>
                      <label htmlFor="co2_ppm_mq" className="mb-1 block text-sm font-medium text-gray-700">
                        CO₂ (ppm, MQ Sensor)
                      </label>
                      <input
                        type="number"
                        id="co2_ppm_mq"
                        name="co2_ppm_mq"
                        value={formData.co2_ppm_mq}
                        onChange={handleFormChange}
                        placeholder="400-1000"
                        step="0.1"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                      />
                    </div>
                    
                    {/* Benzene */}
                    <div>
                      <label htmlFor="benzene_ppm" className="mb-1 block text-sm font-medium text-gray-700">
                        Benzene (ppm)
                      </label>
                      <input
                        type="number"
                        id="benzene_ppm"
                        name="benzene_ppm"
                        value={formData.benzene_ppm}
                        onChange={handleFormChange}
                        placeholder="0.0-0.5"
                        step="0.01"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                      />
                    </div>
                    
                    {/* CO2 (MH-Z19 Sensor) */}
                    <div>
                      <label htmlFor="co2_ppm_mhz19" className="mb-1 block text-sm font-medium text-gray-700">
                        CO₂ (ppm, MH-Z19 Sensor)
                      </label>
                      <input
                        type="number"
                        id="co2_ppm_mhz19"
                        name="co2_ppm_mhz19"
                        value={formData.co2_ppm_mhz19}
                        onChange={handleFormChange}
                        placeholder="400-1000"
                        step="0.1"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                      />
                    </div>
                    
                    {/* Ethanol */}
                    <div>
                      <label htmlFor="ethanol_ppm" className="mb-1 block text-sm font-medium text-gray-700">
                        Ethanol (ppm)
                      </label>
                      <input
                        type="number"
                        id="ethanol_ppm"
                        name="ethanol_ppm"
                        value={formData.ethanol_ppm}
                        onChange={handleFormChange}
                        placeholder="0.0-10.0"
                        step="0.01"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                      />
                    </div>
                    
                    {/* VOCs (MiCS sensor) */}
                    <div>
                      <label htmlFor="vocs_ppm_mics" className="mb-1 block text-sm font-medium text-gray-700">
                        VOCs (ppm, MiCS sensor)
                      </label>
                      <input
                        type="number"
                        id="vocs_ppm_mics"
                        name="vocs_ppm_mics"
                        value={formData.vocs_ppm_mics}
                        onChange={handleFormChange}
                        placeholder="0.1-3.0"
                        step="0.01"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                      />
                    </div>
                    
                    {/* Acetone */}
                    <div>
                      <label htmlFor="acetone_ppm_qcm" className="mb-1 block text-sm font-medium text-gray-700">
                        Acetone (ppm, QCM sensor)
                      </label>
                      <input
                        type="number"
                        id="acetone_ppm_qcm"
                        name="acetone_ppm_qcm"
                        value={formData.acetone_ppm_qcm}
                        onChange={handleFormChange}
                        placeholder="0.0-1.0"
                        step="0.01"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                      />
                    </div>
                    
                    {/* VOC Type */}
                    <div>
                      <label htmlFor="voc_type_chemo" className="mb-1 block text-sm font-medium text-gray-700">
                        VOC Type (chemo sensor)
                      </label>
                      <input
                        type="text"
                        id="voc_type_chemo"
                        name="voc_type_chemo"
                        value={formData.voc_type_chemo}
                        onChange={handleFormChange}
                        placeholder="e.g., Acetone, Ethanol, etc."
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                      />
                    </div>
                    
                    {/* VOC Value */}
                    <div>
                      <label htmlFor="voc_value_ppm_chemo" className="mb-1 block text-sm font-medium text-gray-700">
                        VOC Value (ppm, chemo sensor)
                      </label>
                      <input
                        type="number"
                        id="voc_value_ppm_chemo"
                        name="voc_value_ppm_chemo"
                        value={formData.voc_value_ppm_chemo}
                        onChange={handleFormChange}
                        placeholder="0.0-5.0"
                        step="0.01"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientReport;