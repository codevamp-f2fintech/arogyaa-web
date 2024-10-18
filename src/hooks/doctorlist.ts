import { useState } from "react";
import useSWR from "swr";

import { creator, fetcher, modifier } from "@/apis/apiClient";
import { doctorlist } from "@/types/doctorlist";

/**
 * Hook for fetching users with SWR (stale-while-revalidate) strategy.
 *
 * @param initialData - The initial data to be used before SWR fetches fresh data.
 * @param pathKey - The API path key used by SWR to fetch user data.
 * @returns An object containing the fetched users, loading state, and error state.
 */
export const useGetdoctorlist = (
  initialData: doctorlist[],
  pathKey: string
) => {
  const { data: swrData, error } = useSWR<doctorlist[]>(pathKey, fetcher, {
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
export const useCreatedoctorlist = (pathKey: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [createddoctorlist, setCreateddoctorlist] =
    useState<doctorlist | null>(null);

  const createdoctorlist = async (newdoctorlistData: doctorlist) => {
    setLoading(true);
    setError(null);

    try {
      const doctorlist = await creator<doctorlist, doctorlist>(
        pathKey,
        newdoctorlistData
      );
      setCreateddoctorlist(doctorlist);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { createddoctorlist, loading, error, createdoctorlist };
};

/**
 * Hook for modifying an existing user.
 *
 * @param pathKey - The API path key used to modify a user.
 * @returns An object containing the updated user, loading state, error state, and the modifyUser function.
 */
export const useModifydoctorlist = (pathKey: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [updateddoctorlist, setUpdateddoctorlist] =
    useState<doctorlist | null>(null);

  const modifydoctorlist = async (updateddoctorlistData: doctorlist) => {
    setLoading(true);
    setError(null);

    try {
      const doctorlist = await modifier<doctorlist, doctorlist>(
        pathKey,
        updateddoctorlistData
      );
      setUpdateddoctorlist(doctorlist);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { updateddoctorlist, loading, error, modifydoctorlist };
};
