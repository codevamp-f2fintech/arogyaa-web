export interface AppointmentData {
  _id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
  symptomIds: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  videoUrl?: string; 
  __v: number;
}

export interface Appointment {
  results: AppointmentData[];
  count: number;
  pages: number;
  errorMessage?: string | null;
}