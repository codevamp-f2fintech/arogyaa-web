import { useState } from "react";
import useSWR from "swr";

import { creator, fetcher, modifier } from "@/apis/apiClient";
import { Specialities } from "@/types/specialities";

/**
 * Hook for fetching users with SWR (stale-while-revalidate) strategy.
 *
 * @param initialData - The initial data to be used before SWR fetches fresh data.
 * @param pathKey - The API path key used by SWR to fetch user data.
 * @returns An object containing the fetched users, loading state, and error state.
 */
export const useGetSpecialities = (
  initialData: Specialities[],
  pathKey: string
) => {
  const { data: swrData, error } = useSWR<Specialities[]>(pathKey, fetcher, {
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
export const useCreateSpecialities = (pathKey: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [createdSpecialities, setCreatedSpecialities] =
    useState<Specialities | null>(null);

  const createSpecialities = async (newSpecialitiesData: Specialities) => {
    setLoading(true);
    setError(null);

    try {
      const specialities = await creator<Specialities, Specialities>(
        pathKey,
        newSpecialitiesData
      );
      setCreatedSpecialities(specialities);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { createdSpecialities, loading, error, createSpecialities };
};

/**
 * Hook for modifying an existing user.
 *
 * @param pathKey - The API path key used to modify a user.
 * @returns An object containing the updated user, loading state, error state, and the modifyUser function.
 */
export const useModifySpecialities = (pathKey: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [updatedSpecialities, setUpdatedSpecialities] =
    useState<Specialities | null>(null);

  const modifySpecialities = async (updatedSpecialitiesData: Specialities) => {
    setLoading(true);
    setError(null);

    try {
      const specialities = await modifier<Specialities, Specialities>(
        pathKey,
        updatedSpecialitiesData
      );
      setUpdatedSpecialities(specialities);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { updatedSpecialities, loading, error, modifySpecialities };
};
