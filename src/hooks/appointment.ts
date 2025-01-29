import { useState } from "react";
import useSWR from "swr";

import { creator, fetcher } from "@/apis/apiClient";
import { Appointment, AppointmentData } from "../types/appointment";

/**
 * Hook for fetching users with SWR (stale-while-revalidate) strategy.
 *
 * @param initialData - The initial data to be used before SWR fetches fresh data.
 * @param pathKey - The API path key used by SWR to fetch user data.
 * @returns An object containing the fetched users, loading state, and error state.
 */
export const useGetAppointment = (
  initialData: Appointment | null,
  pathKey: string,
  page: number = 1,
  limit: number = 5
) => {
  const url = `${pathKey}?page=${page}&limit=${limit}`;
  const { data: swrData, error, isValidating } = useSWR<Appointment | null>(
    url,
    () => fetcher('appointment', url),
    {
      fallbackData: initialData,
      refreshInterval: initialData ? 3600000 : 0,
      revalidateOnFocus: false,
    });

  return {
    value: swrData || {
      results: [],
      total: 0,
      pages: 0,
      errorMessage: null
    },
    swrLoading: !error && !swrData && isValidating,
    error,
  };
};

/**
 * Hook for creating a new user.
 *
 * @param pathKey - The API path key used to create a new user.
 * @returns An object containing the created user, loading state, error state, and the createUser function.
 */
export const useCreateAppointment = (pathKey: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createAppointment = async (newAppointmentData: AppointmentData) => {
    setLoading(true);
    setError(null);
    try {
      const appointment = await creator<Appointment, Partial<AppointmentData>>(
        'appointment',
        pathKey,
        newAppointmentData
      );
      return appointment;
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, createAppointment };
};
