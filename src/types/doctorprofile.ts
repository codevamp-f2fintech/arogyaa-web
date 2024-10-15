export interface doctorprofile{
  username: string;
  email: string;
  password: string;
  specializationId: string[]; 
  qualificationIds: string[]; 
  experienceYears: number;
  bio: string;
  availability: Availability[]; 
  role: number;
};

export interface Availability{
  day: string;
  startTime: string;
  endTime: string;
};

