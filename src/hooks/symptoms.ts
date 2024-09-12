import { useState } from 'react';
import useSWR from 'swr';

import { creator, fetcher, modifier } from '@/apis/apiClient';
import { Symptoms } from '@/types/symptoms';

/**
 * Hook for fetching symptomss with SWR (stale-while-revalidate) strategy.
 * 
 * @param initialData - The initial data to be used before SWR fetches fresh data.
 * @param pathKey - The API path key used by SWR to fetch symptoms data.
 * @returns An object contFaining the fetched symptomss, loading state, and error state.
 */
export const useGetSymptoms = (initialData: Symptoms[], pathKey: string) => {
    const { data: swrData, error } = useSWR<Symptoms[]>(pathKey, fetcher, {
        fallbackData: initialData,
        refreshInterval: initialData ? 3600000 : 0, // 1 hour refresh if initialData exists
        revalidateOnFocus: false,                  // Disable revalidation on window focus
    });

    return { data: swrData || [], swrLoading: !error && !swrData, error };
};

/**
 * Hook for creating a new symptoms.
 * 
 * @param pathKey - The API path key used to create a new symptoms.
 * @returns An object containing the created symptoms, loading state, error state, and the createSymptoms function.
 */
export const useCreateSymptoms = (pathKey: string) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [createdSymptoms, setCreatedSymptoms] = useState<Symptoms | null>(null);

    const createSymptoms = async (newSymptomsData: Symptoms) => {
        setLoading(true);
        setError(null);

        try {
            const symptoms = await creator<Symptoms, Symptoms>(pathKey, newSymptomsData);
            setCreatedSymptoms(symptoms);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    return { createdSymptoms, loading, error, createSymptoms };
};

/**
 * Hook for modifying an existing symptoms.
 * 
 * @param pathKey - The API path key used to modify a symptoms.
 * @returns An object containing the updated symptoms, loading state, error state, and the modifySymptoms function.
 */
export const useModifySymptoms = (pathKey: string) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [updatedSymptoms, setUpdatedSymptoms] = useState<Symptoms | null>(null);

    const modifySymptoms = async (updatedSymptomsData: Symptoms) => {
        setLoading(true);
        setError(null);

        try {
            const symptoms = await modifier<Symptoms, Symptoms>(pathKey, updatedSymptomsData);
            setUpdatedSymptoms(symptoms);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    return { updatedSymptoms, loading, error, modifySymptoms };
};
