import { useState } from "react";
import useSWR from "swr";

import { creator, fetcher, modifier } from "@/apis/apiClient";
import { Appointment } from "../types/appointment";

/**
 * Hook for fetching users with SWR (stale-while-revalidate) strategy.
 *
 * @param initialData - The initial data to be used before SWR fetches fresh data.
 * @param pathKey - The API path key used by SWR to fetch user data.
 * @returns An object containing the fetched users, loading state, and error state.
 */
export const useGetAppointment = (
  initialData: Appointment[],
  pathKey: string
) => {
  const { data: swrData, error } = useSWR<Appointment[]>(pathKey,
    () => fetcher('appointment', pathKey),
    {
      fallbackData: initialData,
      refreshInterval: initialData ? 3600000 : 0, // 1 hour refresh if initialData exists
      revalidateOnFocus: false, // Disable revalidation on window focus
    });

  return { data: swrData || [], swrLoading: !error && !swrData, error };
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
  const [createdAppointment, setCreatedAppointment] =
    useState<Appointment | null>(null);

  const createAppointment = async (newAppointmentData: any) => {
    setLoading(true);
    setError(null);

    try {
      const appointment = await creator<Appointment, Appointment>(
        'appointment',
        pathKey,
        newAppointmentData
      );
      setCreatedAppointment(appointment);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { createdAppointment, loading, error, createAppointment };
};
