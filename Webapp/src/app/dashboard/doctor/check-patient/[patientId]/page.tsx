"use client";

import React, { useState, useEffect } from "react";
import { createBrowserClient } from '@supabase/ssr';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Heart, 
  Activity, 
  Thermometer, 
  Droplets, 
  Wind, 
  FileText, 
  Plus, 
  Trash2, 
  X,
  Maximize2,
  ArrowLeft,
  Pill
} from "lucide-react";
import { useRouter, useParams } from 'next/navigation';

interface PatientData {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  country: string;
  user_contact?: string;
  emergency_contact?: string;
  medical_history?: string;
  address: string;
  patient_id: string;
  created_at: string;
}

interface VitalData {
  id: number;
  heart_rate_bpm?: number;
  pulse_bpm?: number;
  spo2_percent?: number;
  body_temp_c?: number;
  systolic_bp?: number;
  diastolic_bp?: number;
  mean_bp?: number;
  recorded_at: string;
}

interface BreathData {
  id: number;
  ammonia_ppm?: number;
  co2_ppm_mq?: number;
  benzene_ppm?: number;
  co2_ppm_mhz19?: number;
  ethanol_ppm?: number;
  vocs_ppm_mics?: number;
  acetone_ppm_qcm?: number;
  voc_type_chemo?: string;
  voc_value_ppm_chemo?: number;
  recorded_at: string;
}

interface AppointmentData {
  id: string;
  appointment_date_time: string;
  status: string;
  reason?: string;
  mode: string;
  location_link?: string;
  duration?: string;
  notes_for_doctor?: string;
  doctor_notes?: string;
}

const CheckPatientPage = () => {
  const router = useRouter();
  const params = useParams();
  const patientId = params.patientId as string;

  const [patient, setPatient] = useState<PatientData | null>(null);
  const [vitals, setVitals] = useState<VitalData[]>([]);
  const [breathAnalysis, setBreathAnalysis] = useState<BreathData[]>([]);
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [medicines, setMedicines] = useState([{
    medicine_name: "",
    dose: "",
    frequency: "Once a day",
    duration: "",
    instructions: ""
  }]);
  const [doctorNotes, setDoctorNotes] = useState("");
  const [prediction, setPrediction] = useState<any>(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
      fetchDoctorId();
      fetchPrediction();
    }
  }, [patientId]);

  const fetchDoctorId = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: doctorData } = await supabase
          .from('doctor')
          .select('doctor_id')
          .eq('id', user.id)
          .single();
        
        if (doctorData) {
          setDoctorId(doctorData.doctor_id);
        }
      }
    } catch (error) {
      console.error('Error fetching doctor ID:', error);
    }
  };

  const fetchPrediction = async () => {
    setPredictionLoading(true);
    try {
      const response = await fetch(`/api/patients/${patientId}/prediction`);
      const result = await response.json();
      
      if (result.success) {
        setPrediction(result.data);
      } else {
        console.error('Prediction API error:', result.error);
      }
    } catch (error) {
      console.error('Error fetching prediction:', error);
    } finally {
      setPredictionLoading(false);
    }
  };

  const fetchPatientData = async () => {
    setLoading(true);
    try {
      // Fetch patient basic information
      const { data: patientData, error: patientError } = await supabase
        .from('users')
        .select('*')
        .eq('patient_id', patientId)
        .single();

      if (patientError) throw patientError;
      setPatient(patientData);

      // Fetch vitals monitoring data
      const { data: vitalsData, error: vitalsError } = await supabase
        .from('vitals_monitoring')
        .select('*')
        .eq('patient_id', patientId)
        .order('recorded_at', { ascending: false });

      if (vitalsError) {
        console.error('Vitals error:', vitalsError);
      } else {
        setVitals(vitalsData || []);
      }

      // Fetch breath analysis data
      const { data: breathData, error: breathError } = await supabase
        .from('breath_analysis')
        .select('*')
        .eq('patient_id', patientId)
        .order('recorded_at', { ascending: false });

      if (breathError) {
        console.error('Breath analysis error:', breathError);
      } else {
        setBreathAnalysis(breathData || []);
      }

      // Fetch appointments
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId)
        .order('appointment_date_time', { ascending: false });

      if (appointmentsError) {
        console.error('Appointments error:', appointmentsError);
      } else {
        setAppointments(appointmentsData || []);
      }

    } catch (error: any) {
      console.error('Error fetching patient data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMonthYear = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  // Group medical history by month
  const groupByMonth = (data: any[], dateField: string) => {
    const grouped: { [key: string]: any[] } = {};
    data.forEach(item => {
      const monthYear = getMonthYear(item[dateField]);
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(item);
    });
    return grouped;
  };

  // Simple markdown renderer for medical text
  const renderMarkdown = (text: string): string => {
    if (!text) return '';

    // helper to format inline emphasis inside cells
    const inlineFormat = (s: string) =>
      s
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-black">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-gray-100 text-gray-800">$1</code>');

    // First pass: convert markdown tables to HTML tables
    const lines = text.split('\n');
    let i = 0;
    let built = '';
    while (i < lines.length) {
      const line = lines[i];
      const next = lines[i + 1] ?? '';
      const isTableStart = /\|/.test(line) && /^\s*\|?\s*:?-{3,}/.test(next);
      if (isTableStart) {
        const headerLine = line.trim();
        const alignLine = next.trim();
        i += 2;
        const rows: string[] = [];
        while (i < lines.length && /\|/.test(lines[i]) && lines[i].trim() !== '') {
          rows.push(lines[i].trim());
          i++;
        }

        const headers = headerLine
          .split('|')
          .map((h) => h.trim())
          .filter((h) => h.length > 0);

        const body = rows.map((r) =>
          r
            .split('|')
            .map((c) => c.trim())
            .filter((c) => c.length > 0)
        );

        // Build table HTML
        let tableHtml = '<div class="overflow-x-auto"><table class="w-full text-sm text-left border-collapse">';
        tableHtml += '<thead class="bg-gray-100">\n<tr>';
        tableHtml += headers
          .map((h) => `<th class="px-4 py-2 font-semibold text-black border-b">${inlineFormat(h)}</th>`)
          .join('');
        tableHtml += '</tr>\n</thead>';
        tableHtml += '<tbody class="divide-y">';
        tableHtml += body
          .map((row) =>
            '<tr>' +
            row
              .map((c) => `<td class="px-4 py-2 text-black align-top">${inlineFormat(c)}</td>`) 
              .join('') +
            '</tr>'
          )
          .join('');
        tableHtml += '</tbody></table></div>';

        built += tableHtml + '\n';
        continue;
      }

      // Non-table lines preserved for second-pass formatting
      built += line + '\n';
      i++;
    }

    // Second pass: headers, lists, blockquotes, paragraphs on the built string
    let html = built
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-black mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-black mt-4 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-black mt-4 mb-3">$1</h1>')

      // Bold and Italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-black">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')

      // Lists
      .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc text-black">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-black">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal text-black">$1</li>')

      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-purple-300 pl-4 italic text-gray-700 my-2">$1</blockquote>');

    // Paragraph/line breaks, but avoid wrapping existing block elements
    html = html
      .split('\n\n')
      .map((block) => {
        const trimmed = block.trim();
        if (!trimmed) return '';
        if (/^\s*<\/?(h\d|ul|ol|li|table|blockquote|div)/.test(trimmed)) return trimmed;
        return `<p class="mb-2 text-black">${trimmed.replace(/\n/g, '<br/>')}</p>`;
      })
      .join('');

    return html;
  };

  // Medicine form handlers
  const handleMedicineChange = (index: number, field: string, value: string) => {
    const updatedMedicines = medicines.map((medicine, i) => 
      i === index ? { ...medicine, [field]: value } : medicine
    );
    setMedicines(updatedMedicines);
  };

  const addMedicine = () => {
    setMedicines([...medicines, {
      medicine_name: "",
      dose: "",
      frequency: "Once a day",
      duration: "",
      instructions: ""
    }]);
  };

  const removeMedicine = (index: number) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter((_, i) => i !== index));
    }
  };

  const handleSubmitPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!doctorId) {
      alert('Doctor ID not found');
      return;
    }

    try {
      const prescriptionData = {
        doctor_id: doctorId,
        patient_id: patientId,
        medicines: JSON.stringify(medicines),
        description: doctorNotes || null
      };

      const { data, error } = await supabase
        .from('prescriptions')
        .insert(prescriptionData)
        .select();

      if (error) {
        console.error('Error creating prescription:', error);
        alert('Failed to create prescription: ' + error.message);
        return;
      }

      console.log('Prescription created successfully:', data);
      alert('Prescription submitted successfully!');
      
      // Reset form
      setMedicines([{
        medicine_name: "",
        dose: "",
        frequency: "Once a day",
        duration: "",
        instructions: ""
      }]);
      setDoctorNotes("");
      setShowPrescriptionModal(false);

    } catch (error: any) {
      console.error('Error submitting prescription:', error);
      alert('Failed to submit prescription');
    }
  };

  const vitalsGrouped = groupByMonth(vitals, 'recorded_at');
  const breathGrouped = groupByMonth(breathAnalysis, 'recorded_at');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Patient not found'}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowPrescriptionModal(true)}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Pill className="w-4 h-4" />
                <span>Give Prescription</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Information */}
          <div className="lg:col-span-1">
            <Card className="h-full shadow-lg bg-gradient-to-br from-white via-gray-50 to-gray-100 border-0 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-black">
                  <User className="w-5 h-5 text-blue-500" />
                  <span>Patient Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-black">Full Name</p>
                      <p className="text-sm text-black">
                        {patient.first_name} {patient.middle_name} {patient.last_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-black">Date of Birth</p>
                      <p className="text-sm text-black">{formatDate(patient.date_of_birth)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-black">Gender</p>
                      <p className="text-sm text-black">{patient.gender}</p>
                    </div>
                  </div>
                  {patient.user_contact && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-black">Phone</p>
                        <p className="text-sm text-black">{patient.user_contact}</p>
                      </div>
                    </div>
                  )}
                  {patient.emergency_contact && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-red-500" />
                      <div>
                        <p className="text-sm font-medium text-black">Emergency Contact</p>
                        <p className="text-sm text-black">{patient.emergency_contact}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-black">Country</p>
                      <p className="text-sm text-black">{patient.country}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Health Prediction */}
          <div className="lg:col-span-1">
            <Card className="h-full shadow-lg bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 border-0 backdrop-blur-sm relative">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-black">
                  <Activity className="w-5 h-5 text-purple-500" />
                  <span>AI Health Prediction</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-16">
                {predictionLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <span className="ml-3 text-black">Analyzing health data...</span>
                  </div>
                ) : prediction ? (
                  <div className="space-y-4">
                    <div className="bg-white/70 rounded-lg p-4 max-h-80 overflow-y-auto">
                      <h4 className="font-semibold text-black mb-3">Risk Assessment</h4>
                      <div 
                        className="text-sm text-black leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(prediction.risk_assessment) }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t">
                      <div className="text-xs text-gray-600">
                        {prediction.cached ? 'Cached' : 'Fresh'} • {new Date(prediction.created_at).toLocaleString()}
                      </div>
                      <button
                        onClick={() => setShowSummaryModal(true)}
                        className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                      >
                        View Summary
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-black mb-4">No prediction available</p>
                    <button
                      onClick={fetchPrediction}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Generate Prediction
                    </button>
                  </div>
                )}
              </CardContent>
              
              {/* Full Screen Button */}
              {prediction && (
                <button
                  onClick={() => setShowSummaryModal(true)}
                  className="absolute bottom-4 right-4 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 shadow-lg transition-all duration-200 hover:scale-110"
                  title="View Full Screen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}
            </Card>
          </div>

          {/* Appointments */}
          <div className="lg:col-span-1">
            <Card className="h-full shadow-lg bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-0 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center space-x-2 text-black">
                    <Calendar className="w-5 h-5 text-green-500" />
                    <span>Appointments</span>
                  </CardTitle>
                  <button
                    onClick={() => setShowPrescriptionModal(true)}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs"
                  >
                    <Pill className="w-3 h-3" />
                    <span>Prescription</span>
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                {appointmentLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="ml-3 text-black">Loading appointments...</span>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-black">No appointments</h3>
                    <p className="mt-1 text-sm text-gray-500">No appointments found for this patient.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="bg-white/70 rounded-lg p-3 hover:bg-white/90 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="font-medium text-black text-sm">
                              {new Date(appointment.appointment_date_time).toLocaleDateString()} at{' '}
                              {new Date(appointment.appointment_date_time).toLocaleTimeString()}
                            </p>
                            <p className="text-xs text-black">{appointment.reason}</p>
                            {appointment.notes_for_doctor && (
                              <p className="text-xs text-gray-600">Notes: {appointment.notes_for_doctor}</p>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Medical History */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-black">Medical History</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Vitals Monitoring */}
              <Card className="shadow-lg bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 border-0 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-black">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span>Vitals Monitoring</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.keys(vitalsGrouped).length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-black">No vitals data</h3>
                      <p className="mt-1 text-sm text-gray-500">No vitals monitoring data found for this patient.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(vitalsGrouped)
                        .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                        .map(([monthYear, monthVitals]) => (
                        <div key={monthYear} className="border-b pb-4 last:border-b-0">
                          <h4 className="font-semibold text-black mb-3">{monthYear}</h4>
                          <div className="space-y-3">
                            {monthVitals.map((vital) => (
                              <div key={vital.id} className="bg-white/70 rounded-lg p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium text-black">{formatDateTime(vital.recorded_at)}</span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-black">
                                  {vital.heart_rate_bpm && (
                                    <div className="flex items-center space-x-1">
                                      <Heart className="w-3 h-3 text-red-500" />
                                      <span>HR: {vital.heart_rate_bpm} bpm</span>
                                    </div>
                                  )}
                                  {vital.spo2_percent && (
                                    <div className="flex items-center space-x-1">
                                      <Droplets className="w-3 h-3 text-blue-500" />
                                      <span>SpO2: {vital.spo2_percent}%</span>
                                    </div>
                                  )}
                                  {vital.body_temp_c && (
                                    <div className="flex items-center space-x-1">
                                      <Thermometer className="w-3 h-3 text-orange-500" />
                                      <span>Temp: {vital.body_temp_c}°C</span>
                                    </div>
                                  )}
                                  {vital.systolic_bp && vital.diastolic_bp && (
                                    <div className="flex items-center space-x-1">
                                      <Activity className="w-3 h-3 text-purple-500" />
                                      <span>BP: {vital.systolic_bp}/{vital.diastolic_bp}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Breath Analysis */}
              <Card className="shadow-lg bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50 border-0 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-black">
                    <Wind className="w-5 h-5 text-cyan-500" />
                    <span>Breath Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.keys(breathGrouped).length === 0 ? (
                    <div className="text-center py-8">
                      <Wind className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-black">No breath data</h3>
                      <p className="mt-1 text-sm text-gray-500">No breath analysis data found for this patient.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(breathGrouped)
                        .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                        .map(([monthYear, monthBreath]) => (
                        <div key={monthYear} className="border-b pb-4 last:border-b-0">
                          <h4 className="font-semibold text-black mb-3">{monthYear}</h4>
                          <div className="space-y-3">
                            {monthBreath.map((breath) => (
                              <div key={breath.id} className="bg-white/70 rounded-lg p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium text-black">{formatDateTime(breath.recorded_at)}</span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-black">
                                  {breath.ammonia_ppm !== undefined && (
                                    <div className="flex items-center space-x-1"><Wind className="w-3 h-3 text-cyan-500" /><span>Ammonia: {breath.ammonia_ppm} ppm</span></div>
                                  )}
                                  {breath.co2_ppm_mq !== undefined && (
                                    <div className="flex items-center space-x-1"><Wind className="w-3 h-3 text-gray-500" /><span>CO₂ (MQ): {breath.co2_ppm_mq} ppm</span></div>
                                  )}
                                  {breath.benzene_ppm !== undefined && (
                                    <div className="flex items-center space-x-1"><Activity className="w-3 h-3 text-purple-500" /><span>Benzene: {breath.benzene_ppm} ppm</span></div>
                                  )}
                                  {breath.co2_ppm_mhz19 !== undefined && (
                                    <div className="flex items-center space-x-1"><Wind className="w-3 h-3 text-gray-500" /><span>CO₂ (MH-Z19): {breath.co2_ppm_mhz19} ppm</span></div>
                                  )}
                                  {breath.ethanol_ppm !== undefined && (
                                    <div className="flex items-center space-x-1"><Activity className="w-3 h-3 text-orange-500" /><span>Ethanol: {breath.ethanol_ppm} ppm</span></div>
                                  )}
                                  {breath.vocs_ppm_mics !== undefined && (
                                    <div className="flex items-center space-x-1"><Droplets className="w-3 h-3 text-blue-500" /><span>VOCs (MiCS): {breath.vocs_ppm_mics} ppm</span></div>
                                  )}
                                  {breath.acetone_ppm_qcm !== undefined && (
                                    <div className="flex items-center space-x-1"><Activity className="w-3 h-3 text-pink-500" /><span>Acetone (QCM): {breath.acetone_ppm_qcm} ppm</span></div>
                                  )}
                                  {breath.voc_type_chemo && (
                                    <div className="flex items-center space-x-1"><FileText className="w-3 h-3 text-indigo-500" /><span>VOC Type (Chemo): {breath.voc_type_chemo}</span></div>
                                  )}
                                  {breath.voc_value_ppm_chemo !== undefined && (
                                    <div className="flex items-center space-x-1"><FileText className="w-3 h-3 text-indigo-500" /><span>VOC Value (Chemo): {breath.voc_value_ppm_chemo} ppm</span></div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">Give Prescription</h2>
                <button
                  onClick={() => setShowPrescriptionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitPrescription} className="space-y-6">
                {/* Medicines Section */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Medicines</h3>
                  <div className="space-y-4">
                    {medicines.map((medicine, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-black mb-1">
                              Medicine Name *
                            </label>
                            <input
                              type="text"
                              value={medicine.medicine_name}
                              onChange={(e) => handleMedicineChange(index, 'medicine_name', e.target.value)}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                              placeholder="Enter medicine name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-black mb-1">
                              Dose *
                            </label>
                            <input
                              type="text"
                              value={medicine.dose}
                              onChange={(e) => handleMedicineChange(index, 'dose', e.target.value)}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                              placeholder="e.g., 500mg"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-black mb-1">
                              Frequency *
                            </label>
                            <select
                              value={medicine.frequency}
                              onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                            >
                              <option value="Once a day">Once a day</option>
                              <option value="Twice a day">Twice a day</option>
                              <option value="Thrice a day">Thrice a day</option>
                              <option value="As Needed">As Needed</option>
                              <option value="Custom">Custom</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-black mb-1">
                              Duration *
                            </label>
                            <input
                              type="text"
                              value={medicine.duration}
                              onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                              placeholder="e.g., 5 days, 2 weeks"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-black mb-1">
                            Instructions (Optional)
                          </label>
                          <textarea
                            value={medicine.instructions}
                            onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                            placeholder="e.g., after food, empty stomach"
                          />
                        </div>
                        
                        {medicines.length > 1 && (
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeMedicine(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove Medicine
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={addMedicine}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Another Medicine</span>
                    </button>
                  </div>
                </div>

                {/* Doctor Notes Section */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Doctor Notes</h3>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Description / Notes
                    </label>
                    <textarea
                      value={doctorNotes}
                      onChange={(e) => setDoctorNotes(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      placeholder="Any free text, test advice, or lifestyle recommendations..."
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowPrescriptionModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    Submit Prescription
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Summary Modal */}
      {showSummaryModal && prediction && (
        <div className="fixed inset-0 bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">Health Data Summary</h2>
                <button
                  onClick={() => setShowSummaryModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-black mb-3">Detailed Health Analysis</h3>
                  <div 
                    className="text-sm text-black leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(prediction.summary) }}
                  />
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-black mb-3">Risk Assessment</h3>
                  <div 
                    className="text-sm text-black leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(prediction.risk_assessment) }}
                  />
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Model:</span> {prediction.model_used} • 
                    <span className="font-medium ml-2">Generated:</span> {new Date(prediction.created_at).toLocaleString()} • 
                    <span className="font-medium ml-2">Status:</span> {prediction.cached ? 'Cached' : 'Fresh Analysis'}
                  </div>
                  <button
                    onClick={() => setShowSummaryModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckPatientPage;
