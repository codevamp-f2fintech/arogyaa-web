export interface DoctorData {
  _id?: string;
  username: string;
  email: string;
  password: string;
  contact: string;
  specializationIds: string[];
  qualificationIds: string[];
  experience: number;
  bio: string;
  dob: Date;
  languagesSpoken: string[];
  address: string;
  profilePicture: string;
  consultationFee: number;
  availability: string[];
  role: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Doctor {
  results: DoctorData[];
  count: number;
  pages: number;
  errorMessage?: string;
}