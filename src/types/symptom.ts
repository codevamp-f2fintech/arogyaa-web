export interface SymptomData {
    _id: string;
    name: string;
    description: string;
    icon: string | File;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Symptom {
    results: SymptomData[];
    count: number;
    pages: number;
    errorMessage?: string | null;
}
