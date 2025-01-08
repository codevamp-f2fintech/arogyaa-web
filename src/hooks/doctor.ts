"use client";

import { useState } from "react";
import useSWR from "swr";

import { creator, fetcher, modifier } from "@/apis/apiClient";
import { Doctor, DoctorData } from "@/types/doctor";

/**
 * Hook for fetching doctors with SWR (stale-while-revalidate) strategy.
 *
 * @param initialData - The initial data to be used before SWR fetches fresh data.
 * @param pathKey - The API path key used by SWR to fetch doctor data.
 * @param page - The page number for pagination.
 * @param limit - The number of items per page.
 * @returns An object containing the fetched doctors, loading, error state, and refetch function.
 */
export const useGetDoctors = (
  initialData: Doctor | null,
  pathKey: string,
  page: number = 1,
  limit: number = 5,
  filters: Record<string, string | undefined> = {}
) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value)),
  });

  const url = `${pathKey}?${queryParams.toString()}`;

  const {
    data: swrData,
    error,
    isValidating,
    mutate,
  } = useSWR<Doctor | null>(url, () => fetcher<Doctor>("doctor", url), {
    fallbackData: initialData,
    refreshInterval: 3600000,
    revalidateOnFocus: false,
  });

  const refetch = async (newFilters?: Record<string, string | undefined>) => {
    const updatedQueryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(
        Object.entries({ ...filters, ...newFilters }).filter(
          ([, value]) => value
        )
      ),
    });

    const updatedUrl = `${pathKey}?${updatedQueryParams.toString()}`;
    await mutate(updatedUrl);
  };

  return {
    value: swrData || { results: [], count: 0, pages: 0, errorMessage: null },
    swrLoading: !error && !swrData && isValidating,
    error,
    refetch,
  };
};

/**
 * Hook for creating a new doctor.
 *
 * @param pathKey - The API path key used to create a new doctor.
 * @returns An object containing the created doctor, loading state, error state, and the createDoctor function.
 */
export const useCreateDoctor = (pathKey: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createDoctor = async (newDoctorData: Partial<DoctorData>) => {
    setLoading(true);
    setError(null);

    try {
      const doctor = await creator<DoctorData, Partial<DoctorData>>(
        "doctor",
        pathKey,
        newDoctorData
      );
      return doctor;
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };
  return { loading, error, createDoctor };
};

/**
 * Hook for modifying an existing doctor.
 *
 * @param pathKey - The API path key used to modify a doctor.
 * @returns An object containing the updated doctor, loading state, error state, and the modifyDoctor function.
 */
export const useModifyDoctor = (pathKey: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const modifyDoctor = async (updatedDoctorData: Partial<DoctorData>) => {
    setLoading(true);
    setError(null);

    try {
      const doctor = await modifier<DoctorData, Partial<DoctorData>>(
        "doctor",
        pathKey,
        updatedDoctorData
      );
      return doctor;
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };
  return { loading, error, modifyDoctor };
};
