"use client";

import { useState } from "react";
import useSWR from "swr";

import { creator, fetcher, modifier } from "@/apis/apiClient";
import { Symptom, SymptomData } from "@/types/symptom";

/**
 * Hook for fetching Symptoms with SWR (stale-while-revalidate) strategy.
 *
 * @param initialData - The initial data to be used before SWR fetches fresh data.
 * @param pathKey - The API path key used by SWR to fetch Symptom data.
 * @param page - The page number for pagination.
 * @param limit - The number of items per page.
 * @returns An object containing the fetched symptoms, loading, error state and refetch function.
 */
export const useGetSymptom = (
    initialData: Symptom | null,
    pathKey: string,
    page: number = 1,
    limit: number = 5
) => {
    const url = `${pathKey}?page=${page}&limit=${limit}`;
    const { data: swrData, error, isValidating, mutate } = useSWR<Symptom | null>(
        url,
        () => fetcher<Symptom>('symptom', url),
        {
            fallbackData: initialData,
            refreshInterval: 3600000,
            revalidateOnFocus: false,
        }
    );
    const refetch = async (keyword?: string) => {
        const refetchUrl = keyword ? `${url}&keyword=${keyword}` : url;
        return await mutate(refetchUrl);
    };

    return {
        value: swrData || {
            results: [],
            count: 0,
            pages: 0,
            errorMessage: null
        },
        swrLoading: !error && !swrData && isValidating,
        error,
        refetch
    };
};

/**
 * Hook for modifying an existing Symptom.
 *
 * @param pathKey - The API path key used to modify a Symptom.
 * @returns An object containing the loading state, error state, and the createSymptom function.
 */
export const useCreateSymptom = (pathKey: string) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createSymptom = async (dataObj: SymptomData) => {
        setLoading(true);
        setError(null);
        try {
            const Symptom = await creator<SymptomData, SymptomData>('symptom', pathKey, dataObj);
            return Symptom;
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };
    return { loading, error, createSymptom };
};

/**
 * Hook for modifying an existing Symptom.
 *
 * @param pathKey - The API path key used to modify a Symptom.
 * @returns An object containing the loading state, error state, and the modifySymptom function.
 */
export const useModifySymptom = (pathKey: string) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const modifySymptom = async (updatedSymptomData: Partial<SymptomData>) => {
        setLoading(true);
        setError(null);
        try {
            const Symptom = await modifier<SymptomData, Partial<SymptomData>>('symptom', pathKey, updatedSymptomData);
            return Symptom;
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };
    return { loading, error, modifySymptom };
};
