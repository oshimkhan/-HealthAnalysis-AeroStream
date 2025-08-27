"use client";

import React, { useState, useEffect } from "react";
import { createBrowserClient } from '@supabase/ssr';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  Plus, 
  X, 
  Upload, 
  MapPin, 
  Phone, 
  Video, 
  User as UserIcon, 
  Activity, 
  Heart, 
  Thermometer, 
  Droplets, 
  User,
  Bell,
  Settings,
  BarChart3,
  Stethoscope,
  LogOut,
  Search,
  Mail,
  Wind,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const DoctorDashboard = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [doctorId, setDoctorId] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [selectedPatientName, setSelectedPatientName] = useState("");
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessageData, setSuccessMessageData] = useState<any>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateAppointmentData, setUpdateAppointmentData] = useState<any>(null);
  
  // Pending appointments (Not Approved) for notifications
  const [pendingAppointments, setPendingAppointments] = useState<any[]>([]);
  const [pendingAppointmentsLoading, setPendingAppointmentsLoading] = useState(false);
  const [showNotificationUpdateModal, setShowNotificationUpdateModal] = useState(false);
  const [notificationUpdateData, setNotificationUpdateData] = useState<any>(null);
  
  // Form data state for report upload
  const [formData, setFormData] = useState({
    heart_rate_bpm: "",
    pulse_bpm: "",
    spo2_percent: "",
    body_temp_c: "",
    ecg_signal_raw: "",
    ecg_rhythm_type: "Normal",
    systolic_bp: "",
    diastolic_bp: "",
    mean_bp: "",
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

  // Appointment form data
  const [appointmentFormData, setAppointmentFormData] = useState({
    patient_id: "",
    appointment_date_time: "",
    reason: "",
    mode: "in-person",
    location_link: "",
    things_to_bring: "",
    duration: "",
    notes_for_doctor: ""
  });

  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Handle Check Patient navigation
  const handleCheckPatient = (patient: any) => {
    const patientId = patient.patient_id || patient.id;
    router.push(`/dashboard/doctor/check-patient/${patientId}`);
  };

  useEffect(() => {
    fetchDoctorId();
  }, []);

  useEffect(() => {
    if (activeTab === "patients") {
      fetchPatients();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "appointments" && doctorId) {
      fetchAppointments();
    }
  }, [activeTab, doctorId]);

  useEffect(() => {
    if (activeTab === "notifications" && doctorId) {
      fetchPendingAppointments();
    }
  }, [activeTab, doctorId]);

  // Fetch appointments count for dashboard independently
  useEffect(() => {
    if (doctorId && activeTab === "dashboard") {
      fetchAppointments();
    }
  }, [doctorId, activeTab]);

  useEffect(() => {
    filterPatients();
  }, [searchQuery, patients]);

  const fetchDoctorId = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch doctor record to get doctor_id and name
        const { data: doctorData, error } = await supabase
          .from('doctor')
          .select('doctor_id, first_name, middle_name, last_name')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching doctor:', error);
        } else if (doctorData) {
          setDoctorId(doctorData.doctor_id);
          const fullName = `${doctorData.first_name} ${doctorData.middle_name ? doctorData.middle_name + ' ' : ''}${doctorData.last_name}`.trim();
          setDoctorName(fullName);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchPatients = async () => {
    setLoading(true);
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

  const fetchAppointments = async () => {
    if (!doctorId) return;
    
    setAppointmentLoading(true);
    try {
      console.log("Fetching appointments for doctor_id:", doctorId);
      
      // First get appointments
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from("appointments")
        .select("*")
        .eq("doctor_id", doctorId)
        .order("appointment_date_time", { ascending: true });

      if (appointmentsError) {
        console.error("Appointments query error:", appointmentsError);
        throw appointmentsError;
      }

      // Then get patient details for each appointment
      const appointmentsWithPatients = await Promise.all(
        (appointmentsData || []).map(async (appointment) => {
          const { data: patientData } = await supabase
            .from("users")
            .select("first_name, last_name, patient_id")
            .eq("patient_id", appointment.patient_id)
            .single();
          
          return {
            ...appointment,
            patient: patientData
          };
        })
      );
      
      console.log("Appointments with patient data:", appointmentsWithPatients);
      setAppointments(appointmentsWithPatients);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setAppointmentLoading(false);
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

  const handleUploadReport = (patientId: string, patientName: string) => {
    setSelectedPatientId(patientId);
    setSelectedPatientName(patientName);
    setShowReportModal(true);
    setFormData({
      heart_rate_bpm: "",
      pulse_bpm: "",
      spo2_percent: "",
      body_temp_c: "",
      ecg_signal_raw: "",
      ecg_rhythm_type: "Normal",
      systolic_bp: "",
      diastolic_bp: "",
      mean_bp: "",
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
      
      const { error: vitalsError } = await supabase
        .from('vitals_monitoring')
        .insert([vitalsData]);
      
      if (vitalsError) throw vitalsError;
      
      const { error: breathError } = await supabase
        .from('breath_analysis')
        .insert([breathData]);
      
      if (breathError) throw breathError;
      
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

  const handleAppointmentFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAppointmentFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateAppointment = (appointment: any) => {
    // Format datetime for datetime-local input
    const formattedDateTime = appointment.appointment_date_time 
      ? new Date(appointment.appointment_date_time).toISOString().slice(0, 16)
      : "";
    
    setUpdateAppointmentData({
      id: appointment.id,
      patient_id: appointment.patient_id,
      appointment_date_time: formattedDateTime,
      reason: appointment.reason || "",
      mode: appointment.mode,
      location_link: appointment.location_link || "",
      things_to_bring: appointment.things_to_bring || "",
      duration: appointment.duration ? appointment.duration.replace(' minutes', '') : "",
      notes_for_doctor: appointment.notes_for_doctor || ""
    });
    setShowUpdateModal(true);
    // Load patients for the form if not already loaded
    if (patients.length === 0) {
      fetchPatients();
    }
  };

  const handleUpdateFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdateAppointmentData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const updateData = {
        patient_id: updateAppointmentData.patient_id,
        appointment_date_time: updateAppointmentData.appointment_date_time,
        reason: updateAppointmentData.reason || null,
        mode: updateAppointmentData.mode,
        location_link: updateAppointmentData.location_link || null,
        things_to_bring: updateAppointmentData.things_to_bring || null,
        duration: updateAppointmentData.duration ? `${updateAppointmentData.duration} minutes` : null,
        notes_for_doctor: updateAppointmentData.notes_for_doctor || null
      };

      const { error } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', updateAppointmentData.id);

      if (error) {
        console.error('Update error:', error);
        alert(`Failed to update appointment: ${error.message}`);
        return;
      }

      setShowUpdateModal(false);
      fetchAppointments(); // Refresh appointments list
      alert('Appointment updated successfully!');
      
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment. Please try again.');
    }
  };

  // Fetch pending appointments for notifications
  const fetchPendingAppointments = async () => {
    if (!doctorId) return;
    
    setPendingAppointmentsLoading(true);
    try {
      const { data: pendingData, error: pendingError } = await supabase
        .from("appointments")
        .select("*")
        .eq("doctor_id", doctorId)
        .eq("status", "Not Approved")
        .order("created_at", { ascending: false });

      if (pendingError) {
        console.error("Pending appointments query error:", pendingError);
        throw pendingError;
      }

      // Get patient details for each pending appointment
      const pendingWithPatients = await Promise.all(
        (pendingData || []).map(async (appointment) => {
          const { data: patientData } = await supabase
            .from("users")
            .select("first_name, last_name, patient_id")
            .eq("patient_id", appointment.patient_id)
            .single();
          
          return {
            ...appointment,
            patient: patientData
          };
        })
      );
      
      setPendingAppointments(pendingWithPatients);
    } catch (error) {
      console.error("Error fetching pending appointments:", error);
    } finally {
      setPendingAppointmentsLoading(false);
    }
  };

  // Confirm/Schedule appointment
  const handleConfirmSchedule = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'scheduled' })
        .eq('id', appointmentId);

      if (error) {
        console.error('Error confirming appointment:', error);
        alert(`Failed to confirm appointment: ${error.message}`);
        return;
      }

      alert('Appointment confirmed and scheduled successfully!');
      fetchPendingAppointments(); // Refresh pending list
      fetchAppointments(); // Refresh main appointments list
      
    } catch (error) {
      console.error('Error confirming appointment:', error);
      alert('Failed to confirm appointment. Please try again.');
    }
  };

  // Handle notification update
  const handleNotificationUpdate = (appointment: any) => {
    const formattedDateTime = appointment.appointment_date_time 
      ? new Date(appointment.appointment_date_time).toISOString().slice(0, 16)
      : "";
    
    setNotificationUpdateData({
      id: appointment.id,
      patient_id: appointment.patient_id,
      appointment_date_time: formattedDateTime,
      reason: appointment.reason || "",
      mode: appointment.mode,
      location_link: appointment.location_link || "",
      things_to_bring: appointment.things_to_bring || "",
      duration: appointment.duration ? appointment.duration.replace(' minutes', '') : "",
      notes_for_doctor: appointment.notes_for_doctor || ""
    });
    setShowNotificationUpdateModal(true);
  };

  // Handle notification update form change
  const handleNotificationUpdateFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNotificationUpdateData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit notification update
  const handleSubmitNotificationUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const updateData = {
        appointment_date_time: notificationUpdateData.appointment_date_time,
        reason: notificationUpdateData.reason || null,
        mode: notificationUpdateData.mode,
        location_link: notificationUpdateData.location_link || null,
        things_to_bring: notificationUpdateData.things_to_bring || null,
        duration: notificationUpdateData.duration ? `${notificationUpdateData.duration} minutes` : null,
        notes_for_doctor: notificationUpdateData.notes_for_doctor || null,
        status: 'scheduled' // Set to scheduled when updating from notifications
      };

      const { error } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', notificationUpdateData.id);

      if (error) {
        console.error('Update error:', error);
        alert(`Failed to update appointment: ${error.message}`);
        return;
      }

      setShowNotificationUpdateModal(false);
      fetchPendingAppointments(); // Refresh pending list
      fetchAppointments(); // Refresh main appointments list
      alert('Appointment updated and scheduled successfully!');
      
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment. Please try again.');
    }
  };

  const handleCreateAppointment = () => {
    setShowAppointmentModal(true);
    setAppointmentFormData({
      patient_id: "",
      appointment_date_time: "",
      reason: "",
      mode: "in-person",
      location_link: "",
      things_to_bring: "",
      duration: "",
      notes_for_doctor: ""
    });
    // Load patients for the form if not already loaded
    if (patients.length === 0) {
      fetchPatients();
    }
  };

  const handleSubmitAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Fetch doctor_id directly from doctor table
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please log in again.');
        return;
      }

      const { data: doctorData, error: doctorError } = await supabase
        .from('doctor')
        .select('doctor_id')
        .eq('id', user.id)
        .single();

      if (doctorError || !doctorData) {
        alert('Doctor profile not found. Please contact support.');
        return;
      }
      
      if (!appointmentFormData.patient_id) {
        alert('Please select a patient.');
        return;
      }
      
      if (!appointmentFormData.appointment_date_time) {
        alert('Please select appointment date and time.');
        return;
      }

      const selectedPatient = patients.find(p => p.id === appointmentFormData.patient_id);
      const patientId = selectedPatient?.patient_id || selectedPatient?.id;

      const appointmentData = {
        patient_id: patientId,
        doctor_id: doctorData.doctor_id,
        appointment_date_time: appointmentFormData.appointment_date_time,
        reason: appointmentFormData.reason,
        mode: appointmentFormData.mode,
        location_link: appointmentFormData.location_link,
        things_to_bring: appointmentFormData.things_to_bring,
        duration: appointmentFormData.duration ? `${appointmentFormData.duration} minutes` : null,
        notes_for_doctor: appointmentFormData.notes_for_doctor,
        status: 'scheduled'
      };

      console.log('Attempting to insert appointment data:', appointmentData);

      const { data, error } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select();

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        alert(`Failed to create appointment: ${error.message}`);
        return;
      }

      console.log('Appointment created successfully:', data);
      
      // Show success message with appointment details
      setSuccessMessageData({
        patientName: selectedPatient ? `${selectedPatient.first_name} ${selectedPatient.last_name}` : 'Unknown Patient',
        appointmentDate: new Date(appointmentFormData.appointment_date_time).toLocaleDateString(),
        appointmentTime: new Date(appointmentFormData.appointment_date_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        reason: appointmentFormData.reason || 'General Consultation'
      });
      setShowSuccessMessage(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      
      setShowAppointmentModal(false);
      fetchAppointments(); // Refresh appointments list
      
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Failed to create appointment. Please try again.');
    }
  };

  const formatAppointmentDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'no-show': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
          <span className="font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {doctorName ? `Dr. ${doctorName}` : "Dr. Loading..."}
          </span>
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
            {/* Dashboard */}
            <div 
              className={`flex items-center cursor-pointer hover:text-blue-700 transition-colors duration-200 ${
                activeTab === "dashboard" ? "text-blue-600" : "text-gray-600 hover:text-black"
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Dashboard</span>
            </div>

            {/* Appointments */}
            <div 
              className={`flex items-center cursor-pointer hover:text-blue-700 transition-colors duration-200 ${
                activeTab === "appointments" ? "text-blue-600" : "text-gray-600 hover:text-black"
              }`}
              onClick={() => setActiveTab("appointments")}
            >
              <Calendar className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Appointments</span>
            </div>

            {/* Patients */}
            <div 
              className={`flex items-center cursor-pointer hover:text-blue-700 transition-colors duration-200 ${
                activeTab === "patients" ? "text-blue-600" : "text-gray-600 hover:text-black"
              }`}
              onClick={() => setActiveTab("patients")}
            >
              <Users className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Patients</span>
            </div>

            {/* Medical Records */}
            <div 
              className={`flex items-center cursor-pointer hover:text-blue-700 transition-colors duration-200 ${
                activeTab === "records" ? "text-blue-600" : "text-gray-600 hover:text-black"
              }`}
              onClick={() => setActiveTab("records")}
            >
              <FileText className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Medical Records</span>
            </div>

            {/* Notifications */}
            <div 
              className={`flex items-center cursor-pointer hover:text-blue-700 transition-colors duration-200 ${
                activeTab === "notifications" ? "text-blue-600" : "text-gray-600 hover:text-black"
              }`}
              onClick={() => setActiveTab("notifications")}
            >
              <Bell className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Notifications</span>
            </div>

            {/* Settings */}
            <div 
              className={`flex items-center cursor-pointer hover:text-blue-700 transition-colors duration-200 ${
                activeTab === "settings" ? "text-blue-600" : "text-gray-600 hover:text-black"
              }`}
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Settings</span>
            </div>
          </nav>
        </div>
      </div>
      
      <div className="pt-32 px-6">
        {/* Render content based on active tab */}
        {activeTab === "dashboard" && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Doctor Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, Dr. Smith. Here's your comprehensive overview for today.
              </p>
            </div>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card 
                className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setActiveTab("appointments")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-800">
                    Total Appointments
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900">{appointments.length}</div>
                  <p className="text-xs text-blue-600">Click to manage</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-800">
                    Total Patients
                  </CardTitle>
                  <Users className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900">156</div>
                  <p className="text-xs text-green-600">+12 this month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-orange-800">
                    Pending Reports
                  </CardTitle>
                  <FileText className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-900">8</div>
                  <p className="text-xs text-orange-600">-3 from yesterday</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-800">
                    Hours Worked
                  </CardTitle>
                  <Clock className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900">6.5</div>
                  <p className="text-xs text-purple-600">Today's hours</p>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Recent Appointments */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center text-black">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    Today's Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(() => {
                      const today = new Date().toDateString();
                      const todayAppointments = appointments.filter(apt => 
                        new Date(apt.appointment_date_time).toDateString() === today
                      );
                      
                      if (todayAppointments.length === 0) {
                        return (
                          <div className="text-center py-8">
                            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No appointments scheduled for today</p>
                          </div>
                        );
                      }
                      
                      return todayAppointments.slice(0, 3).map((appointment) => {
                        const appointmentTime = new Date(appointment.appointment_date_time);
                        const now = new Date();
                        const isPast = appointmentTime < now;
                        const isUpcoming = appointmentTime > now;
                        
                        return (
                          <div key={appointment.id} className={`flex items-center justify-between p-3 rounded-lg border ${
                            isPast ? 'bg-green-50 border-green-200' : 
                            isUpcoming ? 'bg-yellow-50 border-yellow-200' : 
                            'bg-blue-50 border-blue-200'
                          }`}>
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                isPast ? 'bg-green-500' : 
                                isUpcoming ? 'bg-yellow-500' : 
                                'bg-blue-500'
                              }`}></div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {appointment.patient ? `${appointment.patient.first_name} ${appointment.patient.last_name}` : 'Unknown Patient'} - {appointmentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {appointment.reason || 'General consultation'} • {appointment.mode}
                                </p>
                              </div>
                            </div>
                            {isPast ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : isUpcoming ? (
                              <Clock className="w-4 h-4 text-yellow-600" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-black">
                    <Activity className="w-5 h-5 mr-2 text-purple-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <button 
                      className="w-full p-3 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-center bg-white"
                      onClick={() => setActiveTab("appointments")}
                    >
                      <Calendar className="w-4 h-4 mr-3 text-blue-600" />
                      <span className="text-sm text-black font-medium">Schedule Appointment</span>
                    </button>
                    <button className="w-full p-3 border border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors flex items-center bg-white">
                      <FileText className="w-4 h-4 mr-3 text-green-600" />
                      <span className="text-sm text-black font-medium">View Reports</span>
                    </button>
                    <button 
                      className="w-full p-3 border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors flex items-center bg-white"
                      onClick={() => setActiveTab("patients")}
                    >
                      <Users className="w-4 h-4 mr-3 text-purple-600" />
                      <span className="text-sm text-black font-medium">Manage Patients</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Health Metrics Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-black">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Patient Health Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Average Heart Rate</span>
                      <span className="text-sm font-medium text-green-600">72 BPM ↑</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Blood Pressure Control</span>
                      <span className="text-sm font-medium text-blue-600">85% Normal ↑</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Breath Analysis Quality</span>
                      <span className="text-sm font-medium text-purple-600">92% Accurate ↑</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: "92%" }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-black">
                    <Heart className="w-5 h-5 mr-2 text-red-600" />
                    Critical Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-800">High BP Alert</p>
                        <p className="text-xs text-red-600">Patient ID: P-1234 • 2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-yellow-800">Irregular ECG</p>
                        <p className="text-xs text-yellow-600">Patient ID: P-5678 • 4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800">All Systems Normal</p>
                        <p className="text-xs text-green-600">Last checked: 30 minutes ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === "patients" && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-black mb-2">
                Patient Management
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

              {loading ? (
                <Card>
                  <CardContent className="py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-4 text-black">Loading patients...</p>
                    </div>
                  </CardContent>
                </Card>
              ) : filteredPatients.length === 0 ? (
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
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-black">
                                Patient ID: {patient.patient_id || "Not assigned"}
                              </span>
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-black">
                                {getPatientDisplayName(patient)}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <button
                              onClick={() => handleCheckPatient(patient)}
                              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <User className="w-4 h-4" />
                              <span className="text-sm font-medium">Check Patient</span>
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
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <div>
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-black mb-2">
                  Appointments Management
                </h1>
                <p className="text-black">
                  Manage and schedule patient appointments
                </p>
              </div>
              <button
                onClick={handleCreateAppointment}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Create Appointment</span>
              </button>
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-black">
                  All Appointments ({appointments.length})
                </h2>
              </div>

              {appointmentLoading ? (
                <Card>
                  <CardContent className="py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-4 text-black">Loading appointments...</p>
                    </div>
                  </CardContent>
                </Card>
              ) : appointments.length === 0 ? (
                <Card>
                  <CardContent className="py-8">
                    <div className="text-center">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-black font-medium">No appointments scheduled</p>
                      <p className="text-gray-500 text-sm">Create your first appointment to get started</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {appointments.map((appointment) => (
                    <Card key={appointment.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            {/* Patient Info */}
                            <div className="flex items-center space-x-3">
                              <User className="w-5 h-5 text-blue-600" />
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {appointment.patient ? `${appointment.patient.first_name} ${appointment.patient.last_name}` : 'Unknown Patient'}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Patient ID: {appointment.patient?.patient_id || appointment.patient_id}
                                </p>
                              </div>
                            </div>

                            {/* Date & Time */}
                            <div className="flex items-center space-x-3">
                              <Calendar className="w-5 h-5 text-green-600" />
                              <div>
                                <p className="font-medium text-gray-900">
                                  {formatAppointmentDateTime(appointment.appointment_date_time)}
                                </p>
                                {appointment.duration && (
                                  <p className="text-sm text-gray-600">
                                    Duration: {appointment.duration}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Reason */}
                            {appointment.reason && (
                              <div className="flex items-start space-x-3">
                                <FileText className="w-5 h-5 text-purple-600 mt-0.5" />
                                <div>
                                  <p className="font-medium text-gray-900">Reason</p>
                                  <p className="text-sm text-gray-600">{appointment.reason}</p>
                                </div>
                              </div>
                            )}

                            {/* Mode & Location */}
                            <div className="flex items-center space-x-6">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-sm font-medium text-gray-700 capitalize">
                                  {appointment.mode}
                                </span>
                              </div>
                              {appointment.location_link && appointment.mode === 'online' && (
                                <a
                                  href={appointment.location_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                                >
                                  Join Meeting
                                </a>
                              )}
                              {appointment.location_link && appointment.mode === 'phone' && (
                                <div className="text-sm text-gray-700">
                                  <span className="font-medium">Phone: </span>
                                  <a href={`tel:${appointment.location_link}`} className="text-blue-600 hover:text-blue-800">
                                    {appointment.location_link}
                                  </a>
                                </div>
                              )}
                            </div>

                            {/* Things to Bring */}
                            {appointment.things_to_bring && (
                              <div className="flex items-start space-x-3">
                                <Bell className="w-5 h-5 text-orange-600 mt-0.5" />
                                <div>
                                  <p className="font-medium text-gray-900">Things to Bring</p>
                                  <p className="text-sm text-gray-600">{appointment.things_to_bring}</p>
                                </div>
                              </div>
                            )}

                            {/* Notes */}
                            {appointment.notes_for_doctor && (
                              <div className="flex items-start space-x-3">
                                <FileText className="w-5 h-5 text-gray-600 mt-0.5" />
                                <div>
                                  <p className="font-medium text-gray-900">Notes</p>
                                  <p className="text-sm text-gray-600">{appointment.notes_for_doctor}</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Status Badge */}
                          <div className="flex-shrink-0">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Update Button - positioned at bottom right */}
                        <div className="flex justify-end mt-4">
                          <button
                            onClick={() => handleUpdateAppointment(appointment)}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Update
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "records" && (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Medical Records</h2>
            <p className="text-gray-600">Medical records management coming soon...</p>
          </div>
        )}

        {activeTab === "notifications" && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Appointment Requests
              </h1>
              <p className="text-gray-600">
                Review and manage pending appointment requests from patients.
              </p>
            </div>

            {pendingAppointmentsLoading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading appointment requests...</p>
              </div>
            ) : pendingAppointments.length === 0 ? (
              <div className="text-center py-20">
                <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Pending Requests</h2>
                <p className="text-gray-600">All appointment requests have been processed.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pendingAppointments.map((appointment) => {
                  const appointmentTime = new Date(appointment.appointment_date_time);
                  const patientName = appointment.patient 
                    ? `${appointment.patient.first_name} ${appointment.patient.last_name}` 
                    : 'Unknown Patient';
                  
                  return (
                    <Card key={appointment.id} className="border-l-4 border-l-orange-400 bg-gradient-to-br from-orange-50 to-white">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between text-black">
                          <span className="flex items-center">
                            <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
                            New Appointment Request
                          </span>
                          <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                            Pending Approval
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Patient Info */}
                        <div className="p-3 bg-white rounded-lg border">
                          <div className="flex items-center gap-3 mb-2">
                            <UserIcon className="w-5 h-5 text-blue-600" />
                            <div>
                              <h4 className="font-semibold text-black">{patientName}</h4>
                              <p className="text-sm text-gray-600">Patient ID: {appointment.patient_id}</p>
                            </div>
                          </div>
                        </div>

                        {/* Appointment Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span className="text-black">{appointmentTime.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="text-black">{appointmentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {appointment.mode === 'online' ? <Video className="w-4 h-4 text-green-600" /> : 
                             appointment.mode === 'phone' ? <Phone className="w-4 h-4 text-purple-600" /> : 
                             <MapPin className="w-4 h-4 text-red-600" />}
                            <span className="text-black capitalize">{appointment.mode}</span>
                          </div>
                          {appointment.duration && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-600" />
                              <span className="text-black">{appointment.duration}</span>
                            </div>
                          )}
                        </div>

                        {/* Reason */}
                        {appointment.reason && (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <h5 className="font-medium text-black mb-1">Reason for Visit:</h5>
                            <p className="text-sm text-gray-700">{appointment.reason}</p>
                          </div>
                        )}

                        {/* Additional Details */}
                        {(appointment.things_to_bring || appointment.notes_for_doctor || appointment.location_link) && (
                          <div className="space-y-2">
                            {appointment.things_to_bring && (
                              <div>
                                <h6 className="font-medium text-black text-sm">Things to Bring:</h6>
                                <p className="text-sm text-gray-600">{appointment.things_to_bring}</p>
                              </div>
                            )}
                            {appointment.notes_for_doctor && (
                              <div>
                                <h6 className="font-medium text-black text-sm">Additional Notes:</h6>
                                <p className="text-sm text-gray-600">{appointment.notes_for_doctor}</p>
                              </div>
                            )}
                            {appointment.location_link && (
                              <div>
                                <h6 className="font-medium text-black text-sm">Contact Info:</h6>
                                <p className="text-sm text-blue-600">{appointment.location_link}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-3 border-t">
                          <button
                            onClick={() => handleConfirmSchedule(appointment.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Confirm Schedule
                          </button>
                          <button
                            onClick={() => handleNotificationUpdate(appointment)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <FileText className="w-4 h-4" />
                            Update
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="text-center py-20">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
            <p className="text-gray-600">Settings panel coming soon...</p>
          </div>
        )}
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

      {/* Create Appointment Modal */}
      {showAppointmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white/95 backdrop-blur-sm p-6 shadow-xl border border-gray-200">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Create New Appointment
              </h2>
              <button
                onClick={() => setShowAppointmentModal(false)}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitAppointment} className="space-y-6">
              {/* Patient Selection */}
              <div>
                <label htmlFor="patient_id" className="mb-1 block text-sm font-medium text-gray-700">
                  Select Patient *
                </label>
                <select
                  id="patient_id"
                  name="patient_id"
                  value={appointmentFormData.patient_id}
                  onChange={handleAppointmentFormChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Choose a patient...</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {getPatientDisplayName(patient)} - {patient.patient_id || patient.id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date and Time */}
              <div>
                <label htmlFor="appointment_date_time" className="mb-1 block text-sm font-medium text-gray-700">
                  Appointment Date & Time *
                </label>
                <input
                  type="datetime-local"
                  id="appointment_date_time"
                  name="appointment_date_time"
                  value={appointmentFormData.appointment_date_time}
                  onChange={handleAppointmentFormChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Reason */}
              <div>
                <label htmlFor="reason" className="mb-1 block text-sm font-medium text-gray-700">
                  Reason for Visit
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={appointmentFormData.reason}
                  onChange={handleAppointmentFormChange}
                  placeholder="e.g., Regular checkup, Follow-up consultation, etc."
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                />
              </div>

              {/* Mode */}
              <div>
                <label htmlFor="mode" className="mb-1 block text-sm font-medium text-gray-700">
                  Appointment Mode *
                </label>
                <select
                  id="mode"
                  name="mode"
                  value={appointmentFormData.mode}
                  onChange={handleAppointmentFormChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
                >
                  <option value="in-person">In-Person</option>
                  <option value="online">Online</option>
                  <option value="phone">Phone</option>
                </select>
              </div>

              {/* Location/Link */}
              {(appointmentFormData.mode === 'online' || appointmentFormData.mode === 'phone') && (
                <div>
                  <label htmlFor="location_link" className="mb-1 block text-sm font-medium text-gray-700">
                    {appointmentFormData.mode === 'online' ? 'Meeting Link' : 'Phone Number'}
                  </label>
                  <input
                    type={appointmentFormData.mode === 'online' ? 'url' : 'tel'}
                    id="location_link"
                    name="location_link"
                    value={appointmentFormData.location_link}
                    onChange={handleAppointmentFormChange}
                    placeholder={appointmentFormData.mode === 'online' ? 'https://meet.google.com/...' : '+1234567890'}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                  />
                </div>
              )}

              {/* Duration */}
              <div>
                <label htmlFor="duration" className="mb-1 block text-sm font-medium text-gray-700">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={appointmentFormData.duration}
                  onChange={handleAppointmentFormChange}
                  placeholder="30"
                  min="15"
                  max="180"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                />
              </div>

              {/* Things to Bring */}
              <div>
                <label htmlFor="things_to_bring" className="mb-1 block text-sm font-medium text-gray-700">
                  Things to Bring
                </label>
                <textarea
                  id="things_to_bring"
                  name="things_to_bring"
                  value={appointmentFormData.things_to_bring}
                  onChange={handleAppointmentFormChange}
                  placeholder="e.g., Previous test reports, insurance card, medications list"
                  rows={2}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                />
              </div>

              {/* Notes for Doctor */}
              <div>
                <label htmlFor="notes_for_doctor" className="mb-1 block text-sm font-medium text-gray-700">
                  Additional Notes
                </label>
                <textarea
                  id="notes_for_doctor"
                  name="notes_for_doctor"
                  value={appointmentFormData.notes_for_doctor}
                  onChange={handleAppointmentFormChange}
                  placeholder="Any additional information or special instructions"
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAppointmentModal(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Create Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Message Popup */}
      {showSuccessMessage && successMessageData && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-right-5 duration-300">
          <Card className="bg-green-50 border-green-200 shadow-lg max-w-sm">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">Appointment Created!</h4>
                  <div className="text-sm text-green-700 mt-1">
                    <p><strong>Patient:</strong> {successMessageData.patientName}</p>
                    <p><strong>Date:</strong> {successMessageData.appointmentDate}</p>
                    <p><strong>Time:</strong> {successMessageData.appointmentTime}</p>
                    <p><strong>Reason:</strong> {successMessageData.reason}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notification Update Modal */}
      {showNotificationUpdateModal && notificationUpdateData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white/95 backdrop-blur-sm p-6 shadow-xl border border-gray-200">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Update Appointment Request
              </h2>
              <button
                onClick={() => setShowNotificationUpdateModal(false)}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitNotificationUpdate} className="space-y-6">
              {/* Date and Time */}
              <div>
                <label htmlFor="appointment_date_time" className="mb-1 block text-sm font-medium text-gray-700">
                  Appointment Date & Time *
                </label>
                <input
                  type="datetime-local"
                  id="appointment_date_time"
                  name="appointment_date_time"
                  value={notificationUpdateData.appointment_date_time}
                  onChange={handleNotificationUpdateFormChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Reason */}
              <div>
                <label htmlFor="reason" className="mb-1 block text-sm font-medium text-gray-700">
                  Reason for Visit
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={notificationUpdateData.reason}
                  onChange={handleNotificationUpdateFormChange}
                  placeholder="e.g., Regular checkup, Follow-up consultation, etc."
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                />
              </div>

              {/* Mode */}
              <div>
                <label htmlFor="mode" className="mb-1 block text-sm font-medium text-gray-700">
                  Appointment Mode *
                </label>
                <select
                  id="mode"
                  name="mode"
                  value={notificationUpdateData.mode}
                  onChange={handleNotificationUpdateFormChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
                >
                  <option value="in-person">In-Person</option>
                  <option value="online">Online</option>
                  <option value="phone">Phone</option>
                </select>
              </div>

              {/* Location/Link */}
              {(notificationUpdateData.mode === 'online' || notificationUpdateData.mode === 'phone') && (
                <div>
                  <label htmlFor="location_link" className="mb-1 block text-sm font-medium text-gray-700">
                    {notificationUpdateData.mode === 'online' ? 'Meeting Link' : 'Phone Number'}
                  </label>
                  <input
                    type={notificationUpdateData.mode === 'online' ? 'url' : 'tel'}
                    id="location_link"
                    name="location_link"
                    value={notificationUpdateData.location_link}
                    onChange={handleNotificationUpdateFormChange}
                    placeholder={notificationUpdateData.mode === 'online' ? 'https://meet.google.com/...' : '+1234567890'}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                  />
                </div>
              )}

              {/* Duration */}
              <div>
                <label htmlFor="duration" className="mb-1 block text-sm font-medium text-gray-700">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={notificationUpdateData.duration}
                  onChange={handleNotificationUpdateFormChange}
                  placeholder="30"
                  min="15"
                  max="180"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                />
              </div>

              {/* Things to Bring */}
              <div>
                <label htmlFor="things_to_bring" className="mb-1 block text-sm font-medium text-gray-700">
                  Things to Bring
                </label>
                <textarea
                  id="things_to_bring"
                  name="things_to_bring"
                  value={notificationUpdateData.things_to_bring}
                  onChange={handleNotificationUpdateFormChange}
                  placeholder="e.g., Previous test reports, insurance card, medications list"
                  rows={2}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                />
              </div>

              {/* Notes for Doctor */}
              <div>
                <label htmlFor="notes_for_doctor" className="mb-1 block text-sm font-medium text-gray-700">
                  Additional Notes
                </label>
                <textarea
                  id="notes_for_doctor"
                  name="notes_for_doctor"
                  value={notificationUpdateData.notes_for_doctor}
                  onChange={handleNotificationUpdateFormChange}
                  placeholder="Any additional information or special instructions"
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNotificationUpdateModal(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Update & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Appointment Modal */}
      {showUpdateModal && updateAppointmentData && (
        <div className="fixed inset-0 bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Update Appointment</h2>
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Select Patient *
                  </label>
                  <select
                    name="patient_id"
                    value={updateAppointmentData.patient_id}
                    onChange={handleUpdateFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  >
                    <option value="">Choose a patient...</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {getPatientDisplayName(patient)} - {patient.patient_id || patient.id}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="appointment_date_time"
                    value={updateAppointmentData.appointment_date_time}
                    onChange={handleUpdateFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Reason for Visit
                  </label>
                  <textarea
                    name="reason"
                    value={updateAppointmentData.reason}
                    onChange={handleUpdateFormChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Enter reason for appointment"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Appointment Mode *
                  </label>
                  <select
                    name="mode"
                    value={updateAppointmentData.mode}
                    onChange={handleUpdateFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  >
                    <option value="in-person">In-Person</option>
                    <option value="online">Online</option>
                    <option value="phone">Phone</option>
                  </select>
                </div>

                {(updateAppointmentData.mode === 'online' || updateAppointmentData.mode === 'phone') && (
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      {updateAppointmentData.mode === 'online' ? 'Meeting Link' : 'Phone Number'}
                    </label>
                    <input
                      type={updateAppointmentData.mode === 'online' ? 'url' : 'tel'}
                      name="location_link"
                      value={updateAppointmentData.location_link}
                      onChange={handleUpdateFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      placeholder={updateAppointmentData.mode === 'online' ? 'https://meet.google.com/...' : '+1234567890'}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={updateAppointmentData.duration}
                    onChange={handleUpdateFormChange}
                    min="15"
                    max="180"
                    step="15"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Things to Bring
                  </label>
                  <textarea
                    name="things_to_bring"
                    value={updateAppointmentData.things_to_bring}
                    onChange={handleUpdateFormChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Medical records, insurance card, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Notes for Doctor
                  </label>
                  <textarea
                    name="notes_for_doctor"
                    value={updateAppointmentData.notes_for_doctor}
                    onChange={handleUpdateFormChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Any additional notes or special instructions"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUpdateModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Update Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
