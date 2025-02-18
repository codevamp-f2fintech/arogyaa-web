export interface PatientData {
  _id?: string;
  username: string;
  age: string;
  email: string;
  contact: string;
  gender: string;
  dob: Date;
  height: string;
  weight: string;
  medical_history: string[];
  address: string;
  pincode: number;
  profilePicture: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Patient {
  statusCode: number;
  message: string;
  data: {
    results: PatientData[];
    count: number;
    pages: number;
  };
  errorMessage?: string;
}
