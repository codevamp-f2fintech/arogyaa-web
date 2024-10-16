import { useState } from "react";
import useSWR from "swr";

import { creator, fetcher, modifier } from "@/apis/apiClient";
import { doctorprofile } from "@/types/doctorprofile";

/**
 * Hook for fetching users with SWR (stale-while-revalidate) strategy.
 *
 * @param initialData - The initial data to be used before SWR fetches fresh data.
 * @param pathKey - The API path key used by SWR to fetch user data.
 * @returns An object containing the fetched users, loading state, and error state.
 */
export const useGetdoctorprofile = (
  initialData: doctorprofile[],
  pathKey: string
) => {
  const { data: swrData, error } = useSWR<doctorprofile[]>(pathKey, fetcher, {
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
export const useCreatedoctorprofile = (pathKey: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [createddoctorprofile, setCreateddoctorprofile] =
    useState<doctorprofile | null>(null);

  const createdoctorprofile = async (newdoctorprofileData: doctorprofile) => {
    setLoading(true);
    setError(null);

    try {
      const doctorprofile = await creator<doctorprofile, doctorprofile>(
        pathKey,
        newdoctorprofileData
      );
      setCreateddoctorprofile(doctorprofile);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { createddoctorprofile, loading, error, createdoctorprofile };
};

/**
 * Hook for modifying an existing user.
 *
 * @param pathKey - The API path key used to modify a user.
 * @returns An object containing the updated user, loading state, error state, and the modifyUser function.
 */
export const useModifydoctorprofile = (pathKey: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [updateddoctorprofile, setUpdateddoctorprofile] =
    useState<doctorprofile | null>(null);

  const modifydoctorprofile = async (updateddoctorprofileData: doctorprofile) => {
    setLoading(true);
    setError(null);

    try {
      const doctorprofile = await modifier<doctorprofile, doctorprofile>(
        pathKey,
        updateddoctorprofileData
      );
      setUpdateddoctorprofile(doctorprofile);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { updateddoctorprofile, loading, error, modifydoctorprofile };
};
