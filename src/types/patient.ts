export interface PatientData {
    _id?: string;
    username: string;
    age: string;
    email: string;
    phone: string;
    gender: string;
    dob: Date;
    medical_history: string[];
    password: string;

}

export interface Patient {
    results: PatientData[];
    count: number;
    pages: number;
    errorMessage?: string;
}