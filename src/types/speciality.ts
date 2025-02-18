export interface SpecialityData {
  image: string;
  experience: ReactNode;
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Speciality {
  results: SpecialityData[];
  count: number;
  pages: number;
  errorMessage?: string | null;
}
