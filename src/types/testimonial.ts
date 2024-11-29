export interface Testimonial {
  _id: string;
  doctorId: string;
  patientName: string;
  age?: string;
  src?: string;
  srcquote?: string;
  rating: number;
  description: string;
  createdAt: string;
}

export interface ImageData {
  src: string;
  srcquote: string;
  description: string;
  name: string;
  age: string;
}
